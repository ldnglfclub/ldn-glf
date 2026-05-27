#!/usr/bin/env bash
# ============================================================
# LDN GLF CLUB — Unify navigation across all pages
# Run this from your ldn-glf repo root.
# It patches every .html file in the repo with:
#   - Unified desktop nav (Home / Atlas / Caddie / Scorecard / My Club / Code / Contact)
#   - Unified mobile menu (hamburger + side drawer + bottom 5-tab nav)
#   - Auth gate via auth.js (caddie / scorecard / member require signup)
# ============================================================

set -euo pipefail

# Sanity check — must be in the repo
if [[ ! -f "index.html" ]]; then
  echo "❌ Run this from the ldn-glf repo root (where index.html lives)."
  exit 1
fi

# Backup everything first
mkdir -p .backup-before-nav-fix
cp *.html .backup-before-nav-fix/ 2>/dev/null || true
echo "✓ Backed up existing HTML files to .backup-before-nav-fix/"

# ============ STEP 1: ensure auth.js is present ============
if [[ ! -f "auth.js" ]]; then
  echo "❌ auth.js not found in repo root. Copy it in first, then re-run this script."
  exit 1
fi

# ============ STEP 2: patch each page with Python ============
python3 << 'PYEOF'
import os, re, glob

# ----------------------------------------------------------------
# The unified mobile menu HTML (drops in after <body>)
# Used by EVERY page. Active link is computed from filename.
# ----------------------------------------------------------------
MOBILE_HEADER_TEMPLATE = '''<!-- ============ UNIFIED MOBILE APP HEADER ============ -->
<header class="ldnx-app-header">
  <a href="index.html" class="ldnx-app-header-left">
    <img src="logo.png" alt="LDN GLF Club" class="ldnx-app-header-logo" onerror="this.style.display='none'">
    <div class="ldnx-app-header-title">LDN GLF<span class="accent">.</span>CLUB</div>
  </a>
  <button class="ldnx-menu-btn" onclick="document.getElementById('ldnxMobileMenu').classList.add('open')" aria-label="Open menu">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
  </button>
</header>

<!-- ============ MOBILE SIDE MENU ============ -->
<div class="ldnx-mobile-menu" id="ldnxMobileMenu">
  <button class="ldnx-mobile-menu-close" onclick="document.getElementById('ldnxMobileMenu').classList.remove('open')" aria-label="Close">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
  </button>
  <a href="index.html" data-page="index">Home</a>
  <a href="courses.html" data-page="courses">Course Atlas</a>
  <a href="caddie.html" data-page="caddie" data-locked>Caddie <span class="ldnx-lock">🔒</span></a>
  <a href="scorecard.html" data-page="scorecard" data-locked>Scorecard <span class="ldnx-lock">🔒</span></a>
  <a href="member.html" data-page="member" data-locked>My Club <span class="ldnx-lock">🔒</span></a>
  <a href="code.html" data-page="code">Our Code</a>
  <a href="parents.html" data-page="parents">For Parents</a>
  <a href="contact.html" data-page="contact">Contact</a>
  <div class="ldnx-mobile-menu-divider"></div>
  <button class="ldnx-mobile-signup" data-signup>Sign Up — Free</button>
</div>
'''

BOTTOM_NAV = '''<!-- ============ UNIFIED BOTTOM NAV (mobile) ============ -->
<nav class="ldnx-bottom-nav">
  <a href="index.html" data-page="index">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12l9-9 9 9"/><path d="M5 10v10h14V10"/></svg>
    <span>Home</span>
  </a>
  <a href="courses.html" data-page="courses">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
    <span>Atlas</span>
  </a>
  <a href="caddie.html" data-page="caddie" data-locked>
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
    <span>Caddie</span>
  </a>
  <a href="scorecard.html" data-page="scorecard" data-locked>
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
    <span>Play</span>
  </a>
  <a href="member.html" data-page="member" data-locked>
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
    <span>Me</span>
  </a>
</nav>
'''

