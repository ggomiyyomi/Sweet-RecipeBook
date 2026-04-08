import { useNavigate } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { GlassCard } from '../components/ui/GlassCard';
import { Button } from '../components/ui/Button';
import { useAuthStore } from '../store/useAuthStore';
import { authApi } from '../api/auth';

export function MyPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleLogout = async () => {
    try { await authApi.logout(); } catch { /* ignore */ }
    logout();
    navigate('/login');
  };

  const joinedDate = new Date(user.createdAt).toLocaleDateString('ko-KR', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <AppLayout>
      <div className="max-w-lg mx-auto animate-fade-in-up">
        <div className="mb-8">
          <p className="text-sm text-brown-400 mb-1">계정 정보</p>
          <h1 className="text-3xl font-bold text-brown-800">마이페이지</h1>
        </div>

        {/* 프로필 카드 */}
        <GlassCard variant="strong" padding="lg" className="mb-5">
          <div className="flex items-center gap-5 mb-6">
            <div className="w-16 h-16 rounded-full glass flex items-center justify-center text-2xl shrink-0">
              👤
            </div>
            <div>
              <h2 className="text-xl font-bold text-brown-800">{user.name}</h2>
              <p className="text-sm text-brown-400 mt-0.5">{user.email}</p>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center py-3 border-b border-white/30">
              <span className="text-sm text-brown-500">이름</span>
              <span className="text-sm font-medium text-brown-800">{user.name}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-white/30">
              <span className="text-sm text-brown-500">이메일</span>
              <span className="text-sm font-medium text-brown-800">{user.email}</span>
            </div>
            <div className="flex justify-between items-center py-3">
              <span className="text-sm text-brown-500">가입일</span>
              <span className="text-sm font-medium text-brown-800">{joinedDate}</span>
            </div>
          </div>
        </GlassCard>

        {/* 로그아웃 */}
        <Button
          variant="secondary"
          fullWidth
          onClick={handleLogout}
          className="border border-red-200 text-red-400 hover:bg-red-50"
        >
          로그아웃
        </Button>
      </div>
    </AppLayout>
  );
}
