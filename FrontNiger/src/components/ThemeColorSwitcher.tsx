import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Palette, Check } from 'lucide-react';

const colorThemes = [
  {
    name: 'Niger Orange',
    value: 'niger-orange',
    primary: 'hsl(25, 85%, 55%)',
    background: 'hsl(34, 100%, 98%)',
    accent: 'hsl(200, 100%, 40%)'
  },
  {
    name: 'Desert Sunset',
    value: 'desert-sunset',
    primary: 'hsl(15, 90%, 60%)',
    background: 'hsl(30, 50%, 96%)',
    accent: 'hsl(280, 80%, 50%)'
  },
  {
    name: 'Sahara Gold',
    value: 'sahara-gold',
    primary: 'hsl(45, 80%, 50%)',
    background: 'hsl(50, 40%, 97%)',
    accent: 'hsl(220, 70%, 45%)'
  },
  {
    name: 'River Blue',
    value: 'river-blue',
    primary: 'hsl(200, 80%, 50%)',
    background: 'hsl(210, 30%, 98%)',
    accent: 'hsl(30, 90%, 55%)'
  },
  {
    name: 'Forest Green',
    value: 'forest-green',
    primary: 'hsl(140, 60%, 45%)',
    background: 'hsl(120, 20%, 97%)',
    accent: 'hsl(60, 80%, 50%)'
  }
];

const ThemeColorSwitcher = () => {
  const [currentTheme, setCurrentTheme] = useState('niger-orange');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme-color') || 'niger-orange';
    setCurrentTheme(savedTheme);
    applyTheme(savedTheme);
  }, []);

  const applyTheme = (themeName: string) => {
    const theme = colorThemes.find(t => t.value === themeName);
    if (!theme) return;

    const root = document.documentElement;
    
    // Extract HSL values
    const primaryHSL = theme.primary.match(/\d+/g);
    const backgroundHSL = theme.background.match(/\d+/g);
    const accentHSL = theme.accent.match(/\d+/g);

    if (primaryHSL && backgroundHSL && accentHSL) {
      root.style.setProperty('--primary', `${primaryHSL[0]} ${primaryHSL[1]}% ${primaryHSL[2]}%`);
      root.style.setProperty('--background', `${backgroundHSL[0]} ${backgroundHSL[1]}% ${backgroundHSL[2]}%`);
      root.style.setProperty('--accent', `${accentHSL[0]} ${accentHSL[1]}% ${accentHSL[2]}%`);
      root.style.setProperty('--niger-primary', `${primaryHSL[0]} ${primaryHSL[1]}% ${primaryHSL[2]}%`);
      root.style.setProperty('--niger-accent', `${accentHSL[0]} ${accentHSL[1]}% ${accentHSL[2]}%`);
    }
  };

  const handleThemeChange = (themeName: string) => {
    setCurrentTheme(themeName);
    applyTheme(themeName);
    localStorage.setItem('theme-color', themeName);
    setIsOpen(false);
  };

  const currentThemeData = colorThemes.find(t => t.value === currentTheme);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="theme-switcher-btn">
          <Palette className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Thème</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-4 bg-card/95 backdrop-blur-sm border border-border/50">
        <div className="space-y-3">
          <h3 className="font-semibold text-sm text-foreground">Couleurs du thème</h3>
          <div className="grid gap-2">
            {colorThemes.map((theme) => (
              <button
                key={theme.value}
                onClick={() => handleThemeChange(theme.value)}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-all duration-200 w-full text-left"
              >
                <div className="flex gap-1">
                  <div 
                    className="w-4 h-4 rounded-full border border-border/30"
                    style={{ backgroundColor: theme.primary }}
                  />
                  <div 
                    className="w-4 h-4 rounded-full border border-border/30"
                    style={{ backgroundColor: theme.background }}
                  />
                  <div 
                    className="w-4 h-4 rounded-full border border-border/30"
                    style={{ backgroundColor: theme.accent }}
                  />
                </div>
                <span className="text-sm font-medium flex-1">{theme.name}</span>
                {currentTheme === theme.value && (
                  <Check className="w-4 h-4 text-primary" />
                )}
              </button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ThemeColorSwitcher;