# Shared CSS for the unified nav — uses ldnx- prefix to avoid clashes with per-page styles
SHARED_NAV_CSS = '''<style id="ldnx-nav-styles">
  /* ============ UNIFIED MOBILE NAV (shared across all pages) ============ */
  .ldnx-app-header {
    position: sticky; top: 0; left: 0; right: 0;
    background: #0B2118; color: #EFE5CC;
    z-index: 100; padding: 14px 20px;
    display: flex; justify-content: space-between; align-items: center;
    border-bottom: 1px solid #1F4A33;
  }
  .ldnx-app-header-left { display: flex; align-items: center; gap: 12px; text-decoration: none; }
  .ldnx-app-header-logo { width: 32px; height: 32px; border-radius: 50%; background: #EFE5CC; padding: 4px; }
  .ldnx-app-header-title {
    font-family: 'Archivo Black', sans-serif; font-size: 14px;
    letter-spacing: 1.5px; color: #EFE5CC;
  }
  .ldnx-app-header-title .accent { color: #E84D2C; }
  .ldnx-menu-btn {
    background: transparent; border: none; color: #EFE5CC; cursor: pointer;
    width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;
  }
  .ldnx-menu-btn svg { width: 24px; height: 24px; }

  .ldnx-mobile-menu {
    position: fixed; top: 0; right: -100%; width: 82%; max-width: 320px; height: 100%;
    background: #0B2118; z-index: 200; padding: 80px 32px 32px;
    transition: right 0.35s cubic-bezier(0.4, 0, 0.2, 1);
    display: flex; flex-direction: column; gap: 4px;
    overflow-y: auto;
  }
  .ldnx-mobile-menu.open { right: 0; }
  .ldnx-mobile-menu a {
    color: #EFE5CC; text-decoration: none;
    font-family: 'Anton', sans-serif; font-size: 26px;
    letter-spacing: 1.5px; padding: 11px 0;
    border-bottom: 1px solid #1F4A33;
    transition: color 0.2s, padding-left 0.2s;
    display: flex; align-items: center; justify-content: space-between;
  }
  .ldnx-mobile-menu a:hover, .ldnx-mobile-menu a.active { color: #E84D2C; padding-left: 8px; }
  .ldnx-mobile-menu a.active { font-weight: bold; }
  .ldnx-lock { font-size: 13px; opacity: 0.6; }
  .ldnx-mobile-menu-close {
    position: absolute; top: 18px; right: 24px;
    background: transparent; border: none; color: #EFE5CC; cursor: pointer;
    width: 36px; height: 36px;
  }
  .ldnx-mobile-menu-close svg { width: 28px; height: 28px; }
  .ldnx-mobile-menu-divider { height: 1px; background: #1F4A33; margin: 20px 0 14px; }
  .ldnx-mobile-signup {
    background: #E84D2C; color: #EFE5CC; border: none;
    padding: 14px 18px; border-radius: 100px; cursor: pointer;
    font-family: 'Archivo Black', sans-serif; font-size: 12px;
    letter-spacing: 2px; text-transform: uppercase;
    margin-top: 8px;
  }

  /* Mobile bottom nav */
  .ldnx-bottom-nav {
    position: fixed; bottom: 0; left: 0; right: 0;
    height: 64px; background: #0B2118;
    display: flex; align-items: center; justify-content: space-around;
    border-top: 1px solid #1F4A33; z-index: 90;
  }
  .ldnx-bottom-nav a {
    color: rgba(239, 229, 204, 0.5); text-decoration: none;
    display: flex; flex-direction: column; align-items: center; gap: 3px;
    padding: 4px 12px; transition: color 0.2s;
  }
  .ldnx-bottom-nav a.active { color: #EFE5CC; }
  .ldnx-bottom-nav a:hover { color: #E84D2C; }
  .ldnx-bottom-nav a svg { width: 22px; height: 22px; }
  .ldnx-bottom-nav a span {
    font-family: 'Archivo', sans-serif; font-size: 9px;
    letter-spacing: 1px; text-transform: uppercase; font-weight: 700;
  }

  /* Marketing-page DESKTOP NAV gets a "Sign Up" CTA — added by JS where needed */

  /* Add bottom padding to all pages on mobile so content isn't hidden by bottom nav */
  body { padding-bottom: 64px; }

  /* HIDE the unified mobile nav on desktop — desktop uses each page's existing top nav */
  @media (min-width: 768px) {
    .ldnx-app-header { display: none; }
    .ldnx-bottom-nav { display: none; }
    body { padding-bottom: 0; }
  }

  /* HIDE legacy mobile-only headers that already exist on app pages to avoid double-header */
  /* App-page-specific overrides: hide the original sticky header that's identical to ldnx */
</style>
'''

