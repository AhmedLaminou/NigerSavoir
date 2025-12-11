import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Book } from 'lucide-react';
import { Link } from 'react-router-dom';

const subjects = [
  { name: 'Mathématiques', count: 324, color: 'bg-blue-100 text-blue-800 border-blue-200' },
  { name: 'Sciences de la Vie et de la Terre', count: 256, color: 'bg-green-100 text-green-800 border-green-200' },
  { name: 'Philosophie', count: 189, color: 'bg-purple-100 text-purple-800 border-purple-200' },
  { name: 'Histoire-Géographie', count: 167, color: 'bg-orange-100 text-orange-800 border-orange-200' },
  { name: 'Physique-Chimie', count: 198, color: 'bg-red-100 text-red-800 border-red-200' },
  { name: 'Économie', count: 143, color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  { name: 'Droit', count: 98, color: 'bg-indigo-100 text-indigo-800 border-indigo-200' },
  { name: 'Informatique', count: 156, color: 'bg-cyan-100 text-cyan-800 border-cyan-200' },
];

const FeaturedSubjects = () => {
  return (
    <section className="relative py-20 px-4 bg-pattern">
      {/* Overlay for better readability */}
      <div className="absolute inset-0 bg-background/90"></div>
      
      <div className="relative max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4 gradient-text">
            Matières populaires
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Découvrez les documents les plus consultés par domaine d'étude
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 stagger-animation">
          {subjects.map((subject, index) => (
            <Link 
              key={index} 
              to={`/search?subject=${encodeURIComponent(subject.name)}`}
              className="group"
              style={{'--stagger-delay': index} as any}
            >
              <Card className="premium-card card-3d h-full cursor-pointer border-2 hover:border-primary/50">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center group-hover:from-primary/30 group-hover:to-accent/30 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                    <Book className="w-8 h-8 text-primary" />
                  </div>
                  
                  <h3 className="font-semibold text-foreground mb-3 text-sm leading-tight min-h-[40px] flex items-center justify-center">
                    {subject.name}
                  </h3>
                  
                  <Badge variant="secondary" className={`${subject.color} text-xs shadow-sm`}>
                    {subject.count} documents
                  </Badge>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link 
            to="/search" 
            className="inline-flex items-center text-primary hover:text-primary/80 font-semibold text-lg group"
          >
            Voir toutes les matières 
            <span className="ml-2 group-hover:translate-x-2 transition-transform">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedSubjects;