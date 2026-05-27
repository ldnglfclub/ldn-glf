/* ============================================================
   LDN GLF CLUB — Shared auth, nav & signup modal
   Drop <script src="auth.js" defer></script> on every page.
   ============================================================ */

(function() {
  'use strict';

  // ============ CONSTANTS ============
  const STORAGE_KEY = 'ldn_glf_member';
  const PROFILE_KEY = 'ldn_glf_profile'; // legacy compatibility w/ member.html
  const LOCKED_PAGES = ['caddie.html', 'scorecard.html', 'member.html'];

  // ============ INJECT SHARED CSS ============
  const css = `
    /* Shared signup modal */
    .ldn-modal-overlay {
      position: fixed; inset: 0;
      background: rgba(11, 33, 24, 0.75);
      backdrop-filter: blur(8px);
      z-index: 9999;
      display: none;
      align-items: center; justify-content: center;
      padding: 20px;
      opacity: 0;
      transition: opacity 0.25s ease;
    }
    .ldn-modal-overlay.open { display: flex; opacity: 1; }
    .ldn-modal {
      background: #EFE5CC;
      border-radius: 18px;
      padding: 32px 28px;
      max-width: 480px;
      width: 100%;
      max-height: 90vh;
      overflow-y: auto;
      position: relative;
      transform: translateY(20px);
      transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .ldn-modal-overlay.open .ldn-modal { transform: translateY(0); }
    .ldn-modal-close {
      position: absolute; top: 14px; right: 14px;
      background: transparent; border: none; cursor: pointer;
      width: 36px; height: 36px;
      display: flex; align-items: center; justify-content: center;
      color: #0B2118;
    }
    .ldn-modal-close svg { width: 22px; height: 22px; }
    .ldn-modal-flag {
      font-family: 'Archivo', sans-serif;
      font-weight: 800;
      font-size: 10px;
      letter-spacing: 3px;
      text-transform: uppercase;
      color: #E84D2C;
      margin-bottom: 8px;
    }
    .ldn-modal-title {
      font-family: 'Anton', sans-serif;
      font-size: 36px;
      line-height: 0.95;
      letter-spacing: -0.5px;
      color: #0B2118;
      margin-bottom: 10px;
    }
    .ldn-modal-title .italic {
      font-family: 'Instrument Serif', serif;
      font-style: italic;
      font-weight: 400;
      color: #E84D2C;
      letter-spacing: -1.5px;
    }
    .ldn-modal-sub {
      font-family: 'Archivo', sans-serif;
      font-size: 14px;
      line-height: 1.5;
      color: #1F4A33;
      margin-bottom: 22px;
      font-weight: 500;
    }
    .ldn-modal-sub strong { color: #0B2118; font-weight: 800; }
    .ldn-field {
      display: flex; flex-direction: column; gap: 6px;
      margin-bottom: 14px;
    }
    .ldn-field label {
      font-family: 'Archivo', sans-serif;
      font-weight: 800;
      font-size: 10px;
      letter-spacing: 2px;
      text-transform: uppercase;
      color: #1F4A33;
    }
    .ldn-field input {
      font-family: 'Archivo', sans-serif;
      font-size: 14px;
      color: #0B2118;
      background: transparent;
      border: 1.5px solid #0B2118;
      border-radius: 10px;
      padding: 12px 14px;
      width: 100%;
      font-weight: 500;
    }
    .ldn-field input:focus { outline: 2px solid #E84D2C; outline-offset: 0; }
    .ldn-field-row {
      display: grid; grid-template-columns: 1fr 1fr;
      gap: 10px;
    }
    .ldn-field-hint {
      font-family: 'Archivo', sans-serif;
      font-size: 11px;
      color: #1F4A33;
      opacity: 0.75;
      margin-top: 2px;
    }
    .ldn-parent-block {
      background: rgba(11, 33, 24, 0.05);
      border-radius: 10px;
      padding: 12px 14px;
      margin-bottom: 14px;
      display: none;
    }
    .ldn-parent-block.show { display: block; }
    .ldn-parent-block p {
      font-family: 'Archivo', sans-serif;
      font-size: 12px;
      color: #1F4A33;
      line-height: 1.5;
      margin-bottom: 10px;
      font-weight: 500;
    }
    .ldn-submit {
      width: 100%;
      background: #E84D2C;
      color: #EFE5CC;
      border: none;
      padding: 16px;
      border-radius: 100px;
      font-family: 'Archivo Black', sans-serif;
      font-size: 13px;
      letter-spacing: 2px;
      text-transform: uppercase;
      cursor: pointer;
      margin-top: 6px;
      transition: background 0.2s, transform 0.15s;
    }
    .ldn-submit:hover { background: #0B2118; transform: translateY(-1px); }
    .ldn-modal-fineprint {
      font-family: 'Archivo', sans-serif;
      font-size: 11px;
      line-height: 1.5;
      color: #1F4A33;
      opacity: 0.7;
      margin-top: 16px;
      text-align: center;
      font-weight: 500;
    }
    .ldn-modal-fineprint a { color: #E84D2C; text-decoration: none; font-weight: 700; }

    /* Welcome state (post-signup) */
    .ldn-welcome {
      text-align: center;
      padding: 12px 0 8px;
    }
    .ldn-welcome-tick {
      width: 64px; height: 64px;
      background: #0B2118;
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      margin: 0 auto 18px;
      color: #E84D2C;
    }
    .ldn-welcome-tick svg { width: 32px; height: 32px; }
    .ldn-welcome-num {
      font-family: 'Anton', sans-serif;
      font-size: 48px;
      color: #E84D2C;
      line-height: 1;
      margin-bottom: 4px;
    }
    .ldn-welcome-label {
      font-family: 'Archivo Black', sans-serif;
      font-size: 11px;
      letter-spacing: 2.5px;
      text-transform: uppercase;
      color: #1F4A33;
      margin-bottom: 16px;
    }

    /* Floating logout/profile button in corner of every page */
    .ldn-account-fab {
      position: fixed;
      top: 14px; right: 14px;
      z-index: 95;
      background: rgba(11, 33, 24, 0.92);
      backdrop-filter: blur(8px);
      color: #EFE5CC;
      border: 1px solid rgba(239, 229, 204, 0.2);
      padding: 8px 12px 8px 8px;
      border-radius: 100px;
      font-family: 'Archivo Black', sans-serif;
      font-size: 10px;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      cursor: pointer;
      display: none;
      align-items: center;
      gap: 8px;
      transition: background 0.2s;
    }
    .ldn-account-fab.show { display: inline-flex; }
    .ldn-account-fab:hover { background: #E84D2C; }
    .ldn-account-fab-avatar {
      width: 24px; height: 24px;
      border-radius: 50%;
      background: #E84D2C;
      color: #EFE5CC;
      display: flex; align-items: center; justify-content: center;
      font-family: 'Archivo Black', sans-serif;
      font-size: 10px;
      letter-spacing: 0;
    }
    .ldn-account-menu {
      position: fixed;
      top: 54px; right: 14px;
      background: #0B2118;
      border: 1px solid #1F4A33;
      border-radius: 12px;
      padding: 8px;
      z-index: 96;
      display: none;
      min-width: 200px;
      box-shadow: 0 12px 32px rgba(0,0,0,0.25);
    }
    .ldn-account-menu.open { display: block; }
    .ldn-account-menu a, .ldn-account-menu button {
      display: block;
      width: 100%;
      padding: 10px 12px;
      background: transparent;
      border: none;
      color: #EFE5CC;
      font-family: 'Archivo', sans-serif;
      font-size: 13px;
      font-weight: 700;
      text-align: left;
      text-decoration: none;
      cursor: pointer;
      border-radius: 8px;
      transition: background 0.15s, color 0.15s;
    }
    .ldn-account-menu a:hover, .ldn-account-menu button:hover {
      background: #1F4A33;
      color: #E84D2C;
    }
    .ldn-account-menu-divider {
      height: 1px;
      background: #1F4A33;
      margin: 4px 0;
    }

    /* On the marketing pages, the FAB conflicts with the top marquee — push it down */
    body.has-marquee .ldn-account-fab { top: 48px; }
    body.has-marquee .ldn-account-menu { top: 88px; }

    /* Toast helper */
    .ldn-toast {
      position: fixed;
      top: 80px; left: 50%;
      transform: translateX(-50%) translateY(-20px);
      background: #0B2118;
      color: #EFE5CC;
      padding: 12px 22px;
      opacity: 0;
      transition: all 0.3s ease;
      font-family: 'Archivo Black', sans-serif;
      font-size: 11px;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      z-index: 9998;
      border: 2px solid #C9A86A;
      border-radius: 6px;
      pointer-events: none;
    }
    .ldn-toast.show { opacity: 1; transform: translateX(-50%) translateY(0); }
  `;

  const styleEl = document.createElement('style');
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  // ============ INJECT MODAL HTML ============
  const modalHtml = `
    <div class="ldn-modal-overlay" id="ldnSignupModal">
      <div class="ldn-modal" role="dialog" aria-modal="true" aria-labelledby="ldnModalTitle">
        <button class="ldn-modal-close" onclick="LDN.closeSignup()" aria-label="Close">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>

        <div id="ldnSignupForm">
          <div class="ldn-modal-flag">✦ Free · 100 Founding Members</div>
          <h2 class="ldn-modal-title" id="ldnModalTitle">Become a <span class="italic">member.</span></h2>
          <p class="ldn-modal-sub">Sign up to unlock <strong>Scorecards, the Caddie and your member dashboard</strong>. Membership is free for the first 100. No commitment, no card details.</p>

          <form id="ldnSignupFormEl" onsubmit="LDN.handleSignup(event)">
            <div class="ldn-field">
              <label for="ldnName">Full name</label>
              <input type="text" id="ldnName" required autocomplete="name" placeholder="e.g. Dylan Heer">
            </div>
            <div class="ldn-field">
              <label for="ldnEmail">Email</label>
              <input type="email" id="ldnEmail" required autocomplete="email" placeholder="you@email.com">
            </div>
            <div class="ldn-field">
              <label for="ldnDob">Date of birth</label>
              <input type="date" id="ldnDob" required>
              <div class="ldn-field-hint">Under 16? We'll ask for a parent contact below.</div>
            </div>
            <div class="ldn-parent-block" id="ldnParentBlock">
              <p><strong>You're under 16</strong> — we need a parent or guardian's email so we can let them know you've joined and share the safeguarding info.</p>
              <div class="ldn-field" style="margin-bottom: 0;">
                <label for="ldnParentEmail">Parent / guardian email</label>
                <input type="email" id="ldnParentEmail" placeholder="parent@email.com">
              </div>
            </div>
            <div class="ldn-field">
              <label for="ldnFriendCode">Friend code (optional)</label>
              <input type="text" id="ldnFriendCode" placeholder="e.g. LDN-001-AB12" maxlength="14">
              <div class="ldn-field-hint">Got invited by a member? Paste their code.</div>
            </div>
            <button type="submit" class="ldn-submit">Join the Club →</button>
            <p class="ldn-modal-fineprint">By joining you agree to <a href="legal.html">our terms &amp; privacy policy</a> and <a href="code.html">our code</a>.</p>
          </form>
        </div>

        <div id="ldnWelcomeState" style="display: none;">
          <div class="ldn-welcome">
            <div class="ldn-welcome-tick">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <div class="ldn-modal-flag">✦ You're in.</div>
            <h2 class="ldn-modal-title">Welcome to the <span class="italic">club.</span></h2>
          </div>
          <div style="background: #0B2118; color: #EFE5CC; border-radius: 14px; padding: 22px 20px; margin: 18px 0;">
            <div style="font-family: 'Archivo Black', sans-serif; font-size: 10px; letter-spacing: 2.5px; text-transform: uppercase; color: #C9A86A; margin-bottom: 6px;">Your member number</div>
            <div class="ldn-welcome-num" id="ldnWelcomeNum">#---</div>
            <div style="font-family: 'Archivo Black', sans-serif; font-size: 10px; letter-spacing: 2.5px; text-transform: uppercase; color: #C9A86A; margin: 14px 0 6px;">Your friend code</div>
            <div style="font-family: 'Archivo Black', sans-serif; font-size: 22px; color: #EFE5CC; letter-spacing: 1px;" id="ldnWelcomeCode">LDN-XXX-XXXX</div>
          </div>
          <button class="ldn-submit" onclick="LDN.completeSignup()">Continue →</button>
        </div>
      </div>
    </div>
    <div class="ldn-toast" id="ldnToast"></div>
  `;

  document.addEventListener('DOMContentLoaded', () => {
    const wrap = document.createElement('div');
    wrap.innerHTML = modalHtml;
    document.body.appendChild(wrap);

    // DOB change → show parent block if under 16
    const dobInput = document.getElementById('ldnDob');
    if (dobInput) {
      dobInput.addEventListener('change', () => {
        const dob = new Date(dobInput.value);
        const age = (Date.now() - dob.getTime()) / (365.25 * 24 * 60 * 60 * 1000);
        const block = document.getElementById('ldnParentBlock');
        const parentEmail = document.getElementById('ldnParentEmail');
        if (age < 16 && age > 5) {
          block.classList.add('show');
          parentEmail.required = true;
        } else {
          block.classList.remove('show');
          parentEmail.required = false;
        }
      });
    }

    // Build account FAB if logged in
    renderAccountFab();

    // Wire all "data-signup" triggers (any element with this attribute opens modal)
    document.querySelectorAll('[data-signup]').forEach(el => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        LDN.openSignup();
      });
    });

    // Intercept clicks on [data-locked] links — open signup modal instead of navigating if not a member
    document.querySelectorAll('[data-locked]').forEach(el => {
      el.addEventListener('click', (e) => {
        if (!getMember()) {
          e.preventDefault();
          const href = el.getAttribute('href');
          LDN.openSignup({ returnTo: href });
        }
        // If member, let navigation proceed
      });
    });

    // Check if this page requires login
    const path = window.location.pathname.split('/').pop() || 'index.html';
    if (LOCKED_PAGES.includes(path) && !getMember()) {
      // Show signup modal immediately, dim the page underneath
      document.body.style.overflow = 'hidden';
      setTimeout(() => LDN.openSignup({ locked: true, returnTo: path }), 50);
    }
  });

  // ============ DATA HELPERS ============
  function getMember() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  }

  function saveMember(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    // Mirror to legacy profile key so member.html works without changes
    localStorage.setItem(PROFILE_KEY, JSON.stringify({
      name: data.name,
      memberNum: data.memberNum,
      friendCode: data.friendCode,
      joinedAt: data.joinedAt
    }));
  }

  function clearMember() {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(PROFILE_KEY);
  }

  function nextMemberNumber() {
    // Member numbers are sequential. #001 is reserved for Dylan Heer.
    // For now we use a registry in localStorage; with Supabase this becomes a server counter.
    let n = parseInt(localStorage.getItem('ldn_glf_next_member_num') || '2', 10);
    if (isNaN(n) || n < 2) n = 2;
    localStorage.setItem('ldn_glf_next_member_num', String(n + 1));
    return n;
  }

  function generateFriendCode(memberNum) {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let suffix = '';
    for (let i = 0; i < 4; i++) suffix += chars[Math.floor(Math.random() * chars.length)];
    return `LDN-${String(memberNum).padStart(3, '0')}-${suffix}`;
  }

  // ============ ACCOUNT FAB / MENU ============
  function renderAccountFab() {
    const existing = document.querySelector('.ldn-account-fab');
    if (existing) existing.remove();
    const menuExisting = document.querySelector('.ldn-account-menu');
    if (menuExisting) menuExisting.remove();

    const m = getMember();
    if (!m) return;

    const initials = (m.name || '?').trim().split(/\s+/).slice(0,2).map(s => s[0]).join('').toUpperCase();
    const firstName = (m.name || '').trim().split(/\s+/)[0] || 'You';

    const fab = document.createElement('button');
    fab.className = 'ldn-account-fab show';
    fab.innerHTML = `
      <span class="ldn-account-fab-avatar">${initials}</span>
      <span>${firstName}</span>
      <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
    `;
    fab.onclick = (e) => {
      e.stopPropagation();
      document.querySelector('.ldn-account-menu').classList.toggle('open');
    };

    const menu = document.createElement('div');
    menu.className = 'ldn-account-menu';
    menu.innerHTML = `
      <div style="padding: 8px 12px 6px; font-family: 'Archivo', sans-serif; font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: #C9A86A; font-weight: 800;">Member #${String(m.memberNum).padStart(3,'0')}</div>
      <a href="member.html">My Club</a>
      <a href="scorecard.html">New Round</a>
      <a href="caddie.html">Caddie</a>
      <div class="ldn-account-menu-divider"></div>
      <button onclick="LDN.logout()">Sign Out</button>
    `;

    document.body.appendChild(fab);
    document.body.appendChild(menu);

    // Close menu on outside click
    document.addEventListener('click', (e) => {
      if (!menu.contains(e.target) && !fab.contains(e.target)) {
        menu.classList.remove('open');
      }
    });
  }

  // ============ TOAST ============
  function showToast(msg) {
    const t = document.getElementById('ldnToast');
    if (!t) return;
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2800);
  }

  // ============ PUBLIC API ============
  let pendingReturnTo = null;
  let pendingLocked = false;

  window.LDN = {
    isMember: () => !!getMember(),
    getMember: getMember,

    openSignup: function(opts) {
      opts = opts || {};
      pendingReturnTo = opts.returnTo || null;
      pendingLocked = !!opts.locked;
      const modal = document.getElementById('ldnSignupModal');
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
      // Show form, hide welcome state
      document.getElementById('ldnSignupForm').style.display = 'block';
      document.getElementById('ldnWelcomeState').style.display = 'none';
      // If locked, don't allow easy close — but we still expose close for accessibility
    },

    closeSignup: function() {
      const modal = document.getElementById('ldnSignupModal');
      modal.classList.remove('open');
      document.body.style.overflow = '';
      // If user closes a locked-page modal without signing up, send them home
      if (pendingLocked && !getMember()) {
        const path = window.location.pathname.split('/').pop() || 'index.html';
        if (LOCKED_PAGES.includes(path)) {
          window.location.href = 'index.html';
        }
      }
      pendingLocked = false;
      pendingReturnTo = null;
    },

    handleSignup: function(e) {
      e.preventDefault();
      const name = document.getElementById('ldnName').value.trim();
      const email = document.getElementById('ldnEmail').value.trim();
      const dob = document.getElementById('ldnDob').value;
      const parentEmail = document.getElementById('ldnParentEmail').value.trim();
      const referrer = document.getElementById('ldnFriendCode').value.trim().toUpperCase();

      if (!name || !email || !dob) return;

      const memberNum = nextMemberNumber();
      const friendCode = generateFriendCode(memberNum);
      const member = {
        name, email, dob,
        parentEmail: parentEmail || null,
        referrer: referrer || null,
        memberNum, friendCode,
        joinedAt: new Date().toISOString()
      };
      saveMember(member);

      // Queue signup to a "pending sync" list for when Supabase comes online
      try {
        const pending = JSON.parse(localStorage.getItem('ldn_glf_pending_signups') || '[]');
        pending.push(member);
        localStorage.setItem('ldn_glf_pending_signups', JSON.stringify(pending));
      } catch {}

      // Show welcome state
      document.getElementById('ldnWelcomeNum').textContent = '#' + String(memberNum).padStart(3, '0');
      document.getElementById('ldnWelcomeCode').textContent = friendCode;
      document.getElementById('ldnSignupForm').style.display = 'none';
      document.getElementById('ldnWelcomeState').style.display = 'block';
    },

    completeSignup: function() {
      const modal = document.getElementById('ldnSignupModal');
      modal.classList.remove('open');
      document.body.style.overflow = '';
      // Render the FAB
      renderAccountFab();
      // If they were trying to access a locked page, reload it so the page now shows
      if (pendingReturnTo) {
        const target = pendingReturnTo;
        pendingReturnTo = null;
        pendingLocked = false;
        window.location.href = target;
        return;
      }
      // Otherwise just refresh the current page state
      pendingLocked = false;
      showToast('Welcome to the club ✦');
      // Reload so locked-tab clicks now flow through
      setTimeout(() => window.location.reload(), 300);
    },

    logout: function() {
      if (!confirm('Sign out of LDN GLF Club on this device?')) return;
      clearMember();
      window.location.href = 'index.html';
    },

    // For locked nav links — used by inline onclick on <a> tags
    requireMember: function(e, href) {
      if (getMember()) return true; // proceed
      if (e) e.preventDefault();
      LDN.openSignup({ returnTo: href });
      return false;
    },

    showToast: showToast
  };
})();