# Pages that already have their own mobile app header (caddie, scorecard, member)
# — for these, the unified one would double up, so we suppress ours.
APP_PAGES = {'caddie.html', 'scorecard.html', 'member.html'}

# Marketing pages that need the unified mobile header + bottom nav
MARKETING_PAGES = {'index.html', 'courses.html', 'code.html', 'parents.html', 'legal.html', 'contact.html'}

# ----------------------------------------------------------------
# Page-by-page patching
# ----------------------------------------------------------------
def patch_marketing_page(filename):
    """Marketing pages: inject mobile header, mobile menu, bottom nav, signup CTA in top nav."""
    with open(filename, 'r', encoding='utf-8') as f:
        html = f.read()

    # 1. Inject the shared nav CSS in <head>
    if 'ldnx-nav-styles' not in html:
        html = html.replace('</head>', SHARED_NAV_CSS + '\n</head>', 1)

    # 2. Inject auth.js before </body> (idempotent)
    if 'auth.js' not in html:
        html = html.replace('</body>', '<script src="auth.js" defer></script>\n</body>', 1)

    # 3. Inject mobile header right after <body> opening
    # Use a lambda to avoid re.sub treating backslashes in MOBILE_HEADER_TEMPLATE as backrefs
    # Check for the HTML element ID specifically, not the CSS class name
    if 'id="ldnxMobileMenu"' not in html:
        html = re.sub(
            r'(<body[^>]*>)',
            lambda m: m.group(1) + '\n' + MOBILE_HEADER_TEMPLATE,
            html, count=1
        )

    # 4. Inject bottom nav right before </body>
    if 'UNIFIED BOTTOM NAV' not in html:
        html = html.replace('</body>', BOTTOM_NAV + '\n</body>', 1)

    # 5. Update existing desktop nav-cta to use data-signup so it opens the modal
    # Only add data-signup if not already present
    def add_signup_to_cta(m):
        attrs = m.group(1) + m.group(2)
        if 'data-signup' in attrs:
            return m.group(0)
        return f'<a{m.group(1)}class="nav-cta" data-signup{m.group(2)}>{m.group(3)}</a>'
    html = re.sub(
        r'<a([^>]*?)class="nav-cta"([^>]*?)>([^<]*?)</a>',
        add_signup_to_cta,
        html
    )
    # Same for any "Join the Club" / "Get on the List" type CTAs on hero
    def patch_hero_form(m):
        attrs = m.group(1) + m.group(2)
        if 'onsubmit' in attrs:
            return m.group(0)
        return f'<form{m.group(1)}id="hero-signup"{m.group(2)} onsubmit="event.preventDefault(); LDN.openSignup();">'
    html = re.sub(
        r'<form([^>]*?)id="hero-signup"([^>]*?)>',
        patch_hero_form,
        html
    )

    # 6. Add data-signup to any "Become a Member" / "Join" buttons that go to #club anchors
    html = re.sub(r'href="#club"', 'href="#" data-signup', html)
    html = re.sub(r'href="#hero-signup"', 'href="#" data-signup', html)

    # 7. Mark active nav links based on filename
    page_name = filename.replace('.html', '')
    # Pre-clean any active class on nav links to avoid duplicates
    html = re.sub(r'class="active"', '', html)
    # Tag the right link as active in the mobile menu and bottom nav
    html = html.replace(f'data-page="{page_name}"', f'data-page="{page_name}" class="active"')

    # 8. Add a marker class to body so auth.js knows there's a marquee above
    if 'class="has-marquee"' not in html and '<body' in html and 'marquee' in html.lower():
        html = re.sub(r'<body(?![^>]*class=)', '<body class="has-marquee"', html, count=1)

    with open(filename, 'w', encoding='utf-8') as f:
        f.write(html)
    print(f"  ✓ patched {filename} (marketing)")


