# Component Architecture

## Component Hierarchy

```
App.tsx
└── Home.tsx
    ├── Navbar.tsx
    │   ├── Desktop Navigation
    │   │   ├── Logo
    │   │   ├── Search Bar
    │   │   ├── Contact Dropdown
    │   │   └── WhatsApp Link
    │   └── Mobile Navigation
    │       ├── Logo
    │       ├── Menu Toggle
    │       ├── Search Bar
    │       ├── Contact Dropdown
    │       └── WhatsApp Link
    │
    ├── FeaturedCarousel.tsx
    │   ├── Image Slides
    │   ├── Navigation Arrows
    │   ├── Dot Indicators
    │   └── Special Offer Overlay
    │
    ├── TravelPlanForm.tsx
    │   ├── Destination Input
    │   ├── Duration Input
    │   ├── Month Select
    │   ├── Submit Button
    │   └── Form Message
    │
    ├── PopularDestinations.tsx
    │   ├── Section Header
    │   └── Scrollable Card Row
    │       └── Destination Cards (map)
    │           ├── Image
    │           ├── Title
    │           ├── Description
    │           └── View Trip Button
    │
    ├── Kerala Banner
    │
    └── Footer.tsx
        ├── Quick Links Section
        ├── Contact Info Section
        ├── Social Media Section
        └── Copyright Footer
```

## Data Flow

```
┌─────────────────────────────────────────┐
│           Home.tsx (Parent)              │
│  - Manages sample data                   │
│  - Passes props to children              │
└─────────────────┬───────────────────────┘
                  │
        ┌─────────┴─────────┐
        │                   │
        ▼                   ▼
┌───────────────┐   ┌──────────────────┐
│ FeaturedCarousel│   │PopularDestinations│
│                 │   │                  │
│ Props:          │   │ Props:           │
│ - images[]      │   │ - cards[]        │
│                 │   │                  │
│ State:          │   │ State:           │
│ - currentIndex  │   │ - none           │
└─────────────────┘   └──────────────────┘

┌─────────────────────────────────────────┐
│      TravelPlanForm (Self-contained)     │
│                                          │
│ State:                                   │
│ - formData { destination, duration,      │
│              month }                     │
│ - formMessage { text, isError }          │
│                                          │
│ Handlers:                                │
│ - handleSubmit()                         │
│ - handleChange()                         │
└──────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│      Navbar (Self-contained)             │
│                                          │
│ State:                                   │
│ - isContactOpen                          │
│ - isMobileMenuOpen                       │
│ - isMobileContactOpen                    │
│                                          │
│ Handlers:                                │
│ - Toggle functions for dropdowns         │
└──────────────────────────────────────────┘
```

## Component Responsibilities

### 🎯 Navbar.tsx
**Purpose**: Site-wide navigation
- Desktop and mobile layouts
- Search functionality
- Contact dropdown
- WhatsApp integration

**State**: UI toggles (dropdowns, mobile menu)
**Props**: None (self-contained)

---

### 🎠 FeaturedCarousel.tsx
**Purpose**: Showcase featured destinations
- Auto-playing slideshow
- Manual navigation
- Special offers display

**State**: Current slide index
**Props**: Array of featured images

---

### 📝 TravelPlanForm.tsx
**Purpose**: Collect travel preferences
- Form validation
- User input handling
- Success/error feedback

**State**: Form data, validation messages
**Props**: None (self-contained)

---

### 🗺️ PopularDestinations.tsx
**Purpose**: Display destination options
- Scrollable card layout
- Destination previews
- Navigation to details

**State**: None (presentational)
**Props**: Array of destination cards

---

### 📄 Footer.tsx
**Purpose**: Site information and links
- Quick navigation
- Contact details
- Social media links

**State**: None (static)
**Props**: None (self-contained)

---

## State Management Strategy

### Current Approach: Local State
Each component manages its own state using `useState`:

```typescript
// Navbar - UI state
const [isContactOpen, setIsContactOpen] = useState(false);

// FeaturedCarousel - slideshow state
const [currentIndex, setCurrentIndex] = useState(0);

// TravelPlanForm - form state
const [formData, setFormData] = useState({ ... });
```

### Future Considerations

For scaling the app, consider:

1. **React Context** - For global state (user auth, theme)
2. **React Router** - For multi-page navigation
3. **React Query** - For server state management
4. **Zustand/Redux** - For complex state logic

## Props Interface

### FeaturedCarousel
```typescript
interface FeaturedCarouselProps {
  images: FeaturedImage[];
}

interface FeaturedImage {
  id: number;
  image: string;
  title: string;
}
```

### PopularDestinations
```typescript
interface PopularDestinationsProps {
  cards: DestinationCard[];
}

interface DestinationCard {
  id: number;
  image: string;
  title: string;
  description: string;
}
```

## Event Flow

```
User Interaction
      │
      ▼
Event Handler (onClick, onChange, onSubmit)
      │
      ▼
State Update (setState)
      │
      ▼
React Re-render
      │
      ▼
Updated UI
```

### Example: Carousel Navigation

```
User clicks "Next" arrow
      │
      ▼
goToNext() handler
      │
      ▼
setCurrentIndex((prev) => (prev + 1) % total)
      │
      ▼
Component re-renders with new index
      │
      ▼
CSS transform updates slide position
```

## Styling Architecture

```
Component.tsx
      │
      ▼
imports Component.css
      │
      ▼
Scoped styles applied
      │
      ▼
Responsive media queries
```

Each component has its own CSS file:
- `Navbar.css` - Navigation styles
- `FeaturedCarousel.css` - Carousel animations
- `TravelPlanForm.css` - Form styling
- `PopularDestinations.css` - Card layouts
- `Footer.css` - Footer design
- `Home.css` - Page-level styles

## Type Safety

All components use TypeScript for:
- ✅ Props validation
- ✅ State type checking
- ✅ Event handler types
- ✅ Data structure enforcement

```typescript
// Type-safe props
interface Props {
  data: DataType[];
}

// Type-safe state
const [state, setState] = useState<StateType>(initialValue);

// Type-safe handlers
const handleClick = (e: MouseEvent<HTMLButtonElement>) => { ... };
```

---

This architecture ensures:
- **Modularity** - Components are independent
- **Reusability** - Components can be used anywhere
- **Maintainability** - Clear separation of concerns
- **Type Safety** - TypeScript prevents errors
- **Scalability** - Easy to add new features
