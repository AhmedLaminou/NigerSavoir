import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative py-20 md:py-32 px-6">
      {/* Subtle geometric pattern - inspired by Nigerien textile motifs */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="african-pattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M30 0L60 30L30 60L0 30Z" fill="none" stroke="currentColor" strokeWidth="0.5"/>
              <circle cx="30" cy="30" r="4" fill="currentColor" opacity="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#african-pattern)"/>
        </svg>
      </div>

      <div className="relative max-w-3xl mx-auto text-center">
        {/* Main Statement - One meaningful sentence */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-semibold text-foreground mb-6 tracking-tight leading-tight">
          La mémoire intellectuelle
          <br />
          <span className="text-primary">du Niger</span>
        </h1>

        {/* Single descriptive line */}
        <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
          Une archive vivante du savoir étudiant, transmise de génération en génération.
        </p>

        {/* One primary action */}
        <div className="flex justify-center">
          <Button size="lg" asChild className="h-12 px-8 text-base">
            <Link to="/search">
              Accéder aux documents
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
