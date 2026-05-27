#!/usr/bin/env bash
# ============================================================
# LDN GLF CLUB — Wire venues.js into Atlas, Scorecard, Caddie
# ============================================================
# This script:
#   1. Confirms venues.js is present in the repo root
#   2. Adds <script src="venues.js"> to courses.html, scorecard.html, caddie.html
#   3. Replaces the hardcoded COURSES array in scorecard.html with a venues.js lookup
#   4. Adds a region filter row to courses.html and swaps its data source
#   5. Upgrades the Caddie's submit-intel modal with a venue autocomplete
#
# Backs everything up to .backup-before-venues-fix/ first.
# Run from your ldn-glf repo root.
# ============================================================

set -euo pipefail

if [[ ! -f "index.html" ]]; then
  echo "❌ Run this from the ldn-glf repo root (where index.html lives)."
  exit 1
fi

if [[ ! -f "venues.js" ]]; then
  echo "❌ venues.js not found in repo root. Copy it in first."
  echo "   It should be alongside auth.js, index.html, etc."
  exit 1
fi

# Back up
mkdir -p .backup-before-venues-fix
for f in courses.html scorecard.html caddie.html; do
  if [[ -f "$f" ]]; then
    cp "$f" ".backup-before-venues-fix/$f"
  fi
done
echo "✓ Backed up existing pages to .backup-before-venues-fix/"

# ============ STEP 1: Add <script src="venues.js"> to each page ============
python3 << 'PYEOF'
import os, re

def add_venues_script(filename):
    if not os.path.exists(filename):
        print(f"  ⚠ {filename} not found")
        return
    with open(filename, 'r', encoding='utf-8') as f:
        html = f.read()
    if 'venues.js' in html:
        print(f"  ✓ {filename} already includes venues.js")
        return
    # Inject BEFORE auth.js so venues is loaded first
    if '<script src="auth.js"' in html:
        html = html.replace('<script src="auth.js"', '<script src="venues.js" defer></script>\n<script src="auth.js"', 1)
    else:
        # Fallback: add before </body>
        html = html.replace('</body>', '<script src="venues.js" defer></script>\n</body>', 1)
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(html)
    print(f"  ✓ {filename}: venues.js script tag added")

print("\n→ Adding venues.js script tag to each page:")
for fn in ['courses.html', 'scorecard.html', 'caddie.html']:
    add_venues_script(fn)
PYEOF

# ============ STEP 2: Patch scorecard.html — swap hardcoded COURSES ============
python3 << 'PYEOF'
import re, os

if not os.path.exists('scorecard.html'):
    print("  ⚠ scorecard.html not found, skipping")
else:
    with open('scorecard.html', 'r', encoding='utf-8') as f:
        html = f.read()

    # Look for the hardcoded courses array: const COURSES = [ ... ];
    pattern = re.compile(r'const\s+COURSES\s*=\s*\[[\s\S]*?\];', re.MULTILINE)

    replacement = '''// Pulled from venues.js — score-able formats only (courses + pitch-putt) plus the legacy 'Other course' fallback.
  // Falls back to a minimal default if venues.js hasn't loaded yet.
  const COURSES = (function() {
    if (window.LDN_SCOREABLE_VENUES) {
      const venues = window.LDN_SCOREABLE_VENUES();
      // Group by region for display: London first, then UK regions
      const regions = window.LDN_REGION_ORDER || ['london'];
      const regionNames = window.LDN_VENUES_BY_REGION || {london:'Greater London'};
      const grouped = [];
      regions.forEach(r => {
        const inRegion = venues.filter(v => v.region === r);
        if (inRegion.length) {
          // Use a __divider__ marker we'll render as an optgroup in the select
          grouped.push({__divider__: true, label: regionNames[r] || r});
          inRegion.forEach(v => grouped.push(v.name));
        }
      });
      grouped.push("Other course (not listed)");
      return grouped;
    }
    return ["Other course (not listed)"];
  })();'''

    if pattern.search(html):
        html = pattern.sub(replacement, html, count=1)
        print("  ✓ scorecard.html: hardcoded COURSES array swapped for venues.js")
    else:
        print("  ⚠ scorecard.html: couldn't find COURSES array to replace — manual review needed")

    # Also patch initCourseSelect to handle the divider markers (render as optgroup)
    init_pattern = re.compile(
        r"(function\s+initCourseSelect\s*\(\s*\)\s*\{[\s\S]*?select\.innerHTML\s*=\s*)COURSES\.map\([^)]*\)\.join\([^)]*\)(;)"
    )
    init_replacement = (
        r'\1(function(){ '
        r'let html=""; let openGroup=false; '
        r'COURSES.forEach(c => { '
        r'  if (typeof c === "object" && c.__divider__) { '
        r'    if (openGroup) html += "</optgroup>"; '
        r'    html += "<optgroup label=\"" + c.label + "\">"; '
        r'    openGroup = true; '
        r'  } else { '
        r'    html += "<option value=\"" + c + "\">" + c + "</option>"; '
        r'  } '
        r'}); '
        r'if (openGroup) html += "</optgroup>"; '
        r'return html; '
        r'})()\2'
    )

    if init_pattern.search(html):
        html = init_pattern.sub(init_replacement, html, count=1)
        print("  ✓ scorecard.html: initCourseSelect upgraded to render optgroups by region")
    else:
        print("  ⚠ scorecard.html: couldn't find initCourseSelect — dropdown may not render regions properly")

    # Ensure state.course default doesn't choke on a divider object
    state_default = re.compile(r'course:\s*COURSES\[0\]')
    if state_default.search(html):
        html = state_default.sub(
            'course: (function(){ for (const c of COURSES) { if (typeof c === "string") return c; } return ""; })()',
            html, count=1
        )
        print("  ✓ scorecard.html: default course pick now skips dividers")

    with open('scorecard.html', 'w', encoding='utf-8') as f:
        f.write(html)
