import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlassCard } from '../components/ui/GlassCard';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { authApi } from '../api/auth';
import { useAuthStore } from '../store/useAuthStore';

function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePassword(password: string) {
  return {
    hasUpper:   /[A-Z]/.test(password),
    hasNumber:  /[0-9]/.test(password),
    hasSpecial: /[!@#$%^&*(),.?":{}|<>\-_=+[\]\\;'/`~]/.test(password),
    hasLength:  password.length >= 8,
  };
}

export function LoginPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [form, setForm] = useState({ email: '', password: '', name: '' });
  const [touched, setTouched] = useState({ email: false, password: false });

  const emailValid = validateEmail(form.email);
  const pwChecks = validatePassword(form.password);
  const pwValid = Object.values(pwChecks).every(Boolean);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setTouched((prev) => ({ ...prev, [e.target.name]: true }));
  };

  const canSubmit = emailValid && (isRegister ? pwValid : form.password.length > 0) && (!isRegister || form.name.trim().length > 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setLoading(true);
    setError(null);
    try {
      const res = isRegister
        ? await authApi.signup({ email: form.email, password: form.password, name: form.name })
        : await authApi.login({ email: form.email, password: form.password });
      setAuth(res.user, res.token);
      setSuccess(isRegister ? '회원가입이 완료되었습니다!' : '로그인 완료!');
      setTimeout(() => navigate('/'), 900);
    } catch (err: any) {
      setError(err.response?.data?.message ?? '요청에 실패했어요. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (register: boolean) => {
    setIsRegister(register);
    setError(null);
    setSuccess(null);
    setTouched({ email: false, password: false });
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
                onClick={() => switchMode(i === 1)}
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

          {/* 성공 메시지 */}
          {success && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-emerald-50/80 border border-emerald-200 text-sm text-emerald-700 text-center font-medium">
              ✓ {success}
            </div>
          )}

          {/* 에러 메시지 */}
          {error && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-red-50/80 border border-red-200 text-sm text-red-600 text-center">
              {error}
            </div>
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

            {/* 이메일 */}
            <div>
              <Input
                label="이메일"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="hello@example.com"
                required
              />
              {touched.email && form.email && !emailValid && (
                <p className="text-xs text-red-500 mt-1 ml-1">올바른 이메일 형식을 입력해주세요 (@ 포함)</p>
              )}
            </div>

            {/* 비밀번호 */}
            <div>
              <Input
                label="비밀번호"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="••••••••"
                required
              />
              {isRegister && form.password && (
                <div className="mt-2 flex flex-col gap-1">
                  {[
                    { check: pwChecks.hasLength,  label: '8자 이상' },
                    { check: pwChecks.hasUpper,   label: '대문자 포함' },
                    { check: pwChecks.hasNumber,  label: '숫자 포함' },
                    { check: pwChecks.hasSpecial, label: '특수문자 포함' },
                  ].map(({ check, label }) => (
                    <span key={label} className={`text-xs flex items-center gap-1.5 ${check ? 'text-emerald-600' : 'text-brown-400'}`}>
                      <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[10px] font-bold ${check ? 'bg-emerald-100 text-emerald-600' : 'bg-brown-100 text-brown-400'}`}>
                        {check ? '✓' : '·'}
                      </span>
                      {label}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <Button
              type="submit"
              fullWidth
              size="lg"
              loading={loading}
              disabled={!canSubmit || !!success}
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
              <button onClick={() => switchMode(false)} className="text-primary-500 font-medium underline-offset-2 hover:underline">
                로그인
              </button>
            </>
          ) : (
            <>
              아직 계정이 없으신가요?{' '}
              <button onClick={() => switchMode(true)} className="text-primary-500 font-medium underline-offset-2 hover:underline">
                회원가입
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
