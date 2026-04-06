import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';

const navLinks = [
  { to: '/',           label: '홈' },
  { to: '/categories', label: 'INDEX' },
  { to: '/books',      label: '레시피북' },
  { to: '/orders',     label: '주문' },
];

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMenuOpen(false);
  };

  return (
    <>
      <header className="fixed top-4 left-4 right-4 z-50 glass-strong rounded-2xl transition-all duration-300">
        <div className="px-6 h-14 flex items-center justify-between">

          {/* 로고 */}
          <Link to="/" className="text-base font-bold text-brown-800 tracking-[0.3em]">
            재현하다
          </Link>

          {/* 우측 아이콘 */}
          <div className="flex items-center gap-1">

            {/* 로그인 아이콘 */}
            {!user && (
              <Link
                to="/login"
                className="w-9 h-9 flex items-center justify-center rounded-xl text-brown-500 hover:bg-white/50 hover:text-primary-600 transition-all"
                title="로그인"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                  <polyline points="10 17 15 12 10 7" />
                  <line x1="15" y1="12" x2="3" y2="12" />
                </svg>
              </Link>
            )}

            {/* 유저 아이콘 */}
            <button
              className="w-9 h-9 flex items-center justify-center rounded-xl text-brown-500 hover:bg-white/50 hover:text-primary-600 transition-all"
              title={user ? `${user.name}님` : '프로필'}
              onClick={user ? handleLogout : () => navigate('/login')}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
              </svg>
            </button>

            {/* 레시피북 아이콘 */}
            <Link
              to="/books"
              className="w-9 h-9 flex items-center justify-center rounded-xl text-brown-500 hover:bg-white/50 hover:text-primary-600 transition-all"
              title="레시피북"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              </svg>
            </Link>

            {/* 햄버거 메뉴 */}
            <button
              className="w-9 h-9 flex items-center justify-center rounded-xl text-brown-500 hover:bg-white/50 hover:text-primary-600 transition-all"
              onClick={() => setMenuOpen((v) => !v)}
              title="메뉴"
            >
              {menuOpen ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="3" y1="6"  x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* 햄버거 드롭다운 */}
      {menuOpen && (
        <div className="fixed top-20 right-4 z-50 glass-strong rounded-2xl overflow-hidden w-44 shadow-lg animate-fade-in">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className={[
                  'block px-5 py-3 text-sm font-medium transition-colors',
                  isActive
                    ? 'text-primary-600 bg-white/40'
                    : 'text-brown-600 hover:text-primary-600 hover:bg-white/30',
                ].join(' ')}
              >
                {link.label}
              </Link>
            );
          })}
          {user && (
            <button
              onClick={handleLogout}
              className="block w-full text-left px-5 py-3 text-sm font-medium text-red-400 hover:bg-white/30 transition-colors border-t border-white/20"
            >
              로그아웃
            </button>
          )}
        </div>
      )}
    </>
  );
}
