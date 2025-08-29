import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, LogIn } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import { useToast } from '../../hooks/use-toast';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, user, isLoading } = useAuth();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      const redirectTo = location.state?.from?.pathname || '/';
      navigate(redirectTo, { replace: true });
    }
  }, [user, navigate, location]);

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
    
    if (!formData.email) {
      newErrors.email = 'البريد الإلكتروني مطلوب';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'البريد الإلكتروني غير صحيح';
    }
    
    if (!formData.password) {
      newErrors.password = 'كلمة المرور مطلوبة';
    } else if (formData.password.length < 6) {
      newErrors.password = 'كلمة المرور يجب أن تكون 6 أحرف على الأقل';
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
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        toast({
          title: "تم تسجيل الدخول بنجاح",
          description: "مرحباً بك في مانجا بلس!",
        });
        
        const redirectTo = location.state?.from?.pathname || '/';
        navigate(redirectTo, { replace: true });
      } else {
        setErrors({ form: result.error });
      }
    } catch (error) {
      setErrors({ form: 'حدث خطأ غير متوقع، يرجى المحاولة مرة أخرى' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoLogin = () => {
    setFormData({
      email: 'ahmed@example.com',
      password: 'password'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-50 dark:from-gray-900 dark:to-gray-800 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white font-bold text-xl">
            م
          </div>
          
          <CardTitle className="text-2xl font-bold">
            تسجيل الدخول
          </CardTitle>
          
          <CardDescription>
            ادخل بياناتك للوصول إلى حسابك
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {errors.form && (
              <Alert variant="destructive">
                <AlertDescription>{errors.form}</AlertDescription>
              </Alert>
            )}
            
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

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <input
                  id="remember"
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-300"
                />
                <Label htmlFor="remember" className="text-sm">
                  تذكرني
                </Label>
              </div>
              
              <Link 
                to="/forgot-password"
                className="text-sm text-primary hover:underline"
              >
                نسيت كلمة المرور؟
              </Link>
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
                  <span>جاري تسجيل الدخول...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <LogIn className="w-4 h-4" />
                  <span>تسجيل الدخول</span>
                </div>
              )}
            </Button>

            {/* Demo Login */}
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleDemoLogin}
              disabled={isSubmitting}
            >
              تجربة الحساب التجريبي
            </Button>
          </form>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className="text-muted-foreground">
              ليس لديك حساب؟{' '}
              <Link 
                to="/register" 
                className="text-primary hover:underline font-medium"
              >
                إنشاء حساب جديد
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;