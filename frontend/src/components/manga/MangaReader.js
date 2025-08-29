import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ChevronLeft, 
  ChevronRight, 
  Home, 
  List, 
  Settings,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize,
  Minimize,
  BookOpen
} from 'lucide-react';
import { mockMangas } from '../../data/mockData';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Slider } from '../ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '../ui/dropdown-menu';

const MangaReader = () => {
  const { mangaId, chapterId } = useParams();
  const navigate = useNavigate();
  const { user, updateReadingProgress } = useAuth();
  
  const [manga, setManga] = useState(null);
  const [chapter, setChapter] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [readingMode, setReadingMode] = useState('single'); // single, double, scroll
  const [zoom, setZoom] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mock data loading
    const foundManga = mockMangas.find(m => m.id === mangaId);
    if (foundManga) {
      setManga(foundManga);
      const foundChapter = foundManga.chapters?.find(c => c.id === chapterId);
      if (foundChapter) {
        setChapter(foundChapter);
        // Update reading progress
        if (user) {
          updateReadingProgress(mangaId, chapterId, 0);
        }
      }
    }
    setIsLoading(false);
  }, [mangaId, chapterId, user, updateReadingProgress]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        e.preventDefault();
        if (e.key === 'ArrowRight') {
          nextPage();
        } else {
          previousPage();
        }
      } else if (e.key === 'Escape') {
        setIsFullscreen(false);
      } else if (e.key === 'f' || e.key === 'F') {
        toggleFullscreen();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentPage, chapter]);

  // Auto-hide controls
  useEffect(() => {
    let timer;
    if (isFullscreen && showControls) {
      timer = setTimeout(() => setShowControls(false), 3000);
    }
    return () => clearTimeout(timer);
  }, [isFullscreen, showControls]);

  const nextPage = useCallback(() => {
    if (chapter && currentPage < chapter.pages - 1) {
      const newPage = currentPage + 1;
      setCurrentPage(newPage);
      
      // Update progress
      if (user) {
        const progress = Math.round((newPage / chapter.pages) * 100);
        updateReadingProgress(mangaId, chapterId, progress);
      }
    } else {
      // Go to next chapter
      const currentChapterIndex = manga?.chapters?.findIndex(c => c.id === chapterId);
      if (currentChapterIndex !== -1 && currentChapterIndex < manga.chapters.length - 1) {
        const nextChapter = manga.chapters[currentChapterIndex + 1];
        navigate(`/read/${mangaId}/${nextChapter.id}`);
      }
    }
  }, [currentPage, chapter, user, mangaId, chapterId, manga, navigate, updateReadingProgress]);

  const previousPage = useCallback(() => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    } else {
      // Go to previous chapter
      const currentChapterIndex = manga?.chapters?.findIndex(c => c.id === chapterId);
      if (currentChapterIndex > 0) {
        const prevChapter = manga.chapters[currentChapterIndex - 1];
        navigate(`/read/${mangaId}/${prevChapter.id}`);
      }
    }
  }, [currentPage, manga, mangaId, chapterId, navigate]);

  const goToPage = (page) => {
    if (page >= 0 && page < chapter?.pages) {
      setCurrentPage(page);
      if (user) {
        const progress = Math.round((page / chapter.pages) * 100);
        updateReadingProgress(mangaId, chapterId, progress);
      }
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleMouseMove = () => {
    if (isFullscreen) {
      setShowControls(true);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">جاري التحميل...</div>
      </div>
    );
  }

  if (!manga || !chapter) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-2xl font-bold mb-4">الفصل غير موجود</h1>
          <Button asChild>
            <Link to="/">العودة للرئيسية</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`min-h-screen bg-black text-white ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}
      onMouseMove={handleMouseMove}
    >
      {/* Top Controls */}
      <div className={`fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm border-b border-white/10 transition-transform duration-300 ${
        isFullscreen && !showControls ? '-translate-y-full' : 'translate-y-0'
      }`}>
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Left Section */}
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/">
                  <Home className="w-4 h-4" />
                </Link>
              </Button>
              
              <Button variant="ghost" size="sm" asChild>
                <Link to={`/manga/${mangaId}`}>
                  <BookOpen className="w-4 h-4" />
                </Link>
              </Button>
              
              <div className="text-sm">
                <h1 className="font-semibold">{manga.title}</h1>
                <p className="text-gray-400">الفصل {chapter.number}: {chapter.title}</p>
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              {/* Chapter Navigation */}
              <Select 
                value={chapterId} 
                onValueChange={(value) => navigate(`/read/${mangaId}/${value}`)}
              >
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {manga.chapters.map((ch) => (
                    <SelectItem key={ch.id} value={ch.id}>
                      الفصل {ch.number}: {ch.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Settings */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Settings className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setReadingMode('single')}>
                    صفحة واحدة
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setReadingMode('double')}>
                    صفحتان
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setReadingMode('scroll')}>
                    التمرير المستمر
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={toggleFullscreen}>
                    {isFullscreen ? (
                      <>
                        <Minimize className="w-4 h-4 mr-2" />
                        خروج من ملء الشاشة
                      </>
                    ) : (
                      <>
                        <Maximize className="w-4 h-4 mr-2" />
                        ملء الشاشة
                      </>
                    )}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={`${isFullscreen ? 'pt-0' : 'pt-16'} pb-20`}>
        <div className="container mx-auto px-4 py-4">
          {readingMode === 'scroll' ? (
            // Scroll Mode
            <div className="space-y-2">
              {Array.from({ length: chapter.pages }, (_, i) => (
                <img
                  key={i}
                  src={chapter.images[i]}
                  alt={`صفحة ${i + 1}`}
                  className="w-full max-w-4xl mx-auto block"
                  style={{ zoom: `${zoom}%` }}
                  onLoad={() => {
                    // Update progress based on scroll position
                    const observer = new IntersectionObserver((entries) => {
                      entries.forEach((entry) => {
                        if (entry.isIntersecting && user) {
                          const progress = Math.round((i / chapter.pages) * 100);
                          updateReadingProgress(mangaId, chapterId, progress);
                        }
                      });
                    });
                    observer.observe(document.querySelector(`[data-page="${i}"]`));
                  }}
                  data-page={i}
                />
              ))}
            </div>
          ) : (
            // Page Mode
            <div className="flex items-center justify-center min-h-screen">
              <div className="relative">
                {readingMode === 'double' && currentPage < chapter.pages - 1 ? (
                  <div className="flex space-x-2">
                    <img
                      src={chapter.images[currentPage]}
                      alt={`صفحة ${currentPage + 1}`}
                      className="max-h-[80vh] w-auto"
                      style={{ zoom: `${zoom}%` }}
                    />
                    <img
                      src={chapter.images[currentPage + 1]}
                      alt={`صفحة ${currentPage + 2}`}
                      className="max-h-[80vh] w-auto"
                      style={{ zoom: `${zoom}%` }}
                    />
                  </div>
                ) : (
                  <img
                    src={chapter.images[currentPage]}
                    alt={`صفحة ${currentPage + 1}`}
                    className="max-h-[80vh] w-auto mx-auto"
                    style={{ zoom: `${zoom}%` }}
                  />
                )}

                {/* Navigation Arrows */}
                <Button
                  variant="ghost"
                  size="lg"
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70"
                  onClick={previousPage}
                  disabled={currentPage === 0}
                >
                  <ChevronLeft className="w-8 h-8" />
                </Button>

                <Button
                  variant="ghost"
                  size="lg"
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70"
                  onClick={nextPage}
                  disabled={currentPage >= chapter.pages - 1}
                >
                  <ChevronRight className="w-8 h-8" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Controls */}
      <div className={`fixed bottom-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm border-t border-white/10 transition-transform duration-300 ${
        isFullscreen && !showControls ? 'translate-y-full' : 'translate-y-0'
      }`}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            {/* Page Info */}
            <div className="text-sm">
              صفحة {currentPage + 1} من {chapter.pages}
            </div>

            {/* Zoom Controls */}
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setZoom(Math.max(50, zoom - 25))}
                disabled={zoom <= 50}
              >
                <ZoomOut className="w-4 h-4" />
              </Button>
              
              <span className="text-sm min-w-[50px] text-center">{zoom}%</span>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setZoom(Math.min(200, zoom + 25))}
                disabled={zoom >= 200}
              >
                <ZoomIn className="w-4 h-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setZoom(100)}
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Progress Slider */}
          {readingMode !== 'scroll' && (
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <Button
                variant="ghost"
                size="sm"
                onClick={previousPage}
                disabled={currentPage === 0}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
              
              <Slider
                value={[currentPage]}
                onValueChange={(value) => goToPage(value[0])}
                max={chapter.pages - 1}
                step={1}
                className="flex-1"
              />
              
              <Button
                variant="ghost"
                size="sm"
                onClick={nextPage}
                disabled={currentPage >= chapter.pages - 1}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MangaReader;