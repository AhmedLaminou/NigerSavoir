import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search as SearchIcon, Download, User } from 'lucide-react';
import Header from '@/components/Header';

// Mock data for documents
const mockDocuments = [
  {
    id: 1,
    title: "Sujet de Mathématiques - Baccalauréat 2023",
    type: "Baccalauréat",
    subject: "Mathématiques",
    level: "Terminale C",
    school: "Lycée La Fontaine",
    region: "Niamey",
    year: "2023",
    uploadedBy: {
      name: "Aminata Diallo",
      avatar: "/placeholder.svg",
      initials: "AD"
    },
    format: "PDF",
    tags: ["Maths", "Terminale C", "Bac 2023"],
    uploadDate: "2024-01-15"
  },
  {
    id: 2,
    title: "Cours de Philosophie - Introduction à la logique",
    type: "Cours",
    subject: "Philosophie",
    level: "Terminale A",
    school: "Université Abdou Moumouni",
    region: "Niamey",
    year: "2023",
    uploadedBy: {
      name: "Ibrahim Souley",
      avatar: "/placeholder.svg",
      initials: "IS"
    },
    format: "PDF",
    tags: ["Philosophie", "Terminale A", "Logique"],
    uploadDate: "2024-01-10"
  },
  {
    id: 3,
    title: "Devoir de SVT - Génétique et hérédité",
    type: "Devoir",
    subject: "SVT",
    level: "Première D",
    school: "Lycée Issa Béri",
    region: "Zinder",
    year: "2023",
    uploadedBy: {
      name: "Fatima Ali",
      avatar: "/placeholder.svg",
      initials: "FA"
    },
    format: "Image",
    tags: ["SVT", "Première D", "Génétique"],
    uploadDate: "2024-01-08"
  },
  {
    id: 4,
    title: "Examen d'Économie - Macro-économie",
    type: "Examen",
    subject: "Économie",
    level: "Licence 2",
    school: "Université Abdou Moumouni",
    region: "Niamey",
    year: "2023",
    uploadedBy: {
      name: "Moussa Garba",
      avatar: "/placeholder.svg",
      initials: "MG"
    },
    format: "PDF",
    tags: ["Économie", "Licence 2", "Macro"],
    uploadDate: "2024-01-05"
  }
];

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedSchool, setSelectedSchool] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedType, setSelectedType] = useState('');

  const levels = ['3ème', '2nde', '1ère', 'Terminale', 'Licence 1', 'Licence 2', 'Licence 3', 'Master'];
  const subjects = ['Mathématiques', 'SVT', 'Philosophie', 'Histoire-Géographie', 'Physique-Chimie', 'Économie', 'Droit', 'Informatique'];
  const regions = ['Niamey', 'Zinder', 'Maradi', 'Dosso', 'Tahoua', 'Agadez', 'Tillabéri', 'Diffa'];
  const schools = ['Lycée La Fontaine', 'Université Abdou Moumouni', 'Lycée Issa Béri', 'Collège Mariama'];
  const years = ['2024', '2023', '2022', '2021', '2020'];
  const types = ['Cours', 'Devoir', 'Examen', 'Baccalauréat', 'Concours'];

  const filteredDocuments = mockDocuments.filter(doc => {
    return (
      (!searchQuery || doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
       doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))) &&
      (!selectedLevel || selectedLevel === 'all' || doc.level.includes(selectedLevel)) &&
      (!selectedSubject || selectedSubject === 'all' || doc.subject === selectedSubject) &&
      (!selectedRegion || selectedRegion === 'all' || doc.region === selectedRegion) &&
      (!selectedSchool || selectedSchool === 'all' || doc.school === selectedSchool) &&
      (!selectedYear || selectedYear === 'all' || doc.year === selectedYear) &&
      (!selectedType || selectedType === 'all' || doc.type === selectedType)
    );
  });

  return (
    <div className="min-h-screen bg-background bg-pattern">
      <div className="absolute inset-0 bg-background/95"></div>
      <div className="relative">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4 gradient-text">
            Rechercher des documents
          </h1>
          <p className="text-muted-foreground text-lg">
            Trouvez facilement les cours, devoirs et examens dont vous avez besoin
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6 glass-card p-1 rounded-lg">
          <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <Input
            placeholder="Rechercher par mots-clés (ex: baccalauréat SVT 2023)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-14 text-lg border-0 bg-transparent focus-visible:ring-0"
          />
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8 glass-card p-6 rounded-xl">
          <Select value={selectedLevel} onValueChange={setSelectedLevel}>
            <SelectTrigger>
              <SelectValue placeholder="Niveau" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les niveaux</SelectItem>
              {levels.map(level => (
                <SelectItem key={level} value={level}>{level}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedSubject} onValueChange={setSelectedSubject}>
            <SelectTrigger>
              <SelectValue placeholder="Matière" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les matières</SelectItem>
              {subjects.map(subject => (
                <SelectItem key={subject} value={subject}>{subject}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger>
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les types</SelectItem>
              {types.map(type => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedRegion} onValueChange={setSelectedRegion}>
            <SelectTrigger>
              <SelectValue placeholder="Région" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les régions</SelectItem>
              {regions.map(region => (
                <SelectItem key={region} value={region}>{region}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedSchool} onValueChange={setSelectedSchool}>
            <SelectTrigger>
              <SelectValue placeholder="École" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les écoles</SelectItem>
              {schools.map(school => (
                <SelectItem key={school} value={school}>{school}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger>
              <SelectValue placeholder="Année" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les années</SelectItem>
              {years.map(year => (
                <SelectItem key={year} value={year}>{year}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            {filteredDocuments.length} document(s) trouvé(s)
          </p>
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredDocuments.map((doc) => (
            <Card key={doc.id} className="premium-card border-2 hover:border-primary/30">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold text-lg text-foreground line-clamp-2 flex-1">
                    {doc.title}
                  </h3>
                  <Badge variant="outline" className="ml-2 flex-shrink-0 shadow-sm">
                    {doc.format}
                  </Badge>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">{doc.type}</span>
                    <span className="mx-2">•</span>
                    <span>{doc.subject}</span>
                    <span className="mx-2">•</span>
                    <span>{doc.level}</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-muted-foreground">
                    <span>{doc.school}</span>
                    <span className="mx-2">•</span>
                    <span className="network-badge">{doc.region}</span>
                    <span className="mx-2">•</span>
                    <span>{doc.year}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {doc.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs shadow-sm">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Avatar className="w-7 h-7 ring-2 ring-primary/20">
                      <AvatarImage src={doc.uploadedBy.avatar} />
                      <AvatarFallback className="text-xs bg-gradient-to-br from-primary/20 to-accent/20">
                        {doc.uploadedBy.initials}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-muted-foreground font-medium">
                      {doc.uploadedBy.name}
                    </span>
                  </div>

                  <Button size="sm" className="shadow-md">
                    <Download className="w-4 h-4 mr-2" />
                    Télécharger
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredDocuments.length === 0 && (
          <div className="text-center py-12">
            <div className="text-muted-foreground mb-4">
              Aucun document trouvé pour vos critères de recherche
            </div>
            <Button variant="outline" onClick={() => {
              setSearchQuery('');
              setSelectedLevel('all');
              setSelectedSubject('all');
              setSelectedRegion('all');
              setSelectedSchool('all');
              setSelectedYear('all');
              setSelectedType('all');
            }}>
              Réinitialiser les filtres
            </Button>
          </div>
        )}
      </div>
      </div>
    </div>
  );
};

export default Search;