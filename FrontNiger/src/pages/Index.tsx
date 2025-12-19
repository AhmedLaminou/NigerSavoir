import Header from '@/components/Header';
import Hero from '@/components/Hero';
import KnowledgeFlow from '@/components/FeaturedSubjects';
import NetworkSection from '@/components/RegionFilter';
import { Link } from 'react-router-dom';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero - Identity section */}
      <Hero />
      
      {/* Knowledge Flow - Documents as stream */}
      <KnowledgeFlow />
      
      {/* Network - Regions with quiet indicators */}
      <NetworkSection />
      
      {/* Footer - Institutional, calm */}
      <footer className="border-t border-border py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 bg-primary rounded flex items-center justify-center">
                  <span className="text-primary-foreground font-serif font-semibold text-sm">NS</span>
                </div>
                <span className="font-serif font-semibold text-foreground">Niger Savoir+</span>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-sm">
                Archive collective du savoir étudiant nigérien. 
                Une ressource pérenne pour les générations présentes et futures.
              </p>
            </div>
            
            {/* Navigation */}
            <div>
              <h4 className="font-medium text-foreground mb-4 text-sm">Navigation</h4>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <Link to="/search" className="text-muted-foreground hover:text-foreground transition-colors">
                    Documents
                  </Link>
                </li>
                <li>
                  <Link to="/upload" className="text-muted-foreground hover:text-foreground transition-colors">
                    Contribuer
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                    À propos
                  </Link>
                </li>
              </ul>
            </div>
            
            {/* Contact */}
            <div>
              <h4 className="font-medium text-foreground mb-4 text-sm">Contact</h4>
              <ul className="space-y-2.5 text-sm text-muted-foreground">
                <li>contact@nigersavoir.ne</li>
                <li>Niamey, Niger</li>
              </ul>
            </div>
          </div>
          
          {/* Bottom bar */}
          <div className="border-t border-border mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Niger Savoir+
            </p>
            <p className="text-xs text-muted-foreground/60">
              Pour le savoir, par le savoir
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
