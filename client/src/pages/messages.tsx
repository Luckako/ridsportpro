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
import { MessageSquare, Plus, Mail, User, GraduationCap, Settings } from "lucide-react";
import { format } from "date-fns";
import { sv } from "date-fns/locale";

const createMessageSchema = z.object({
  receiverId: z.number().min(1, "Mottagare är obligatorisk"),
  subject: z.string().min(1, "Ämne är obligatoriskt"),
  content: z.string().min(1, "Meddelande är obligatoriskt"),
});

type CreateMessageData = z.infer<typeof createMessageSchema>;

export default function Messages() {
  const { userProfile } = useAuthContext();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<any>(null);

  const form = useForm<CreateMessageData>({
    resolver: zodResolver(createMessageSchema),
    defaultValues: {
      subject: "",
      content: "",
    },
  });

  const { data: messages = [], isLoading } = useQuery({
    queryKey: ["/api/messages/user", userProfile?.id],
    enabled: !!userProfile,
  });

  const { data: users = [] } = useQuery({
    queryKey: ["/api/users"],
    enabled: !!userProfile,
  });

  const createMessageMutation = useMutation({
    mutationFn: async (data: CreateMessageData) => {
      const messageData = {
        ...data,
        senderId: userProfile!.id,
      };
      return apiRequest("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(messageData),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/messages/user"] });
      setIsCreateDialogOpen(false);
      form.reset();
      toast({
        title: "Meddelande skickat",
        description: "Ditt meddelande har skickats",
      });
    },
    onError: () => {
      toast({
        title: "Fel",
        description: "Kunde inte skicka meddelandet",
        variant: "destructive",
      });
    },
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (messageId: number) => {
      return apiRequest(`/api/messages/${messageId}/read`, {
        method: "PATCH",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/messages/user"] });
    },
  });

  const onSubmit = (data: CreateMessageData) => {
    createMessageMutation.mutate(data);
  };

  const handleViewMessage = (message: any) => {
    setSelectedMessage(message);
    if (!message.read && message.receiverId === userProfile?.id) {
      markAsReadMutation.mutate(message.id);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "Ryttare": return User;
      case "Tränare": return GraduationCap;
      case "Admin": return Settings;
      default: return User;
    }
  };

  const getOtherUsers = () => {
    return users.filter((user: any) => user.id !== userProfile?.id);
  };

  const getUserById = (id: number) => {
    return users.find((user: any) => user.id === id);
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
              <h1 className="text-3xl font-bold text-gray-900">Meddelanden</h1>
              <p className="text-gray-600 mt-2">
                Kommunicera med andra användare
              </p>
            </div>

            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Nytt meddelande
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Skapa nytt meddelande</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="receiverId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Till</FormLabel>
                          <Select onValueChange={(value) => field.onChange(parseInt(value))}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Välj mottagare" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {getOtherUsers().map((user: any) => {
                                const RoleIcon = getRoleIcon(user.role);
                                return (
                                  <SelectItem key={user.id} value={user.id.toString()}>
                                    <div className="flex items-center">
                                      <RoleIcon className="w-4 h-4 mr-2" />
                                      {user.name} ({user.role})
                                    </div>
                                  </SelectItem>
                                );
                              })}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ämne</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="content"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Meddelande</FormLabel>
                          <FormControl>
                            <Textarea {...field} rows={4} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button 
                      type="submit" 
                      className="w-full"
                      disabled={createMessageMutation.isPending}
                    >
                      {createMessageMutation.isPending ? "Skickar..." : "Skicka meddelande"}
                    </Button>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Messages List */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MessageSquare className="w-5 h-5 mr-2" />
                    Alla meddelanden ({messages.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="animate-pulse">
                          <div className="h-16 bg-gray-200 rounded"></div>
                        </div>
                      ))}
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="text-center py-8">
                      <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Inga meddelanden
                      </h3>
                      <p className="text-gray-600">
                        Du har inga meddelanden än. Skicka ditt första meddelande!
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {messages.map((message: any) => {
                        const isReceived = message.receiverId === userProfile.id;
                        const otherUser = getUserById(isReceived ? message.senderId : message.receiverId);
                        const RoleIcon = getRoleIcon(otherUser?.role || "");

                        return (
                          <div
                            key={message.id}
                            onClick={() => handleViewMessage(message)}
                            className={`p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${
                              !message.read && isReceived ? "bg-blue-50 border-blue-200" : "bg-white"
                            }`}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center mb-2">
                                  <RoleIcon className="w-4 h-4 mr-2 text-gray-600" />
                                  <span className="font-medium text-gray-900">
                                    {isReceived ? `Från: ${otherUser?.name}` : `Till: ${otherUser?.name}`}
                                  </span>
                                  {!message.read && isReceived && (
                                    <Badge variant="default" className="ml-2">Ny</Badge>
                                  )}
                                </div>
                                <h4 className="font-medium text-gray-900 mb-1">
                                  {message.subject}
                                </h4>
                                <p className="text-sm text-gray-600 line-clamp-2">
                                  {message.content}
                                </p>
                              </div>
                              <div className="text-xs text-gray-500 ml-4">
                                {format(new Date(message.createdAt), "PPP", { locale: sv })}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Message Detail */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Meddelandedetaljer</CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedMessage ? (
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-medium text-gray-900 mb-2">
                          {selectedMessage.subject}
                        </h3>
                        <div className="text-sm text-gray-600 mb-4">
                          <div className="flex items-center mb-1">
                            <span className="font-medium">
                              {selectedMessage.receiverId === userProfile.id ? "Från:" : "Till:"}
                            </span>
                            <span className="ml-2">
                              {getUserById(
                                selectedMessage.receiverId === userProfile.id 
                                  ? selectedMessage.senderId 
                                  : selectedMessage.receiverId
                              )?.name}
                            </span>
                          </div>
                          <div>
                            {format(new Date(selectedMessage.createdAt), "PPP 'kl.' HH:mm", { locale: sv })}
                          </div>
                        </div>
                        <div className="prose prose-sm max-w-none">
                          <p className="text-gray-900 whitespace-pre-wrap">
                            {selectedMessage.content}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">
                        Välj ett meddelande för att visa detaljer
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}