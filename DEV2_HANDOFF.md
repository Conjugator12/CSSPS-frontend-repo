# CSSPS Frontend — Developer 2 Handoff

Welcome to the project. Dev 1 has already built the public-facing pages and auth system.
Your job is to build the **authenticated portal** — everything a student sees after logging in.

---

## Quick Start

```bash
# 1. Clone the frontend repo
git clone https://github.com/Conjugator12/CSSPS-frontend-repo.git
cd CSSPS-frontend-repo

# 2. Install dependencies
npm install

# 3. Set up environment
cp .env.example .env
# .env should contain:
# VITE_API_BASE_URL=http://localhost:8000

# 4. Start the dev server
npm run dev
# Runs on http://localhost:3000
```

> You also need the backend running in a separate terminal:
> ```bash
> cd CSSPS-backend_repo
> python -m uvicorn app.main:app --reload
> # Runs on http://localhost:8000
> ```

---

## Project Structure

```
src/
├── index.css                        # Global CSS variables + shared utility classes
├── main.jsx                         # React entry point
├── App.jsx                          # Router — your routes are already registered here
│
├── context/
│   └── AuthContext.jsx              # ← DO NOT MODIFY (Dev 1 owns this)
│
├── services/
│   └── api.js                       # ← DO NOT MODIFY (Dev 1 owns this)
│
├── components/
│   ├── HelplineBanner.jsx           # Dev 1
│   ├── PublicNavbar.jsx             # Dev 1
│   ├── PlacementModal.jsx           # Dev 1
│   ├── Footer.jsx                   # Dev 1
│   ├── ProtectedRoute.jsx           # Dev 1 — DO NOT MODIFY
│   └── AuthNavbar.jsx               # ← YOU BUILD THIS
│
└── pages/
    ├── LandingPage.jsx              # Dev 1
    ├── Login.jsx                    # Dev 1
    ├── SelfPlacement.jsx            # Dev 1
    ├── Dashboard.jsx                # ← YOU BUILD THIS
    └── PlacementInfo.jsx            # ← YOU BUILD THIS
```

---

## What You Need to Build

### 1. `src/components/AuthNavbar.jsx` + `AuthNavbar.module.css`

The top navigation bar shown on all authenticated pages.

**Must include:**
- CSSPS logo (import from `../assets/cssps-logo.png`)
- Three nav links: **Dashboard** (`/hub`), **Placement Information** (`/hub/placement`), **Self Placement** (`/hub/self-placement`)
- Active link highlighted in gold (`#D4A017`)
- Notification bell icon (static for now)
- User avatar showing initials (e.g. "LV" for LITSA VICTORIA)
- Background color: `var(--cream)` — `#FEFAE8`

**After building it**, open `src/pages/SelfPlacement.jsx` and replace
the `TempAuthNav` component at the top of that file with:
```jsx
import AuthNavbar from '../components/AuthNavbar'
// then use <AuthNavbar /> instead of <TempAuthNav />
```

---

### 2. `src/pages/Dashboard.jsx` + `Dashboard.module.css`

Route: `/hub`

**Layout (two cards side by side):**

**Left card — Welcome:**
- Large circular avatar showing user initials (black circle, white text)
- "Welcome" heading
- Student full name below
- Sign Out button (calls `logout()` from auth context, redirects to `/`)

**Right card — Profile:**
- Section title: "PROFILE" with a gold underline
- Rows: Name, Gender, Index Number, BECE Year, Basic School, District, Region
- Values aligned to the right, label on the left
- Show `—` for any empty/null values

---

### 3. `src/pages/PlacementInfo.jsx` + `PlacementInfo.module.css`

Route: `/hub/placement`

**Section 1 — Choices table:**
- Title: "CHOICES"
- Table columns: `#`, `SCHOOL`, `PROGRAMME`, `RESIDENCY`
- Lists all school choices the student submitted (from API)

**Section 2 — Placed School card (green background `#f0fdf4`):**
- Title: "PLACED SCHOOL"
- Rows: Candidate Name, Index Number, SHS Placed, Programme, Residency, SHS District, SHS Region
- Two blue buttons at the bottom:
  - **Print Placement Slip** → `window.print()`
  - **Print Enrolment Form** → `window.print()`

---

## Getting the Logged-in User

```jsx
import { useAuth } from '../context/AuthContext'

export default function Dashboard() {
  const { user, logout } = useAuth()

  // Available fields (from backend):
  // user.name / user.candidate_name
  // user.index_number
  // user.gender
  // user.bece_year
  // user.basic_school
  // user.district
  // user.region
}
```

---

## Making API Calls

