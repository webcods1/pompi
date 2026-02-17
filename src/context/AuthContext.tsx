import { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { onAuthStateChanged, signInWithEmailAndPassword, type User } from 'firebase/auth';
import { ref, onValue, off } from 'firebase/database';

interface AuthContextType {
    currentUser: User | null | any;
    userData: any | null; // { role: 'admin' | 'user', ... }
    loading: boolean;
    isAdmin: boolean;
    loginAdmin: () => Promise<void>;
    loginUser: (email: string, password: string) => Promise<void>;
    registerUser: (email: string, password: string, name: string) => Promise<void>;
    logout: () => Promise<void>;
    isLoginModalOpen: boolean;
    openLoginModal: () => void;
    closeLoginModal: () => void;
}

const AuthContext = createContext<AuthContextType>({
    currentUser: null,
    userData: null,
    loading: true,
    isAdmin: false,
    loginAdmin: async () => { },
    loginUser: async () => { },
    registerUser: async () => { },
    logout: async () => { },
    isLoginModalOpen: false,
    openLoginModal: () => { },
    closeLoginModal: () => { }
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [currentUser, setCurrentUser] = useState<any | null>(null);
    const [userData, setUserData] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

    const openLoginModal = () => setIsLoginModalOpen(true);
    const closeLoginModal = () => setIsLoginModalOpen(false);

    useEffect(() => {
        // Check for hardcoded admin session first
        const adminSession = localStorage.getItem('travelAppAdmin');
        if (adminSession) {
            const adminUser = JSON.parse(adminSession);
            setCurrentUser(adminUser);
            setUserData({ role: 'admin', name: 'Admin User' });
            setLoading(false);
            return;
        }

        let userRef: any = null;
        let dataListener: any = null;

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            // Clean up previous listener if it exists
            if (userRef && dataListener) {
                off(userRef, dataListener);
                userRef = null;
                dataListener = null;
            }

            if (user) {
                setCurrentUser(user);

                // Subscribe to user data in RTDB
                userRef = ref(db, `users/${user.uid}`);
                dataListener = onValue(userRef, (snapshot) => {
                    const data = snapshot.val();
                    if (data) {
                        setUserData(data);
                    } else {
                        // If no data exists yet (could be race condition on registration), set partial or null
                        setUserData({
                            email: user.email,
                            name: user.displayName || '',
                            role: 'user'
                        });
                    }
                    setLoading(false);
                }, (error) => {
                    console.error("Error fetching user data:", error);
                    setUserData(null);
                    setLoading(false);
                });

            } else {
                setCurrentUser(null);
                setUserData(null);
                setLoading(false);
            }
        });

        return () => {
            if (userRef && dataListener) {
                off(userRef, dataListener);
            }
            unsubscribe();
        };
    }, []);

    const loginAdmin = async () => {
        try {
            // Sign in to Firebase with the hardcoded admin email/password
            // This requires the admin user to actually exist in Firebase Authentication!
            await signInWithEmailAndPassword(auth, 'admin@pompi.com', 'password123');

            // Set local state just in case, though onAuthStateChanged will handle it
            const adminUser = { uid: 'admin-local', email: 'admin@pompi.com', displayName: 'Admin' };
            localStorage.setItem('travelAppAdmin', JSON.stringify(adminUser));

            // We rely on the auth listener to update state, but setting local storage helps persistence preference
        } catch (error) {
            console.error("Firebase Admin Login Failed:", error);
            // Fallback to local-only mode if firebase auth fails (e.g. user doesn't exist yet)
            const adminUser = { uid: 'admin-local', email: 'admin@pompi.com', displayName: 'Admin' };
            localStorage.setItem('travelAppAdmin', JSON.stringify(adminUser));
            setCurrentUser(adminUser);
            setUserData({ role: 'admin', name: 'Admin User' });
        }
    };

    const loginUser = async (email: string, password: string) => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            closeLoginModal();
        } catch (error) {
            console.error("Error logging in user:", error);
            throw error;
        }
    };

    const registerUser = async (email: string, password: string, name: string) => {
        try {
            // Dynamically import to keep bundle size optimized if not always used, 
            // but standard imports are fine. using dynamic just to be safe with user imports as per request
            const { createUserWithEmailAndPassword } = await import('firebase/auth');
            const { ref, set } = await import('firebase/database');

            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            const userRef = ref(db, `users/${user.uid}`);
            await set(userRef, {
                email,
                name,
                role: 'user',
                createdAt: new Date().toISOString()
            });
            // Update local state implicitly via onAuthStateChanged
            closeLoginModal();
        } catch (error) {
            console.error("Error registering user:", error);
            throw error;
        }
    };

    const logout = async () => {
        localStorage.removeItem('travelAppAdmin');
        await auth.signOut();
        setCurrentUser(null);
        setUserData(null);
    };

    const value = {
        currentUser,
        userData,
        loading,
        isAdmin: userData?.role === 'admin',
        loginAdmin,
        loginUser,
        registerUser,
        logout,
        isLoginModalOpen,
        openLoginModal,
        closeLoginModal
    };

    return (
        <AuthContext.Provider value={value}>
            {loading ? (
                <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
                    <div className="flex flex-col items-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
                        <p className="text-sm font-medium animate-pulse">Initializing TravelApp...</p>
                    </div>
                </div>
            ) : children}
        </AuthContext.Provider>
    );
};
