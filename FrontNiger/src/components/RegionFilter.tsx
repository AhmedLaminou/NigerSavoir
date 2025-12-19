import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';

const regions = [
  { name: 'Niamey', description: 'Capitale', activity: 'high' },
  { name: 'Zinder', description: 'Est', activity: 'medium' },
  { name: 'Maradi', description: 'Centre-Sud', activity: 'medium' },
  { name: 'Tahoua', description: 'Centre', activity: 'low' },
];

const NetworkSection = () => {
  const getActivityIndicator = (activity: string) => {
    switch (activity) {
      case 'high':
        return 'bg-niger-sage';
      case 'medium':
        return 'bg-niger-gold/60';
      default:
        return 'bg-muted-foreground/30';
    }
  };

  return (
    <section className="py-16 md:py-24 px-6 bg-secondary/30">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="mb-12">
          <h2 className="text-2xl md:text-3xl font-serif font-semibold text-foreground mb-3">
            Réseau académique
          </h2>
          <p className="text-muted-foreground max-w-xl">
            Contributions par région. Le savoir se construit partout au Niger.
          </p>
        </div>

        {/* Regions Grid - Quiet indicators */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {regions.map((region, index) => (
            <Link
              key={index}
              to={`/search?region=${encodeURIComponent(region.name)}`}
              className="group bg-card border border-border rounded-md p-5 hover:border-primary/30 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span
                  className={`w-2 h-2 rounded-full ${getActivityIndicator(region.activity)}`}
                  title={`Activité ${region.activity === 'high' ? 'élevée' : region.activity === 'medium' ? 'moyenne' : 'modérée'}`}
                />
              </div>
              <h3 className="font-medium text-foreground group-hover:text-primary transition-colors">
                {region.name}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {region.description}
              </p>
            </Link>
          ))}
        </div>

        {/* Subtle link */}
        <div className="mt-8 text-center">
          <Link
            to="/networking"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Voir le réseau complet →
          </Link>
        </div>
      </div>
    </section>
  );
};

export default NetworkSection;