The `api` instance in `src/services/api.js` automatically attaches
the JWT token to every request — you just call the endpoint.

```jsx
import { useEffect, useState } from 'react'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'

export default function PlacementInfo() {
  const { user } = useAuth()
  const [placement, setPlacement] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get(`/api/placements/check-placement/${user.index_number}`)
      .then(({ data }) => setPlacement(data))
      .catch((err) => setError(err.userMessage || 'Failed to load placement.'))
      .finally(() => setLoading(false))
  }, [])
}
```

### Your API Endpoints

| Endpoint | Method | Purpose |
|---|---|---|
| `/api/auth/student/me` | GET | Full student profile |
| `/api/placements/check-placement/{index_number}` | GET | Placement result + school choices |

> Explore all endpoints at `http://localhost:8000/docs` (Swagger UI)

---

## CSS Rules — Follow These Exactly

### Each component gets its own CSS Module

```
AuthNavbar.jsx        →  AuthNavbar.module.css
Dashboard.jsx         →  Dashboard.module.css
PlacementInfo.jsx     →  PlacementInfo.module.css
```

Import like this:
```jsx
import s from './Dashboard.module.css'
// use as: className={s.someClass}
```

### Global CSS Variables (defined in `src/index.css`)

```css
/* Colors */
--gold:       #D4A017    /* active nav links, accents */
--gold-dark:  #b8890f
--cream:      #FEFAE8    /* page background */
--dark:       #1A2340    /* headings */
--red:        #C0392B    /* primary buttons */
--green:      #27ae60
--blue:       #2563eb    /* print buttons */

/* Grays */
--gray-50 through --gray-900

/* Spacing & Shape */
--radius-sm:   6px
--radius-md:   10px
--radius-lg:   16px
--radius-full: 9999px

/* Shadows */
--shadow-sm / --shadow-md / --shadow-lg

/* Transition */
--transition:  all 0.2s ease
```

### Global Utility Classes (no import needed — use directly)

| Class | What it does |
|---|---|
| `.card` | White rounded card with border and shadow |
| `.btn-primary` | Red pill button |
| `.btn-gold` | Gold rounded button |
| `.btn-outline` | Outlined ghost button |
| `.input-field` | Styled text/select input |
| `.alert` | Base alert box |
| `.alert-error` | Red error alert |
| `.alert-warn` | Yellow warning alert |
| `.alert-success` | Green success alert |
| `.alert-info` | Blue info alert |
| `.spinner` | CSS loading spinner |
| `.page-loading` | Full-page centered loading screen |

---

## App.jsx — Your Routes Are Already There

You do not need to touch `App.jsx`. It already has:

```jsx
<Route path="/hub"                element={<ProtectedRoute><HubDashboard /></ProtectedRoute>} />
<Route path="/hub/placement"      element={<ProtectedRoute><PlacementInfo /></ProtectedRoute>} />
<Route path="/hub/self-placement" element={<ProtectedRoute><SelfPlacement /></ProtectedRoute>} />
```

Just replace the placeholder `HubDashboard` and `PlacementInfo` imports
with your real page components:

```jsx
// Replace these two lines in App.jsx:
import Dashboard     from './pages/Dashboard'
import PlacementInfo from './pages/PlacementInfo'

// And update the route elements:
<Route path="/hub"           element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
<Route path="/hub/placement" element={<ProtectedRoute><PlacementInfo /></ProtectedRoute>} />
```

---

## Visual Reference

All pages should match the screenshots in the project brief:

| Page | Key visual details |
|---|---|
| Dashboard | Cream background, white cards, gold profile underline, black avatar circle |
| Placement Info | White card for choices table, green card for placed school, blue print buttons |
| Auth Navbar | Cream background, gold active link, avatar initials top right |

---

## Running the Full Stack

```
Terminal 1 (backend):   python -m uvicorn app.main:app --reload
Terminal 2 (frontend):  npm run dev

Browser:
  Frontend  →  http://localhost:3000
  Backend   →  http://localhost:8000
  API Docs  →  http://localhost:8000/docs
```

---

## Git Workflow

```bash
# Always pull before starting work
git pull origin main

# Create your branch
git checkout -b dev2/dashboard-placement

# Commit often
git add .
git commit -m "feat: add Dashboard page"

# Push and open a PR for Dev 1 to review before merging
git push origin dev2/dashboard-placement
```

---

## Questions?

Check `http://localhost:8000/docs` first — every endpoint is documented there with
request and response examples you can run directly in the browser.

If a response field name does not match what is shown in the UI screenshots,
check the actual JSON in the browser DevTools Network tab
and adjust your field mapping accordingly.

---

*CSSPS Frontend · Developer 2 Handoff · May 2026*
