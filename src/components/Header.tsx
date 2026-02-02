import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  Menu,
  X,
  BookOpen,
  Trophy,
  User,
  Languages,
  Sun,
  Moon,
  Globe
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const { theme, setTheme } = useTheme();

  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const isLoggedIn = !!token && !!user;

  const changeLanguage = async (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('i18nextLng', lng);

    // If user is logged in, sync to profile
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const { default: authService } = await import("@/services/authService");
        await authService.updateProfile({ language: lng });

        // Update local storage user object if exists
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const user = JSON.parse(storedUser);
          user.language = lng;
          localStorage.setItem('user', JSON.stringify(user));
        }
      } catch (error) {
        console.error("Failed to sync language to profile:", error);
      }
    }
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-border bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <a
            href="/"
            className="flex items-center gap-2"
            onClick={(e) => {
              e.preventDefault();
              // Try multiple scrolling methods
              window.scrollTo({ top: 0, behavior: 'smooth' });
              document.documentElement.scrollTo({ top: 0, behavior: 'smooth' });
              document.body.scrollTo({ top: 0, behavior: 'smooth' });

              if (window.location.pathname !== '/') {
                window.location.href = '/';
              }
            }}
          >
            <img src="/logo.png" alt="Logo" className="w-10 h-10 md:w-12 md:h-12 object-contain" />
            <span className="text-xl md:text-2xl font-bold gradient-text">
              Ardent
            </span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/all-courses" className="text-muted-foreground hover:text-primary transition-colors font-medium">
              {t('nav.courses')}
            </Link>
            <Link to="/guide" className="text-muted-foreground hover:text-primary transition-colors font-medium">
              {t('nav.guide')}
            </Link>
            <Link to="/all-olympiads" className="text-muted-foreground hover:text-primary transition-colors font-medium">
              {t('nav.olympiads')}
            </Link>
            <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors font-medium">
              {t('nav.about')}
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            {/* Language Switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Globe className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => changeLanguage('uz')}>
                  <span className="mr-2">🇺🇿</span> O'zbekcha
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => changeLanguage('ru')}>
                  <span className="mr-2">🇷🇺</span> Русский
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Theme Toggle */}
            <Button variant="ghost" size="icon" className="rounded-full" onClick={toggleTheme}>
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>

            {isLoggedIn ? (
              <div className="flex items-center gap-3">
                <Link to="/dashboard">
                  <Button variant="ghost" size="sm">
                    {t('nav.dashboard', 'Dashboard')}
                  </Button>
                </Link>
                <Link to="/profile">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white font-bold border-2 border-background shadow-sm overflow-hidden">
                    {user?.avatar ? (
                      <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      (user?.first_name?.[0] || user?.username?.[0] || 'U').toUpperCase()
                    )}
                  </div>
                </Link>
              </div>
            ) : (
              <>
                <Link to="/auth/login">
                  <Button variant="ghost" size="sm">
                    {t('nav.login')}
                  </Button>
                </Link>
                <Link to="/auth/register">
                  <Button variant="hero" size="default">
                    {t('nav.register')}
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border animate-slide-up">
            <nav className="flex flex-col gap-2">
              <Link
                to="/all-courses"
                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <BookOpen className="w-5 h-5 text-primary" />
                <span className="font-medium">{t('nav.courses')}</span>
              </Link>
              <Link
                to="/subjects"
                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <BookOpen className="w-5 h-5 text-secondary" />
                <span className="font-medium">{t('nav.subjects')}</span>
              </Link>
              <Link
                to="/all-olympiads"
                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <Trophy className="w-5 h-5 text-warning" />
                <span className="font-medium">{t('nav.olympiads')}</span>
              </Link>

              <div className="flex items-center justify-between px-4 py-4 mt-2 border-t border-border">
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => changeLanguage('uz')}>UZ</Button>
                  <Button variant="outline" size="sm" onClick={() => changeLanguage('ru')}>RU</Button>
                </div>
                <Button variant="ghost" size="icon" onClick={toggleTheme}>
                  <Sun className="h-5 w-5 dark:hidden" />
                  <Moon className="h-5 w-5 hidden dark:block" />
                </Button>
              </div>

              <div className="flex flex-col gap-2 mt-2 px-4 shadow-xl">
                {isLoggedIn ? (
                  <>
                    <Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="hero" className="w-full">
                        <User className="w-5 h-5 mr-2" />
                        {t('nav.dashboard', 'Dashboard')}
                      </Button>
                    </Link>
                    <Link to="/profile" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="outline" className="w-full">
                        {t('nav.profile', 'Profil')}
                      </Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/auth/login" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="outline" className="w-full">
                        <User className="w-5 h-5 mr-2" />
                        {t('nav.login')}
                      </Button>
                    </Link>
                    <Link to="/auth/register" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="hero" className="w-full">
                        {t('nav.register')}
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