PYEOF

# ============ STEP 3: Patch caddie.html — autocomplete venue field ============
python3 << 'PYEOF'
import re, os

if not os.path.exists('caddie.html'):
    print("  ⚠ caddie.html not found, skipping")
else:
    with open('caddie.html', 'r', encoding='utf-8') as f:
        html = f.read()

    # Find the courseName input in the intel modal and add a datalist
    # The existing line looks like: <input type="text" id="courseName" placeholder="..." required>
    cn_pattern = re.compile(
        r'<input type="text" id="courseName" placeholder="[^"]*"\s+required>'
    )
    cn_replacement = (
        '<input type="text" id="courseName" placeholder="Start typing a venue name..." list="ldnVenuesList" required autocomplete="off">\n'
        '        <datalist id="ldnVenuesList"></datalist>'
    )
    if cn_pattern.search(html):
        html = cn_pattern.sub(cn_replacement, html, count=1)
        print("  ✓ caddie.html: courseName field now has venue autocomplete datalist")
    else:
        print("  ⚠ caddie.html: courseName input not found in expected shape — manual review needed")

    # Add a script block at end of body (before existing scripts) that populates the datalist on load
    populate_script = '''
<script>
// Populate the venue autocomplete in the intel modal from venues.js once loaded
(function populateVenueAutocomplete() {
  function fill() {
    const list = document.getElementById('ldnVenuesList');
    if (!list || !window.LDN_VENUES) return;
    list.innerHTML = window.LDN_VENUES.map(v =>
      '<option value="' + v.name + '">' + (v.town ? '(' + v.town + ')' : '') + '</option>'
    ).join('');
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fill);
  } else {
    fill();
  }
  // Also fill once after a short delay in case venues.js is still loading (defer)
  setTimeout(fill, 600);
})();
</script>
'''
    if 'populateVenueAutocomplete' not in html:
        # Insert before the existing <script> block at end of body
        html = html.replace('</body>', populate_script + '</body>', 1)
        print("  ✓ caddie.html: venue-autocomplete populator added")

    with open('caddie.html', 'w', encoding='utf-8') as f:
        f.write(html)
PYEOF

# ============ STEP 4: Patch courses.html — add region filter + venues.js data ============
python3 << 'PYEOF'
import re, os

if not os.path.exists('courses.html'):
    print("  ⚠ courses.html not found, skipping")
