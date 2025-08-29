import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { Toaster } from './components/ui/toaster';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

// Pages
import Home from './components/Home';
import Library from './components/library/Library';
import MangaDetail from './components/manga/MangaDetail';
import MangaReader from './components/manga/MangaReader';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Favorites from './components/user/Favorites';

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
                <Route path="/library" element={<Library />} />
                <Route path="/manga/:id" element={<MangaDetail />} />
                <Route path="/read/:mangaId/:chapterId" element={<MangaReader />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/favorites" element={<Favorites />} />
                
                {/* Additional routes that could be added */}
                <Route path="/genres" element={<Library />} />
                <Route path="/latest" element={<Library />} />
                <Route path="/trending" element={<Library />} />
                <Route path="/search" element={<Library />} />
                
                {/* 404 fallback */}
                <Route path="*" element={
                  <div className="container mx-auto px-4 py-16 text-center">
                    <h1 className="text-4xl font-bold mb-4">404</h1>
                    <p className="text-muted-foreground mb-8">الصفحة غير موجودة</p>
                    <a href="/" className="text-primary hover:underline">
                      العودة للرئيسية
                    </a>
                  </div>
                } />
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