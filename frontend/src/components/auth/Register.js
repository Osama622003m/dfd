import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, UserPlus } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import { Checkbox } from '../ui/checkbox';
import { useToast } from '../../hooks/use-toast';

const Register = () => {
  const navigate = useNavigate();
  const { register, user, isLoading } = useAuth();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.username) {
      newErrors.username = 'اسم المستخدم مطلوب';
    } else if (formData.username.length < 3) {
      newErrors.username = 'اسم المستخدم يجب أن يكون 3 أحرف على الأقل';
    } else if (!/^[a-zA-Z0-9_\u0600-\u06FF]+$/.test(formData.username)) {
      newErrors.username = 'اسم المستخدم يجب أن يحتوي على أحرف وأرقام فقط';
    }
    
    if (!formData.email) {
      newErrors.email = 'البريد الإلكتروني مطلوب';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'البريد الإلكتروني غير صحيح';
    }
    
    if (!formData.password) {
      newErrors.password = 'كلمة المرور مطلوبة';
    } else if (formData.password.length < 8) {
      newErrors.password = 'كلمة المرور يجب أن تكون 8 أحرف على الأقل';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'كلمة المرور يجب أن تحتوي على حرف كبير وحرف صغير ورقم';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'تأكيد كلمة المرور مطلوب';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'كلمة المرور غير متطابقة';
    }
    
    if (!acceptTerms) {
      newErrors.terms = 'يجب الموافقة على الشروط والأحكام';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setIsSubmitting(true);
    setErrors({});
    
    try {
      const result = await register(formData.username, formData.email, formData.password);
      
      if (result.success) {
        toast({
          title: "تم إنشاء الحساب بنجاح",
          description: "مرحباً بك في مانجا بلس! يمكنك الآن الاستمتاع بقراءة المانجا",
        });
        
        navigate('/', { replace: true });
      } else {
        setErrors({ form: result.error });
      }
    } catch (error) {
      setErrors({ form: 'حدث خطأ غير متوقع، يرجى المحاولة مرة أخرى' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-50 dark:from-gray-900 dark:to-gray-800 px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white font-bold text-xl">
            م
          </div>
          
          <CardTitle className="text-2xl font-bold">
            إنشاء حساب جديد
          </CardTitle>
          
          <CardDescription>
            أدخل بياناتك لإنشاء حساب في مانجا بلس
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {errors.form && (
              <Alert variant="destructive">
                <AlertDescription>{errors.form}</AlertDescription>
              </Alert>
            )}
            
            {/* Username Field */}
            <div className="space-y-2">
              <Label htmlFor="username">اسم المستخدم</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="أدخل اسم المستخدم"
                  value={formData.username}
                  onChange={handleInputChange}
                  className={`pl-10 pr-4 ${errors.username ? 'border-destructive' : ''}`}
                  disabled={isSubmitting}
                />
              </div>
              {errors.username && (
                <p className="text-sm text-destructive">{errors.username}</p>
              )}
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="أدخل بريدك الإلكتروني"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`pl-10 pr-4 ${errors.email ? 'border-destructive' : ''}`}
                  disabled={isSubmitting}
                />
              </div>
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password">كلمة المرور</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="أدخل كلمة المرور"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`pl-10 pr-10 ${errors.password ? 'border-destructive' : ''}`}
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  disabled={isSubmitting}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">تأكيد كلمة المرور</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="أعد إدخال كلمة المرور"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`pl-10 pr-10 ${errors.confirmPassword ? 'border-destructive' : ''}`}
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  disabled={isSubmitting}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-destructive">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Terms Checkbox */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <Checkbox
                  id="terms"
                  checked={acceptTerms}
                  onCheckedChange={setAcceptTerms}
                  disabled={isSubmitting}
                />
                <Label htmlFor="terms" className="text-sm">
                  أوافق على{' '}
                  <Link to="/terms" className="text-primary hover:underline">
                    الشروط والأحكام
                  </Link>
                  {' '}و{' '}
                  <Link to="/privacy" className="text-primary hover:underline">
                    سياسة الخصوصية
                  </Link>
                </Label>
              </div>
              {errors.terms && (
                <p className="text-sm text-destructive">{errors.terms}</p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>جاري إنشاء الحساب...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <UserPlus className="w-4 h-4" />
                  <span>إنشاء الحساب</span>
                </div>
              )}
            </Button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-muted-foreground">
              لديك حساب بالفعل؟{' '}
              <Link 
                to="/login" 
                className="text-primary hover:underline font-medium"
              >
                تسجيل الدخول
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;