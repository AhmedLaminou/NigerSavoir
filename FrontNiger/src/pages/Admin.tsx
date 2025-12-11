import { useState } from 'react';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  FileText, 
  TrendingUp, 
  Shield, 
  AlertTriangle,
  Download,
  Eye,
  Edit,
  Trash2,
  Search,
  Filter
} from 'lucide-react';

const Admin = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data
  const stats = {
    totalUsers: 1247,
    totalDocuments: 3892,
    recentUploads: 24,
    flaggedContent: 3
  };

  const recentDocuments = [
    {
      id: 1,
      title: "Mathématiques Terminale C - Baccalauréat 2023",
      uploader: "Amadou Ibrahim",
      school: "Lycée La Fontaine",
      subject: "Mathématiques",
      level: "Terminale C",
      uploadDate: "2024-06-13",
      downloads: 234,
      status: "approved"
    },
    {
      id: 2,
      title: "Histoire-Géographie 2nde - Devoir Surveillé",
      uploader: "Fatouma Ali",
      school: "Lycée Issa Béri",
      subject: "Histoire-Géographie",
      level: "2nde",
      uploadDate: "2024-06-12",
      downloads: 89,
      status: "pending"
    },
    {
      id: 3,
      title: "SVT Première - Cours Complet",
      uploader: "Moussa Garba",
      school: "Université Abdou Moumouni",
      subject: "SVT",
      level: "Première",
      uploadDate: "2024-06-11",
      downloads: 156,
      status: "flagged"
    }
  ];

  const recentUsers = [
    {
      id: 1,
      name: "Aisha Moussa",
      email: "aisha.moussa@email.ne",
      school: "Lycée La Fontaine",
      region: "Niamey",
      joinDate: "2024-06-10",
      uploads: 12,
      status: "active"
    },
    {
      id: 2,
      name: "Ibrahim Salou",
      email: "ibrahim.salou@email.ne",
      school: "Université Abdou Moumouni",
      region: "Niamey",
      joinDate: "2024-06-09",
      uploads: 8,
      status: "active"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2 admin-title">
                Panneau d'Administration
              </h1>
              <p className="text-muted-foreground">
                Gérez les utilisateurs, documents et paramètres de Niger Savoir+
              </p>
            </div>
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
              <Shield className="w-4 h-4 mr-1" />
              Admin
            </Badge>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="stats-card">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Utilisateurs</p>
                  <p className="text-2xl font-bold text-foreground">{stats.totalUsers.toLocaleString()}</p>
                </div>
                <Users className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="stats-card">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Documents</p>
                  <p className="text-2xl font-bold text-foreground">{stats.totalDocuments.toLocaleString()}</p>
                </div>
                <FileText className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="stats-card">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Uploads récents</p>
                  <p className="text-2xl font-bold text-foreground">{stats.recentUploads}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-niger-success" />
              </div>
            </CardContent>
          </Card>

          <Card className="stats-card">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Signalements</p>
                  <p className="text-2xl font-bold text-foreground">{stats.flaggedContent}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-niger-warning" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="documents" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="users">Utilisateurs</TabsTrigger>
            <TabsTrigger value="settings">Paramètres</TabsTrigger>
          </TabsList>

          <TabsContent value="documents" className="space-y-6">
            <Card className="admin-card">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Gestion des Documents</span>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Rechercher un document..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-64"
                    />
                    <Button variant="outline" size="icon">
                      <Search className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Filter className="w-4 h-4" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentDocuments.map((doc) => (
                    <div key={doc.id} className="document-item p-4 rounded-lg border border-border bg-card/50">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground mb-1">{doc.title}</h3>
                          <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                            <span>Par {doc.uploader}</span>
                            <span>•</span>
                            <span>{doc.school}</span>
                            <span>•</span>
                            <span>{doc.subject} - {doc.level}</span>
                            <span>•</span>
                            <span>{doc.downloads} téléchargements</span>
                          </div>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge 
                              variant={doc.status === 'approved' ? 'default' : 
                                      doc.status === 'pending' ? 'secondary' : 'destructive'}
                            >
                              {doc.status === 'approved' ? 'Approuvé' : 
                               doc.status === 'pending' ? 'En attente' : 'Signalé'}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              Uploadé le {doc.uploadDate}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card className="admin-card">
              <CardHeader>
                <CardTitle>Gestion des Utilisateurs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentUsers.map((user) => (
                    <div key={user.id} className="user-item p-4 rounded-lg border border-border bg-card/50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                            <Users className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-foreground">{user.name}</h3>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs text-muted-foreground">{user.school}</span>
                              <span>•</span>
                              <span className="text-xs text-muted-foreground">{user.region}</span>
                              <span>•</span>
                              <span className="text-xs text-muted-foreground">{user.uploads} uploads</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-niger-success border-niger-success">
                            Actif
                          </Badge>
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card className="admin-card">
              <CardHeader>
                <CardTitle>Paramètres de la Plateforme</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-3">Modération automatique</h3>
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" defaultChecked />
                        <span className="text-sm">Activer la détection automatique de contenu inapproprié</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" defaultChecked />
                        <span className="text-sm">Exiger une approbation manuelle pour les nouveaux comptes</span>
                      </label>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-3">Limites de stockage</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Taille max par fichier (MB)</label>
                        <Input type="number" defaultValue="50" className="mt-1" />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Uploads par utilisateur/jour</label>
                        <Input type="number" defaultValue="10" className="mt-1" />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;