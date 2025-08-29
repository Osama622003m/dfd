import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, BookOpen, Eye, Star, Calendar, Trash2 } from 'lucide-react';
import { mockMangas } from '../../data/mockData';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { useToast } from '../../hooks/use-toast';

const Favorites = () => {
  const { user, toggleFavorite } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [favoriteMangas, setFavoriteMangas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login', { 
        state: { from: { pathname: '/favorites' } }
      });
      return;
    }

    // Mock data loading
    setTimeout(() => {
      const favorites = mockMangas.filter(manga => 
        user.favorites?.includes(manga.id)
      );
      setFavoriteMangas(favorites);
      setIsLoading(false);
    }, 1000);
  }, [user, navigate]);

  const handleRemoveFromFavorites = (mangaId, mangaTitle, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    toggleFavorite(mangaId);
    setFavoriteMangas(prev => prev.filter(manga => manga.id !== mangaId));
    
    toast({
      title: "تم الحذف من المفضلة",
      description: `تم حذف "${mangaTitle}" من قائمة المفضلة`,
    });
  };

  const clearAllFavorites = () => {
    favoriteMangas.forEach(manga => {
      toggleFavorite(manga.id);
    });
    setFavoriteMangas([]);
    
    toast({
      title: "تم مسح جميع المفضلات",
      description: "تم حذف جميع المانجا من قائمة المفضلة",
    });
  };

  if (!user) {
    return null; // Will redirect in useEffect
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-48 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <Heart className="w-8 h-8 text-red-500 fill-current" />
          <div>
            <h1 className="text-3xl font-bold">مفضلاتي</h1>
            <p className="text-muted-foreground">
              {favoriteMangas.length} مانجا في قائمة المفضلة
            </p>
          </div>
        </div>

        {favoriteMangas.length > 0 && (
          <Button 
            variant="destructive" 
            onClick={clearAllFavorites}
            size="sm"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            مسح الكل
          </Button>
        )}
      </div>

      {/* Content */}
      {favoriteMangas.length === 0 ? (
        <div className="text-center py-16">
          <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">لا توجد مفضلات حتى الآن</h3>
          <p className="text-muted-foreground mb-6">
            ابدأ بإضافة المانجا التي تحبها لتظهر هنا
          </p>
          <Button asChild>
            <Link to="/library">
              <BookOpen className="w-4 h-4 mr-2" />
              استكشف المكتبة
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favoriteMangas.map((manga) => (
            <Card 
              key={manga.id} 
              className="group overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
            >
              <Link to={`/manga/${manga.id}`} className="block">
                <div className="relative aspect-[3/4] overflow-hidden">
                  <img 
                    src={manga.coverImage} 
                    alt={manga.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  
                  {/* Favorite Badge */}
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-red-500 hover:bg-red-600">
                      <Heart className="w-3 h-3 fill-current" />
                    </Badge>
                  </div>
                  
                  {/* Remove Button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 left-2 w-8 h-8 p-0 bg-black/50 hover:bg-red-500/80 text-white opacity-0 group-hover:opacity-100 transition-all duration-300"
                    onClick={(e) => handleRemoveFromFavorites(manga.id, manga.title, e)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Quick Stats */}
                  <div className="absolute bottom-0 left-0 right-0 p-3 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-1 rtl:space-x-reverse">
                        <Star className="w-3 h-3 text-yellow-400 fill-current" />
                        <span>{manga.rating}</span>
                      </div>
                      <div className="flex items-center space-x-1 rtl:space-x-reverse">
                        <BookOpen className="w-3 h-3" />
                        <span>{manga.totalChapters}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
              
              <CardContent className="p-4">
                <Link to={`/manga/${manga.id}`}>
                  <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                    {manga.title}
                  </h3>
                </Link>
                
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                  {manga.description}
                </p>
                
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span>{manga.rating}</span>
                    <span>•</span>
                    <Eye className="w-4 h-4" />
                    <span>{(manga.views / 1000).toFixed(0)}k</span>
                  </div>
                  
                  <Badge variant="secondary">
                    {manga.status}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {manga.genres?.slice(0, 2).map((genre) => (
                      <Badge key={genre} variant="outline" className="text-xs">
                        {genre}
                      </Badge>
                    ))}
                    {manga.genres?.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{manga.genres.length - 2}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-1 rtl:space-x-reverse text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    <span>{manga.lastUpdated}</span>
                  </div>
                </div>
                
                <div className="flex gap-2 mt-4">
                  <Button asChild size="sm" className="flex-1">
                    <Link to={`/manga/${manga.id}`}>
                      <BookOpen className="w-4 h-4 mr-2" />
                      قراءة
                    </Link>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={(e) => handleRemoveFromFavorites(manga.id, manga.title, e)}
                  >
                    <Heart className="w-4 h-4 fill-current text-red-500" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;