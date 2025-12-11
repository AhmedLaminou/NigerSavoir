import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Upload, Download, Edit, Settings } from 'lucide-react';
import Header from '@/components/Header';

// Mock user data
const userData = {
  name: "Aminata Diallo",
  email: "aminata.diallo@email.com",
  region: "Niamey",
  school: "Lycée La Fontaine",
  avatar: "/placeholder.svg",
  initials: "AD",
  joinDate: "Janvier 2024",
  totalUploads: 12,
  totalDownloads: 45,
  contributionScore: 156
};

// Mock uploaded documents
const uploadedDocuments = [
  {
    id: 1,
    title: "Sujet de Mathématiques - Baccalauréat 2023",
    subject: "Mathématiques",
    level: "Terminale C",
    uploadDate: "2024-01-15",
    downloads: 23,
    status: "Publié"
  },
  {
    id: 2,
    title: "Cours de Philosophie - Introduction à la logique",
    subject: "Philosophie",
    level: "Terminale A",
    uploadDate: "2024-01-10",
    downloads: 18,
    status: "En révision"
  },
  {
    id: 3,
    title: "Devoir de SVT - Génétique et hérédité",
    subject: "SVT",
    level: "Première D",
    uploadDate: "2024-01-08",
    downloads: 31,
    status: "Publié"
  }
];

const Profile = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <Avatar className="w-24 h-24">
                <AvatarImage src={userData.avatar} />
                <AvatarFallback className="text-2xl">
                  {userData.initials}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-2xl font-bold text-foreground mb-2">
                  {userData.name}
                </h1>
                <p className="text-muted-foreground mb-2">{userData.email}</p>
                <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-4">
                  <Badge variant="outline">{userData.school}</Badge>
                  <Badge variant="outline">{userData.region}</Badge>
                  <Badge variant="secondary">Membre depuis {userData.joinDate}</Badge>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-md mx-auto md:mx-0">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{userData.totalUploads}</div>
                    <div className="text-sm text-muted-foreground">Documents publiés</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-accent">{userData.totalDownloads}</div>
                    <div className="text-sm text-muted-foreground">Téléchargements</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-niger-success">{userData.contributionScore}</div>
                    <div className="text-sm text-muted-foreground">Score de contribution</div>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Edit className="w-4 h-4 mr-2" />
                  Modifier
                </Button>
                <Button variant="outline" size="sm">
                  <Settings className="w-4 h-4 mr-2" />
                  Paramètres
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="uploads">Mes documents</TabsTrigger>
            <TabsTrigger value="activity">Activité</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="w-5 h-5" />
                    Activité récente
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Document téléchargé</p>
                        <p className="text-xs text-muted-foreground">Sujet de Mathématiques - il y a 2 jours</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-accent rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Profil mis à jour</p>
                        <p className="text-xs text-muted-foreground">Photo de profil modifiée - il y a 5 jours</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-niger-success rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Nouveau badge</p>
                        <p className="text-xs text-muted-foreground">Contributeur actif - il y a 1 semaine</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Statistics */}
              <Card>
                <CardHeader>
                  <CardTitle>Statistiques</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Documents publiés ce mois</span>
                      <span className="font-medium">3</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Téléchargements ce mois</span>
                      <span className="font-medium">15</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Matière la plus populaire</span>
                      <span className="font-medium">Mathématiques</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Note moyenne</span>
                      <span className="font-medium">4.8/5</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="uploads" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Mes documents ({uploadedDocuments.length})</h3>
              <Button>
                <Upload className="w-4 h-4 mr-2" />
                Nouveau document
              </Button>
            </div>

            <div className="grid gap-4">
              {uploadedDocuments.map((doc) => (
                <Card key={doc.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-foreground">{doc.title}</h4>
                        <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                          <span>{doc.subject} • {doc.level}</span>
                          <span>Publié le {doc.uploadDate}</span>
                          <span>{doc.downloads} téléchargements</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant={doc.status === 'Publié' ? 'default' : 'secondary'}
                        >
                          {doc.status}
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Historique d'activité</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((item) => (
                    <div key={item} className="flex items-center gap-4 p-3 border border-border rounded-lg">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <Download className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">Document téléchargé</p>
                        <p className="text-sm text-muted-foreground">
                          Cours de Philosophie - Introduction à la logique
                        </p>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Il y a {item} jour{item > 1 ? 's' : ''}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;