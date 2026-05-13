import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router';
import { useAuth } from '@/hooks/useAuth';
import { trpc } from '@/providers/trpc';
import {
  Clock, Zap, BarChart3, Image as ImageIcon, Video, ChevronRight,
  XCircle, CheckCircle2, Loader2, Settings, LogOut, Crown, Package
} from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, isLoading: authLoading, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'history' | 'quota' | 'settings'>('history');

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/');
    }
  }, [authLoading, user, navigate]);

  // Fetch comparison history
  const historyQuery = trpc.comparison.list.useQuery(
    { limit: 20 },
    { enabled: !!user }
  );

  // Fetch quota
  const quotaQuery = trpc.comparison.quota.useQuery(undefined, {
    enabled: !!user,
  });

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-void flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-cyan animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  const history = historyQuery.data ?? [];
  const quota = quotaQuery.data;

  const usagePercent = quota
    ? Math.min(100, (quota.usedThisMonth / quota.monthlyLimit) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-void text-white">
      {/* Header */}
      <header className="border-b border-white/5 bg-void/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-[1280px] mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-cyan flex items-center justify-center">
              <span className="text-void font-bold text-sm">d</span>
            </div>
            <span className="text-white font-bold">dlss5 Compare</span>
          </Link>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              {user.avatar && (
                <img src={user.avatar} alt="" className="w-8 h-8 rounded-full" />
              )}
              <span className="text-white/70 text-sm">{user.name ?? 'User'}</span>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 rounded-lg hover:bg-white/5 transition-colors"
            >
              <LogOut className="w-4 h-4 text-white/40" />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-[1280px] mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="rounded-2xl glass-panel p-4 space-y-1">
              {[
                { id: 'history' as const, label: 'History', icon: Clock },
                { id: 'quota' as const, label: 'Usage & Plan', icon: BarChart3 },
                { id: 'settings' as const, label: 'Settings', icon: Settings },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl text-sm transition-all ${
                    activeTab === tab.id
                      ? 'bg-cyan/10 text-cyan border border-cyan/20'
                      : 'text-white/50 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Quick Stats */}
            <div className="rounded-2xl glass-panel p-4 mt-4">
              <p className="text-white/30 text-[10px] font-mono uppercase tracking-wider mb-3">This Month</p>
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white/50 text-xs">Comparisons</span>
                    <span className="text-white text-sm font-medium">
                      {quota?.usedThisMonth ?? 0} / {quota?.monthlyLimit ?? 5}
                    </span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-cyan rounded-full transition-all"
                      style={{ width: `${usagePercent}%` }}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/50 text-xs">Plan</span>
                  <span className={`text-xs font-mono px-2 py-0.5 rounded ${
                    quota?.plan === 'pro' ? 'bg-gold/10 text-gold' : 'bg-white/5 text-white/40'
                  }`}>
                    {(quota?.plan ?? 'free').toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'history' && (
              <div>
                <h2 className="text-xl font-bold text-white mb-6">Comparison History</h2>
                {history.length === 0 ? (
                  <div className="rounded-2xl glass-panel p-12 text-center">
                    <BarChart3 className="w-12 h-12 text-white/10 mx-auto mb-4" />
                    <p className="text-white/40 text-sm mb-4">No comparisons yet</p>
                    <Link
                      to="/"
                      className="inline-flex items-center gap-2 bg-cyan text-void font-semibold px-5 py-2.5 rounded-2xl text-sm hover:shadow-glow-cyan transition-all"
                    >
                      <Zap className="w-4 h-4" />
                      Start Your First Comparison
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {history.map((item) => (
                      <div
                        key={item.id}
                        className="rounded-2xl glass-panel p-5 hover:border-white/10 transition-all"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                              {item.type === 'image' ? (
                                <ImageIcon className="w-5 h-5 text-cyan" />
                              ) : (
                                <Video className="w-5 h-5 text-purple-400" />
                              )}
                            </div>
                            <div>
                              <h3 className="text-white text-sm font-medium">{item.title}</h3>
                              <p className="text-white/30 text-[10px] font-mono">
                                {new Date(item.createdAt).toLocaleDateString()} · {item.type.toUpperCase()}
                              </p>
                            </div>
                          </div>
                          <StatusBadge status={item.status} />
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          {(item.models as string[]).map((m) => (
                            <span
                              key={m}
                              className="text-[10px] font-mono text-white/30 bg-white/5 px-2 py-0.5 rounded"
                            >
                              {m}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'quota' && (
              <div>
                <h2 className="text-xl font-bold text-white mb-6">Usage & Plan</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  {[
                    { label: 'Used This Month', value: quota?.usedThisMonth ?? 0, icon: Package },
                    { label: 'Monthly Limit', value: quota?.monthlyLimit ?? 5, icon: Crown },
                    { label: 'Remaining', value: (quota?.monthlyLimit ?? 5) - (quota?.usedThisMonth ?? 0), icon: Zap },
                  ].map((stat) => (
                    <div key={stat.label} className="rounded-2xl glass-panel p-5">
                      <stat.icon className="w-5 h-5 text-cyan mb-2" />
                      <p className="text-white text-2xl font-bold">{stat.value}</p>
                      <p className="text-white/30 text-xs">{stat.label}</p>
                    </div>
                  ))}
                </div>

                {/* Upgrade CTA */}
                <div className="rounded-2xl glass-panel p-6 border border-cyan/20 bg-cyan/[0.02]">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-white font-semibold mb-1">Upgrade to Pro</h3>
                      <p className="text-white/40 text-sm">
                        100 comparisons/month, no watermark, video support, priority processing.
                      </p>
                    </div>
                    <Link
                      to="/"
                      className="flex items-center gap-2 bg-cyan text-void font-semibold px-5 py-2.5 rounded-2xl text-sm hover:shadow-glow-cyan transition-all whitespace-nowrap"
                    >
                      $19/month <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div>
                <h2 className="text-xl font-bold text-white mb-6">Account Settings</h2>
                <div className="rounded-2xl glass-panel p-6 space-y-6">
                  <div className="flex items-center gap-4">
                    {user.avatar && (
                      <img src={user.avatar} alt="" className="w-16 h-16 rounded-2xl" />
                    )}
                    <div>
                      <p className="text-white font-medium">{user.name ?? 'User'}</p>
                      <p className="text-white/30 text-xs font-mono">ID: {user.unionId?.slice(0, 16)}...</p>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-white/5">
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors text-sm"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    processing: 'bg-blue-500/10 text-blue-400',
    done: 'bg-emerald-500/10 text-emerald-400',
    failed: 'bg-red-500/10 text-red-400',
  };
  return (
    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${styles[status] ?? 'bg-white/5 text-white/30'}`}>
      {status.toUpperCase()}
    </span>
  );
}
