import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Mail, ExternalLink } from "lucide-react";

interface RidingSchool {
  id: number;
  name: string;
  subdomain: string;
  address?: string;
  phone?: string;
  email?: string;
  description?: string;
  primaryColor: string;
}

interface RidskolaSelectorProps {
  value?: number;
  onValueChange: (ridingSchoolId: number) => void;
  error?: string;
}

export function RidskolaSelector({ value, onValueChange, error }: RidskolaSelectorProps) {
  const [selectedSchool, setSelectedSchool] = useState<RidingSchool | null>(null);

  const { data: ridingSchools, isLoading } = useQuery<RidingSchool[]>({
    queryKey: ["/api/riding-schools"],
  });

  useEffect(() => {
    if (value && ridingSchools) {
      const school = ridingSchools.find(s => s.id === value);
      setSelectedSchool(school || null);
    }
  }, [value, ridingSchools]);

  const handleValueChange = (schoolId: string) => {
    const id = parseInt(schoolId);
    onValueChange(id);
    
    const school = ridingSchools?.find(s => s.id === id);
    setSelectedSchool(school || null);
  };

  if (isLoading) {
    return (
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Välj ridskola
        </label>
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Välj ridskola *
        </label>
        <Select value={value?.toString()} onValueChange={handleValueChange}>
          <SelectTrigger className={error ? "border-red-500" : ""}>
            <SelectValue placeholder="Välj din ridskola..." />
          </SelectTrigger>
          <SelectContent>
            {ridingSchools?.map((school) => (
              <SelectItem key={school.id} value={school.id.toString()}>
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: school.primaryColor }}
                  />
                  {school.name}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {error && (
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        )}
      </div>

      {selectedSchool && (
        <Card className="border-l-4" style={{ borderLeftColor: selectedSchool.primaryColor }}>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <div 
                className="w-4 h-4 rounded-full" 
                style={{ backgroundColor: selectedSchool.primaryColor }}
              />
              {selectedSchool.name}
              <Badge variant="outline" className="ml-auto">
                {selectedSchool.subdomain}.ridsportpro.se
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {selectedSchool.description && (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {selectedSchool.description}
              </p>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              {selectedSchool.address && (
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <MapPin className="w-4 h-4" />
                  {selectedSchool.address}
                </div>
              )}
              
              {selectedSchool.phone && (
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Phone className="w-4 h-4" />
                  {selectedSchool.phone}
                </div>
              )}
              
              {selectedSchool.email && (
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Mail className="w-4 h-4" />
                  {selectedSchool.email}
                </div>
              )}
              
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <ExternalLink className="w-4 h-4" />
                <span className="text-xs">
                  {selectedSchool.subdomain}.ridsportpro.se
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}