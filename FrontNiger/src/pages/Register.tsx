import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, Mail, Lock, MapPin } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { useToast } from '@/hooks/use-toast';
import { api, ApiError, type School as SchoolModel } from '@/lib/api';
import { setAuthToken, setAuthUser } from '@/lib/auth';

const Register = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    city: '',
    password: '',
    confirmPassword: '',
    region: '',
    grade: '',
    school: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [schools, setSchools] = useState<SchoolModel[]>([]);
  const [schoolsLoading, setSchoolsLoading] = useState(false);

  const regions = ['Niamey', 'Zinder', 'Maradi', 'Dosso', 'Tahoua', 'Agadez', 'Tillabéri', 'Diffa'];
  const grades = ['6ème', '5ème', '4ème', '3ème', '2nde', '1ère', 'Terminale', 'Licence 1', 'Licence 2', 'Licence 3', 'Master'];

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setSchoolsLoading(true);
      try {
        const list = await api.schools.list({ region: formData.region || undefined });
        if (!cancelled) setSchools(list);
      } catch {
        if (!cancelled) setSchools([]);
      } finally {
        if (!cancelled) setSchoolsLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [formData.region]);

  const selectedSchoolId = useMemo(() => {
    if (!formData.school) return null;
    const parsed = Number(formData.school);
    return Number.isFinite(parsed) ? parsed : null;
  }, [formData.school]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.city.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez renseigner votre ville.",
        variant: "destructive"
      });
      return;
    }

    if (!formData.region) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner votre région.",
        variant: "destructive"
      });
      return;
    }

    if (!formData.grade) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner votre classe/niveau (grade).",
        variant: "destructive"
      });
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Erreur",
        description: "Les mots de passe ne correspondent pas.",
        variant: "destructive"
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: "Erreur",
        description: "Le mot de passe doit contenir au moins 6 caractères.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const res = await api.auth.register({
        name: formData.fullName,
        email: formData.email,
        password: formData.password,
        city: formData.city,
        region: formData.region,
        grade: formData.grade,
        schoolId: selectedSchoolId,
      });

      setAuthToken(res.token);
      setAuthUser({ email: res.email, name: res.name, role: res.role });

      toast({
        title: "Compte créé avec succès !",
        description: `Bienvenue ${res.name}`,
      });
      navigate('/');
    } catch (err) {
      const message =
        err instanceof ApiError
          ? (typeof err.payload === 'object' && err.payload && 'error' in err.payload
              ? String((err.payload as any).error)
              : "Impossible de créer le compte")
          : "Impossible de créer le compte";
      toast({
        title: "Erreur",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="max-w-md mx-auto px-6 py-12">
        {/* Header - Clean, institutional */}
        <div className="text-center mb-10">
          <h1 className="text-2xl font-serif font-semibold text-foreground mb-2">
            Créer un compte
          </h1>
          <p className="text-muted-foreground text-sm">
            Rejoignez l'archive du savoir nigérien
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-sm font-medium">Nom complet</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                id="fullName"
                type="text"
                value={formData.fullName}
                onChange={(e) => updateFormData('fullName', e.target.value)}
                placeholder="Prénom Nom"
                className="pl-10 h-11"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">Adresse email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => updateFormData('email', e.target.value)}
                placeholder="votre@email.com"
                className="pl-10 h-11"
                required
              />
            </div>
          </div>

          {/* City */}
          <div className="space-y-2">
            <Label htmlFor="city" className="text-sm font-medium">Ville</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                id="city"
                type="text"
                value={formData.city}
                onChange={(e) => updateFormData('city', e.target.value)}
                placeholder="Niamey"
                className="pl-10 h-11"
                required
              />
            </div>
          </div>

          {/* Region and Grade */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Région</Label>
              <Select value={formData.region} onValueChange={(value) => updateFormData('region', value)}>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Région" />
                </SelectTrigger>
                <SelectContent>
                  {regions.map(region => (
                    <SelectItem key={region} value={region}>{region}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Niveau</Label>
              <Select value={formData.grade} onValueChange={(value) => updateFormData('grade', value)}>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Classe" />
                </SelectTrigger>
                <SelectContent>
                  {grades.map(g => (
                    <SelectItem key={g} value={g}>{g}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* School */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">École (optionnel)</Label>
            <Select value={formData.school} onValueChange={(value) => updateFormData('school', value)}>
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Sélectionner une école" />
              </SelectTrigger>
              <SelectContent>
                {schoolsLoading && (
                  <SelectItem value="loading" disabled>Chargement...</SelectItem>
                )}
                {!schoolsLoading && schools.length === 0 && (
                  <SelectItem value="none" disabled>Aucune école</SelectItem>
                )}
                {schools.map((school) => (
                  <SelectItem key={school.id} value={String(school.id)}>
                    {school.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium">Mot de passe</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => updateFormData('password', e.target.value)}
                placeholder="6 caractères minimum"
                className="pl-10 h-11"
                required
              />
            </div>
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirmer</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => updateFormData('confirmPassword', e.target.value)}
                placeholder="••••••••"
                className="pl-10 h-11"
                required
              />
            </div>
          </div>

          <Button type="submit" className="w-full h-11" disabled={isLoading}>
            {isLoading ? "Création..." : "Créer mon compte"}
          </Button>
        </form>

        {/* Footer link */}
        <div className="mt-8 pt-6 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">
            Déjà un compte ?{' '}
            <Link to="/login" className="text-primary hover:text-primary/80 font-medium">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;