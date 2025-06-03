import { useAuthContext } from "@/components/auth-provider";
import { Header } from "@/components/layout/header";
import { WelcomeWidget } from "@/components/welcome-widget";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, GraduationCap, Settings, Calendar, Users, BarChart3 } from "lucide-react";

const roleIcons = {
  Ryttare: User,
  Tränare: GraduationCap,
  Admin: Settings,
};

const roleColors = {
  Ryttare: "bg-blue-100 text-blue-800",
  Tränare: "bg-green-100 text-green-800",
  Admin: "bg-purple-100 text-purple-800",
};

export default function Dashboard() {
  const { user, userProfile, loading } = useAuthContext();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!user || !userProfile) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Du måste logga in för att se denna sida
            </h1>
          </div>
        </main>
      </div>
    );
  }

  const RoleIcon = roleIcons[userProfile.role];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Widget */}
          <div className="mb-8">
            <WelcomeWidget />
          </div>

          {/* Role-specific Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userProfile.role === "Ryttare" && (
              <>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Nästa träning</CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">Imorgon</div>
                    <p className="text-xs text-muted-foreground">
                      Hopplektion 14:00 - 15:00
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Genomförda lektioner</CardTitle>
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">12</div>
                    <p className="text-xs text-muted-foreground">
                      denna månad
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Min tränare</CardTitle>
                    <GraduationCap className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">Anna</div>
                    <p className="text-xs text-muted-foreground">
                      Hopptränare
                    </p>
                  </CardContent>
                </Card>
              </>
            )}

            {userProfile.role === "Tränare" && (
              <>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Mina ryttare</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">15</div>
                    <p className="text-xs text-muted-foreground">
                      aktiva ryttare
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Dagens lektioner</CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">3</div>
                    <p className="text-xs text-muted-foreground">
                      schemalagda idag
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Månadens lektioner</CardTitle>
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">48</div>
                    <p className="text-xs text-muted-foreground">
                      genomförda denna månad
                    </p>
                  </CardContent>
                </Card>
              </>
            )}

            {userProfile.role === "Admin" && (
              <>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Totala användare</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">127</div>
                    <p className="text-xs text-muted-foreground">
                      registrerade användare
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Aktiva tränare</CardTitle>
                    <GraduationCap className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">8</div>
                    <p className="text-xs text-muted-foreground">
                      tränare i systemet
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Systemstatus</CardTitle>
                    <Settings className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">Online</div>
                    <p className="text-xs text-muted-foreground">
                      alla tjänster fungerar
                    </p>
                  </CardContent>
                </Card>
              </>
            )}
          </div>

          {/* Quick Actions */}
          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Snabbåtgärder</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {userProfile.role === "Ryttare" && (
                    <>
                      <a href="/lessons" className="p-4 bg-gray-50 rounded-lg text-center hover:bg-gray-100 transition-colors cursor-pointer">
                        <Calendar className="w-8 h-8 mx-auto mb-2 text-gray-600" />
                        <p className="text-sm font-medium">Boka lektion</p>
                      </a>
                      <a href="/progress" className="p-4 bg-gray-50 rounded-lg text-center hover:bg-gray-100 transition-colors cursor-pointer">
                        <BarChart3 className="w-8 h-8 mx-auto mb-2 text-gray-600" />
                        <p className="text-sm font-medium">Se framsteg</p>
                      </a>
                      <a href="/messages" className="p-4 bg-gray-50 rounded-lg text-center hover:bg-gray-100 transition-colors cursor-pointer">
                        <GraduationCap className="w-8 h-8 mx-auto mb-2 text-gray-600" />
                        <p className="text-sm font-medium">Kontakta tränare</p>
                      </a>
                      <a href="/profile" className="p-4 bg-gray-50 rounded-lg text-center hover:bg-gray-100 transition-colors cursor-pointer">
                        <User className="w-8 h-8 mx-auto mb-2 text-gray-600" />
                        <p className="text-sm font-medium">Uppdatera profil</p>
                      </a>
                    </>
                  )}

                  {userProfile.role === "Tränare" && (
                    <>
                      <a href="/lessons" className="p-4 bg-gray-50 rounded-lg text-center hover:bg-gray-100 transition-colors cursor-pointer">
                        <Calendar className="w-8 h-8 mx-auto mb-2 text-gray-600" />
                        <p className="text-sm font-medium">Schemalägg lektion</p>
                      </a>
                      <a href="/messages" className="p-4 bg-gray-50 rounded-lg text-center hover:bg-gray-100 transition-colors cursor-pointer">
                        <Users className="w-8 h-8 mx-auto mb-2 text-gray-600" />
                        <p className="text-sm font-medium">Hantera ryttare</p>
                      </a>
                      <a href="/progress" className="p-4 bg-gray-50 rounded-lg text-center hover:bg-gray-100 transition-colors cursor-pointer">
                        <BarChart3 className="w-8 h-8 mx-auto mb-2 text-gray-600" />
                        <p className="text-sm font-medium">Se statistik</p>
                      </a>
                      <a href="/profile" className="p-4 bg-gray-50 rounded-lg text-center hover:bg-gray-100 transition-colors cursor-pointer">
                        <GraduationCap className="w-8 h-8 mx-auto mb-2 text-gray-600" />
                        <p className="text-sm font-medium">Uppdatera profil</p>
                      </a>
                    </>
                  )}

                  {userProfile.role === "Admin" && (
                    <>
                      <a href="/users" className="p-4 bg-gray-50 rounded-lg text-center hover:bg-gray-100 transition-colors cursor-pointer">
                        <Users className="w-8 h-8 mx-auto mb-2 text-gray-600" />
                        <p className="text-sm font-medium">Hantera användare</p>
                      </a>
                      <a href="/messages" className="p-4 bg-gray-50 rounded-lg text-center hover:bg-gray-100 transition-colors cursor-pointer">
                        <Settings className="w-8 h-8 mx-auto mb-2 text-gray-600" />
                        <p className="text-sm font-medium">Systeminställningar</p>
                      </a>
                      <a href="/progress" className="p-4 bg-gray-50 rounded-lg text-center hover:bg-gray-100 transition-colors cursor-pointer">
                        <BarChart3 className="w-8 h-8 mx-auto mb-2 text-gray-600" />
                        <p className="text-sm font-medium">Rapporter</p>
                      </a>
                      <a href="/lessons" className="p-4 bg-gray-50 rounded-lg text-center hover:bg-gray-100 transition-colors cursor-pointer">
                        <Calendar className="w-8 h-8 mx-auto mb-2 text-gray-600" />
                        <p className="text-sm font-medium">Schemaöversikt</p>
                      </a>
                      <a href="/profile" className="p-4 bg-gray-50 rounded-lg text-center hover:bg-gray-100 transition-colors cursor-pointer">
                        <User className="w-8 h-8 mx-auto mb-2 text-gray-600" />
                        <p className="text-sm font-medium">Uppdatera profil</p>
                      </a>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
