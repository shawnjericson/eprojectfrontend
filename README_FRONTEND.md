# Global Heritage - Frontend

A modern React application for exploring world heritage sites and historical monuments.

## Features

### 1. Home Page
- Hero section with stunning visuals
- Statistics showcase
- Feature highlights
- Call-to-action sections

### 2. Monuments Section
- **Zone-Based Categorization**: Filter monuments by geographical zones (East, West, North, South, Central)
- **Interactive Map**: View monument locations on an interactive map using Leaflet
- **World Wonders**: Special section showcasing the Seven Wonders of the World
- **Detailed Information**: Each monument includes history, images, and descriptions
- **Read More Modal**: Click on monuments for detailed information

### 3. Gallery Section
- Visual gallery with thumbnail grid
- Lightbox view for full-size images
- Category filtering (Monuments, Wonders, Landmarks, Ancient, Castles)
- Smooth hover effects and transitions

### 4. Contact Us Page
- **Interactive Map**: Company location displayed using Leaflet maps
- **Geolocation**: Shows user's current location on the map
- **Contact Form**: Send messages directly
- **Email Link**: mailto link for direct email communication
- Contact information cards

### 5. Feedback Section
- Interactive feedback form
- Monument selection dropdown
- Star rating system (1-5 stars)
- Form validation
- Success notifications
- Submits without page reload

### 6. Special Features
- **Scrolling Ticker**: Continuous ticker at footer showing:
  - Current date
  - Current time (updates every second)
  - User location (using HTML5 Geolocation API)
- **Visitor Counter**: Displayed in navbar (top right)
- **Menu Animations**:
  - Color change on hover
  - Active state highlighting
  - Smooth fade transitions
- **Responsive Design**: Mobile-friendly across all pages

## Tech Stack

- **React** 19.1.1
- **React Router DOM** 7.9.2
- **Tailwind CSS** (for styling)
- **Leaflet** & **React-Leaflet** (for maps)
- **Yet Another React Lightbox** (for image gallery)
- **date-fns** (for date formatting)
- **Axios** (for API calls)

## Installation

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

The app will open at `http://localhost:3000`

## Project Structure

```
frontend/
├── public/
│   ├── index.html
│   └── ...
├── src/
│   ├── components/
│   │   └── Layout/
│   │       ├── Navbar.jsx
│   │       └── Footer.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Monuments.jsx
│   │   ├── Gallery.jsx
│   │   ├── Contact.jsx
│   │   └── Feedback.jsx
│   ├── App.js
│   ├── index.js
│   └── index.css
├── tailwind.config.js
├── postcss.config.js
└── package.json
```

## Configuration

### Tailwind CSS

The project uses a custom Tailwind configuration with:
- **Primary Colors**: Green shades (heritage/nature theme)
- **Accent Colors**: Gold/brown shades (historical theme)
- **Custom Fonts**: 
  - Sans: Inter
  - Serif: Playfair Display

### API Integration

To connect to the Laravel backend API:

1. Update API base URL in your API service file
2. Configure CORS in Laravel backend
3. Set up authentication if needed

Example API configuration:

```javascript
// src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
```

## Available Scripts

### `npm start`
Runs the app in development mode at [http://localhost:3000](http://localhost:3000)

### `npm build`
Builds the app for production to the `build` folder

### `npm test`
Launches the test runner

### `npm run eject`
Ejects from Create React App (one-way operation)

## Features Implementation

### Scrolling Ticker
Located in Footer component, displays:
- Current date and time (updates every second)
- User location (fetched using Geolocation API)
- Continuous scrolling animation

### Visitor Counter
Located in Navbar component:
- Tracks page visits using localStorage
- Displays in top-right corner
- Formatted with thousands separator

### Menu Animations
Navbar links feature:
- Hover color change
- Active state highlighting
- Smooth transitions (300ms duration)
- Fade in/out effects

### Interactive Maps
Used in:
- **Monuments Page**: Shows all monument locations
- **Contact Page**: Shows company location and user location

### Lightbox Gallery
- Click any image to open full-size view
- Navigate between images
- Smooth transitions
- Close with X button or click outside

## Responsive Design

The application is fully responsive with breakpoints:
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## Color Scheme

### Primary (Green - Heritage/Nature)
- 50: #f0f9f4
- 600: #2c9968 (main)
- 800: #175038

### Accent (Gold - Historical)
- 50: #faf8f3
- 400: #d4a574 (main)
- 800: #714127

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance Optimization

- Lazy loading for images
- Code splitting with React Router
- Optimized bundle size
- Efficient re-renders with React hooks

## Future Enhancements

- [ ] User authentication
- [ ] Save favorite monuments
- [ ] Share on social media
- [ ] Multi-language support
- [ ] Dark mode
- [ ] Progressive Web App (PWA)
- [ ] Offline support

## Troubleshooting

### Maps not displaying
- Check if Leaflet CSS is imported
- Verify map container has height set
- Check internet connection for tile loading

### Images not loading
- Verify image URLs are correct
- Check CORS settings if loading from external sources
- Ensure images are in public folder or properly imported

### Geolocation not working
- Enable location permissions in browser
- Use HTTPS in production (required for geolocation)
- Handle permission denied gracefully

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.

## Contact

For questions or support, please contact:
- Email: info@globalheritage.com
- Website: https://globalheritage.com

---

Built with ❤️ for preserving world heritage

