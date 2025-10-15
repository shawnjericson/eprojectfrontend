import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import MaintenanceDetector from './components/Maintenance/MaintenanceDetector';
import MaintenancePage from './components/Maintenance/MaintenancePage';
import ScrollToTop from './components/ScrollToTop';
import LoadingOverlay from './components/Loading/LoadingOverlay';
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import Home from './pages/Home';
import Monuments from './pages/Monuments';
import MonumentDetail from './pages/MonumentDetail';
import Blog from './pages/Blog';
import BlogDetail from './pages/BlogDetail';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';
import Feedback from './pages/Feedback';

function App() {
  return (
    <LanguageProvider>
      <MaintenanceDetector
        maintenanceUrl="/maintenance"
        checkInterval={30000} // Check every 30 seconds
        retryCount={3}
        autoRedirect={true}
        showNotification={true}
      >
        <Router>
          <ScrollToTop />
          <LoadingOverlay />
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/monuments" element={<Monuments />} />
                <Route path="/monuments/:id" element={<MonumentDetail />} />
                <Route path="/monuments/:id-:slug" element={<MonumentDetail />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:id" element={<BlogDetail />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/feedback" element={<Feedback />} />
                <Route path="/maintenance" element={<MaintenancePage />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </MaintenanceDetector>
    </LanguageProvider>
  );
}

export default App;
