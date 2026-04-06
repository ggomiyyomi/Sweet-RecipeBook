import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { to: '/',           label: '레시피' },
    { to: '/categories', label: 'INDEX' },
    { to: '/books',      label: '레시피북' },
    { to: '/orders',     label: '주문' },
  ];

  return (
    <header
      className={[
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled ? 'glass-strong shadow-sm' : 'bg-transparent',
      ].join(' ')}
    >
      <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
        {/* 로고 */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <span className="text-2xl">🍽️</span>
          <div className="flex flex-col leading-none">
            <span className="text-sm font-bold text-brown-800 tracking-tight">맛을 재현하다</span>
            <span className="text-[10px] text-brown-400 tracking-widest">RECIPE BOOK</span>
          </div>
        </Link>

        {/* 네비게이션 */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={[
                  'px-4 py-2 rounded-xl text-sm font-medium transition-all duration-150',
                  isActive
                    ? 'glass text-primary-600'
                    : 'text-brown-600 hover:text-primary-600 hover:bg-white/35',
                ].join(' ')}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* 우측 유저 영역 */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <span className="hidden sm:block text-sm text-brown-500">
                {user.name}님
              </span>
              <button
                onClick={handleLogout}
                className="glass px-3 py-1.5 rounded-xl text-xs text-brown-600 hover:text-red-500 transition-colors"
              >
                로그아웃
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="glass px-4 py-2 rounded-xl text-sm font-medium text-primary-600 hover:bg-white/65 transition-all"
            >
              로그인
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
