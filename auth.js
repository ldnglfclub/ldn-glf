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

    /* Sign-in note has more body copy and a left-aligned warning tone */
    .ldn-signin-note {
      text-align: left;
      background: rgba(232, 77, 44, 0.08);
      border-left: 3px solid #E84D2C;
      padding: 12px 14px;
      border-radius: 6px;
      opacity: 1;
      margin-top: 14px;
    }
    .ldn-signin-note strong { color: #0B2118; }

    /* Choice stack on landing */
    .ldn-choice-stack {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin: 22px 0 18px;
    }
    .ldn-choice-btn {
      width: 100%;
      border: 2px solid #0B2118;
      background: transparent;
      padding: 18px 20px;
      border-radius: 14px;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 4px;
      text-align: left;
      transition: all 0.18s;
      font-family: 'Archivo', sans-serif;
    }
    .ldn-choice-btn.primary {
      background: #0B2118;
      color: #EFE5CC;
      border-color: #0B2118;
    }
    .ldn-choice-btn.primary:hover {
      background: #E84D2C;
      border-color: #E84D2C;
      transform: translateY(-2px);
    }
    .ldn-choice-btn.secondary {
      background: transparent;
      color: #0B2118;
    }
    .ldn-choice-btn.secondary:hover {
      background: #0B2118;
      color: #EFE5CC;
      transform: translateY(-2px);
    }
    .ldn-choice-label {
      font-family: 'Archivo', sans-serif;
      font-weight: 800;
      font-size: 10px;
      letter-spacing: 2px;
      text-transform: uppercase;
      opacity: 0.65;
    }
    .ldn-choice-btn.primary .ldn-choice-label { color: #C9A86A; opacity: 1; }
    .ldn-choice-title {
      font-family: 'Archivo Black', sans-serif;
      font-size: 18px;
      letter-spacing: 0.3px;
    }
    .ldn-choice-meta {
      font-family: 'Instrument Serif', serif;
      font-style: italic;
      font-weight: 400;
      font-size: 14px;
      letter-spacing: -0.3px;
      opacity: 0.75;
    }

    /* Back arrow on signup/signin sub-views */
    .ldn-back-btn {
      background: transparent;
      border: none;
      cursor: pointer;
      color: #1F4A33;
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 6px 8px 6px 0;
      margin-bottom: 6px;
      font-family: 'Archivo Black', sans-serif;
      font-size: 10px;
      letter-spacing: 2px;
      text-transform: uppercase;
      transition: color 0.15s;
    }
    .ldn-back-btn:hover { color: #E84D2C; }
    .ldn-back-btn svg { width: 14px; height: 14px; }

    /* Desktop nav: small text "Sign In" link to the LEFT of the Sign Up CTA */
    .nav-signin-link {
      font-family: 'Archivo', sans-serif;
      font-weight: 700;
      font-size: 13px;
      letter-spacing: 0.3px;
      color: #0B2118;
      text-decoration: none;
      margin-right: 16px;
      padding: 6px 0;
      transition: color 0.15s;
      cursor: pointer;
    }
    .nav-signin-link:hover { color: #E84D2C; }

    /* Mobile menu: Sign In button below the orange Sign Up button */
    .ldnx-mobile-signin {
      background: transparent;
      color: #EFE5CC;
      border: 1.5px solid #C9A86A;
      padding: 12px 18px;
      border-radius: 100px;
      cursor: pointer;
      font-family: 'Archivo Black', sans-serif;
      font-size: 11px;
      letter-spacing: 2px;
      text-transform: uppercase;
      margin-top: 8px;
      transition: all 0.18s;
    }
    .ldnx-mobile-signin:hover { background: #C9A86A; color: #0B2118; }

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

        <!-- LANDING: pick Sign Up or Sign In -->
        <div id="ldnLanding">
          <div class="ldn-modal-flag">✦ The Club</div>
          <h2 class="ldn-modal-title" id="ldnModalTitle">Members <span class="italic">only.</span></h2>
          <p class="ldn-modal-sub" id="ldnLandingSub">Sign up to unlock <strong>Scorecards, the Caddie and your member dashboard</strong>. Already a member? Sign in to restore your profile on this device.</p>
          <div class="ldn-choice-stack">
            <button class="ldn-choice-btn primary" onclick="LDN.showSignup()">
              <span class="ldn-choice-label">New here?</span>
              <span class="ldn-choice-title">Sign Up <span class="ldn-choice-meta">— Free, takes 30 sec</span></span>
            </button>
            <button class="ldn-choice-btn secondary" onclick="LDN.showSignin()">
              <span class="ldn-choice-label">Returning member?</span>
              <span class="ldn-choice-title">Sign In <span class="ldn-choice-meta">— Restore your profile</span></span>
            </button>
          </div>
          <p class="ldn-modal-fineprint">By using LDN GLF Club you agree to <a href="legal.html">our terms &amp; privacy</a> and <a href="code.html">our code</a>.</p>
        </div>

        <!-- SIGNUP FORM -->
        <div id="ldnSignupForm" style="display: none;">
          <button class="ldn-back-btn" onclick="LDN.showLanding()" aria-label="Back">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg>
            <span>Back</span>
          </button>
          <div class="ldn-modal-flag">✦ Free · 100 Founding Members</div>
          <h2 class="ldn-modal-title">Join the <span class="italic">club.</span></h2>
          <p class="ldn-modal-sub">No card details. No commitment. Just your <strong>name, email and DOB</strong>.</p>

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
          </form>
        </div>

        <!-- SIGN IN FORM -->
        <div id="ldnSigninForm" style="display: none;">
          <button class="ldn-back-btn" onclick="LDN.showLanding()" aria-label="Back">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg>
            <span>Back</span>
          </button>
          <div class="ldn-modal-flag">✦ Welcome back</div>
          <h2 class="ldn-modal-title">Sign <span class="italic">in.</span></h2>
          <p class="ldn-modal-sub">Restore your profile on this device. We'll need your <strong>email and either your member number or friend code</strong>.</p>

          <form id="ldnSigninFormEl" onsubmit="LDN.handleSignin(event)">
            <div class="ldn-field">
              <label for="ldnSigninName">Your name</label>
              <input type="text" id="ldnSigninName" required autocomplete="name" placeholder="As you registered">
            </div>
            <div class="ldn-field">
              <label for="ldnSigninEmail">Email you signed up with</label>
              <input type="email" id="ldnSigninEmail" required autocomplete="email" placeholder="you@email.com">
            </div>
            <div class="ldn-field">
              <label for="ldnSigninIdentifier">Member number <em style="font-weight:500;text-transform:none;letter-spacing:0;opacity:0.6;">or</em> friend code</label>
              <input type="text" id="ldnSigninIdentifier" required placeholder="e.g. 12  or  LDN-012-XY3K">
              <div class="ldn-field-hint">Whichever you remember. Both work.</div>
            </div>
            <button type="submit" class="ldn-submit">Sign In →</button>
            <p class="ldn-modal-fineprint ldn-signin-note">
              <strong>Heads-up:</strong> we don't have a server yet — sign-in restores your profile on <em>this</em> device based on what you remember. A proper account system is coming soon. <br><br>
              Forgot everything? <a href="#" onclick="LDN.showSignup(); return false;">Just sign up fresh</a> — we'll merge old &amp; new records when accounts are live.
            </p>
          </form>
        </div>

        <!-- WELCOME (post-signup) -->
        <div id="ldnWelcomeState" style="display: none;">
          <div class="ldn-welcome">
            <div class="ldn-welcome-tick">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <div class="ldn-modal-flag" id="ldnWelcomeFlag">✦ You're in.</div>
            <h2 class="ldn-modal-title" id="ldnWelcomeTitle">Welcome to the <span class="italic">club.</span></h2>
          </div>
          <div style="background: #0B2118; color: #EFE5CC; border-radius: 14px; padding: 22px 20px; margin: 18px 0;">
            <div style="font-family: 'Archivo Black', sans-serif; font-size: 10px; letter-spacing: 2.5px; text-transform: uppercase; color: #C9A86A; margin-bottom: 6px;">Your member number</div>
            <div class="ldn-welcome-num" id="ldnWelcomeNum">#---</div>
            <div style="font-family: 'Archivo Black', sans-serif; font-size: 10px; letter-spacing: 2.5px; text-transform: uppercase; color: #C9A86A; margin: 14px 0 6px;">Your friend code</div>
            <div style="font-family: 'Archivo Black', sans-serif; font-size: 22px; color: #EFE5CC; letter-spacing: 1px;" id="ldnWelcomeCode">LDN-XXX-XXXX</div>
            <div style="font-family: 'Archivo', sans-serif; font-size: 11px; color: rgba(239,229,204,0.65); margin-top: 10px; line-height: 1.5;">
              Save these somewhere — you'll need them if you ever sign in on another device.
            </div>
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

    // Hide/swap signup CTAs based on auth state
    refreshAuthVisibility();

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

  // ============ AUTH-AWARE UI VISIBILITY ============
  // Hides signup CTAs when logged in. Swaps "Join the Club" buttons to "My Club".
  // Adds a "Sign In" link next to signup CTAs for logged-out users.
  function refreshAuthVisibility() {
    const loggedIn = !!getMember();

    // Top desktop nav-cta (Sign Up — Free) and mobile menu signup button
    document.querySelectorAll('.nav-cta[data-signup], .ldnx-mobile-signup, [data-signup-cta]').forEach(el => {
      if (loggedIn) {
        el.style.display = 'none';
      } else {
        el.style.display = '';
      }
    });

    // Any element with [data-signin-cta] — for explicit "Sign In" links
    document.querySelectorAll('[data-signin-cta]').forEach(el => {
      if (loggedIn) el.style.display = 'none';
      else el.style.display = '';
    });

    // Add a sibling "Sign In" link next to every data-signup element (if not already there)
    if (!loggedIn) {
      document.querySelectorAll('.nav-cta[data-signup]').forEach(cta => {
        if (cta.dataset.signinPaired === '1') return;
        cta.dataset.signinPaired = '1';
        const signin = document.createElement('a');
        signin.href = '#';
        signin.className = 'nav-signin-link';
        signin.textContent = 'Sign In';
        signin.setAttribute('data-signin-cta', '');
        signin.addEventListener('click', (e) => { e.preventDefault(); LDN.openSignin(); });
        cta.parentNode.insertBefore(signin, cta);
      });
      // Add a Sign In button below the mobile menu Sign Up button
      document.querySelectorAll('.ldnx-mobile-signup').forEach(btn => {
        if (btn.dataset.signinPaired === '1') return;
        btn.dataset.signinPaired = '1';
        const signin = document.createElement('button');
        signin.className = 'ldnx-mobile-signin';
        signin.textContent = 'Sign In — Already a member';
        signin.setAttribute('data-signin-cta', '');
        signin.addEventListener('click', () => {
          document.getElementById('ldnxMobileMenu').classList.remove('open');
          LDN.openSignin();
        });
        btn.parentNode.insertBefore(signin, btn.nextSibling);
      });
    } else {
      // Remove any sign-in pairs that may exist (in case of dynamic state change)
      document.querySelectorAll('[data-signin-cta]').forEach(el => el.remove());
    }
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

  function setView(view) {
    // view ∈ 'landing' | 'signup' | 'signin' | 'welcome'
    const map = {
      landing: 'ldnLanding',
      signup: 'ldnSignupForm',
      signin: 'ldnSigninForm',
      welcome: 'ldnWelcomeState'
    };
    Object.values(map).forEach(id => {
      const el = document.getElementById(id);
      if (el) el.style.display = 'none';
    });
    const showEl = document.getElementById(map[view]);
    if (showEl) showEl.style.display = 'block';
  }

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
      // Default opens to the landing chooser
      // If caller wants to skip straight to a view (e.g. opts.view = 'signin'), honour it
      setView(opts.view || 'landing');
    },

    openSignin: function(opts) {
      LDN.openSignup(Object.assign({}, opts || {}, { view: 'signin' }));
    },

    showLanding: function() { setView('landing'); },
    showSignup:  function() { setView('signup'); },
    showSignin:  function() { setView('signin'); },

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
      const flag = document.getElementById('ldnWelcomeFlag');
      const title = document.getElementById('ldnWelcomeTitle');
      if (flag) flag.innerHTML = '✦ You\'re in.';
      if (title) title.innerHTML = 'Welcome to the <span class="italic">club.</span>';
      document.getElementById('ldnWelcomeNum').textContent = '#' + String(memberNum).padStart(3, '0');
      document.getElementById('ldnWelcomeCode').textContent = friendCode;
      setView('welcome');
    },

    handleSignin: function(e) {
      e.preventDefault();
      const name = document.getElementById('ldnSigninName').value.trim();
      const email = document.getElementById('ldnSigninEmail').value.trim();
      const ident = document.getElementById('ldnSigninIdentifier').value.trim().toUpperCase();

      if (!name || !email || !ident) return;

      // Parse identifier — either a member number ("12", "#012") or a friend code ("LDN-012-XY3K")
      let memberNum = null;
      let friendCode = null;

      const fcMatch = ident.match(/^LDN-(\d{1,4})-[A-Z0-9]{4}$/);
      if (fcMatch) {
        memberNum = parseInt(fcMatch[1], 10);
        friendCode = ident;
      } else {
        // Try as raw number
        const cleaned = ident.replace(/[^0-9]/g, '');
        if (cleaned) {
          memberNum = parseInt(cleaned, 10);
          friendCode = generateFriendCode(memberNum); // synthesise — they'll get this in their welcome
        }
      }

      if (!memberNum || memberNum < 1) {
        showToast('Member number looks wrong — try again');
        return;
      }

      // Reconstruct profile from what they gave us
      const member = {
        name, email, dob: null, parentEmail: null, referrer: null,
        memberNum, friendCode,
        joinedAt: new Date().toISOString(),
        restored: true  // flag so we know this came from sign-in, not fresh signup
      };
      saveMember(member);

      // Show welcome state, tweak copy for sign-in
      const flag = document.getElementById('ldnWelcomeFlag');
      const title = document.getElementById('ldnWelcomeTitle');
      if (flag) flag.innerHTML = '✦ Welcome back.';
      if (title) title.innerHTML = 'Signed <span class="italic">in.</span>';
      document.getElementById('ldnWelcomeNum').textContent = '#' + String(memberNum).padStart(3, '0');
      document.getElementById('ldnWelcomeCode').textContent = friendCode;
      setView('welcome');
    },

    completeSignup: function() {
      const modal = document.getElementById('ldnSignupModal');
      modal.classList.remove('open');
      document.body.style.overflow = '';
      // Render the FAB
      renderAccountFab();
      // Update visibility of signup CTAs across the page now that user is logged in
      refreshAuthVisibility();
      // If they were trying to access a locked page, reload it so the page now shows
      if (pendingReturnTo) {
        const target = pendingReturnTo;
        pendingReturnTo = null;
        pendingLocked = false;
        window.location.href = target;
        return;
      }
      pendingLocked = false;
      showToast('Welcome to the club ✦');
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
