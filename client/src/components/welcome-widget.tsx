import { useAuthContext } from "@/components/auth-provider";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { 
  Calendar, 
  MessageSquare, 
  TrendingUp, 
  Users, 
  Sparkles, 
  ChevronRight,
  Sun,
  Moon,
  Sunrise,
  Sunset,
  Target,
  Award,
  Clock
} from "lucide-react";

interface UserStats {
  weeklyLessons: number;
  totalLessons: number;
  currentStreak: number;
  nextLesson?: {
    title: string;
    date: string;
    time: string;
  };
  unreadMessages: number;
  achievements: Array<{
    id: string;
    title: string;
    icon: string;
    unlockedDate: string;
  }>;
}

export function WelcomeWidget() {
  const { userProfile } = useAuthContext();

  // Fetch user statistics for personalization
  const { data: userStats } = useQuery<UserStats>({
    queryKey: ["/api/user/stats", userProfile?.id],
    enabled: !!userProfile?.id,
  });

  if (!userProfile) return null;

  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    
    if (hour >= 5 && hour < 12) {
      return {
        greeting: "God morgon",
        icon: Sunrise,
        message: "Redo för en fantastisk dag med ridning?",
        color: "text-yellow-600 bg-yellow-100"
      };
    } else if (hour >= 12 && hour < 17) {
      return {
        greeting: "God eftermiddag",
        icon: Sun,
        message: "Perfekt tid för träning!",
        color: "text-orange-600 bg-orange-100"
      };
    } else if (hour >= 17 && hour < 21) {
      return {
        greeting: "God kväll",
        icon: Sunset,
        message: "Dags att reflektera över dagens framsteg.",
        color: "text-purple-600 bg-purple-100"
      };
    } else {
      return {
        greeting: "God natt",
        icon: Moon,
        message: "Vila gott efter en dag med ridning.",
        color: "text-blue-600 bg-blue-100"
      };
    }
  };

  const getRoleSpecificMessage = () => {
    const role = userProfile.role;
    
    switch (role) {
      case "Ryttare":
        return {
          message: "Fortsätt utveckla dina ridfärdigheter och nå nya höjder!",
          quickActions: [
            { label: "Boka nästa lektion", href: "/lessons", icon: Calendar },
            { label: "Se min progress", href: "/progress", icon: TrendingUp }
          ]
        };
      case "Tränare":
        return {
          message: "Inspirera och vägled dina ryttare till framgång idag!",
          quickActions: [
            { label: "Schemalägg lektion", href: "/lessons", icon: Calendar },
            { label: "Kontakta ryttare", href: "/messages", icon: MessageSquare }
          ]
        };
      case "Admin":
        return {
          message: "Hantera systemet och stöd hela ridgemenskapen!",
          quickActions: [
            { label: "Hantera användare", href: "/users", icon: Users },
            { label: "Systemöversikt", href: "/lessons", icon: TrendingUp }
          ]
        };
      default:
        return {
          message: "Välkommen till RidSportPro!",
          quickActions: []
        };
    }
  };

  const getMotivationalQuote = () => {
    const quotes = [
      "Varje ridtur är en möjlighet att växa.",
      "Framgång kommer från uthållighet och passion.",
      "Hästar lär oss tålamod och ödmjukhet.",
      "Tillsammans når vi längre än ensamma.",
      "Varje dag är en chans att bli bättre.",
      "Ridning handlar om partnerskap och förståelse."
    ];
    
    const today = new Date().getDate();
    return quotes[today % quotes.length];
  };

  const getPersonalizedMessage = () => {
    if (!userStats) return roleMessage.message;
    
    const role = userProfile.role;
    
    if (userStats.currentStreak > 0) {
      return `${userStats.currentStreak} dagars träningsstreak! ${roleMessage.message}`;
    }
    
    if (userStats.weeklyLessons > 0) {
      return `${userStats.weeklyLessons} lektioner denna vecka. ${roleMessage.message}`;
    }
    
    return roleMessage.message;
  };

  const timeGreeting = getTimeBasedGreeting();
  const roleMessage = getRoleSpecificMessage();
  const quote = getMotivationalQuote();
  const TimeIcon = timeGreeting.icon;

  return (
    <Card className="overflow-hidden bg-gradient-to-br from-primary/5 via-white to-primary/10 dark:from-primary/10 dark:via-gray-900 dark:to-primary/5 border-primary/20">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            {/* Time-based greeting */}
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-2 rounded-full ${timeGreeting.color}`}>
                <TimeIcon className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {timeGreeting.greeting}, {userProfile.name}!
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {timeGreeting.message}
                </p>
              </div>
            </div>

            {/* Role badge and message */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Badge 
                  variant="outline" 
                  className="bg-primary/10 text-primary border-primary/20"
                >
                  <Sparkles className="w-3 h-3 mr-1" />
                  {userProfile.role}
                </Badge>
                {userStats && userStats.currentStreak > 0 && (
                  <Badge variant="outline" className="bg-orange-100 text-orange-700 border-orange-200">
                    <Target className="w-3 h-3 mr-1" />
                    {userStats.currentStreak} dagars streak
                  </Badge>
                )}
              </div>
              <p className="text-gray-700 dark:text-gray-300 font-medium">
                {getPersonalizedMessage()}
              </p>
            </div>

            {/* Personalized stats */}
            {userStats && (
              <div className="mb-4 grid grid-cols-2 md:grid-cols-4 gap-3">
                {userStats.weeklyLessons > 0 && (
                  <div className="text-center p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg border border-primary/10">
                    <Calendar className="w-4 h-4 mx-auto mb-1 text-primary" />
                    <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{userStats.weeklyLessons}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Denna vecka</p>
                  </div>
                )}
                {userStats.totalLessons > 0 && (
                  <div className="text-center p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg border border-primary/10">
                    <Award className="w-4 h-4 mx-auto mb-1 text-primary" />
                    <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{userStats.totalLessons}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Totalt</p>
                  </div>
                )}
                {userStats.unreadMessages > 0 && (
                  <div className="text-center p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg border border-primary/10">
                    <MessageSquare className="w-4 h-4 mx-auto mb-1 text-primary" />
                    <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{userStats.unreadMessages}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Nya meddelanden</p>
                  </div>
                )}
                {userStats.nextLesson && (
                  <div className="text-center p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg border border-primary/10">
                    <Clock className="w-4 h-4 mx-auto mb-1 text-primary" />
                    <p className="text-xs font-bold text-gray-900 dark:text-gray-100">{userStats.nextLesson.time}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Nästa lektion</p>
                  </div>
                )}
              </div>
            )}

            {/* Motivational quote */}
            <div className="mb-6">
              <blockquote className="italic text-gray-600 dark:text-gray-400 border-l-4 border-primary/30 pl-4">
                "{quote}"
              </blockquote>
            </div>

            {/* Quick actions */}
            {roleMessage.quickActions.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Snabbåtgärder för dig:
                </p>
                <div className="flex flex-wrap gap-2">
                  {roleMessage.quickActions.map((action, index) => {
                    const ActionIcon = action.icon;
                    return (
                      <Link key={index} href={action.href}>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="bg-white/50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-800 border-primary/20 hover:border-primary/40 transition-all duration-200"
                        >
                          <ActionIcon className="w-4 h-4 mr-2" />
                          {action.label}
                          <ChevronRight className="w-3 h-3 ml-2" />
                        </Button>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Decorative element */}
          <div className="hidden md:block ml-6">
            <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}