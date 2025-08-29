import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { Toaster } from './components/ui/toaster';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './components/Home';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-background text-foreground">
            <Header />
            <main>
              <Routes>
                <Route path="/" element={<Home />} />
                {/* More routes will be added */}
              </Routes>
            </main>
            <Footer />
            <Toaster />
          </div>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;