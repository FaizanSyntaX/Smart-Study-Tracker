import { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, BookOpen, Target, BarChart3, ArrowRight } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const payload = isLogin 
        ? { email: formData.email, password: formData.password }
        : formData;

      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok) {
        if (isLogin) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
          toast.success(`Welcome back, ${data.user.name}! 🎉`, {
            position: "top-right",
            autoClose: 2000,
            theme: "colored"
          });
          setTimeout(() => {
            window.location.href = '/dashboard';
          }, 2000);
        } else {
          toast.success('Account created successfully! Please login. ✨', {
            position: "top-right",
            autoClose: 2000,
            theme: "colored"
          });
          setIsLogin(true);
          setFormData({ name: '', email: '', password: '' });
        }
      } else {
        toast.error(data.msg || 'Something went wrong!', {
          position: "top-right",
          autoClose: 3000,
          theme: "colored"
        });
      }
    } catch (error) {
      toast.error('Server error. Please try again later.', {
        position: "top-right",
        autoClose: 3000,
        theme: "colored"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden bg-gradient-to-br from-[#5FA8D3] via-[#62B6CB] to-[#BEE9E8]">
      <ToastContainer />
      
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#1B4965] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-[#62B6CB] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/3 w-72 h-72 bg-[#CAE9FF] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="hidden lg:flex lg:w-1/2 relative z-10 flex-col justify-center items-center p-12 text-white">
        <div className="max-w-md space-y-8 animate-fade-in-up">
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-8">
              <div className="relative">
                <BookOpen className="w-16 h-16 text-[#BEE9E8]" strokeWidth={1.5} />
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-[#62B6CB] rounded-full animate-ping"></div>
              </div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-white to-[#BEE9E8] bg-clip-text text-transparent">
                Smart Study
              </h1>
            </div>
            
            <p className="text-2xl font-light text-[#CAE9FF]">
              Your Personal Study Companion
            </p>
            <p className="text-lg text-[#BEE9E8]/80 leading-relaxed">
              Track your progress, manage your tasks, and achieve your academic goals with ease.
            </p>
          </div>

          <div className="space-y-4 mt-12">
            <FeatureCard 
              icon={<Target className="w-6 h-6" />}
              title="Track your study progress"
              delay="0"
            />
            <FeatureCard 
              icon={<BookOpen className="w-6 h-6" />}
              title="Manage tasks efficiently"
              delay="100"
            />
            <FeatureCard 
              icon={<BarChart3 className="w-6 h-6" />}
              title="Visualize your growth"
              delay="200"
            />
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative z-10">
        <div className="w-full max-w-md">
          <div className="bg-[#CAE9FF]/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20 animate-slide-in-right">
            <div className="lg:hidden flex justify-center mb-6">
              <BookOpen className="w-12 h-12 text-[#1B4965]" strokeWidth={1.5} />
            </div>

            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-[#1B4965] mb-2">
                {isLogin ? 'Welcome Back!' : 'Create Account'}
              </h2>
              <p className="text-[#62B6CB]">
                {isLogin ? 'Sign in to continue your study journey' : 'Join us and start tracking your progress'}
              </p>
            </div>

            <div className="space-y-5">
              {!isLogin && (
                <div className="group">
                  <label className="block text-sm font-medium text-[#1B4965] mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 pl-12 bg-white/80 border-2 border-[#62B6CB]/30 rounded-xl focus:outline-none focus:border-[#1B4965] focus:bg-white transition-all duration-300 text-[#1B4965] placeholder-[#62B6CB]/50"
                      placeholder="Enter your name"
                    />
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#62B6CB] group-focus-within:text-[#1B4965] transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  </div>
                </div>
              )}

              <div className="group">
                <label className="block text-sm font-medium text-[#1B4965] mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 pl-12 bg-white/80 border-2 border-[#62B6CB]/30 rounded-xl focus:outline-none focus:border-[#1B4965] focus:bg-white transition-all duration-300 text-[#1B4965] placeholder-[#62B6CB]/50"
                    placeholder="Enter your email"
                  />
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#62B6CB] group-focus-within:text-[#1B4965] transition-colors" />
                </div>
              </div>

              <div className="group">
                <label className="block text-sm font-medium text-[#1B4965] mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 pl-12 pr-12 bg-white/80 border-2 border-[#62B6CB]/30 rounded-xl focus:outline-none focus:border-[#1B4965] focus:bg-white transition-all duration-300 text-[#1B4965] placeholder-[#62B6CB]/50"
                    placeholder="Enter your password"
                  />
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#62B6CB] group-focus-within:text-[#1B4965] transition-colors" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#62B6CB] hover:text-[#1B4965] transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#1B4965] to-[#62B6CB] text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                {loading ? (
                  <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    {isLogin ? 'Sign In' : 'Create Account'}
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>

            <div className="mt-6 text-center">
              <p className="text-[#62B6CB]">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setFormData({ name: '', email: '', password: '' });
                  }}
                  className="text-[#1B4965] font-semibold hover:underline transition-all"
                >
                  {isLogin ? 'Create Account' : 'Sign In'}
                </button>
              </p>
            </div>

            {isLogin && (
              <div className="lg:hidden mt-8 space-y-3 pt-6 border-t border-[#62B6CB]/30">
                <FeatureCard 
                  icon={<Target className="w-5 h-5" />}
                  title="Track your study progress"
                  delay="0"
                  compact
                />
                <FeatureCard 
                  icon={<BookOpen className="w-5 h-5" />}
                  title="Manage tasks efficiently"
                  delay="100"
                  compact
                />
                <FeatureCard 
                  icon={<BarChart3 className="w-5 h-5" />}
                  title="Visualize your growth"
                  delay="200"
                  compact
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fadeInUp 1s ease-out;
        }
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-slide-in-right {
          animation: slideInRight 0.8s ease-out;
        }
      `}</style>
    </div>
  );
}

function FeatureCard({ icon, title, delay, compact }) {
  return (
    <div 
      className={`flex items-center gap-3 ${compact ? 'bg-white/50' : 'bg-white/10'} backdrop-blur-sm ${compact ? 'p-3' : 'p-4'} rounded-xl hover:bg-white/20 transition-all duration-300 cursor-default hover:scale-105`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className={`${compact ? 'text-[#1B4965]' : 'text-[#BEE9E8]'}`}>
        {icon}
      </div>
      <span className={`${compact ? 'text-sm text-[#1B4965]' : 'text-[#CAE9FF]'} font-medium`}>
        {title}
      </span>
    </div>
  );
}