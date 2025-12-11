import Header from '@/components/Header';
import Hero from '@/components/Hero';
import FeaturedSubjects from '@/components/FeaturedSubjects';
import RegionFilter from '@/components/RegionFilter';

const Index = () => {
  return (
    <div className="min-h-screen bg-background bg-pattern">
      <div className="absolute inset-0 bg-background/95"></div>
      <div className="relative">
      <Header />
      <Hero />
      <FeaturedSubjects />
      <RegionFilter />
      
      {/* Footer */}
      <footer className="bg-card border-t border-border py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm">NS+</span>
                </div>
                <span className="font-bold text-foreground">Niger Savoir+</span>
              </div>
              <p className="text-muted-foreground text-sm">
                Plateforme collaborative pour le partage de savoir entre élèves et étudiants du Niger.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-foreground mb-3">Navigation</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="/search" className="hover:text-primary transition-colors">Documents</a></li>
                <li><a href="/upload" className="hover:text-primary transition-colors">Publier</a></li>
                <li><a href="/register" className="hover:text-primary transition-colors">Créer un compte</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-foreground mb-3">Matières</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="/search?subject=Mathématiques" className="hover:text-primary transition-colors">Mathématiques</a></li>
                <li><a href="/search?subject=SVT" className="hover:text-primary transition-colors">SVT</a></li>
                <li><a href="/search?subject=Philosophie" className="hover:text-primary transition-colors">Philosophie</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-foreground mb-3">Contact</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>contact@nigersavoir.ne</li>
                <li>+227 XX XX XX XX</li>
                <li>Niamey, Niger</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 Niger Savoir+. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
      </div>
    </div>
  );
};

export default Index;
