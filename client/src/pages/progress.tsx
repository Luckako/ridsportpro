import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthContext } from "@/components/auth-provider";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { TrendingUp, Plus, Star, User, Calendar } from "lucide-react";
import { format } from "date-fns";
import { sv } from "date-fns/locale";

const createProgressSchema = z.object({
  riderId: z.number().min(1, "Ryttare är obligatorisk"),
  category: z.enum(["Balans", "Tempo", "Hopp", "Dressyr", "Allmänt"]),
  rating: z.number().min(1).max(5),
  notes: z.string().optional(),
});

type CreateProgressData = z.infer<typeof createProgressSchema>;

export default function Progress() {
  const { userProfile } = useAuthContext();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const form = useForm<CreateProgressData>({
    resolver: zodResolver(createProgressSchema),
    defaultValues: {
      category: "Allmänt",
      rating: 3,
      notes: "",
    },
  });

  const { data: progressReports = [], isLoading } = useQuery({
    queryKey: userProfile?.role === "Ryttare" 
      ? ["/api/progress/rider", userProfile.id]
      : ["/api/progress/trainer", userProfile?.id],
    enabled: !!userProfile,
  });

  const { data: users = [] } = useQuery({
    queryKey: ["/api/users"],
    enabled: !!userProfile && userProfile.role === "Tränare",
  });

  const createProgressMutation = useMutation({
    mutationFn: async (data: CreateProgressData) => {
      const progressData = {
        ...data,
        trainerId: userProfile!.id,
      };
      return apiRequest("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(progressData),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/progress"] });
      setIsCreateDialogOpen(false);
      form.reset();
      toast({
        title: "Framstegsrapport skapad",
        description: "Framstegsrapporten har sparats",
      });
    },
    onError: () => {
      toast({
        title: "Fel",
        description: "Kunde inte spara framstegsrapporten",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: CreateProgressData) => {
    createProgressMutation.mutate(data);
  };

  const getRiders = () => {
    return users.filter((user: any) => user.role === "Ryttare");
  };

  const getUserById = (id: number) => {
    return users.find((user: any) => user.id === id);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Balans": return "bg-blue-100 text-blue-800";
      case "Tempo": return "bg-green-100 text-green-800";
      case "Hopp": return "bg-orange-100 text-orange-800";
      case "Dressyr": return "bg-purple-100 text-purple-800";
      case "Allmänt": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

  if (!userProfile) {
    return <div>Laddar...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {userProfile.role === "Ryttare" ? "Min utveckling" : "Framstegsrapporter"}
              </h1>
              <p className="text-gray-600 mt-2">
                {userProfile.role === "Ryttare" 
                  ? "Se din utveckling över tid"
                  : "Dokumentera och följ ryttarnas framsteg"
                }
              </p>
            </div>

            {userProfile.role === "Tränare" && (
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Ny rapport
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Skapa framstegsrapport</DialogTitle>
                  </DialogHeader>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="riderId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Ryttare</FormLabel>
                            <Select onValueChange={(value) => field.onChange(parseInt(value))}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Välj ryttare" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {getRiders().map((rider: any) => (
                                  <SelectItem key={rider.id} value={rider.id.toString()}>
                                    {rider.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Kategori</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Balans">Balans</SelectItem>
                                <SelectItem value="Tempo">Tempo</SelectItem>
                                <SelectItem value="Hopp">Hopp</SelectItem>
                                <SelectItem value="Dressyr">Dressyr</SelectItem>
                                <SelectItem value="Allmänt">Allmänt</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="rating"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Betyg (1-5)</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                min="1" 
                                max="5" 
                                {...field} 
                                onChange={e => field.onChange(parseInt(e.target.value))}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="notes"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Anteckningar</FormLabel>
                            <FormControl>
                              <Textarea {...field} rows={3} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button 
                        type="submit" 
                        className="w-full"
                        disabled={createProgressMutation.isPending}
                      >
                        {createProgressMutation.isPending ? "Sparar..." : "Spara rapport"}
                      </Button>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            )}
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : progressReports.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Inga framstegsrapporter hittades
                </h3>
                <p className="text-gray-600">
                  {userProfile.role === "Ryttare" 
                    ? "Dina tränare har inte skapat några framstegsrapporter än."
                    : "Du har inte skapat några framstegsrapporter än."
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {progressReports.map((report: any) => {
                const rider = getUserById(report.riderId);
                const trainer = getUserById(report.trainerId);
                
                return (
                  <Card key={report.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">
                            {userProfile.role === "Ryttare" ? report.category : rider?.name}
                          </CardTitle>
                          <div className="flex items-center mt-2">
                            {renderStars(report.rating)}
                            <span className="ml-2 text-sm text-gray-600">
                              {report.rating}/5
                            </span>
                          </div>
                        </div>
                        <Badge className={getCategoryColor(report.category)}>
                          {report.category}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {report.notes && (
                        <p className="text-gray-600 text-sm">{report.notes}</p>
                      )}
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center text-gray-600">
                          <User className="w-4 h-4 mr-2" />
                          {userProfile.role === "Ryttare" 
                            ? `Tränare: ${trainer?.name}`
                            : `Ryttare: ${rider?.name}`
                          }
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Calendar className="w-4 h-4 mr-2" />
                          {format(new Date(report.createdAt), "PPP", { locale: sv })}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Progress Summary for Riders */}
          {userProfile.role === "Ryttare" && progressReports.length > 0 && (
            <div className="mt-12">
              <Card>
                <CardHeader>
                  <CardTitle>Utvecklingsöversikt</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    {["Balans", "Tempo", "Hopp", "Dressyr", "Allmänt"].map((category) => {
                      const categoryReports = progressReports.filter((r: any) => r.category === category);
                      const avgRating = categoryReports.length > 0 
                        ? categoryReports.reduce((sum: number, r: any) => sum + r.rating, 0) / categoryReports.length
                        : 0;
                      
                      return (
                        <div key={category} className="text-center">
                          <h4 className="font-medium text-gray-900 mb-2">{category}</h4>
                          <div className="flex justify-center mb-2">
                            {renderStars(Math.round(avgRating))}
                          </div>
                          <p className="text-sm text-gray-600">
                            {avgRating > 0 ? `${avgRating.toFixed(1)}/5` : "Ej bedömd"}
                          </p>
                          <p className="text-xs text-gray-500">
                            {categoryReports.length} rapport{categoryReports.length !== 1 ? "er" : ""}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}