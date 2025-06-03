import { useState } from "react";
import { Link, useLocation } from "wouter";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Header } from "@/components/layout/header";
import { LogIn, Loader2 } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Ogiltig e-postadress"),
  password: z.string().min(1, "Lösenord är obligatoriskt"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function Login() {
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      
      toast({
        title: "Inloggning lyckades",
        description: "Välkommen tillbaka!",
      });

      setLocation("/dashboard");
    } catch (error: any) {
      console.error("Login error:", error);
      
      let errorMessage = "Ett fel uppstod vid inloggning. Försök igen.";
      
      if (error.code === "auth/user-not-found") {
        errorMessage = "Ingen användare hittades med denna e-postadress.";
      } else if (error.code === "auth/wrong-password") {
        errorMessage = "Felaktigt lösenord.";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Ogiltig e-postadress.";
      } else if (error.code === "auth/too-many-requests") {
        errorMessage = "För många felaktiga försök. Försök igen senare.";
      }

      toast({
        title: "Inloggning misslyckades",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <Card className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-primary to-teal-700 px-6 py-8 text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <LogIn className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Logga in</h2>
              <p className="text-primary-100">Välkommen tillbaka till RidSportPro</p>
            </CardHeader>

            <CardContent className="px-6 py-8">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">
                          E-postadress
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="din@email.com"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors placeholder-gray-400"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">
                          Lösenord
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Ditt lösenord"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors placeholder-gray-400"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-primary text-white py-3 px-4 rounded-lg font-medium hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" />
                        Loggar in...
                      </>
                    ) : (
                      "Logga in"
                    )}
                  </Button>
                </form>
              </Form>

              <div className="mt-6 text-center space-y-3">
                <Link href="/forgot-password">
                  <span className="text-sm font-medium text-primary hover:text-primary/80 transition-colors cursor-pointer">
                    Glömt lösenord?
                  </span>
                </Link>
                
                <p className="text-sm text-gray-600">
                  Har du inget konto?{" "}
                  <Link href="/register">
                    <span className="font-medium text-primary hover:text-primary/80 transition-colors cursor-pointer">
                      Registrera dig här
                    </span>
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
