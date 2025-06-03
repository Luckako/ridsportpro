import { useState, useEffect } from "react";
import { User as FirebaseUser } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import type { User } from "@shared/schema";

interface AuthState {
  user: FirebaseUser | null;
  userProfile: User | null;
  loading: boolean;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    userProfile: null,
    loading: true,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Get user profile from Firestore
          const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
          const userProfile = userDoc.exists() ? userDoc.data() as User : null;
          
          setAuthState({
            user: firebaseUser,
            userProfile,
            loading: false,
          });
        } catch (error) {
          console.error("Error fetching user profile:", error);
          setAuthState({
            user: firebaseUser,
            userProfile: null,
            loading: false,
          });
        }
      } else {
        setAuthState({
          user: null,
          userProfile: null,
          loading: false,
        });
      }
    });

    return () => unsubscribe();
  }, []);

  return authState;
}
