import { useEffect, useMemo, useState } from "react";
import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { api, ApiError } from "@/lib/api";
import { getAuthToken } from "@/lib/auth";
import { Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Networking = () => {
  const navigate = useNavigate();
  const [grade, setGrade] = useState<string>("all");
  const [region, setRegion] = useState<string>("all");
  const [schoolId, setSchoolId] = useState<string>("all");

  const regions = ['Niamey', 'Zinder', 'Maradi', 'Dosso', 'Tahoua', 'Agadez', 'Tillabéri', 'Diffa'];
  const grades = ['6ème', '5ème', '4ème', '3ème', '2nde', '1ère', 'Terminale', 'Licence 1', 'Licence 2', 'Licence 3', 'Master'];

  const meQuery = useQuery({
    queryKey: ["users", "me"],
    queryFn: () => api.users.me(),
    enabled: Boolean(getAuthToken()),
  });

  const schoolsQuery = useQuery({
    queryKey: ["schools", region],
    queryFn: () => api.schools.list({ region: region !== 'all' ? region : undefined }),
  });

  useEffect(() => {
    const me = meQuery.data;
    if (!me) return;
    if (region === 'all' && me.region) setRegion(me.region);
    if (grade === 'all' && me.grade) setGrade(me.grade);
    if (schoolId === 'all' && me.school?.id) setSchoolId(String(me.school.id));
  }, [meQuery.data, region, grade, schoolId]);

  const schoolIdNumber = useMemo(() => {
    const n = Number(schoolId);
    return Number.isFinite(n) && n > 0 ? n : undefined;
  }, [schoolId]);

  const discoverQuery = useQuery({
    queryKey: ["users", "discover", schoolIdNumber, grade, region],
    queryFn: () =>
      api.users.discover({
        schoolId: schoolIdNumber,
        grade: grade !== 'all' ? grade : undefined,
        region: region !== 'all' ? region : undefined,
      }),
    enabled: Boolean(getAuthToken()),
  });

  const errorMessage = useMemo(() => {
    if (!discoverQuery.error) return null;
    const err = discoverQuery.error;
    if (err instanceof ApiError) {
      if (typeof err.payload === 'object' && err.payload && 'error' in err.payload) {
        return String((err.payload as any).error);
      }
      return `Erreur API (${err.status})`;
    }
    return "Erreur lors du chargement";
  }, [discoverQuery.error]);

  if (!getAuthToken()) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-3xl mx-auto px-4 py-8">
          <Card>
            <CardContent className="p-8">
              <div className="text-muted-foreground mb-4">Connectez-vous pour accéder au networking.</div>
              <Button onClick={() => navigate("/login")}>Connexion</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background bg-pattern">
      <div className="absolute inset-0 bg-background/95" />
      <div className="relative">
        <Header />

        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Networking</h1>
              <p className="text-muted-foreground">Trouvez des camarades de votre école et de votre niveau.</p>
            </div>
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
              <Users className="w-4 h-4 mr-1" />
              Communauté
            </Badge>
          </div>

          {meQuery.data && (
            <div className="mb-4 text-sm text-muted-foreground">
              Mon profil: {meQuery.data.school?.name || '—'} • {meQuery.data.grade || '—'} • {meQuery.data.region}
            </div>
          )}

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Filtres</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Select value={region} onValueChange={(v) => {
                setRegion(v);
                setSchoolId('all');
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Région" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les régions</SelectItem>
                  {regions.map((r) => (
                    <SelectItem key={r} value={r}>{r}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={schoolId} onValueChange={setSchoolId}>
                <SelectTrigger>
                  <SelectValue placeholder="École" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les écoles</SelectItem>
                  {(schoolsQuery.data || []).map((s) => (
                    <SelectItem key={String(s.id)} value={String(s.id)}>{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={grade} onValueChange={setGrade}>
                <SelectTrigger>
                  <SelectValue placeholder="Niveau" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les niveaux</SelectItem>
                  {grades.map((g) => (
                    <SelectItem key={g} value={g}>{g}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {errorMessage && (
            <div className="mb-6 text-sm text-destructive">{errorMessage}</div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(discoverQuery.data || []).map((u) => (
              <Card key={u.id} className="premium-card">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="font-semibold text-foreground">{u.name}</div>
                      <div className="text-sm text-muted-foreground">{u.city} • {u.region}</div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {u.schoolName && <Badge variant="outline">{u.schoolName}</Badge>}
                        {u.grade && <Badge variant="secondary">{u.grade}</Badge>}
                      </div>
                    </div>
                    <Button size="sm" variant="outline">Voir profil</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {!discoverQuery.isLoading && (discoverQuery.data || []).length === 0 && (
            <div className="text-center py-12 text-muted-foreground">Aucun utilisateur trouvé.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Networking;
