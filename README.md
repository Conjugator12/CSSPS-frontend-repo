# CSSPS Frontend — Developer 1 (Plain CSS)

No Tailwind. No UI library. Pure CSS Modules + global variables.

## Quick start

```bash
npm install
cp .env.example .env        # set VITE_API_BASE_URL to your Flask server
npm run dev                 # runs on http://localhost:3000
```

> The Vite dev server proxies `/api/*` → `http://localhost:5000` automatically,
> so no CORS config needed during development.

## File map

```
src/
├── index.css                        # Global CSS vars, resets, shared classes
├── main.jsx                         # React root
├── App.jsx                          # Router + auth provider
│
├── context/
│   └── AuthContext.jsx              # JWT login/logout, user state
│
├── services/
│   └── api.js                       # All Flask API calls (axios)
│
├── components/
│   ├── HelplineBanner.jsx / .css    # Red helpline top bar
│   ├── PublicNavbar.jsx   / .css    # Landing page pill nav
│   ├── PlacementModal.jsx / .css    # Public index number lookup popup
│   ├── Footer.jsx         / .css    # Dark footer
│   └── ProtectedRoute.jsx           # Auth guard (no CSS needed)
│
└── pages/
    ├── LandingPage.jsx    / .css    # /
    ├── Login.jsx          / .css    # /login
    └── SelfPlacement.jsx  / .css    # /hub/self-placement
```

## Global CSS classes (src/index.css)

Use these anywhere without importing — they're global:

| Class | Purpose |
|---|---|
| `.btn-primary` | Red pill button |
| `.btn-gold` | Gold rounded button |
| `.btn-outline` | Outlined ghost button |
| `.input-field` | Text/select input |
| `.card` | White rounded card with shadow |
| `.alert` | Base alert (combine with below) |
| `.alert-error` | Red error alert |
| `.alert-warn` | Yellow warning alert |
| `.alert-success` | Green success alert |
| `.alert-info` | Blue info alert |
| `.spinner` | CSS loading spinner |
| `.page-loading` | Full page loading screen |

## CSS Variables (available everywhere)

```css
--gold / --gold-dark
--cream
--dark
--red / --red-dark
--green
--blue / --blue-dark
--gray-50 … --gray-900
--radius-sm / --radius-md / --radius-lg / --radius-full
--shadow-sm / --shadow-md / --shadow-lg
--transition
```

## Assets

Place the CSSPS logo at `src/assets/cssps-logo.png`.

## Handoff to Dev 2

- `App.jsx` has placeholder `<div>` components at `/hub` and `/hub/placement`
- Dev 2 replaces those with their `Dashboard.jsx` and `PlacementInfo.jsx`
- The `TempAuthNav` inside `SelfPlacement.jsx` should be replaced with
  Dev 2's `AuthNavbar` component after merging
- Shared: `AuthContext`, `ProtectedRoute`, `api.js`, `index.css`
