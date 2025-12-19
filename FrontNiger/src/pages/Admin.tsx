import { useMemo, useState } from 'react';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery } from '@tanstack/react-query';
import { api, ApiError, type AdminDashboardResponse } from '@/lib/api';
import { getAuthUser, isLoggedIn } from '@/lib/auth';
import { 
  Users, 
  FileText, 
  TrendingUp, 
  Shield, 
  Search,
  Download,
  Eye
} from 'lucide-react';

const Admin = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const authUser = getAuthUser();
  const canAccess = isLoggedIn() && authUser?.role === 'ADMIN';

  const dashboardQuery = useQuery({
    queryKey: ['admin', 'dashboard'],
    queryFn: () => api.admin.dashboard(),
    enabled: canAccess,
  });

  const dashboard: AdminDashboardResponse | null = dashboardQuery.data || null;

  const errorMessage = useMemo(() => {
    if (!dashboardQuery.error) return null;
    const err = dashboardQuery.error;
    if (err instanceof ApiError) {
      if (typeof err.payload === 'object' && err.payload && 'error' in err.payload) {
        return String((err.payload as any).error);
      }
      return `Erreur API (${err.status})`;
    }
    return "Erreur lors du chargement de l'administration";
  }, [dashboardQuery.error]);

  const stats = dashboard?.stats;
  const recentDocuments = dashboard?.recentDocuments || [];
  const recentUsers = dashboard?.recentUsers || [];

  const adminDocumentsQuery = useQuery({
    queryKey: ['admin', 'documents'],
    queryFn: () => api.admin.documents(),
    enabled: canAccess,
  });

  const adminUsersQuery = useQuery({
    queryKey: ['admin', 'users'],
    queryFn: () => api.admin.users(),
    enabled: canAccess,
  });

  const adminOrdersQuery = useQuery({
    queryKey: ['admin', 'orders'],
    queryFn: () => api.admin.orders(),
    enabled: canAccess,
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header - Institutional */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-5 h-5 text-primary" />
            <h1 className="text-2xl md:text-3xl font-serif font-semibold text-foreground">
              Administration
            </h1>
          </div>
          <p className="text-muted-foreground">
            Gestion de la plateforme Niger Savoir+
          </p>
        </div>

        {/* Access Denied */}
        {!canAccess && (
          <div className="bg-card border border-border rounded-md p-8 text-center">
            <Shield className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground">
              Accès refusé. Connexion avec un compte administrateur requise.
            </p>
          </div>
        )}

        {/* Error Message */}
        {canAccess && errorMessage && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-md p-4 mb-8">
            <p className="text-destructive text-sm">{errorMessage}</p>
          </div>
        )}

        {/* Stats Overview - Clean, institutional */}
        {canAccess && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <div className="admin-stat-card">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-5 h-5 text-muted-foreground" />
            </div>
            <p className="stat-value">{(stats?.totalUsers || 0).toLocaleString()}</p>
            <p className="stat-label">Utilisateurs</p>
          </div>

          <div className="admin-stat-card">
            <div className="flex items-center justify-between mb-2">
              <FileText className="w-5 h-5 text-muted-foreground" />
            </div>
            <p className="stat-value">{(stats?.totalDocuments || 0).toLocaleString()}</p>
            <p className="stat-label">Documents</p>
          </div>

          <div className="admin-stat-card">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-5 h-5 text-muted-foreground" />
            </div>
            <p className="stat-value">{stats?.recentUploads || 0}</p>
            <p className="stat-label">Uploads (7j)</p>
          </div>

          <div className="admin-stat-card">
            <div className="flex items-center justify-between mb-2">
              <FileText className="w-5 h-5 text-muted-foreground" />
            </div>
            <p className="stat-value">{stats?.totalOrders || 0}</p>
            <p className="stat-label">Commandes</p>
          </div>
        </div>
        )}

        {/* Main Content - Clean tabs */}
        {canAccess && (
        <Tabs defaultValue="documents" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4 bg-secondary/50">
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="users">Utilisateurs</TabsTrigger>
            <TabsTrigger value="orders">Commandes</TabsTrigger>
            <TabsTrigger value="settings">Paramètres</TabsTrigger>
          </TabsList>

          {/* Documents Tab */}
          <TabsContent value="documents" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-foreground">Documents</h2>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Rechercher..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 h-9"
                />
              </div>
            </div>

            <div className="border border-border rounded-md overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-secondary/50">
                  <tr>
                    <th className="text-left p-3 font-medium text-muted-foreground">Titre</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Matière</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Niveau</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Date</th>
                    <th className="text-right p-3 font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {(adminDocumentsQuery.data || recentDocuments)
                    .filter((doc) => {
                      if (!searchTerm) return true;
                      const q = searchTerm.toLowerCase();
                      return (
                        doc.title?.toLowerCase?.().includes(q) ||
                        doc.subject?.toLowerCase?.().includes(q) ||
                        doc.level?.toLowerCase?.().includes(q)
                      );
                    })
                    .map((doc) => (
                    <tr key={doc.id} className="admin-table-row">
                      <td className="p-3">
                        <span className="font-medium text-foreground">{doc.title}</span>
                      </td>
                      <td className="p-3 text-muted-foreground">{doc.subject}</td>
                      <td className="p-3 text-muted-foreground">{doc.level}</td>
                      <td className="p-3 text-muted-foreground time-indicator">
                        {'uploadDate' in doc ? (doc as any).uploadDate : '—'}
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <h2 className="text-lg font-medium text-foreground">Utilisateurs</h2>

            <div className="border border-border rounded-md overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-secondary/50">
                  <tr>
                    <th className="text-left p-3 font-medium text-muted-foreground">Nom</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Email</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Région</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Uploads</th>
                  </tr>
                </thead>
                <tbody>
                  {(adminUsersQuery.data || recentUsers).map((user) => (
                    <tr key={user.id} className="admin-table-row">
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                            <Users className="w-4 h-4 text-muted-foreground" />
                          </div>
                          <span className="font-medium text-foreground">{user.name}</span>
                        </div>
                      </td>
                      <td className="p-3 text-muted-foreground">{user.email}</td>
                      <td className="p-3 text-muted-foreground">{user.region}</td>
                      <td className="p-3 text-muted-foreground tabular-nums">{user.uploads}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <h2 className="text-lg font-medium text-foreground">Commandes</h2>

            <div className="border border-border rounded-md overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-secondary/50">
                  <tr>
                    <th className="text-left p-3 font-medium text-muted-foreground">ID</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Client</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Articles</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Montant</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {(adminOrdersQuery.data || []).map((o) => (
                    <tr key={o.id} className="admin-table-row">
                      <td className="p-3 font-medium text-foreground">#{o.id}</td>
                      <td className="p-3 text-muted-foreground">{o.userEmail}</td>
                      <td className="p-3 text-muted-foreground tabular-nums">{o.itemCount}</td>
                      <td className="p-3 font-medium text-foreground tabular-nums">
                        {Number(o.totalAmount).toLocaleString()} FCFA
                      </td>
                      <td className="p-3">
                        <span className="quiet-badge">{o.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-8">
            <h2 className="text-lg font-medium text-foreground">Paramètres</h2>

            <div className="space-y-8 max-w-xl">
              <div>
                <h3 className="text-sm font-medium text-foreground mb-4">Modération</h3>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" className="rounded border-border" defaultChecked />
                    <span className="text-sm text-muted-foreground">Détection automatique de contenu inapproprié</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" className="rounded border-border" defaultChecked />
                    <span className="text-sm text-muted-foreground">Approbation manuelle des nouveaux comptes</span>
                  </label>
                </div>
              </div>
              
              <div className="border-t border-border pt-8">
                <h3 className="text-sm font-medium text-foreground mb-4">Limites</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm text-muted-foreground">Taille max fichier (MB)</label>
                    <Input type="number" defaultValue="50" className="h-10" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-muted-foreground">Uploads / jour / user</label>
                    <Input type="number" defaultValue="10" className="h-10" />
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        )}
      </div>
    </div>
  );
};

export default Admin;