import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { authApi } from '../../api/auth';

const publicLinks = [
  { to: '/', label: '홈' },
];

const privateLinks = [
  { to: '/recipes',    label: '레시피' },
  { to: '/books',      label: '레시피북' },
  { to: '/orders',     label: '주문' },
];

const IconPerson = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
  </svg>
);

const IconBook = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
);

const IconLogout = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

const IconMenu = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="6"  x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const IconClose = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try { await authApi.logout(); } catch { /* ignore */ }
    logout();
    navigate('/login');
    setMenuOpen(false);
  };

  const btnClass = 'w-9 h-9 flex items-center justify-center rounded-xl text-brown-500 hover:bg-white/50 hover:text-primary-600 transition-all';

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

            {/* 사람 아이콘: 비로그인 → /login, 로그인 → /mypage */}
            <Link
              to={user ? '/mypage' : '/login'}
              className={btnClass}
              title={user ? `${user.name}님의 마이페이지` : '로그인'}
            >
              <IconPerson />
            </Link>

            {/* 로그인 상태일 때만 로그아웃 버튼 표시 */}
            {user && (
              <button
                className={`${btnClass} hover:text-red-400`}
                title="로그아웃"
                onClick={handleLogout}
              >
                <IconLogout />
              </button>
            )}

            {/* 레시피북 아이콘: 로그인 시에만 */}
            {user && (
              <Link to="/books" className={btnClass} title="레시피북">
                <IconBook />
              </Link>
            )}

            {/* 햄버거 메뉴 */}
            <button
              className={btnClass}
              onClick={() => setMenuOpen((v) => !v)}
              title="메뉴"
            >
              {menuOpen ? <IconClose /> : <IconMenu />}
            </button>
          </div>
        </div>
      </header>

      {/* 햄버거 드롭다운 */}
      {menuOpen && (
        <div className="fixed top-20 right-4 z-50 glass-strong rounded-2xl overflow-hidden w-44 shadow-lg animate-fade-in">
          {[...publicLinks, ...(user ? privateLinks : [])].map((link) => {
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
            <>
              <Link
                to="/mypage"
                onClick={() => setMenuOpen(false)}
                className="block px-5 py-3 text-sm font-medium text-brown-600 hover:text-primary-600 hover:bg-white/30 transition-colors border-t border-white/20"
              >
                마이페이지
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-5 py-3 text-sm font-medium text-red-400 hover:bg-white/30 transition-colors"
              >
                로그아웃
              </button>
            </>
          )}
        </div>
      )}
    </>
  );
}
