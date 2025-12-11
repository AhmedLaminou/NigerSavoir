import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const regions = [
  { name: 'Niamey', count: 1250, color: 'bg-primary/10 text-primary border-primary/20' },
  { name: 'Zinder', count: 234, color: 'bg-accent/10 text-accent border-accent/20' },
  { name: 'Maradi', count: 189, color: 'bg-niger-success/10 text-niger-success border-niger-success/20' },
  { name: 'Dosso', count: 167, color: 'bg-niger-warning/10 text-niger-warning border-niger-warning/20' },
  { name: 'Tahoua', count: 143, color: 'bg-purple-100 text-purple-700 border-purple-200' },
  { name: 'Agadez', count: 98, color: 'bg-orange-100 text-orange-700 border-orange-200' },
  { name: 'Tillabéri', count: 76, color: 'bg-green-100 text-green-700 border-green-200' },
  { name: 'Diffa', count: 54, color: 'bg-blue-100 text-blue-700 border-blue-200' },
];

const schools = [
  'Lycée La Fontaine',
  'Université Abdou Moumouni',
  'Lycée Issa Béri',
  'Collège Mariama',
  'Université de Niamey',
  'Lycée Bosso',
  'ESSENTIEL',
  'Université Islamique du Niger',
];

const RegionFilter = () => {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [showAllRegions, setShowAllRegions] = useState(false);
  const [showAllSchools, setShowAllSchools] = useState(false);

  const displayedRegions = showAllRegions ? regions : regions.slice(0, 4);
  const displayedSchools = showAllSchools ? schools : schools.slice(0, 4);

  return (
    <section className="py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Regions */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-foreground">
              Par région
            </h3>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setShowAllRegions(!showAllRegions)}
            >
              {showAllRegions ? 'Voir moins' : 'Voir tout'}
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <Badge
              variant={selectedRegion === null ? "default" : "secondary"}
              className="cursor-pointer px-3 py-1"
              onClick={() => setSelectedRegion(null)}
            >
              Toutes les régions
            </Badge>
            
            {displayedRegions.map((region, index) => (
              <Badge
                key={index}
                variant={selectedRegion === region.name ? "default" : "outline"}
                className={`cursor-pointer px-3 py-1 ${region.color} hover:opacity-80 transition-opacity`}
                onClick={() => setSelectedRegion(region.name)}
              >
                {region.name} ({region.count})
              </Badge>
            ))}
          </div>
        </div>

        {/* Schools */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-foreground">
              Écoles partenaires
            </h3>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setShowAllSchools(!showAllSchools)}
            >
              {showAllSchools ? 'Voir moins' : 'Voir tout'}
            </Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {displayedSchools.map((school, index) => (
              <div
                key={index}
                className="p-4 border border-border rounded-lg hover:border-primary/30 hover:bg-card/50 transition-all cursor-pointer"
              >
                <div className="font-medium text-foreground text-sm">{school}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {Math.floor(Math.random() * 200) + 50} documents
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default RegionFilter;