import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuthContext } from "@/components/auth-provider";
import { useTheme } from "@/components/theme-provider";
import { 
  Menu, 
  Home, 
  Calendar, 
  MessageSquare, 
  BarChart3, 
  User, 
  Users, 
  LogOut, 
  Moon, 
  Sun,
  Settings
} from "lucide-react";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

export function MobileNav() {
  const { userProfile } = useAuthContext();
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setIsOpen(false);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  if (!userProfile) return null;

  const getNavigationItems = () => {
    const baseItems = [
      { href: "/dashboard", label: "Dashboard", icon: Home },
      { href: "/profile", label: "Min profil", icon: User },
      { href: "/messages", label: "Meddelanden", icon: MessageSquare },
    ];

    if (userProfile.role === "Admin") {
      return [
        ...baseItems,
        { href: "/users", label: "Användare", icon: Users },
        { href: "/lessons", label: "Lektioner", icon: Calendar },
        { href: "/progress", label: "Rapporter", icon: BarChart3 },
      ];
    } else if (userProfile.role === "Tränare") {
      return [
        ...baseItems,
        { href: "/lessons", label: "Lektioner", icon: Calendar },
        { href: "/progress", label: "Progress", icon: BarChart3 },
      ];
    } else {
      return [
        ...baseItems,
        { href: "/lessons", label: "Boka lektion", icon: Calendar },
        { href: "/progress", label: "Min progress", icon: BarChart3 },
      ];
    }
  };

  const navigationItems = getNavigationItems();

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="md:hidden text-gray-600 dark:text-gray-300"
        >
          <Menu className="w-5 h-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] sm:w-[400px]">
        <div className="flex flex-col h-full">
          {/* User Info */}
          <div className="border-b border-gray-200 dark:border-gray-700 pb-4 mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">
                  {userProfile.name}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {userProfile.email}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  {userProfile.role}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant="ghost"
                    className="w-full justify-start flex items-center space-x-3 h-12 text-gray-700 dark:text-gray-300"
                    onClick={() => setIsOpen(false)}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Button>
                </Link>
              );
            })}
          </nav>

          {/* Settings & Actions */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2">
            <Button
              variant="ghost"
              onClick={toggleTheme}
              className="w-full justify-start flex items-center space-x-3 h-12 text-gray-700 dark:text-gray-300"
            >
              {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              <span>{theme === "dark" ? "Ljust läge" : "Mörkt läge"}</span>
            </Button>

            <Button
              variant="ghost"
              className="w-full justify-start flex items-center space-x-3 h-12 text-gray-700 dark:text-gray-300"
            >
              <Settings className="w-5 h-5" />
              <span>Inställningar</span>
            </Button>

            <Button
              variant="ghost"
              onClick={handleSignOut}
              className="w-full justify-start flex items-center space-x-3 h-12 text-red-600 dark:text-red-400"
            >
              <LogOut className="w-5 h-5" />
              <span>Logga ut</span>
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}