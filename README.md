# 🚀 Employee Dashboard - Modern HR Management System

A production-ready, visually stunning ReactJS web application for employee management with advanced features including data visualization, interactive maps, and photo capture functionality.

![React](https://img.shields.io/badge/React-18.2.0-blue.svg)
![Vite](https://img.shields.io/badge/Vite-5.1.0-purple.svg)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4.1-cyan.svg)
![License](https://img.shields.io/badge/License-MIT-green.svg)

## ✨ Features

### 🔐 Authentication
- Modern login page with gradient background and animations
- Secure credential validation
- Persistent session management
- Demo credentials: `testuser` / `Test123`

### 📊 Data Management
- **Interactive Table View**: Paginated, searchable, and sortable employee data
- **Bar Chart Visualization**: View top 10 employee salaries using Recharts
- **Map View**: Geographic distribution of employees using React-Leaflet
- Real-time search and filtering
- Smooth transitions between different view modes

### 👤 Employee Details
- Comprehensive employee profile cards
- Professional information display
- Salary breakdown (annual/monthly)
- Employment timeline
- Responsive card layouts with glassmorphism effects

### 📷 Photo Capture
- Webcam integration using react-webcam
- Front/back camera switching
- Photo preview with confirm/retake options
- Download and share functionality
- Camera frame overlay for better positioning

### 🎨 Design & UX
- **Theme Support**: Light/Dark mode with persistent storage
- **Glassmorphism**: Modern glass-effect UI components
- **Animations**: Smooth transitions using Framer Motion
- **Responsive**: Fully responsive design for desktop and mobile
- **Icons**: Beautiful icons from Lucide React
- **Gradient Accents**: Eye-catching gradient backgrounds
- **Micro-interactions**: Button hovers, scale effects, and animations

## 🛠️ Technology Stack

- **React 18.2** - UI library
- **Vite 5.1** - Build tool and dev server
- **React Router 6.22** - Navigation and routing
- **TailwindCSS 3.4** - Utility-first CSS framework
- **Framer Motion 11** - Animation library
- **Axios 1.6** - HTTP client for API calls
- **Recharts 2.12** - Chart library for data visualization
- **React-Leaflet 4.2** - Map integration
- **Leaflet 1.9** - Interactive maps
- **React-Webcam 7.2** - Camera capture
- **Lucide React** - Modern icon library

## 📁 Project Structure

```
employee-dashboard/
├── public/
├── src/
│   ├── components/
│   │   ├── ui/
│   │   │   ├── button.jsx
│   │   │   ├── card.jsx
│   │   │   ├── input.jsx
│   │   │   ├── loading.jsx
│   │   │   └── theme-toggle.jsx
│   │   └── ProtectedRoute.jsx
│   ├── contexts/
│   │   ├── AuthContext.jsx
│   │   └── ThemeContext.jsx
│   ├── lib/
│   │   └── utils.js
│   ├── pages/
│   │   ├── LoginPage.jsx
│   │   ├── ListPage.jsx
│   │   ├── DetailsPage.jsx
│   │   ├── CapturePhotoPage.jsx
│   │   └── PhotoResultPage.jsx
│   ├── services/
│   │   └── api.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .env
├── .gitignore
├── index.html
├── package.json
├── postcss.config.cjs
├── tailwind.config.js
├── vite.config.js
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ and npm installed on your machine
- Modern web browser with webcam support (for photo capture feature)

### Installation

1. **Clone or download the project**

2. **Navigate to the project directory**
   ```bash
   cd "c:\Users\Lenovo\Desktop\new p"
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Environment Setup**
   
   The `.env` file is already configured with:
   ```env
   VITE_API_BASE_URL=https://backend.jotish.in/backend_dev
   VITE_API_USERNAME=test
   VITE_API_PASSWORD=123456
   VITE_LOGIN_USERNAME=testuser
   VITE_LOGIN_PASSWORD=Test123
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   
   Navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The optimized production build will be created in the `dist` folder.

### Preview Production Build

```bash
npm run preview
```

## 🎯 Usage Guide

### Login
1. Navigate to the login page
2. Enter credentials:
   - **Username**: `testuser`
   - **Password**: `Test123`
3. Click "Sign In"

### Dashboard
1. **Table View**: Browse, search, and sort employee data
2. **Chart View**: Visualize salary distribution
3. **Map View**: See employee locations on an interactive map
4. Click on any employee row to view details

### Employee Details
1. View comprehensive employee information
2. Click "Capture Photo" to take a photo
3. Capture or retake photos as needed
4. Download or share the captured photo

### Theme Toggle
- Click the sun/moon icon in the top-right to switch themes
- Theme preference is saved automatically

## 🌟 Key Features Explained

### API Integration
- Fetches employee data from the provided REST API
- Implements caching to reduce API calls
- Falls back to dummy data if API is unavailable
- Error handling and loading states

### Data Visualization
- **Recharts**: Interactive bar charts with tooltips
- **React-Leaflet**: Interactive maps with markers and popups
- Smooth transitions between visualization modes

### State Management
- **AuthContext**: Manages authentication state
- **ThemeContext**: Manages dark/light theme
- **Local Storage**: Persists user preferences and data

### Responsive Design
- Mobile-first approach
- Breakpoints for tablets and desktops
- Touch-friendly interactions
- Adaptive layouts

### Performance
- Lazy loading of components
- Optimized re-renders
- Data caching
- Efficient animations

## 🎨 Customization

### Colors
Edit `tailwind.config.js` to customize the color scheme:
```javascript
colors: {
  primary: "hsl(var(--primary))",
  // ... more colors
}
```

### Animations
Modify animation durations in `tailwind.config.js`:
```javascript
animation: {
  'gradient': 'gradient 8s linear infinite',
  // ... more animations
}
```

### API Endpoints
Update `.env` file to change API configurations:
```env
VITE_API_BASE_URL=your-api-url
```

## 🔒 Security Notes

- Credentials are validated against environment variables
- Session data is stored securely in localStorage
- Protected routes prevent unauthorized access
- API credentials are environment-based

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Opera (latest)

**Note**: Camera functionality requires HTTPS in production or localhost in development.

## 🐛 Troubleshooting

### Camera Not Working
- Ensure you're using HTTPS or localhost
- Grant camera permissions in browser
- Check if webcam is connected and not in use

### API Errors
- Check network connection
- Verify API endpoint in `.env`
- App will use dummy data as fallback

### Build Errors
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Clear cache: `npm cache clean --force`

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🙏 Acknowledgments

- React team for the amazing framework
- Tailwind CSS for the utility-first approach
- Framer Motion for smooth animations
- ShadCN for UI component inspiration
- OpenStreetMap for map tiles

## 👨‍💻 Developer

Built with ❤️ using React and modern web technologies.

---

**🎯 Ready to impress in interviews and portfolios!**

This application demonstrates:
- ✅ Modern React patterns and best practices
- ✅ Advanced UI/UX design with animations
- ✅ API integration and state management
- ✅ Responsive and accessible design
- ✅ Production-ready code quality
- ✅ Clean architecture and code organization

**Start the app and enjoy the experience! 🚀**
