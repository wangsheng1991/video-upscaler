import { useAuth } from '@/hooks/useAuth';
import { Link } from 'react-router';
import { LogIn, ArrowLeft, Zap } from 'lucide-react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';

export default function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-void flex items-center justify-center px-6">
      <div className="max-w-[400px] w-full">
        <Link to="/" className="flex items-center gap-2 text-white/30 hover:text-white/50 transition-colors mb-8 text-sm">
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </Link>

        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-cyan flex items-center justify-center mx-auto mb-4">
            <Zap className="w-6 h-6 text-void" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-white/40 text-sm">
            Sign in to save your comparison history and access unlimited tests.
          </p>
        </div>

        <button
          onClick={login}
          className="w-full flex items-center justify-center gap-2 bg-cyan text-void font-semibold py-3.5 rounded-2xl hover:shadow-glow-cyan hover:scale-[1.01] transition-all text-sm"
        >
          <LogIn className="w-4 h-4" />
          Sign In with Kimi
        </button>

        <div className="mt-6 text-center">
          <p className="text-white/20 text-xs">
            No account? Signing in creates one instantly.
          </p>
        </div>
      </div>
    </div>
  );
}
