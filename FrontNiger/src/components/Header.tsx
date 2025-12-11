import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Search, Menu, X, Upload, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import ThemeColorSwitcher from './ThemeColorSwitcher';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Mock state

  return (
    <header className="bg-card border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">NS+</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-foreground">Niger Savoir+</h1>
                <p className="text-xs text-muted-foreground">Partage de savoir entre élèves et étudiants</p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/search" className="text-foreground hover:text-primary transition-colors">
              Documents
            </Link>
            <Link to="/upload" className="text-foreground hover:text-primary transition-colors">
              Publier
            </Link>
            <Link to="/about" className="text-foreground hover:text-primary transition-colors">
              À propos
            </Link>
            <Link to="/admin" className="text-foreground hover:text-primary transition-colors">
              Admin
            </Link>
          </nav>

          {/* Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeColorSwitcher />
            {isLoggedIn ? (
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" asChild>
                  <Link to="/upload">
                    <Upload className="w-4 h-4 mr-2" />
                    Publier
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/profile">
                    <User className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/login">Connexion</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link to="/register">Créer un compte</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 border-t border-border">
              <Link
                to="/search"
                className="block px-3 py-2 text-foreground hover:text-primary transition-colors"
              >
                Documents
              </Link>
              <Link
                to="/upload"
                className="block px-3 py-2 text-foreground hover:text-primary transition-colors"
              >
                Publier
              </Link>
              <Link
                to="/about"
                className="block px-3 py-2 text-foreground hover:text-primary transition-colors"
              >
                À propos
              </Link>
              
              {!isLoggedIn && (
                <div className="pt-4 space-y-2">
                  <Button variant="ghost" size="sm" className="w-full" asChild>
                    <Link to="/login">Connexion</Link>
                  </Button>
                  <Button size="sm" className="w-full" asChild>
                    <Link to="/register">Créer un compte</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;