else:
    with open('courses.html', 'r', encoding='utf-8') as f:
        html = f.read()

    # Add a region filter strip via injected HTML + JS that intercepts the existing filter logic.
    # We do NOT replace the existing card grid — venues.js entries are *additional* venues,
    # rendered into a new section below the curated 20 London cards when the user selects a non-London region.
    #
    # The cleanest approach: inject the new region filter UI + a new card grid that
    # renders venues from venues.js filtered by region. The existing London grid stays as-is.

    # CSS for the new UI
    region_css = '''<style id="ldnx-region-filter-styles">
  /* Region filter strip */
  .ldnx-region-filter {
    background: var(--cream, #EFE5CC);
    padding: 18px 20px 14px;
    position: sticky;
    top: 0;
    z-index: 80;
    border-bottom: 1px solid rgba(11, 33, 24, 0.12);
  }
  .ldnx-region-filter-label {
    font-family: 'Archivo', sans-serif;
    font-weight: 800;
    font-size: 10px;
    letter-spacing: 2.5px;
    text-transform: uppercase;
    color: #1F4A33;
    margin-bottom: 10px;
  }
  .ldnx-region-chips {
    display: flex;
    gap: 8px;
    overflow-x: auto;
    scrollbar-width: none;
    -webkit-overflow-scrolling: touch;
    padding-bottom: 2px;
  }
  .ldnx-region-chips::-webkit-scrollbar { display: none; }
  .ldnx-region-chip {
    flex: 0 0 auto;
    background: transparent;
    border: 1.5px solid #0B2118;
    color: #0B2118;
    padding: 8px 14px;
    border-radius: 100px;
    font-family: 'Archivo', sans-serif;
    font-weight: 700;
    font-size: 12px;
    letter-spacing: 0.3px;
    cursor: pointer;
    transition: all 0.18s;
    white-space: nowrap;
  }
  .ldnx-region-chip:hover { background: #1F4A33; color: #EFE5CC; border-color: #1F4A33; }
  .ldnx-region-chip.active { background: #0B2118; color: #EFE5CC; }
  .ldnx-region-chip .count {
    font-family: 'Archivo Black', sans-serif;
    font-size: 10px;
    margin-left: 6px;
    opacity: 0.7;
  }

  /* UK venues grid — sits BELOW the existing London curated grid */
  .ldnx-uk-section {
    padding: 32px 20px 48px;
    background: var(--cream, #EFE5CC);
    display: none;
  }
  .ldnx-uk-section.show { display: block; }
  .ldnx-uk-header {
    margin-bottom: 18px;
  }
  .ldnx-uk-flag {
    font-family: 'Archivo', sans-serif;
    font-weight: 800;
    font-size: 11px;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: #E84D2C;
    margin-bottom: 8px;
  }
  .ldnx-uk-title {
    font-family: 'Anton', sans-serif;
    font-size: 44px;
    line-height: 0.95;
    color: #0B2118;
    margin-bottom: 8px;
  }
  .ldnx-uk-title .italic {
    font-family: 'Instrument Serif', serif;
    font-style: italic;
    font-weight: 400;
    color: #E84D2C;
    letter-spacing: -1px;
  }
  .ldnx-uk-sub {
    font-family: 'Archivo', sans-serif;
    font-size: 14px;
    line-height: 1.5;
    color: #143425;
    font-weight: 500;
    margin-bottom: 6px;
  }
  .ldnx-uk-honest {
    font-family: 'Archivo', sans-serif;
    font-size: 12px;
    color: #1F4A33;
    opacity: 0.85;
    font-style: italic;
    font-weight: 500;
  }
  .ldnx-uk-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 14px;
  }
  .ldnx-uk-card {
    background: rgba(255, 255, 255, 0.5);
    border: 1.5px solid #0B2118;
    border-radius: 16px;
    padding: 20px 18px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    transition: transform 0.2s, box-shadow 0.2s;
  }
  .ldnx-uk-card:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(11, 33, 24, 0.12); }
  .ldnx-uk-card-top {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 12px;
  }
  .ldnx-uk-card-name {
    font-family: 'Archivo Black', sans-serif;
    font-size: 16px;
    letter-spacing: 0.2px;
    color: #0B2118;
    line-height: 1.2;
    flex: 1;
  }
  .ldnx-uk-card-type {
    font-family: 'Archivo', sans-serif;
    font-weight: 800;
    font-size: 9px;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: #E84D2C;
    background: rgba(232, 77, 44, 0.1);
    padding: 4px 8px;
    border-radius: 100px;
    flex: 0 0 auto;
  }
  .ldnx-uk-card-meta {
    font-family: 'Instrument Serif', serif;
    font-style: italic;
    font-size: 14px;
    color: #1F4A33;
    margin-bottom: 4px;
  }
  .ldnx-uk-card-note {
    font-family: 'Archivo', sans-serif;
    font-size: 13px;
    line-height: 1.5;
    color: #0B2118;
    font-weight: 500;
  }
  .ldnx-uk-card-foot {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
    margin-top: 10px;
    padding-top: 10px;
    border-top: 1px dashed rgba(11, 33, 24, 0.15);
  }
  .ldnx-uk-card-info {
    display: flex;
    gap: 12px;
    font-family: 'Archivo', sans-serif;
    font-size: 11px;
    color: #1F4A33;
    font-weight: 700;
    letter-spacing: 0.3px;
  }
  .ldnx-uk-card-info span strong {
    font-family: 'Archivo Black', sans-serif;
    color: #0B2118;
    font-weight: 800;
  }
  .ldnx-uk-card-links {
    display: flex;
    gap: 8px;
  }
  .ldnx-uk-card-link {
    font-family: 'Archivo Black', sans-serif;
    font-size: 10px;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: #0B2118;
    text-decoration: none;
    padding: 6px 10px;
    border: 1px solid #0B2118;
    border-radius: 100px;
    transition: all 0.15s;
  }
  .ldnx-uk-card-link:hover { background: #0B2118; color: #EFE5CC; }
  .ldnx-uk-card-link.hot { background: #E84D2C; color: #EFE5CC; border-color: #E84D2C; }
  .ldnx-uk-card-link.hot:hover { background: #0B2118; border-color: #0B2118; }

  @media (min-width: 768px) {
    .ldnx-uk-grid { grid-template-columns: 1fr 1fr; }
    .ldnx-uk-section { padding: 48px 48px 64px; max-width: 1200px; margin: 0 auto; }
    .ldnx-uk-title { font-size: 64px; }
  }
  @media (min-width: 1100px) {
    .ldnx-uk-grid { grid-template-columns: 1fr 1fr 1fr; }
  }

  /* Hide the LONDON curated grid when a non-London region is selected */
  body.ldnx-non-london-mode .courses-section,
  body.ldnx-non-london-mode .filters { display: none !important; }
</style>'''

    if 'ldnx-region-filter-styles' not in html:
        html = html.replace('</head>', region_css + '\n</head>', 1)
        print("  ✓ courses.html: region-filter CSS injected")

    # Inject the region filter strip + UK grid container right after <body>
    # (or after the existing header — we just need it ABOVE the existing London card grid)
    region_html = '''
<!-- ============ REGION FILTER STRIP (UK Atlas) ============ -->
<div class="ldnx-region-filter" id="ldnxRegionFilter">
  <div class="ldnx-region-filter-label">✦ Region</div>
  <div class="ldnx-region-chips" id="ldnxRegionChips">
    <!-- Populated by JS once venues.js loads -->
  </div>
</div>

<!-- ============ UK ATLAS GRID (non-London) ============ -->
<section class="ldnx-uk-section" id="ldnxUkSection">
  <div class="ldnx-uk-header">
    <p class="ldnx-uk-flag" id="ldnxUkFlag">✦ South West · United Kingdom</p>
    <h2 class="ldnx-uk-title" id="ldnxUkTitle">Playing <span class="italic">further afield?</span></h2>
    <p class="ldnx-uk-sub" id="ldnxUkSub">Hand-picked venues across the UK. Real websites, real youth policies where we know them.</p>
    <p class="ldnx-uk-honest">Listed by us — proper member intel still coming. Played one? <a href="caddie.html" style="color: #E84D2C; font-weight: 700;">Submit it on the Caddie page →</a></p>
  </div>
  <div class="ldnx-uk-grid" id="ldnxUkGrid"></div>
</section>
'''

    if 'id="ldnxRegionFilter"' not in html:
        # Inject after opening <body> tag (and after any header/marquee that sticks)
        # Find a good insertion point — after any sticky elements but before the main content
        # Safe approach: insert just before the first <section> or <main> tag
        first_section = re.search(r'<(section|main)[\s>]', html)
        if first_section:
            idx = first_section.start()
            html = html[:idx] + region_html + '\n' + html[idx:]
            print("  ✓ courses.html: region filter strip + UK grid injected")
        else:
            html = html.replace('</body>', region_html + '\n</body>', 1)
            print("  ✓ courses.html: region filter strip + UK grid injected (fallback position)")

    # Inject the JS that populates everything
    region_js = '''
<script>
// ============ REGION FILTER + UK GRID RENDERER ============
(function() {
  function venueTypeLabel(type) {
    const map = {
      course: 'Course', range: 'Range', topgolf: 'Topgolf-style',
      crazy: 'Crazy golf', adventure: 'Adventure golf',
      pitchputt: 'Pitch & putt', indoor: 'Indoor sim'
    };
    return map[type] || type;
  }

  function renderVenueCard(v) {
    const caddieBtn = v.hasFullCaddie
      ? '<a href="caddie.html?course=' + (v.caddieKey || '') + '" class="ldnx-uk-card-link hot">Caddie →</a>'
      : '';
    return (
      '<article class="ldnx-uk-card">' +
        '<div class="ldnx-uk-card-top">' +
          '<div class="ldnx-uk-card-name">' + v.name + '</div>' +
          '<div class="ldnx-uk-card-type">' + venueTypeLabel(v.type) + '</div>' +
        '</div>' +
        '<div class="ldnx-uk-card-meta">' + v.format + ' · ' + v.town + '</div>' +
        '<div class="ldnx-uk-card-note">' + v.atlasNote + '</div>' +
        '<div class="ldnx-uk-card-foot">' +
          '<div class="ldnx-uk-card-info">' +
            '<span><strong>' + (v.priceBand || '£') + '</strong></span>' +
            (v.youthPolicy ? '<span>' + v.youthPolicy + '</span>' : '') +
          '</div>' +
          '<div class="ldnx-uk-card-links">' +
            (v.website ? '<a href="' + v.website + '" target="_blank" rel="noopener" class="ldnx-uk-card-link">Website →</a>' : '') +
            caddieBtn +
          '</div>' +
        '</div>' +
      '</article>'
    );
  }

  function renderRegion(regionKey) {
    if (!window.LDN_VENUES) return;
    const chips = document.getElementById('ldnxRegionChips');
    if (chips) {
      chips.querySelectorAll('.ldnx-region-chip').forEach(c => {
        c.classList.toggle('active', c.dataset.region === regionKey);
      });
    }
    if (regionKey === 'london') {
      // Show the original Atlas, hide the UK section
      document.body.classList.remove('ldnx-non-london-mode');
      document.getElementById('ldnxUkSection').classList.remove('show');
      return;
    }
    // Hide the original London grid, show the UK section with filtered venues
    document.body.classList.add('ldnx-non-london-mode');
    const section = document.getElementById('ldnxUkSection');
    section.classList.add('show');
    const matched = window.LDN_VENUES.filter(v => v.region === regionKey);
    const regionNames = window.LDN_VENUES_BY_REGION || {};
    document.getElementById('ldnxUkFlag').textContent = '✦ ' + (regionNames[regionKey] || regionKey) + ' · United Kingdom';
    document.getElementById('ldnxUkGrid').innerHTML = matched.map(renderVenueCard).join('');
    // Scroll to top of section
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function buildChips() {
    if (!window.LDN_VENUES) return;
    const chips = document.getElementById('ldnxRegionChips');
    if (!chips) return;
    const order = window.LDN_REGION_ORDER || ['london'];
    const names = window.LDN_VENUES_BY_REGION || {};
    const counts = {};
    window.LDN_VENUES.forEach(v => { counts[v.region] = (counts[v.region]||0)+1; });
    chips.innerHTML = order.map(r => {
      const active = (r === 'london') ? ' active' : '';
      return '<button class="ldnx-region-chip' + active + '" data-region="' + r + '">' +
        (names[r] || r) + '<span class="count">' + (counts[r]||0) + '</span></button>';
    }).join('');
    chips.querySelectorAll('.ldnx-region-chip').forEach(c => {
      c.addEventListener('click', () => renderRegion(c.dataset.region));
    });
  }

  function init() {
    if (!window.LDN_VENUES) {
      // venues.js still loading — try again in a moment
      return setTimeout(init, 200);
    }
    buildChips();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
</script>
'''

    if 'function renderVenueCard' not in html:
        html = html.replace('</body>', region_js + '\n</body>', 1)
        print("  ✓ courses.html: region-filter populator added")
    else:
        print("  ✓ courses.html: region-filter populator already present")

    with open('courses.html', 'w', encoding='utf-8') as f:
        f.write(html)
PYEOF

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✓ venues.js wired into Atlas, Scorecard and Caddie."
echo ""
echo "Test locally before pushing:"
echo "  1. Open courses.html → region chips at top → tap South West, Scotland etc."
echo "  2. Open scorecard.html → course dropdown should be grouped by region"
echo "  3. Open caddie.html → submit-intel modal → course field has autocomplete"
echo ""
echo "If happy, push:"
echo "  git add . && git commit -m 'UK Atlas: 109 venues across 9 regions, shared with Scorecard + Caddie' && git push"
echo ""
echo "Rollback if needed:"
echo "  cp .backup-before-venues-fix/*.html ."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
