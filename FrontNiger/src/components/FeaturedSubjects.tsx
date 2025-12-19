import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const subjects = [
  { name: 'Mathématiques', count: 324 },
  { name: 'SVT', count: 256 },
  { name: 'Philosophie', count: 189 },
  { name: 'Histoire-Géographie', count: 167 },
  { name: 'Physique-Chimie', count: 198 },
  { name: 'Économie', count: 143 },
];

const KnowledgeFlow = () => {
  return (
    <section className="py-16 md:py-24 px-6 border-t border-border">
      <div className="max-w-6xl mx-auto">
        {/* Section Header - Calm, purposeful */}
        <div className="mb-12">
          <h2 className="text-2xl md:text-3xl font-serif font-semibold text-foreground mb-3">
            Flux de connaissances
          </h2>
          <p className="text-muted-foreground max-w-xl">
            Documents organisés par discipline, accumulés au fil des années.
          </p>
        </div>

        {/* Knowledge Stream - Timeline/flow visualization */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-1">
          {subjects.map((subject, index) => (
            <Link
              key={index}
              to={`/search?subject=${encodeURIComponent(subject.name)}`}
              className="knowledge-item group"
            >
              <div className="flex items-baseline justify-between">
                <h3 className="text-foreground font-medium group-hover:text-primary transition-colors">
                  {subject.name}
                </h3>
                <span className="text-sm text-muted-foreground tabular-nums">
                  {subject.count}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                documents disponibles
              </p>
            </Link>
          ))}
        </div>

        {/* Subtle link to all */}
        <div className="mt-12 pt-8 border-t border-border">
          <Link
            to="/search"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Explorer toutes les matières
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default KnowledgeFlow;