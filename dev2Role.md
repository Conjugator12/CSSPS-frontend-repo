# Developer 2 Tasks - CSSPS Frontend

## ✅ Already Built (by Dev 1)

### Public Routes
- `/` - Landing page with placement checker modal
- `/login` - Student authentication page

### Protected Routes (with auth)
- `/hub/self-placement` - Complete self-placement workflow

### Components
- `HelplineBanner` - Top banner with phone numbers
- `PublicNavbar` - Public navigation with Check/Self Placement buttons
- `Footer` - Resources and help centre links
- `PlacementModal` - Public placement lookup
- `ProtectedRoute` - Auth guard wrapper

### Context & Services
- `AuthContext` - JWT token and user state management
- `api.js` - All backend API calls with token interceptor

### Styling
- Complete CSS system (no Tailwind)
- Responsive design ready
- Custom component classes

## ⚠️ NEED TO BUILD (Dev 2)

### 1. Authenticated Navbar (`src/components/AuthNavbar.jsx`)
```jsx
// Requirements:
- Show student name/index number
- Active route highlighting
- Logout button with confirmation
- Navigation links: Dashboard, Placement Info, Self Placement