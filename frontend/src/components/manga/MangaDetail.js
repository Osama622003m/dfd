import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Star, 
  Heart, 
  Eye, 
  Clock, 
  User, 
  Calendar,
  BookOpen,
  Play,
  Share2,
  MessageCircle,
  ChevronRight
} from 'lucide-react';
import { mockMangas, mockComments } from '../../data/mockData';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { Textarea } from '../ui/textarea';
import { useToast } from '../../hooks/use-toast';

const MangaDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, toggleFavorite, rateManga } = useAuth();
  const { toast } = useToast();
  const [manga, setManga] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [userRating, setUserRating] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mock data loading
    const foundManga = mockMangas.find(m => m.id === id);
    if (foundManga) {
      setManga(foundManga);
      setComments(mockComments.filter(c => c.mangaId === id));
      
      // Get user rating if exists
      const existingRating = user?.ratings?.find(r => r.mangaId === id);
      if (existingRating) {
        setUserRating(existingRating.rating);
      }
    }
    setIsLoading(false);
  }, [id, user]);

  const handleFavoriteToggle = () => {
    if (!user) {
      toast({
        title: "تحتاج لتسجيل الدخول",
        description: "يرجى تسجيل الدخول أولاً لإضافة المانجا للمفضلة",
        variant: "destructive"
      });
      return;
    }
    toggleFavorite(id);
    toast({
      title: user?.favorites?.includes(id) ? "تم الحذف من المفضلة" : "تم الإضافة للمفضلة",
      description: `تم ${user?.favorites?.includes(id) ? 'حذف' : 'إضافة'} المانجا ${user?.favorites?.includes(id) ? 'من' : 'إلى'} قائمة المفضلة`,
    });
  };

  const handleRating = (rating) => {
    if (!user) {
      toast({
        title: "تحتاج لتسجيل الدخول",
        description: "يرجى تسجيل الدخول أولاً لتقييم المانجا",
        variant: "destructive"
      });
      return;
    }
    setUserRating(rating);
    rateManga(id, rating);
    toast({
      title: "تم التقييم",
      description: `تم تقييم المانجا بـ ${rating} نجوم`,
    });
  };

  const handleCommentSubmit = () => {
    if (!user) {
      toast({
        title: "تحتاج لتسجيل الدخول",
        description: "يرجى تسجيل الدخول أولاً للتعليق",
        variant: "destructive"
      });
      return;
    }
    
    if (!newComment.trim()) return;

    const comment = {
      id: `comment_${Date.now()}`,
      mangaId: id,
      userId: user.id,
      username: user.username,
      content: newComment,
      timestamp: new Date().toISOString(),
      likes: 0,
      replies: []
    };

    setComments([comment, ...comments]);
    setNewComment('');
    toast({
      title: "تم إضافة التعليق",
      description: "تم إضافة تعليقك بنجاح",
    });
  };

  const handleStartReading = () => {
    if (!manga?.chapters?.length) {
      toast({
        title: "لا توجد فصول متاحة",
        description: "هذه المانجا لا تحتوي على فصول للقراءة حالياً",
        variant: "destructive"
      });
      return;
    }
    navigate(`/read/${id}/${manga.chapters[0].id}`);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/4 mb-6"></div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="h-96 bg-muted rounded"></div>
            <div className="md:col-span-2 space-y-4">
              <div className="h-8 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-full"></div>
              <div className="h-4 bg-muted rounded w-full"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!manga) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">المانجا غير موجودة</h1>
        <p className="text-muted-foreground mb-8">عذراً، لم نتمكن من العثور على المانجا المطلوبة</p>
        <Button asChild>
          <Link to="/">العودة للرئيسية</Link>
        </Button>
      </div>
    );
  }

  const isFavorite = user?.favorites?.includes(id);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 rtl:space-x-reverse text-sm text-muted-foreground mb-6">
        <Link to="/" className="hover:text-foreground">الرئيسية</Link>
        <ChevronRight className="w-4 h-4" />
        <Link to="/library" className="hover:text-foreground">المكتبة</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-foreground">{manga.title}</span>
      </nav>

      {/* Main Content */}
      <div className="grid md:grid-cols-3 gap-8 mb-12">
        {/* Cover Image */}
        <div className="space-y-4">
          <div className="relative aspect-[3/4] overflow-hidden rounded-lg shadow-lg">
            <img 
              src={manga.coverImage} 
              alt={manga.title}
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Action Buttons */}
          <div className="space-y-3">
            <Button 
              size="lg" 
              className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
              onClick={handleStartReading}
            >
              <Play className="w-5 h-5 mr-2" />
              ابدأ القراءة
            </Button>
            
            <div className="grid grid-cols-2 gap-2">
              <Button 
                variant="outline" 
                onClick={handleFavoriteToggle}
                className={isFavorite ? "border-red-500 text-red-500" : ""}
              >
                <Heart className={`w-4 h-4 mr-2 ${isFavorite ? 'fill-current' : ''}`} />
                {isFavorite ? 'مفضلة' : 'أضف للمفضلة'}
              </Button>
              
              <Button variant="outline">
                <Share2 className="w-4 h-4 mr-2" />
                شارك
              </Button>
            </div>
          </div>

          {/* Rating */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">قيم هذه المانجا</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center space-x-1 rtl:space-x-reverse">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => handleRating(star)}
                    className="p-1 hover:scale-110 transition-transform"
                  >
                    <Star 
                      className={`w-6 h-6 ${
                        star <= userRating 
                          ? 'text-yellow-400 fill-current' 
                          : 'text-muted-foreground'
                      }`} 
                    />
                  </button>
                ))}
              </div>
              {userRating > 0 && (
                <p className="text-center text-sm text-muted-foreground mt-2">
                  تقييمك: {userRating} نجوم
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Details */}
        <div className="md:col-span-2 space-y-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{manga.title}</h1>
            {manga.englishTitle && (
              <h2 className="text-xl text-muted-foreground mb-4">{manga.englishTitle}</h2>
            )}
            
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <div className="flex items-center space-x-1 rtl:space-x-reverse">
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <span className="font-semibold">{manga.rating}</span>
                <span className="text-muted-foreground text-sm">(1,234 تقييم)</span>
              </div>
              
              <div className="flex items-center space-x-1 rtl:space-x-reverse text-muted-foreground">
                <Eye className="w-5 h-5" />
                <span>{manga.views?.toLocaleString()} مشاهدة</span>
              </div>
              
              <div className="flex items-center space-x-1 rtl:space-x-reverse text-muted-foreground">
                <BookOpen className="w-5 h-5" />
                <span>{manga.totalChapters} فصل</span>
              </div>
              
              <Badge variant={manga.status === 'مستمر' ? 'default' : 'secondary'}>
                {manga.status}
              </Badge>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">القصة</h3>
            <p className="text-muted-foreground leading-relaxed">{manga.description}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3">معلومات أساسية</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">المؤلف:</span>
                  <span>{manga.author}</span>
                </div>
                
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">آخر تحديث:</span>
                  <span>{manga.lastUpdated}</span>
                </div>
                
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">الحالة:</span>
                  <span>{manga.status}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">التصنيفات</h3>
              <div className="flex flex-wrap gap-2">
                {manga.genres?.map((genre) => (
                  <Badge key={genre} variant="secondary">
                    {genre}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chapters List */}
      {manga.chapters && manga.chapters.length > 0 && (
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
              <BookOpen className="w-5 h-5" />
              <span>الفصول ({manga.chapters.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {manga.chapters.map((chapter) => (
                <Link
                  key={chapter.id}
                  to={`/read/${id}/${chapter.id}`}
                  className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent transition-colors"
                >
                  <div className="flex items-center space-x-3 rtl:space-x-reverse">
                    <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                      {chapter.number}
                    </div>
                    <div>
                      <h4 className="font-medium">الفصل {chapter.number}: {chapter.title}</h4>
                      <p className="text-sm text-muted-foreground">{chapter.pages} صفحة • {chapter.releaseDate}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Comments Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
            <MessageCircle className="w-5 h-5" />
            <span>التعليقات ({comments.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Add Comment */}
          {user && (
            <div className="space-y-3">
              <Textarea
                placeholder="اكتب تعليقك هنا..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={3}
              />
              <Button onClick={handleCommentSubmit} disabled={!newComment.trim()}>
                إضافة تعليق
              </Button>
            </div>
          )}

          <Separator />

          {/* Comments List */}
          <div className="space-y-6">
            {comments.map((comment) => (
              <div key={comment.id} className="space-y-3">
                <div className="flex items-start space-x-3 rtl:space-x-reverse">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={`https://picsum.photos/100/100?random=${comment.userId}`} />
                    <AvatarFallback>{comment.username.charAt(0)}</AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <span className="font-semibold">{comment.username}</span>
                      <span className="text-sm text-muted-foreground">
                        {new Date(comment.timestamp).toLocaleDateString('ar')}
                      </span>
                    </div>
                    
                    <p className="text-muted-foreground">{comment.content}</p>
                    
                    <div className="flex items-center space-x-4 rtl:space-x-reverse">
                      <Button variant="ghost" size="sm">
                        <Heart className="w-4 h-4 mr-1" />
                        {comment.likes}
                      </Button>
                      <Button variant="ghost" size="sm">
                        رد
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Replies */}
                {comment.replies?.length > 0 && (
                  <div className="mr-12 space-y-4">
                    {comment.replies.map((reply) => (
                      <div key={reply.id} className="flex items-start space-x-3 rtl:space-x-reverse">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback>{reply.username.charAt(0)}</AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center space-x-2 rtl:space-x-reverse">
                            <span className="font-semibold text-sm">{reply.username}</span>
                            <span className="text-xs text-muted-foreground">
                              {new Date(reply.timestamp).toLocaleDateString('ar')}
                            </span>
                          </div>
                          
                          <p className="text-sm text-muted-foreground">{reply.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {!user && (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">يرجى تسجيل الدخول للمشاركة في التعليقات</p>
              <Button asChild>
                <Link to="/login">تسجيل الدخول</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MangaDetail;