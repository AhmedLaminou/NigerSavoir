import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Upload as UploadIcon, FileText, Check } from 'lucide-react';
import Header from '@/components/Header';
import { useToast } from '@/hooks/use-toast';

const Upload = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    level: '',
    school: '',
    region: '',
    year: '',
    type: '',
    comment: '',
    termsAccepted: false
  });
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const subjects = ['Mathématiques', 'SVT', 'Philosophie', 'Histoire-Géographie', 'Physique-Chimie', 'Économie', 'Droit', 'Informatique'];
  const levels = ['3ème', '2nde', '1ère', 'Terminale', 'Licence 1', 'Licence 2', 'Licence 3', 'Master'];
  const regions = ['Niamey', 'Zinder', 'Maradi', 'Dosso', 'Tahoua', 'Agadez', 'Tillabéri', 'Diffa'];
  const schools = ['Lycée La Fontaine', 'Université Abdou Moumouni', 'Lycée Issa Béri', 'Collège Mariama', 'Université de Niamey', 'Lycée Bosso'];
  const years = ['2024', '2023', '2022', '2021', '2020'];
  const types = ['Cours', 'Devoir', 'Examen', 'Baccalauréat', 'Concours'];

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
    
    // Simulate upload process
    setTimeout(() => {
      setIsUploading(false);
      toast({
        title: "Document téléchargé avec succès !",
        description: "Votre document sera révisé avant d'être publié.",
      });
      
      // Reset form
      setFormData({
        title: '',
        subject: '',
        level: '',
        school: '',
        region: '',
        year: '',
        type: '',
        comment: '',
        termsAccepted: false
      });
      setFile(null);
    }, 2000);
  };

  const updateFormData = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4">
            Publier un document
          </h1>
          <p className="text-muted-foreground">
            Partagez vos cours, devoirs ou examens pour aider la communauté étudiante
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UploadIcon className="w-5 h-5" />
              Informations du document
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* File Upload */}
              <div>
                <Label htmlFor="file">Fichier *</Label>
                <div className="mt-2">
                  <Input
                    id="file"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileChange}
                    className="file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                  />
                  {file && (
                    <div className="mt-2 flex items-center text-sm text-muted-foreground">
                      <FileText className="w-4 h-4 mr-2" />
                      {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    Formats acceptés: PDF, JPG, PNG (max 10 MB)
                  </p>
                </div>
              </div>

              {/* Title */}
              <div>
                <Label htmlFor="title">Titre du document *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => updateFormData('title', e.target.value)}
                  placeholder="Ex: Sujet de Mathématiques - Baccalauréat 2023"
                  required
                />
              </div>

              {/* Row 1: Subject, Level, Type */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="subject">Matière *</Label>
                  <Select value={formData.subject} onValueChange={(value) => updateFormData('subject', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une matière" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map(subject => (
                        <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="level">Niveau *</Label>
                  <Select value={formData.level} onValueChange={(value) => updateFormData('level', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un niveau" />
                    </SelectTrigger>
                    <SelectContent>
                      {levels.map(level => (
                        <SelectItem key={level} value={level}>{level}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="type">Type de document *</Label>
                  <Select value={formData.type} onValueChange={(value) => updateFormData('type', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un type" />
                    </SelectTrigger>
                    <SelectContent>
                      {types.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Row 2: School, Region, Year */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="school">École *</Label>
                  <Select value={formData.school} onValueChange={(value) => updateFormData('school', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une école" />
                    </SelectTrigger>
                    <SelectContent>
                      {schools.map(school => (
                        <SelectItem key={school} value={school}>{school}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="region">Région *</Label>
                  <Select value={formData.region} onValueChange={(value) => updateFormData('region', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une région" />
                    </SelectTrigger>
                    <SelectContent>
                      {regions.map(region => (
                        <SelectItem key={region} value={region}>{region}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="year">Année *</Label>
                  <Select value={formData.year} onValueChange={(value) => updateFormData('year', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une année" />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map(year => (
                        <SelectItem key={year} value={year}>{year}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Comment */}
              <div>
                <Label htmlFor="comment">Commentaire (optionnel)</Label>
                <Textarea
                  id="comment"
                  value={formData.comment}
                  onChange={(e) => updateFormData('comment', e.target.value)}
                  placeholder="Ajoutez des informations supplémentaires sur ce document..."
                  rows={3}
                />
              </div>

              {/* Terms */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={formData.termsAccepted}
                  onCheckedChange={(checked) => updateFormData('termsAccepted', checked as boolean)}
                />
                <Label htmlFor="terms" className="text-sm">
                  Je confirme que je télécharge du contenu éducatif qui respecte les droits d'auteur *
                </Label>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full"
                disabled={isUploading || !formData.termsAccepted}
              >
                {isUploading ? (
                  "Téléchargement en cours..."
                ) : (
                  <>
                    <UploadIcon className="w-4 h-4 mr-2" />
                    Publier le document
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Upload;