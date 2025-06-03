import { useState } from "react";
import { Link, useLocation } from "wouter";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { registerUserSchema, type RegisterUser } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { Header } from "@/components/layout/header";
import { User, GraduationCap, Settings, CheckCircle, Loader2 } from "lucide-react";

const roles = [
  {
    value: "Ryttare" as const,
    label: "Ryttare",
    description: "Rider och deltagare i träning",
    icon: User,
    color: "blue",
  },
  {
    value: "Tränare" as const,
    label: "Tränare", 
    description: "Instruktör och tränare",
    icon: GraduationCap,
    color: "green",
  },
  {
    value: "Admin" as const,
    label: "Admin",
    description: "Administratör och hantering",
    icon: Settings,
    color: "purple",
  },
];

export default function Register() {
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<RegisterUser>({
    resolver: zodResolver(registerUserSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: undefined,
    },
  });

  const onSubmit = async (data: RegisterUser) => {
    setIsLoading(true);
    try {
      // Create user account with Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const user = userCredential.user;

      // Store user profile in Firestore
      await setDoc(doc(db, "users", user.uid), {
        firebaseUid: user.uid,
        email: data.email,
        name: data.name,
        role: data.role,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      toast({
        title: "Konto skapat!",
        description: `Välkommen som ${data.role}. Ditt konto har skapats framgångsrikt.`,
      });

      setLocation("/dashboard");
    } catch (error: any) {
      console.error("Registration error:", error);
      
      let errorMessage = "Ett fel uppstod vid registrering. Försök igen.";
      
      if (error.code === "auth/email-already-in-use") {
        errorMessage = "E-postadressen används redan av ett annat konto.";
      } else if (error.code === "auth/weak-password") {
        errorMessage = "Lösenordet är för svagt.";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Ogiltig e-postadress.";
      }

      toast({
        title: "Registrering misslyckades",
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
                <User className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Skapa ditt konto</h2>
              <p className="text-primary-100">Registrera dig för att komma igång med RidSportPro</p>
            </CardHeader>

            <CardContent className="px-6 py-8">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">
                          Fullt namn
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ditt fullständiga namn"
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
                            placeholder="Minst 6 tecken"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors placeholder-gray-400"
                            {...field}
                          />
                        </FormControl>
                        <div className="mt-2 text-xs text-gray-500">
                          Lösenordet måste innehålla minst 6 tecken
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700 mb-3">
                          Välj din roll
                        </FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            value={field.value}
                            className="grid grid-cols-1 gap-3"
                          >
                            {roles.map((role) => {
                              const IconComponent = role.icon;
                              const isSelected = field.value === role.value;
                              return (
                                <div key={role.value} className="relative">
                                  <RadioGroupItem
                                    value={role.value}
                                    id={role.value}
                                    className="sr-only"
                                  />

                                  <label
                                    htmlFor={role.value}
                                    className={`cursor-pointer block p-6 rounded-xl transition-all duration-300 ${
                                      isSelected 
                                        ? `border-4 scale-105 ${
                                            role.color === 'blue' ? 'border-blue-600 bg-blue-50 shadow-xl shadow-blue-200/50' :
                                            role.color === 'green' ? 'border-green-600 bg-green-50 shadow-xl shadow-green-200/50' :
                                            'border-purple-600 bg-purple-50 shadow-xl shadow-purple-200/50'
                                          }`
                                        : 'border-2 border-gray-200'
                                    }`}
                                  >
                                    <div className="flex items-center">
                                      <div className="flex-shrink-0 mr-4">
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                                          isSelected 
                                            ? role.color === 'blue' ? 'bg-blue-500 shadow-lg shadow-blue-300/50' :
                                              role.color === 'green' ? 'bg-green-500 shadow-lg shadow-green-300/50' :
                                              'bg-purple-500 shadow-lg shadow-purple-300/50'
                                            : role.color === 'blue' ? 'bg-blue-100' :
                                              role.color === 'green' ? 'bg-green-100' :
                                              'bg-purple-100'
                                        }`}>
                                          <IconComponent className={`w-6 h-6 transition-all duration-200 ${
                                            isSelected 
                                              ? 'text-white'
                                              : role.color === 'blue' ? 'text-blue-600' :
                                                role.color === 'green' ? 'text-green-600' :
                                                'text-purple-600'
                                          }`} />
                                        </div>
                                      </div>
                                      <div className="flex-1">
                                        <div className={`font-semibold text-lg transition-all duration-300 ${
                                          isSelected 
                                            ? role.color === 'blue' ? 'text-blue-700' :
                                              role.color === 'green' ? 'text-green-700' :
                                              'text-purple-700'
                                            : 'text-gray-900 hover:text-gray-700'
                                        }`}>
                                          {role.label}
                                        </div>
                                        <div className={`text-sm mt-1 transition-all duration-300 ${
                                          isSelected 
                                            ? role.color === 'blue' ? 'text-blue-600' :
                                              role.color === 'green' ? 'text-green-600' :
                                              'text-purple-600'
                                            : 'text-gray-600'
                                        }`}>
                                          {role.description}
                                        </div>
                                      </div>
                                      <div className="ml-4 flex flex-col items-end">
                                        <CheckCircle className={`w-6 h-6 opacity-0 peer-checked:opacity-100 transition-all duration-300 ${
                                          role.color === 'blue' ? 'text-blue-500' :
                                          role.color === 'green' ? 'text-green-500' :
                                          'text-purple-500'
                                        }`} />
                                        <div className={`mt-2 px-2 py-1 rounded-full text-xs font-bold opacity-0 peer-checked:opacity-100 transition-all duration-300 ${
                                          role.color === 'blue' ? 'bg-blue-500 text-white' :
                                          role.color === 'green' ? 'bg-green-500 text-white' :
                                          'bg-purple-500 text-white'
                                        }`}>
                                          VALD
                                        </div>
                                      </div>
                                    </div>
                                  </label>
                                </div>
                              );
                            })}
                          </RadioGroup>
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
                        Registrerar...
                      </>
                    ) : (
                      "Registrera konto"
                    )}
                  </Button>
                </form>
              </Form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Har du redan ett konto?{" "}
                  <Link href="/login">
                    <span className="font-medium text-primary hover:text-primary/80 transition-colors cursor-pointer">
                      Logga in här
                    </span>
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="mt-8 bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Vad ingår i ditt konto?</h3>
            <div className="space-y-3">
              {[
                "Personlig profil och inställningar",
                "Tillgång till träningsschema", 
                "Kommunikation med tränare",
                "Framstegsspårning och statistik",
              ].map((feature, index) => (
                <div key={index} className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