def patch_app_page(filename):
    """App pages already have their own header — just wire auth + bottom nav active state + signup data attrs."""
    with open(filename, 'r', encoding='utf-8') as f:
        html = f.read()

    # 1. Inject auth.js before </body>
    if 'auth.js' not in html:
        html = html.replace('</body>', '<script src="auth.js" defer></script>\n</body>', 1)

    # 2. Mark locked nav links so they trigger signup if logged out
    # (auth.js handles the gating page-load-wide; this is for in-page links)
    # No change needed — auth.js redirects unauthenticated users at page load.

    print(f"  ✓ patched {filename} (app)")
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(html)


def update_desktop_nav_on_marketing_pages():
    """Replace the desktop nav-links list with the unified 7-link version on every marketing page."""
    new_nav_links = '''  <ul class="nav-links">
    <li><a href="courses.html">Course Atlas</a></li>
    <li><a href="caddie.html" data-locked>Caddie</a></li>
    <li><a href="scorecard.html" data-locked>Scorecard</a></li>
    <li><a href="member.html" data-locked>My Club</a></li>
    <li><a href="code.html">Our Code</a></li>
    <li><a href="parents.html">For Parents</a></li>
    <li><a href="contact.html">Contact</a></li>
  </ul>'''

    for filename in MARKETING_PAGES:
        if not os.path.exists(filename):
            continue
        with open(filename, 'r', encoding='utf-8') as f:
            html = f.read()
        # Replace any <ul class="nav-links">...</ul> with the unified one
        html = re.sub(
            r'<ul class="nav-links">.*?</ul>',
            new_nav_links,
            html,
            count=1,
            flags=re.DOTALL
        )
        # Update the nav CTA text and behavior
        def patch_nav_cta(m):
            return '<a class="nav-cta" data-signup href="#">Sign Up — Free</a>'
        html = re.sub(
            r'<a[^>]*?class="nav-cta"[^>]*?>[^<]*?</a>',
            patch_nav_cta,
            html,
            count=1
        )
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(html)


# ----------------------------------------------------------------
# Run patches
# ----------------------------------------------------------------
print("\n→ Updating desktop nav-links on marketing pages...")
update_desktop_nav_on_marketing_pages()

print("\n→ Patching marketing pages with mobile nav + auth:")
for fn in sorted(MARKETING_PAGES):
    if os.path.exists(fn):
        patch_marketing_page(fn)
    else:
        print(f"  ⚠ {fn} not found, skipping")

print("\n→ Patching app pages with auth gate:")
for fn in sorted(APP_PAGES):
    if os.path.exists(fn):
        patch_app_page(fn)
    else:
        print(f"  ⚠ {fn} not found, skipping")

print("\n✓ All done. Test locally by opening index.html in your browser.\n")
PYEOF

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✓ Site navigation unified."
echo ""
echo "Next steps:"
echo "  1. Open index.html locally → click Sign Up → fill it in → confirm member dashboard works"
echo "  2. Try clicking Caddie/Scorecard/Me in mobile bottom nav while logged out → signup modal should appear"
echo "  3. Commit + push:"
echo "       git add . && git commit -m 'Unify navigation, add signup gate' && git push"
echo ""
echo "Rollback if needed:"
echo "  cp .backup-before-nav-fix/*.html ."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
