import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlassCard } from '../components/ui/GlassCard';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { authApi } from '../api/auth';
import { useAuthStore } from '../store/useAuthStore';

export function LoginPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ email: '', password: '', name: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = isRegister
        ? await authApi.signup({ email: form.email, password: form.password, name: form.name })
        : await authApi.login({ email: form.email, password: form.password });
      setAuth(res.user, res.token);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message ?? '요청에 실패했어요. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4">
      {/* 배경 오브 */}
      <div aria-hidden className="pointer-events-none">
        <div className="bg-orb w-[480px] h-[480px] top-[-100px] right-[-60px] bg-orange-200 opacity-50" />
        <div className="bg-orb w-[380px] h-[380px] bottom-[-80px] left-[-80px] bg-amber-200 opacity-40" />
        <div className="bg-orb w-[280px] h-[280px] top-[35%] left-[15%] bg-rose-100 opacity-30" />
      </div>

      <div className="w-full max-w-md animate-fade-in-up">
        {/* 브랜드 */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-3 animate-float">🍽️</div>
          <h1 className="text-2xl font-bold text-brown-800 tracking-tight">맛을 재현하다</h1>
          <p className="text-sm text-brown-400 mt-1 tracking-wide">나만의 레시피를 책으로 남기세요</p>
        </div>

        <GlassCard variant="strong" padding="lg">
          {/* 탭 */}
          <div className="flex glass-subtle rounded-xl p-1 mb-7">
            {(['로그인', '회원가입'] as const).map((label, i) => (
              <button
                key={label}
                onClick={() => setIsRegister(i === 1)}
                className={[
                  'flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-200',
                  (i === 1) === isRegister
                    ? 'glass text-primary-600 shadow-sm'
                    : 'text-brown-400 hover:text-brown-600',
                ].join(' ')}
              >
                {label}
              </button>
            ))}
          </div>

          {error && (
            <p className="text-sm text-red-500 text-center -mb-1">{error}</p>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {isRegister && (
              <Input
                label="이름"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="홍길동"
                required
              />
            )}
            <Input
              label="이메일"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="hello@example.com"
              required
            />
            <Input
              label="비밀번호"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />

            <Button
              type="submit"
              fullWidth
              size="lg"
              loading={loading}
              className="mt-2"
            >
              {isRegister ? '가입하기' : '로그인'}
            </Button>
          </form>
        </GlassCard>

        <p className="text-center text-xs text-brown-400 mt-5">
          {isRegister ? (
            <>
              이미 계정이 있으신가요?{' '}
              <button onClick={() => setIsRegister(false)} className="text-primary-500 font-medium underline-offset-2 hover:underline">
                로그인
              </button>
            </>
          ) : (
            <>
              아직 계정이 없으신가요?{' '}
              <button onClick={() => setIsRegister(true)} className="text-primary-500 font-medium underline-offset-2 hover:underline">
                회원가입
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
