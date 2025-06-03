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
import { Calendar, Clock, Users, Plus, User } from "lucide-react";
import { format } from "date-fns";
import { sv } from "date-fns/locale";

const createLessonSchema = z.object({
  title: z.string().min(1, "Titel är obligatorisk"),
  description: z.string().optional(),
  startTime: z.string().min(1, "Starttid är obligatorisk"),
  endTime: z.string().min(1, "Sluttid är obligatorisk"),
  maxParticipants: z.number().min(1, "Minst 1 deltagare"),
  lessonType: z.enum(["Hopplektion", "Dressyr", "Terrängridning", "Grundutbildning"]),
});

type CreateLessonData = z.infer<typeof createLessonSchema>;

export default function Lessons() {
  const { userProfile } = useAuthContext();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const form = useForm<CreateLessonData>({
    resolver: zodResolver(createLessonSchema),
    defaultValues: {
      title: "",
      description: "",
      startTime: "",
      endTime: "",
      maxParticipants: 1,
      lessonType: "Hopplektion",
    },
  });

  const { data: lessons = [], isLoading } = useQuery({
    queryKey: ["/api/lessons"],
    enabled: !!userProfile,
  });

  const { data: availableLessons = [] } = useQuery({
    queryKey: ["/api/lessons/available"],
    enabled: !!userProfile && userProfile.role === "Ryttare",
  });

  const createLessonMutation = useMutation({
    mutationFn: async (data: CreateLessonData) => {
      const lessonData = {
        ...data,
        trainerId: userProfile!.id,
        startTime: new Date(data.startTime).toISOString(),
        endTime: new Date(data.endTime).toISOString(),
      };
      return apiRequest("/api/lessons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lessonData),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/lessons"] });
      setIsCreateDialogOpen(false);
      form.reset();
      toast({
        title: "Lektion skapad",
        description: "Lektionen har skapats framgångsrikt",
      });
    },
    onError: () => {
      toast({
        title: "Fel",
        description: "Kunde inte skapa lektionen",
        variant: "destructive",
      });
    },
  });

  const bookLessonMutation = useMutation({
    mutationFn: async (lessonId: number) => {
      return apiRequest("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lessonId,
          riderId: userProfile!.id,
          status: "Bekräftad",
        }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/lessons"] });
      toast({
        title: "Bokning bekräftad",
        description: "Du har bokat lektionen framgångsrikt",
      });
    },
    onError: () => {
      toast({
        title: "Fel",
        description: "Kunde inte boka lektionen",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: CreateLessonData) => {
    createLessonMutation.mutate(data);
  };

  const handleBookLesson = (lessonId: number) => {
    bookLessonMutation.mutate(lessonId);
  };

  const getLessonTypeColor = (type: string) => {
    switch (type) {
      case "Hopplektion": return "bg-blue-100 text-blue-800";
      case "Dressyr": return "bg-green-100 text-green-800";
      case "Terrängridning": return "bg-orange-100 text-orange-800";
      case "Grundutbildning": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (!userProfile) {
    return <div>Laddar...</div>;
  }

  const displayLessons = userProfile.role === "Ryttare" ? availableLessons : lessons;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {userProfile.role === "Ryttare" ? "Tillgängliga lektioner" : "Mina lektioner"}
              </h1>
              <p className="text-gray-600 mt-2">
                {userProfile.role === "Ryttare" 
                  ? "Boka lektioner som passar dig"
                  : "Hantera dina schemalagda lektioner"
                }
              </p>
            </div>

            {userProfile.role === "Tränare" && (
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Ny lektion
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Skapa ny lektion</DialogTitle>
                  </DialogHeader>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Titel</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="lessonType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Typ av lektion</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Hopplektion">Hopplektion</SelectItem>
                                <SelectItem value="Dressyr">Dressyr</SelectItem>
                                <SelectItem value="Terrängridning">Terrängridning</SelectItem>
                                <SelectItem value="Grundutbildning">Grundutbildning</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Beskrivning</FormLabel>
                            <FormControl>
                              <Textarea {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="startTime"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Starttid</FormLabel>
                              <FormControl>
                                <Input type="datetime-local" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="endTime"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Sluttid</FormLabel>
                              <FormControl>
                                <Input type="datetime-local" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="maxParticipants"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Max deltagare</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                min="1" 
                                {...field} 
                                onChange={e => field.onChange(parseInt(e.target.value))}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button 
                        type="submit" 
                        className="w-full"
                        disabled={createLessonMutation.isPending}
                      >
                        {createLessonMutation.isPending ? "Skapar..." : "Skapa lektion"}
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
          ) : displayLessons.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Inga lektioner hittades
                </h3>
                <p className="text-gray-600">
                  {userProfile.role === "Ryttare" 
                    ? "Det finns inga tillgängliga lektioner att boka just nu."
                    : "Du har inte skapat några lektioner än."
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayLessons.map((lesson: any) => (
                <Card key={lesson.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{lesson.title}</CardTitle>
                      <Badge className={getLessonTypeColor(lesson.lessonType)}>
                        {lesson.lessonType}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {lesson.description && (
                      <p className="text-gray-600 text-sm">{lesson.description}</p>
                    )}
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center text-gray-600">
                        <Calendar className="w-4 h-4 mr-2" />
                        {format(new Date(lesson.startTime), "PPP", { locale: sv })}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Clock className="w-4 h-4 mr-2" />
                        {format(new Date(lesson.startTime), "HH:mm")} - {format(new Date(lesson.endTime), "HH:mm")}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Users className="w-4 h-4 mr-2" />
                        Max {lesson.maxParticipants} deltagare
                      </div>
                    </div>

                    {userProfile.role === "Ryttare" && (
                      <Button 
                        onClick={() => handleBookLesson(lesson.id)}
                        disabled={bookLessonMutation.isPending}
                        className="w-full"
                      >
                        {bookLessonMutation.isPending ? "Bokar..." : "Boka lektion"}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}