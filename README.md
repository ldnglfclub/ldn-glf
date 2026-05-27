# The LDN GLF Club — Local Site Mockup

A mockup landing page for The LDN GLF Club brand.

## How to run it locally

The simplest way — just open `index.html` in your browser. Done.

If you want to serve it properly (some browsers handle local images better this way):

**Option 1 — Python (already installed on Mac and most Linux)**
```bash
cd ldn_glf_club_site
python3 -m http.server 8000
```
Then open http://localhost:8000 in your browser.

**Option 2 — Node**
```bash
npx serve .
```

**Option 3 — VS Code**
Install the "Live Server" extension, right-click `index.html`, "Open with Live Server".

## What's inside

- `index.html` — the full site, single file
- `logo.png` — the cleaned-up crest logo (green on transparent)
- `logo-cream.png` — cream version for dark backgrounds
- `logo-small.png` / `logo-small-cream.png` — smaller versions for nav/footer

## Sections

1. **Hero** — full-screen logo with tagline
2. **Manifesto** — the brand's why, in deep green
3. **Drop 001** — The Heritage Hoodie, with embroidered crest illustration
4. **Membership** — Join the Club, four benefits in roman numerals
5. **Founder Note** — the personal story
6. **Footer** — brand summary and links

## Customising

Open `index.html` in a text editor. The styling is all in the `<style>` block at the top. Colours are at the very top under `:root` — change those and the whole site updates.

Key things to change first:
- The £95 price → search for "£95"
- The drop date "July 1st" → search for "July 1st"
- The founder note copy → search for "I started playing golf at twelve"
- Social links in the footer → currently placeholder #

## Fonts used

Loaded from Google Fonts (no install needed, just an internet connection):
- **Fraunces** — display headings, characterful serif
- **Cormorant Garamond** — body text and italics
- **Inter** — small caps and metadata
