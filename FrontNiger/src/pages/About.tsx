import Header from '@/components/Header';
import { BookOpen, Users, MapPin } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="max-w-3xl mx-auto px-6 py-16">
        {/* Header - Institutional */}
        <div className="mb-16">
          <h1 className="text-3xl md:text-4xl font-serif font-semibold text-foreground mb-4">
            À propos
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Niger Savoir+ est une archive collective du savoir étudiant nigérien, 
            construite par et pour les étudiants du Niger.
          </p>
        </div>

        {/* Mission */}
        <section className="mb-16">
          <h2 className="text-xl font-serif font-semibold text-foreground mb-4">
            Notre mission
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Démocratiser l'accès aux ressources éducatives au Niger. Chaque élève et étudiant 
            mérite d'avoir accès aux documents d'apprentissage, peu importe son école ou sa région.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Cette plateforme est conçue pour durer — un bien commun intellectuel qui se transmet 
            de génération en génération.
          </p>
        </section>

        {/* Values */}
        <section className="mb-16">
          <h2 className="text-xl font-serif font-semibold text-foreground mb-6">
            Ce que nous offrons
          </h2>
          <div className="space-y-6">
            <div className="flex gap-4">
              <BookOpen className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-foreground mb-1">Archive documentaire</h3>
                <p className="text-sm text-muted-foreground">
                  Cours, devoirs, examens et sujets de baccalauréat du collège à l'université.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <Users className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-foreground mb-1">Réseau académique</h3>
                <p className="text-sm text-muted-foreground">
                  Collaboration entre élèves de différentes écoles et régions du Niger.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <MapPin className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-foreground mb-1">Couverture nationale</h3>
                <p className="text-sm text-muted-foreground">
                  Documents de toutes les régions : Niamey, Zinder, Maradi, Tahoua, et plus.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Schools */}
        <section className="mb-16">
          <h2 className="text-xl font-serif font-semibold text-foreground mb-6">
            Établissements représentés
          </h2>
          <div className="grid grid-cols-2 gap-3 text-sm text-muted-foreground">
            {[
              'Lycée La Fontaine',
              'Université Abdou Moumouni',
              'Lycée Issa Béri',
              'Collège Mariama',
              'Université de Niamey',
              'Lycée Bosso',
              'Lycée Issa Korombé',
              'Collège CEG1'
            ].map((school, index) => (
              <span key={index}>{school}</span>
            ))}
          </div>
        </section>

        {/* Contact */}
        <section className="pt-8 border-t border-border">
          <h2 className="text-xl font-serif font-semibold text-foreground mb-4">
            Contact
          </h2>
          <p className="text-muted-foreground">
            contact@nigersavoir.ne
          </p>
        </section>
      </div>
    </div>
  );
};

export default About;