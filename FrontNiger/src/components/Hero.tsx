import { Button } from "@/components/ui/button";
import { Search, Upload, User } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative bg-hero bg-cover bg-center py-24 px-4 overflow-hidden">
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-br from-background/95 via-background/85 to-background/75 backdrop-blur-sm"></div>

      {/* Animated gradient overlay */}
      <div className="absolute inset-0 floating-gradient opacity-30"></div>

      <div className="relative max-w-4xl mx-auto text-center hero-content z-10">
        {/* Main Heading */}
        <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 gradient-text">
          Niger Savoir+
        </h1>

        {/* Subtitle */}
        <p className="text-xl md:text-3xl text-foreground/90 mb-4 font-semibold">
          Partage de savoir entre élèves et étudiants du Niger
        </p>

        {/* Description */}
        <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
          Accédez facilement aux cours, devoirs et examens passés. Partagez vos
          documents pour aider la communauté étudiante nigérienne.
        </p>

        {/* Call-to-Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 stagger-animation">
          <Button
            size="lg"
            className="w-full sm:w-auto button-hover shadow-xl"
            asChild
            style={{ "--stagger-delay": "0" } as any}
          >
            <Link to="/search">
              <Search className="w-5 h-5 mr-2" />
              Explorer les documents
            </Link>
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="w-full sm:w-auto button-hover glass-card"
            asChild
            style={{ "--stagger-delay": "1" } as any}
          >
            <Link to="/upload">
              <Upload className="w-5 h-5 mr-2" />
              Publier un sujet
            </Link>
          </Button>

          <Button
            variant="secondary"
            size="lg"
            className="w-full sm:w-auto button-hover shadow-lg"
            asChild
            style={{ "--stagger-delay": "2" } as any}
          >
            <Link to="/register">
              <User className="w-5 h-5 mr-2" />
              Créer un compte
            </Link>
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto stagger-animation">
          <div
            className="glass-card text-center rounded-xl p-8 premium-card"
            style={{ "--stagger-delay": "0" } as any}
          >
            <div className="text-4xl font-bold gradient-text mb-2">1,250+</div>
            <div className="text-muted-foreground font-medium">
              Documents partagés
            </div>
          </div>
          <div
            className="glass-card text-center rounded-xl p-8 premium-card"
            style={{ "--stagger-delay": "1" } as any}
          >
            <div className="text-4xl font-bold gradient-text mb-2">15+</div>
            <div className="text-muted-foreground font-medium">
              Écoles partenaires
            </div>
          </div>
          <div
            className="glass-card text-center rounded-xl p-8 premium-card"
            style={{ "--stagger-delay": "2" } as any}
          >
            <div className="text-4xl font-bold gradient-text mb-2">3,400+</div>
            <div className="text-muted-foreground font-medium">
              Étudiants actifs
            </div>
          </div>
        </div>
      </div>

      {/* Background decoration - Enhanced */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse float"></div>
        <div
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse float"
          style={{ animationDelay: "2s" }}
        ></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-3xl animate-pulse"></div>
      </div>
    </section>
  );
};

export default Hero;
