import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Upload as UploadIcon, FileText } from 'lucide-react';
import Header from '@/components/Header';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import { api, ApiError, type DocumentType } from '@/lib/api';
import { getAuthToken } from '@/lib/auth';
import { useNavigate } from 'react-router-dom';

const Upload = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    level: '',
    schoolId: '',
    region: '',
    year: '',
    type: '' as DocumentType | '',
    comment: '',
    termsAccepted: false
  });
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const subjects = ['Mathématiques', 'SVT', 'Philosophie', 'Histoire-Géographie', 'Physique-Chimie', 'Économie', 'Droit', 'Informatique'];
  const levels = ['3ème', '2nde', '1ère', 'Terminale', 'Licence 1', 'Licence 2', 'Licence 3', 'Master'];
  const regions = ['Niamey', 'Zinder', 'Maradi', 'Dosso', 'Tahoua', 'Agadez', 'Tillabéri', 'Diffa'];
  const years = ['2024', '2023', '2022', '2021', '2020'];
  const types: { label: string; value: DocumentType }[] = [
    { label: 'Cours', value: 'COURS' },
    { label: 'Devoir', value: 'DEVOIR' },
    { label: 'Examen', value: 'EXAMEN' },
    { label: 'Baccalauréat', value: 'BACCALAUREAT' },
    { label: 'Concours', value: 'CONCOURS' },
  ];

  const schoolsQuery = useQuery({
    queryKey: ['schools', formData.region],
    queryFn: () => api.schools.list({ region: formData.region || undefined }),
  });

  const schoolIdNumber = useMemo(() => {
    const n = Number(formData.schoolId);
    return Number.isFinite(n) && n > 0 ? n : undefined;
  }, [formData.schoolId]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Check file type
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(selectedFile.type)) {
        toast({
          title: "Format de fichier non supporté",
          description: "Veuillez télécharger un fichier PDF ou une image (JPG, PNG).",
          variant: "destructive"
        });
        return;
      }
      
      // Check file size (max 10MB)
      if (selectedFile.size > 10 * 1024 * 1024) {
        toast({
          title: "Fichier trop volumineux",
          description: "La taille du fichier ne doit pas dépasser 10 MB.",
          variant: "destructive"
        });
        return;
      }
      
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!getAuthToken()) {
      toast({
        title: "Connexion requise",
        description: "Veuillez vous connecter avant de publier un document.",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }
    
    if (!file) {
      toast({
        title: "Fichier manquant",
        description: "Veuillez sélectionner un fichier à télécharger.",
        variant: "destructive"
      });
      return;
    }

    if (!formData.termsAccepted) {
      toast({
        title: "Conditions d'utilisation",
        description: "Veuillez accepter les conditions d'utilisation pour continuer.",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);

    try {
      const form = new FormData();
      form.append('file', file);
      form.append('title', formData.title);
      form.append('description', formData.comment);
      form.append('subject', formData.subject);
      form.append('level', formData.level);
      form.append('type', formData.type);
      form.append('year', formData.year);
      if (schoolIdNumber) {
        form.append('schoolId', String(schoolIdNumber));
      }

      await api.documents.upload(form);

      toast({
        title: "Document publié !",
        description: "Votre document a été ajouté.",
      });

      setFormData({
        title: '',
        subject: '',
        level: '',
        schoolId: '',
        region: '',
        year: '',
        type: '',
        comment: '',
        termsAccepted: false
      });
      setFile(null);
    } catch (err) {
      const message =
        err instanceof ApiError
          ? (typeof err.payload === 'object' && err.payload && 'error' in err.payload
              ? String((err.payload as any).error)
              : "Impossible de publier le document")
          : "Impossible de publier le document";
      toast({
        title: 'Erreur',
        description: message,
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const updateFormData = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="max-w-2xl mx-auto px-6 py-12">
        {/* Header - Calm, purposeful */}
        <div className="mb-10">
          <h1 className="text-2xl md:text-3xl font-serif font-semibold text-foreground mb-3">
            Contribuer
          </h1>
          <p className="text-muted-foreground">
            Partagez vos documents pour enrichir l'archive collective.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* File Upload */}
          <div className="space-y-2">
            <Label htmlFor="file" className="text-sm font-medium">Fichier</Label>
            <Input
              id="file"
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileChange}
              className="file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
            />
            {file && (
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <FileText className="w-4 h-4" />
                {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              PDF, JPG, PNG (max 10 MB)
            </p>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">Titre</Label>
            <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => updateFormData('title', e.target.value)}
              placeholder="Ex: Sujet de Mathématiques - Baccalauréat 2023"
              className="h-11"
              required
            />
          </div>

          {/* Row 1: Subject, Level, Type */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Matière</Label>
              <Select value={formData.subject} onValueChange={(value) => updateFormData('subject', value)}>
                <SelectTrigger className="h-11"><SelectValue placeholder="Matière" /></SelectTrigger>
                <SelectContent>
                  {subjects.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Niveau</Label>
              <Select value={formData.level} onValueChange={(value) => updateFormData('level', value)}>
                <SelectTrigger className="h-11"><SelectValue placeholder="Niveau" /></SelectTrigger>
                <SelectContent>
                  {levels.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Type</Label>
              <Select value={formData.type} onValueChange={(value) => updateFormData('type', value)}>
                <SelectTrigger className="h-11"><SelectValue placeholder="Type" /></SelectTrigger>
                <SelectContent>
                  {types.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Row 2: Region, School, Year */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Région</Label>
              <Select value={formData.region} onValueChange={(value) => updateFormData('region', value)}>
                <SelectTrigger className="h-11"><SelectValue placeholder="Région" /></SelectTrigger>
                <SelectContent>
                  {regions.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">École</Label>
              <Select value={formData.schoolId} onValueChange={(value) => updateFormData('schoolId', value)}>
                <SelectTrigger className="h-11"><SelectValue placeholder="École" /></SelectTrigger>
                <SelectContent>
                  {schoolsQuery.isLoading && <SelectItem value="loading" disabled>Chargement...</SelectItem>}
                  {!schoolsQuery.isLoading && (schoolsQuery.data?.length || 0) === 0 && <SelectItem value="none" disabled>Aucune</SelectItem>}
                  {(schoolsQuery.data || []).map((school) => (
                    <SelectItem key={school.id} value={String(school.id)}>{school.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Année</Label>
              <Select value={formData.year} onValueChange={(value) => updateFormData('year', value)}>
                <SelectTrigger className="h-11"><SelectValue placeholder="Année" /></SelectTrigger>
                <SelectContent>
                  {years.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Comment */}
          <div className="space-y-2">
            <Label htmlFor="comment" className="text-sm font-medium">Notes (optionnel)</Label>
            <Textarea
              id="comment"
              value={formData.comment}
              onChange={(e) => updateFormData('comment', e.target.value)}
              placeholder="Informations supplémentaires..."
              rows={3}
            />
          </div>

          {/* Terms */}
          <div className="flex items-start gap-3">
            <Checkbox
              id="terms"
              checked={formData.termsAccepted}
              onCheckedChange={(checked) => updateFormData('termsAccepted', checked as boolean)}
              className="mt-0.5"
            />
            <Label htmlFor="terms" className="text-sm text-muted-foreground leading-relaxed">
              Je confirme que ce contenu respecte les droits d'auteur
            </Label>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full h-11"
            disabled={isUploading || !formData.termsAccepted}
          >
            {isUploading ? (
              "Publication en cours..."
            ) : (
              <>
                <UploadIcon className="w-4 h-4 mr-2" />
                Publier
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Upload;