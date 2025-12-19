import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import ThemeColorSwitcher from './ThemeColorSwitcher';
import { getAuthUser, isLoggedIn as getIsLoggedIn } from '@/lib/auth';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(getIsLoggedIn());
  const authUser = getAuthUser();
  const location = useLocation();

  useEffect(() => {
    const sync = () => setIsLoggedIn(getIsLoggedIn());
    window.addEventListener('storage', sync);
    window.addEventListener('auth_changed', sync as EventListener);
    return () => {
      window.removeEventListener('storage', sync);
      window.removeEventListener('auth_changed', sync as EventListener);
    };
  }, []);

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { to: '/search', label: 'Documents' },
    { to: '/networking', label: 'Réseau' },
    { to: '/upload', label: 'Contribuer' },
    { to: '/about', label: 'À propos' },
  ];

  return (
    <header className="bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo - Simple, institutional */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 bg-primary rounded flex items-center justify-center">
              <span className="text-primary-foreground font-serif font-semibold text-sm">NS</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-serif font-semibold text-foreground tracking-tight">
                Niger Savoir+
              </h1>
            </div>
          </Link>

          {/* Desktop Navigation - Clean, minimal */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm font-medium transition-colors duration-200 ${
                  isActive(link.to)
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {link.label}
              </Link>
            ))}
            {authUser?.role === 'ADMIN' && (
              <Link
                to="/admin"
                className={`text-sm font-medium transition-colors duration-200 ${
                  isActive('/admin')
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Administration
              </Link>
            )}
          </nav>

          {/* Auth Section - Restrained */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeColorSwitcher />
            {isLoggedIn ? (
              <Link
                to="/profile"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                  <User className="w-4 h-4" />
                </div>
              </Link>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" asChild className="text-muted-foreground">
                  <Link to="/login">Connexion</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link to="/register">S'inscrire</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeColorSwitcher />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation - Clean */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border">
            <nav className="py-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-2 py-2.5 text-sm font-medium rounded transition-colors ${
                    isActive(link.to)
                      ? 'text-primary bg-primary/5'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {authUser?.role === 'ADMIN' && (
                <Link
                  to="/admin"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-2 py-2.5 text-sm font-medium rounded transition-colors ${
                    isActive('/admin')
                      ? 'text-primary bg-primary/5'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }`}
                >
                  Administration
                </Link>
              )}
              
              {!isLoggedIn && (
                <div className="pt-4 mt-4 border-t border-border space-y-2">
                  <Button variant="outline" size="sm" className="w-full" asChild>
                    <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                      Connexion
                    </Link>
                  </Button>
                  <Button size="sm" className="w-full" asChild>
                    <Link to="/register" onClick={() => setIsMobileMenuOpen(false)}>
                      S'inscrire
                    </Link>
                  </Button>
                </div>
              )}

              {isLoggedIn && (
                <div className="pt-4 mt-4 border-t border-border">
                  <Link
                    to="/profile"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-2 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground"
                  >
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                      <User className="w-4 h-4" />
                    </div>
                    Mon profil
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;