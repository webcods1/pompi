# Pompi Travels - React Vite TypeScript App

This project has been converted from Django HTML templates to a modern React application using Vite and TypeScript.

## 🚀 Project Structure

```
react-travel-app/
├── src/
│   ├── components/          # React components
│   │   ├── Navbar.tsx
│   │   ├── FeaturedCarousel.tsx
│   │   ├── TravelPlanForm.tsx
│   │   ├── PopularDestinations.tsx
│   │   └── Footer.tsx
│   ├── pages/              # Page components
│   │   └── Home.tsx
│   ├── styles/             # CSS modules
│   │   ├── Navbar.css
│   │   ├── FeaturedCarousel.css
│   │   ├── TravelPlanForm.css
│   │   ├── PopularDestinations.css
│   │   ├── Footer.css
│   │   └── Home.css
│   ├── App.tsx             # Main app component
│   ├── main.tsx            # Entry point
│   └── index.css           # Global styles
├── public/                 # Static assets (images, etc.)
└── package.json

```

## 📋 Converted Components

### ✅ Completed Conversions

1. **Navbar Component** (`Navbar.tsx`)
   - Desktop and mobile responsive navigation
   - Contact dropdown functionality
   - WhatsApp integration
   - Search bar

2. **Featured Carousel** (`FeaturedCarousel.tsx`)
   - Auto-playing image carousel
   - Navigation arrows and dots
   - Special offer overlay
   - Responsive design

3. **Travel Plan Form** (`TravelPlanForm.tsx`)
   - Form with destination, duration, and month selection
   - Form validation
   - Success/error messaging
   - Background image styling

4. **Popular Destinations** (`PopularDestinations.tsx`)
   - Scrollable destination cards
   - Hover effects and animations
   - Responsive card layout

5. **Footer** (`Footer.tsx`)
   - Quick links section
   - Contact information
   - Social media links
   - Responsive layout

6. **Home Page** (`Home.tsx`)
   - Main landing page
   - Integrates all components
   - Sample data structure

## 🛠️ Technologies Used

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **CSS3** - Styling with animations
- **Google Fonts** - Roboto font family

## 📦 Installation & Setup

1. Navigate to the project directory:
   ```bash
   cd react-travel-app
   ```

2. Install dependencies (if not already installed):
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and visit:
   ```
   http://localhost:5173
   ```

## 🎨 Key Features

- **Fully Responsive** - Works on desktop, tablet, and mobile
- **Type-Safe** - All components use TypeScript
- **Component-Based** - Modular and reusable components
- **Modern Styling** - CSS with animations and transitions
- **Fast Development** - Hot module replacement with Vite

## 📝 Next Steps

To complete the conversion, you may want to:

1. **Add Routing** - Install React Router for multi-page navigation
   ```bash
   npm install react-router-dom
   ```

2. **State Management** - Add Context API or Redux for global state

3. **API Integration** - Connect to a backend API for dynamic data

4. **Additional Pages** - Convert remaining HTML pages:
   - About Us
   - Contact
   - Bus Booking
   - Train Booking
   - Trip Details
   - etc.

5. **Form Handling** - Integrate with backend for form submissions

6. **Image Optimization** - Optimize images for web performance

## 🔧 Build for Production

To create a production build:

```bash
npm run build
```

The optimized files will be in the `dist/` folder.

## 📄 Original Django Files

The original Django HTML templates are located in:
- `hello/templates/hello/`
- `hello/static/`

## 🎯 Conversion Notes

- All Django template tags (`{% %}`) have been replaced with React JSX
- Static file references updated to use public folder
- Form handling converted to React state management
- CSS extracted into separate files for better organization
- All files renamed from `.html` to `.tsx`

## 🤝 Contributing

Feel free to enhance this project by:
- Adding more pages
- Improving accessibility
- Optimizing performance
- Adding tests

---

**Converted by**: AI Assistant
**Date**: February 2026
**Framework**: React + Vite + TypeScript
