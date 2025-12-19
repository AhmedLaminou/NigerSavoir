import { useMemo, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search as SearchIcon, Download, FileText, Calendar, MapPin } from 'lucide-react';
import Header from '@/components/Header';
import { useQuery } from '@tanstack/react-query';
import { api, ApiError, type DocumentType } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

const Search = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedSchoolId, setSelectedSchoolId] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedType, setSelectedType] = useState<'' | 'all' | DocumentType>('');

  const levels = ['3ème', '2nde', '1ère', 'Terminale', 'Licence 1', 'Licence 2', 'Licence 3', 'Master'];
  const subjects = ['Mathématiques', 'SVT', 'Philosophie', 'Histoire-Géographie', 'Physique-Chimie', 'Économie', 'Droit', 'Informatique'];
  const regions = ['Niamey', 'Zinder', 'Maradi', 'Dosso', 'Tahoua', 'Agadez', 'Tillabéri', 'Diffa'];
  const years = ['2024', '2023', '2022', '2021', '2020'];
  const types: { label: string; value: 'all' | DocumentType }[] = [
    { label: 'Tous', value: 'all' },
    { label: 'Cours', value: 'COURS' },
    { label: 'Devoir', value: 'DEVOIR' },
    { label: 'Examen', value: 'EXAMEN' },
    { label: 'Baccalauréat', value: 'BACCALAUREAT' },
    { label: 'Concours', value: 'CONCOURS' },
  ];

  const typeLabel: Record<DocumentType, string> = {
    COURS: 'Cours',
    DEVOIR: 'Devoir',
    EXAMEN: 'Examen',
    BACCALAUREAT: 'Baccalauréat',
    CONCOURS: 'Concours',
  };

  const schoolsQuery = useQuery({
    queryKey: ['schools', selectedRegion],
    queryFn: () => api.schools.list({ region: selectedRegion && selectedRegion !== 'all' ? selectedRegion : undefined }),
  });

  const schoolIdNumber = useMemo(() => {
    const n = Number(selectedSchoolId);
    return Number.isFinite(n) && n > 0 ? n : undefined;
  }, [selectedSchoolId]);

  const documentsQuery = useQuery({
    queryKey: ['documents', searchQuery, selectedLevel, selectedSubject, selectedYear, selectedType, schoolIdNumber, selectedRegion],
    queryFn: () =>
      api.documents.search({
        subject: selectedSubject && selectedSubject !== 'all' ? selectedSubject : undefined,
        level: selectedLevel && selectedLevel !== 'all' ? selectedLevel : undefined,
        type: selectedType && selectedType !== 'all' ? (selectedType as DocumentType) : undefined,
        year: selectedYear && selectedYear !== 'all' ? selectedYear : undefined,
        schoolId: schoolIdNumber,
        region: selectedRegion && selectedRegion !== 'all' ? selectedRegion : undefined,
      }),
  });

  const filteredDocuments = useMemo(() => {
    const docs = documentsQuery.data || [];
    if (!searchQuery) return docs;
    const q = searchQuery.toLowerCase();
    return docs.filter((d) => {
      const title = d.title?.toLowerCase() || '';
      const desc = d.description?.toLowerCase() || '';
      return title.includes(q) || desc.includes(q);
    });
  }, [documentsQuery.data, searchQuery]);

  const handleDownload = async (id: number, fallbackName: string) => {
    try {
      const { blob, filename } = await api.documents.download(id);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename || fallbackName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      const message =
        err instanceof ApiError
          ? (typeof err.payload === 'object' && err.payload && 'error' in err.payload
              ? String((err.payload as any).error)
              : 'Téléchargement impossible')
          : 'Téléchargement impossible';
      toast({
        title: 'Erreur',
        description: message,
        variant: 'destructive',
      });
    }
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedLevel('');
    setSelectedSubject('');
    setSelectedRegion('');
    setSelectedSchoolId('');
    setSelectedYear('');
    setSelectedType('');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Page Header - Calm, purposeful */}
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-serif font-semibold text-foreground mb-3">
            Documents
          </h1>
          <p className="text-muted-foreground">
            Parcourez l'archive du savoir étudiant nigérien.
          </p>
        </div>

        {/* Search Bar - Clean, minimal */}
        <div className="relative mb-8">
          <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <Input
            placeholder="Rechercher par mots-clés..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-12 text-base bg-card border-border"
          />
        </div>

        {/* Filters - Restrained, functional */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-10 p-4 bg-secondary/30 rounded-md border border-border">
          <Select value={selectedLevel} onValueChange={setSelectedLevel}>
            <SelectTrigger className="bg-background">
              <SelectValue placeholder="Niveau" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous niveaux</SelectItem>
              {levels.map(level => (
                <SelectItem key={level} value={level}>{level}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedSubject} onValueChange={setSelectedSubject}>
            <SelectTrigger className="bg-background">
              <SelectValue placeholder="Matière" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes matières</SelectItem>
              {subjects.map(subject => (
                <SelectItem key={subject} value={subject}>{subject}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedType} onValueChange={(v) => setSelectedType(v as any)}>
            <SelectTrigger className="bg-background">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              {types.map((type) => (
                <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedRegion} onValueChange={(v) => {
            setSelectedRegion(v);
            setSelectedSchoolId('');
          }}>
            <SelectTrigger className="bg-background">
              <SelectValue placeholder="Région" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes régions</SelectItem>
              {regions.map(region => (
                <SelectItem key={region} value={region}>{region}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedSchoolId} onValueChange={setSelectedSchoolId}>
            <SelectTrigger className="bg-background">
              <SelectValue placeholder="École" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes écoles</SelectItem>
              {schoolsQuery.isLoading && (
                <SelectItem value="loading" disabled>Chargement...</SelectItem>
              )}
              {!schoolsQuery.isLoading && (schoolsQuery.data?.length || 0) === 0 && (
                <SelectItem value="none" disabled>Aucune école</SelectItem>
              )}
              {(schoolsQuery.data || []).map((school) => (
                <SelectItem key={String(school.id)} value={String(school.id)}>{school.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="bg-background">
              <SelectValue placeholder="Année" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes années</SelectItem>
              {years.map(year => (
                <SelectItem key={year} value={year}>{year}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Results Count - Quiet indicator */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {documentsQuery.isLoading ? 'Recherche en cours...' : `${filteredDocuments.length} document${filteredDocuments.length !== 1 ? 's' : ''}`}
          </p>
          {(selectedLevel || selectedSubject || selectedRegion || selectedYear || selectedType) && (
            <button
              onClick={resetFilters}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Réinitialiser
            </button>
          )}
        </div>

        {/* Results - Clean document list */}
        <div className="space-y-3">
          {filteredDocuments.map((doc) => (
            <article
              key={doc.id}
              className="document-card group"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  {/* Title and type */}
                  <div className="flex items-start gap-3 mb-2">
                    <FileText className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium text-foreground leading-tight group-hover:text-primary transition-colors">
                        {doc.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                        <span className="quiet-badge">{typeLabel[doc.type]}</span>
                        <span className="quiet-badge">{doc.subject}</span>
                        <span className="quiet-badge">{doc.level}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Metadata - quiet indicators */}
                  <div className="flex items-center gap-4 ml-8 mt-3 text-sm text-muted-foreground">
                    {doc.school?.region && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {doc.school.region}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {doc.year}
                    </span>
                    {doc.school?.name && (
                      <span className="hidden sm:inline">{doc.school.name}</span>
                    )}
                  </div>
                </div>

                {/* Download action */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDownload(doc.id, `${doc.title}.${(doc.format || 'pdf').toLowerCase()}`)}
                  className="flex-shrink-0"
                >
                  <Download className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Télécharger</span>
                  <span className="sm:hidden">PDF</span>
                </Button>
              </div>
            </article>
          ))}
        </div>

        {/* Empty state */}
        {!documentsQuery.isLoading && filteredDocuments.length === 0 && (
          <div className="text-center py-16">
            <FileText className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">
              Aucun document ne correspond à vos critères.
            </p>
            <Button variant="outline" onClick={resetFilters}>
              Réinitialiser les filtres
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;