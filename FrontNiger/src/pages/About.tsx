import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, BookOpen, Award, Target, Heart, Globe } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            À propos de Niger Savoir+
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Plateforme collaborative dédiée au partage de connaissances entre élèves et étudiants du Niger
          </p>
        </div>

        {/* Mission Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                Notre Mission
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                Niger Savoir+ a pour mission de démocratiser l'accès aux ressources éducatives au Niger. 
                Nous croyons que chaque élève et étudiant mérite d'avoir accès aux meilleurs documents 
                d'apprentissage, peu importe son école ou sa région.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-primary" />
                Notre Vision
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                Créer un écosystème éducatif collaboratif où les connaissances sont partagées librement, 
                favorisant l'excellence académique et l'entraide entre la jeunesse nigérienne.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Features Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">Ce que nous offrons</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="text-center">
              <CardContent className="pt-6">
                <BookOpen className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Bibliothèque complète</h3>
                <p className="text-sm text-muted-foreground">
                  Cours, devoirs, examens et sujets de baccalauréat de la 3ème à l'université
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <Users className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Communauté active</h3>
                <p className="text-sm text-muted-foreground">
                  Partage et collaboration entre élèves de différentes écoles du Niger
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <Award className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Qualité vérifiée</h3>
                <p className="text-sm text-muted-foreground">
                  Documents vérifiés et organisés par matière, niveau et établissement
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Schools Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">Écoles partenaires</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
              <Badge key={index} variant="outline" className="p-3 text-center justify-center">
                {school}
              </Badge>
            ))}
          </div>
        </div>

        {/* Regions Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">Régions couvertes</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              'Niamey',
              'Zinder',
              'Maradi',
              'Dosso',
              'Tahoua',
              'Agadez',
              'Tillabéri',
              'Diffa'
            ].map((region, index) => (
              <Badge key={index} variant="secondary" className="p-2">
                <Globe className="w-3 h-3 mr-1" />
                {region}
              </Badge>
            ))}
          </div>
        </div>

        {/* Statistics */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">En chiffres</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">500+</div>
              <div className="text-sm text-muted-foreground">Documents partagés</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">200+</div>
              <div className="text-sm text-muted-foreground">Étudiants actifs</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">15+</div>
              <div className="text-sm text-muted-foreground">Matières couvertes</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">8</div>
              <div className="text-sm text-muted-foreground">Régions du Niger</div>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center">L'équipe</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-4">
              <img 
                src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=150&h=150&fit=crop&crop=face" 
                alt="Équipe Niger Savoir+"
                className="w-24 h-24 rounded-full mx-auto object-cover"
              />
              <div>
                <h3 className="font-semibold text-lg">Équipe Niger Savoir+</h3>
                <p className="text-muted-foreground">
                  Une équipe passionnée d'éducateurs et de développeurs nigériens, 
                  dédiée à l'amélioration de l'accès à l'éducation au Niger.
                </p>
              </div>
              <div className="text-sm text-muted-foreground">
                "L'éducation est l'arme la plus puissante pour changer le monde" - Nelson Mandela
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Section */}
        <div className="text-center mt-12 p-6 bg-muted rounded-lg">
          <h3 className="font-semibold mb-2">Rejoignez-nous !</h3>
          <p className="text-muted-foreground mb-4">
            Vous voulez contribuer à Niger Savoir+ ? Contactez-nous pour devenir partenaire ou bénévole.
          </p>
          <div className="text-sm text-muted-foreground">
            Email: contact@nigersavoir.ne | Téléphone: +227 XX XX XX XX
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;