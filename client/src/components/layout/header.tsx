import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/components/auth-provider";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { Home, Calendar, Users, MessageSquare, TrendingUp, Settings, Menu, X } from "lucide-react";
import { useState } from "react";

export function Header() {
  const { user, userProfile } = useAuthContext();
  const { toast } = useToast();
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      toast({
        title: "Utloggad",
        description: "Du har loggats ut framgångsrikt",
      });
    } catch (error) {
      toast({
        title: "Fel",
        description: "Kunde inte logga ut",
        variant: "destructive",
      });
    }
  };

  const navigationItems = [
    { href: "/dashboard", label: "Dashboard", icon: Home },
    { href: "/lessons", label: "Lektioner", icon: Calendar },
    { href: "/messages", label: "Meddelanden", icon: MessageSquare },
    { href: "/progress", label: "Framsteg", icon: TrendingUp },
  ];

  // Add admin-only navigation
  if (userProfile?.role === "Admin") {
    navigationItems.push({ href: "/users", label: "Användare", icon: Settings });
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link href="/dashboard">
                <h1 className="text-xl font-bold text-gray-900 cursor-pointer">
                  RidSport<span className="text-primary">Pro</span>
                </h1>
              </Link>
            </div>
            
            {user && (
              <nav className="hidden md:flex ml-8 space-x-6">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location === item.href;
                  return (
                    <Link key={item.href} href={item.href}>
                      <div className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors touch-manipulation ${
                        isActive 
                          ? "bg-primary text-white" 
                          : "text-gray-700 hover:text-primary hover:bg-gray-50 active:bg-gray-100"
                      }`}>
                        <Icon className="w-4 h-4 mr-2" />
                        {item.label}
                      </div>
                    </Link>
                  );
                })}
              </nav>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="hidden sm:block text-sm text-gray-700">
                  Hej, {userProfile?.name || user.email}
                  {userProfile?.role && (
                    <span className="ml-1 text-xs text-gray-500">
                      ({userProfile.role})
                    </span>
                  )}
                </span>
                <Button variant="outline" onClick={handleSignOut} className="hidden sm:flex">
                  Logga ut
                </Button>
                
                {/* Mobile menu button */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="md:hidden p-2"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                  {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" className="text-gray-500 hover:text-gray-900">
                    Logga in
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="bg-primary hover:bg-primary/90">
                    Registrera
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
        
        {/* Mobile Navigation Menu */}
        {user && isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-4 py-4 space-y-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = location === item.href;
                return (
                  <Link key={item.href} href={item.href}>
                    <div 
                      className={`flex items-center px-4 py-3 rounded-lg text-base font-medium transition-colors touch-manipulation ${
                        isActive 
                          ? "bg-primary text-white" 
                          : "text-gray-700 hover:bg-gray-50 active:bg-gray-100"
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Icon className="w-5 h-5 mr-3" />
                      {item.label}
                    </div>
                  </Link>
                );
              })}
              
              <div className="pt-4 border-t border-gray-200">
                <div className="px-4 py-2">
                  <p className="text-sm text-gray-600">
                    {userProfile?.name || user.email}
                  </p>
                  {userProfile?.role && (
                    <p className="text-xs text-gray-500">{userProfile.role}</p>
                  )}
                </div>
                <Button 
                  variant="outline" 
                  onClick={handleSignOut}
                  className="w-full mx-4 mt-2"
                >
                  Logga ut
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
