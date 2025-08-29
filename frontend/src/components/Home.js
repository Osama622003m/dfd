import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, 
  Star, 
  Eye, 
  Clock, 
  ChevronRight,
  Play,
  Heart
} from 'lucide-react';
import { mockMangas } from '../data/mockData';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';

const Home = () => {
  const { user, toggleFavorite } = useAuth();
  const [featuredManga, setFeaturedManga] = useState(null);
  const [trendingMangas, setTrendingMangas] = useState([]);
  const [latestUpdates, setLatestUpdates] = useState([]);

  useEffect(() => {
    // Mock data loading
    setFeaturedManga(mockMangas[0]);
    setTrendingMangas(mockMangas.slice(0, 6));
    setLatestUpdates(mockMangas.slice(0, 8));
  }, []);

  const handleFavoriteToggle = (mangaId, e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(mangaId);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      {featuredManga && (
        <section className="relative h-[60vh] overflow-hidden rounded-xl mx-4 mt-6">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${featuredManga.coverImage})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/30" />
          </div>
          
          <div className="relative h-full flex items-center">
            <div className="container mx-auto px-4">
              <div className="max-w-2xl text-white">
                <Badge className="mb-4 bg-orange-600 hover:bg-orange-700">
                  مميز اليوم
                </Badge>
                
                <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
                  {featuredManga.title}
                </h1>
                
                <p className="text-lg md:text-xl mb-6 text-gray-200 leading-relaxed">
                  {featuredManga.description}
                </p>
                
                <div className="flex flex-wrap items-center gap-4 mb-8">
                  <div className="flex items-center space-x-1 rtl:space-x-reverse">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="font-semibold">{featuredManga.rating}</span>
                  </div>
                  
                  <div className="flex items-center space-x-1 rtl:space-x-reverse">
                    <Eye className="w-5 h-5" />
                    <span>{featuredManga.views?.toLocaleString()} مشاهدة</span>
                  </div>
                  
                  <div className="flex items-center space-x-1 rtl:space-x-reverse">
                    <Clock className="w-5 h-5" />
                    <span>{featuredManga.totalChapters} فصل</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
                    asChild
                  >
                    <Link to={`/manga/${featuredManga.id}`}>
                      <Play className="w-5 h-5 mr-2" />
                      ابدأ القراءة
                    </Link>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="border-white/30 text-white hover:bg-white/10"
                    onClick={(e) => handleFavoriteToggle(featuredManga.id, e)}
                  >
                    <Heart className={`w-5 h-5 mr-2 ${
                      user?.favorites?.includes(featuredManga.id) ? 'fill-current text-red-500' : ''
                    }`} />
                    أضف للمفضلة
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Trending Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <TrendingUp className="w-6 h-6 text-orange-600" />
            <h2 className="text-2xl md:text-3xl font-bold">الأكثر شعبية</h2>
          </div>
          
          <Button variant="ghost" asChild>
            <Link to="/trending" className="flex items-center space-x-1 rtl:space-x-reverse">
              <span>عرض الكل</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {trendingMangas.map((manga, index) => (
            <Link 
              key={manga.id} 
              to={`/manga/${manga.id}`}
              className="group relative overflow-hidden rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              <Card className="border-0 bg-transparent">
                <div className="relative aspect-[3/4] overflow-hidden rounded-lg">
                  <img 
                    src={manga.coverImage} 
                    alt={manga.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  
                  {/* Ranking Badge */}
                  <div className="absolute top-2 left-2">
                    <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold">
                      #{index + 1}
                    </Badge>
                  </div>
                  
                  {/* Favorite Button */}
                  <Button
                    size="sm"
                    variant="ghost"
                    className="absolute top-2 right-2 w-8 h-8 p-0 bg-black/50 hover:bg-black/70 text-white"
                    onClick={(e) => handleFavoriteToggle(manga.id, e)}
                  >
                    <Heart className={`w-4 h-4 ${
                      user?.favorites?.includes(manga.id) ? 'fill-current text-red-500' : ''
                    }`} />
                  </Button>
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Quick Info */}
                  <div className="absolute bottom-0 left-0 right-0 p-3 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-1 rtl:space-x-reverse">
                        <Star className="w-3 h-3 text-yellow-400 fill-current" />
                        <span>{manga.rating}</span>
                      </div>
                      <div className="flex items-center space-x-1 rtl:space-x-reverse">
                        <Clock className="w-3 h-3" />
                        <span>{manga.totalChapters}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <CardContent className="p-3">
                  <h3 className="font-semibold text-sm md:text-base line-clamp-2 group-hover:text-primary transition-colors">
                    {manga.title}
                  </h3>
                  
                  <div className="flex flex-wrap gap-1 mt-2">
                    {manga.genres?.slice(0, 2).map((genre) => (
                      <Badge key={genre} variant="secondary" className="text-xs">
                        {genre}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Latest Updates */}
      <section className="container mx-auto px-4 pb-12">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <Clock className="w-6 h-6 text-green-600" />
            <h2 className="text-2xl md:text-3xl font-bold">آخر التحديثات</h2>
          </div>
          
          <Button variant="ghost" asChild>
            <Link to="/latest" className="flex items-center space-x-1 rtl:space-x-reverse">
              <span>عرض الكل</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {latestUpdates.map((manga) => (
            <Link 
              key={manga.id} 
              to={`/manga/${manga.id}`}
              className="group"
            >
              <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img 
                    src={manga.coverImage} 
                    alt={manga.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  
                  <Button
                    size="sm"
                    variant="ghost"
                    className="absolute top-2 right-2 w-8 h-8 p-0 bg-black/50 hover:bg-black/70 text-white"
                    onClick={(e) => handleFavoriteToggle(manga.id, e)}
                  >
                    <Heart className={`w-4 h-4 ${
                      user?.favorites?.includes(manga.id) ? 'fill-current text-red-500' : ''
                    }`} />
                  </Button>
                </div>
                
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                    {manga.title}
                  </h3>
                  
                  <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                    {manga.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 rtl:space-x-reverse text-sm text-muted-foreground">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span>{manga.rating}</span>
                      <span>•</span>
                      <span>{manga.totalChapters} فصل</span>
                    </div>
                    
                    <Badge variant="secondary">
                      {manga.status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;