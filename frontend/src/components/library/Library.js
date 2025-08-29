import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  Star, 
  Eye, 
  Calendar,
  BookOpen,
  TrendingUp,
  Clock
} from 'lucide-react';
import { mockMangas, mockGenres } from '../../data/mockData';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
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

const Library = () => {
  const [mangas, setMangas] = useState([]);
  const [filteredMangas, setFilteredMangas] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortBy, setSortBy] = useState('views');
  const [viewMode, setViewMode] = useState('grid');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mock data loading
    setTimeout(() => {
      setMangas(mockMangas);
      setFilteredMangas(mockMangas);
      setIsLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = [...mangas];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(manga =>
        manga.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        manga.englishTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        manga.author.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Genre filter
    if (selectedGenre !== 'all') {
      filtered = filtered.filter(manga =>
        manga.genres?.includes(selectedGenre)
      );
    }

    // Status filter
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(manga => manga.status === selectedStatus);
    }

    // Sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'rating':
          return b.rating - a.rating;
        case 'views':
          return (b.views || 0) - (a.views || 0);
        case 'chapters':
          return b.totalChapters - a.totalChapters;
        case 'updated':
          return new Date(b.lastUpdated) - new Date(a.lastUpdated);
        default:
          return 0;
      }
    });

    setFilteredMangas(filtered);
  }, [mangas, searchQuery, selectedGenre, selectedStatus, sortBy]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedGenre('all');
    setSelectedStatus('all');
    setSortBy('views');
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="flex gap-4">
            <div className="h-10 bg-muted rounded w-64"></div>
            <div className="h-10 bg-muted rounded w-32"></div>
            <div className="h-10 bg-muted rounded w-32"></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="h-72 bg-muted rounded"></div>
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
        <div>
          <h1 className="text-3xl font-bold mb-2">مكتبة المانجا</h1>
          <p className="text-muted-foreground">
            اكتشف واقرأ آلاف المانجا المترجمة للعربية
          </p>
        </div>

        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <Grid3X3 className="w-4 h-4" />
          </Button>
          
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="ابحث عن المانجا بالاسم أو المؤلف..."
                  value={searchQuery}
                  onChange={handleSearch}
                  className="pl-10 pr-4"
                />
              </div>
            </div>

            {/* Genre Filter */}
            <Select value={selectedGenre} onValueChange={setSelectedGenre}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="التصنيف" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع التصنيفات</SelectItem>
                {mockGenres.map((genre) => (
                  <SelectItem key={genre} value={genre}>
                    {genre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Status Filter */}
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="الحالة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الحالات</SelectItem>
                <SelectItem value="مستمر">مستمر</SelectItem>
                <SelectItem value="مكتمل">مكتمل</SelectItem>
                <SelectItem value="متوقف">متوقف</SelectItem>
              </SelectContent>
            </Select>

            {/* Sort */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-32">
                  <Filter className="w-4 h-4 mr-2" />
                  ترتيب
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setSortBy('views')}>
                  <Eye className="w-4 h-4 mr-2" />
                  الأكثر مشاهدة
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('rating')}>
                  <Star className="w-4 h-4 mr-2" />
                  الأعلى تقييماً
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('title')}>
                  <BookOpen className="w-4 h-4 mr-2" />
                  الاسم أبجدياً
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('updated')}>
                  <Clock className="w-4 h-4 mr-2" />
                  آخر تحديث
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('chapters')}>
                  <TrendingUp className="w-4 h-4 mr-2" />
                  عدد الفصول
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={clearFilters}>
                  مسح الفلاتر
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Active Filters */}
          {(searchQuery || selectedGenre !== 'all' || selectedStatus !== 'all') && (
            <div className="flex flex-wrap items-center gap-2 mt-4">
              <span className="text-sm text-muted-foreground">الفلاتر النشطة:</span>
              
              {searchQuery && (
                <Badge variant="secondary">
                  البحث: {searchQuery}
                  <button
                    onClick={() => setSearchQuery('')}
                    className="ml-1 hover:text-destructive"
                  >
                    ×
                  </button>
                </Badge>
              )}
              
              {selectedGenre !== 'all' && (
                <Badge variant="secondary">
                  التصنيف: {selectedGenre}
                  <button
                    onClick={() => setSelectedGenre('all')}
                    className="ml-1 hover:text-destructive"
                  >
                    ×
                  </button>
                </Badge>
              )}
              
              {selectedStatus !== 'all' && (
                <Badge variant="secondary">
                  الحالة: {selectedStatus}
                  <button
                    onClick={() => setSelectedStatus('all')}
                    className="ml-1 hover:text-destructive"
                  >
                    ×
                  </button>
                </Badge>
              )}
              
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                مسح الكل
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      <div className="mb-4">
        <p className="text-muted-foreground">
          تم العثور على {filteredMangas.length} مانجا
        </p>
      </div>

      {/* Manga Grid/List */}
      {filteredMangas.length === 0 ? (
        <div className="text-center py-16">
          <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">لم يتم العثور على نتائج</h3>
          <p className="text-muted-foreground mb-4">
            جرب تغيير معايير البحث أو الفلاتر
          </p>
          <Button onClick={clearFilters}>
            مسح جميع الفلاتر
          </Button>
        </div>
      ) : (
        <div className={
          viewMode === 'grid'
            ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-6'
            : 'space-y-4'
        }>
          {filteredMangas.map((manga) => (
            <Link 
              key={manga.id} 
              to={`/manga/${manga.id}`}
              className={`group ${viewMode === 'list' ? 'block' : ''}`}
            >
              {viewMode === 'grid' ? (
                <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <img 
                      src={manga.coverImage} 
                      alt={manga.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    <div className="absolute bottom-0 left-0 right-0 p-3 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-1 rtl:space-x-reverse">
                          <Star className="w-3 h-3 text-yellow-400 fill-current" />
                          <span>{manga.rating}</span>
                        </div>
                        <div className="flex items-center space-x-1 rtl:space-x-reverse">
                          <Eye className="w-3 h-3" />
                          <span>{(manga.views / 1000).toFixed(0)}k</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <CardContent className="p-3">
                    <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors mb-2">
                      {manga.title}
                    </h3>
                    
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{manga.totalChapters} فصل</span>
                      <Badge variant="secondary" className="text-xs">
                        {manga.status}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="overflow-hidden transition-all duration-300 hover:shadow-md">
                  <CardContent className="p-4">
                    <div className="flex space-x-4 rtl:space-x-reverse">
                      <div className="w-16 h-24 flex-shrink-0 overflow-hidden rounded-lg">
                        <img 
                          src={manga.coverImage} 
                          alt={manga.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                          {manga.title}
                        </h3>
                        
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                          {manga.description}
                        </p>
                        
                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-3">
                          <div className="flex items-center space-x-1 rtl:space-x-reverse">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span>{manga.rating}</span>
                          </div>
                          
                          <div className="flex items-center space-x-1 rtl:space-x-reverse">
                            <Eye className="w-4 h-4" />
                            <span>{manga.views?.toLocaleString()} مشاهدة</span>
                          </div>
                          
                          <div className="flex items-center space-x-1 rtl:space-x-reverse">
                            <BookOpen className="w-4 h-4" />
                            <span>{manga.totalChapters} فصل</span>
                          </div>
                          
                          <div className="flex items-center space-x-1 rtl:space-x-reverse">
                            <Calendar className="w-4 h-4" />
                            <span>{manga.lastUpdated}</span>
                          </div>
                          
                          <Badge variant="secondary">
                            {manga.status}
                          </Badge>
                        </div>
                        
                        <div className="flex flex-wrap gap-1">
                          {manga.genres?.slice(0, 3).map((genre) => (
                            <Badge key={genre} variant="outline" className="text-xs">
                              {genre}
                            </Badge>
                          ))}
                          {manga.genres?.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{manga.genres.length - 3}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Library;