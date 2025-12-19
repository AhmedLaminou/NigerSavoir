import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Lock } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { useToast } from '@/hooks/use-toast';
import { api, ApiError } from '@/lib/api';
import { setAuthToken, setAuthUser } from '@/lib/auth';

const Login = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await api.auth.login({
        email: formData.email,
        password: formData.password,
      });

      setAuthToken(res.token);
      setAuthUser({ email: res.email, name: res.name, role: res.role });

      toast({
        title: "Connexion réussie",
        description: `Bienvenue, ${res.name}`,
      });
      navigate('/');
    } catch (err) {
      const message =
        err instanceof ApiError
          ? (typeof err.payload === 'object' && err.payload && 'error' in err.payload
              ? String((err.payload as any).error)
              : "Identifiants invalides")
          : "Impossible de se connecter";
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
      
      <div className="max-w-sm mx-auto px-6 py-16">
        {/* Header - Clean, institutional */}
        <div className="text-center mb-10">
          <h1 className="text-2xl font-serif font-semibold text-foreground mb-2">
            Connexion
          </h1>
          <p className="text-muted-foreground text-sm">
            Accédez à votre espace Niger Savoir+
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Adresse email
            </Label>
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

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium">
              Mot de passe
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => updateFormData('password', e.target.value)}
                placeholder="••••••••"
                className="pl-10 h-11"
                required
              />
            </div>
          </div>

          <Button type="submit" className="w-full h-11" disabled={isLoading}>
            {isLoading ? "Connexion..." : "Se connecter"}
          </Button>
        </form>

        {/* Footer link */}
        <div className="mt-8 pt-6 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">
            Pas encore de compte ?{' '}
            <Link to="/register" className="text-primary hover:text-primary/80 font-medium">
              S'inscrire
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;