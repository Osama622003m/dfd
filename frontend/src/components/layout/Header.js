import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  Moon, 
  Sun, 
  User, 
  Heart, 
  Bell, 
  Menu, 
  X,
  BookOpen,
  Home,
  Library
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '../ui/dropdown-menu';
import { Badge } from '../ui/badge';

const Header = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsMobileMenuOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 rtl:space-x-reverse">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white font-bold">
              م
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              مانجا بلس
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6 rtl:space-x-reverse">
            <Link 
              to="/" 
              className="flex items-center space-x-1 rtl:space-x-reverse text-sm font-medium hover:text-primary transition-colors"
            >
              <Home className="w-4 h-4" />
              <span>الرئيسية</span>
            </Link>
            <Link 
              to="/library" 
              className="flex items-center space-x-1 rtl:space-x-reverse text-sm font-medium hover:text-primary transition-colors"
            >
              <Library className="w-4 h-4" />
              <span>المكتبة</span>
            </Link>
            <Link 
              to="/genres" 
              className="flex items-center space-x-1 rtl:space-x-reverse text-sm font-medium hover:text-primary transition-colors"
            >
              <BookOpen className="w-4 h-4" />
              <span>التصنيفات</span>
            </Link>
          </nav>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-sm mx-6">
            <form onSubmit={handleSearch} className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                type="text"
                placeholder="ابحث عن المانجا..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4"
              />
            </form>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="w-9 h-9 p-0"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </Button>

            {user ? (
              <>
                {/* Notifications */}
                <Button variant="ghost" size="sm" className="relative w-9 h-9 p-0">
                  <Bell className="w-4 h-4" />
                  <Badge className="absolute -top-1 -right-1 w-5 h-5 rounded-full p-0 flex items-center justify-center text-xs">
                    3
                  </Badge>
                </Button>

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="flex items-center space-x-2 rtl:space-x-reverse">
                      <img 
                        src={user.avatar} 
                        alt={user.username}
                        className="w-6 h-6 rounded-full"
                      />
                      <span className="hidden sm:inline">{user.username}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem onClick={() => navigate('/profile')}>
                      <User className="w-4 h-4 mr-2" />
                      الملف الشخصي
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/favorites')}>
                      <Heart className="w-4 h-4 mr-2" />
                      المفضلة
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      تسجيل الخروج
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>
                  دخول
                </Button>
                <Button size="sm" onClick={() => navigate('/register')}>
                  تسجيل
                </Button>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden w-9 h-9 p-0"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="w-4 h-4" />
              ) : (
                <Menu className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border py-4">
            <div className="space-y-4">
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  type="text"
                  placeholder="ابحث عن المانجا..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4"
                />
              </form>

              {/* Mobile Navigation */}
              <nav className="flex flex-col space-y-2">
                <Link 
                  to="/" 
                  className="flex items-center space-x-2 rtl:space-x-reverse p-2 rounded-lg hover:bg-accent"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Home className="w-4 h-4" />
                  <span>الرئيسية</span>
                </Link>
                <Link 
                  to="/library" 
                  className="flex items-center space-x-2 rtl:space-x-reverse p-2 rounded-lg hover:bg-accent"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Library className="w-4 h-4" />
                  <span>المكتبة</span>
                </Link>
                <Link 
                  to="/genres" 
                  className="flex items-center space-x-2 rtl:space-x-reverse p-2 rounded-lg hover:bg-accent"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <BookOpen className="w-4 h-4" />
                  <span>التصنيفات</span>
                </Link>
              </nav>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;