import { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { onAuthStateChanged, signInWithEmailAndPassword, type User } from 'firebase/auth';
import { ref, onValue, off, get } from 'firebase/database';

interface AuthContextType {
    currentUser: User | null | any;
    userData: any | null; // { role: 'admin' | 'user', ... }
    loading: boolean;
    isAdmin: boolean;
    loginAdmin: () => Promise<void>;
    loginUser: (email: string, password: string) => Promise<void>;
    registerUser: (email: string, password: string, name: string, mobile: string) => Promise<void>;
    logout: () => Promise<void>;
    isLoginModalOpen: boolean;
    modalView: 'login' | 'register';
    openLoginModal: (view?: 'login' | 'register') => void;
    closeLoginModal: () => void;
    heroSlides: any[];
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
    modalView: 'login',
    openLoginModal: () => { },
    closeLoginModal: () => { },
    heroSlides: []
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [currentUser, setCurrentUser] = useState<any | null>(null);
    const [userData, setUserData] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [heroSlides, setHeroSlides] = useState<any[]>([]);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [modalView, setModalView] = useState<'login' | 'register'>('login');

    const openLoginModal = (view: 'login' | 'register' = 'login') => {
        setModalView(view);
        setIsLoginModalOpen(true);
    };
    const closeLoginModal = () => setIsLoginModalOpen(false);

    useEffect(() => {
        // Check for hardcoded admin session first
        const adminSession = localStorage.getItem('travelAppAdmin');

        // Coordinate "Auth Ready" and "Image Ready".
        let authReady = false;
        let imageReady = false;

        // Function to check if everything is ready
        const checkReady = () => {
            if (authReady && imageReady) {
                setLoading(false);
            }
        };

        // 1. Image Preloading Logic
        const preloadHeroImage = async () => {
            try {
                // Fetch hero slides once to get the first image
                const snapshot = await get(ref(db, 'hero_slides'));
                if (snapshot.exists()) {
                    const data = snapshot.val();
                    const slides = Object.values(data);

                    // Format slides nicely if needed (similar to how Hero uses Object.entries but here we just need values or consistent format)
                    // Hero.tsx uses: Object.entries(data).map(([key, val]) => ({ id: key, ...val }))
                    const formattedSlides = Object.entries(data).map(([key, val]: [string, any]) => ({
                        id: key,
                        ...val
                    }));

                    setHeroSlides(formattedSlides);

                    if (slides.length > 0) {
                        const firstSlide: any = slides[0];
                        if (firstSlide && firstSlide.image) {
                            const img = new Image();
                            img.src = firstSlide.image;
                            await new Promise((resolve) => {
                                img.onload = resolve;
                                img.onerror = resolve; // Proceed even if error
                            });
                        }
                    }
                }
            } catch (error) {
                console.error("Error preloading hero image:", error);
            } finally {
                imageReady = true;
                checkReady();
            }
        };

        preloadHeroImage();

        // 2. Auth Logic (Modified to call checkReady instead of setLoading(false))
        if (adminSession) {
            const adminUser = JSON.parse(adminSession);
            setCurrentUser(adminUser);
            setUserData({ role: 'admin', name: 'Admin User' });
            authReady = true;
            checkReady();
            return; // Exit effect (cleanup not needed for admin session)
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
                        setUserData({
                            email: user.email,
                            name: user.displayName || '',
                            role: 'user'
                        });
                    }
                    authReady = true;
                    checkReady();
                }, (error) => {
                    console.error("Error fetching user data:", error);
                    setUserData(null);
                    authReady = true; // Still ready, just failed data
                    checkReady();
                });

            } else {
                setCurrentUser(null);
                setUserData(null);
                authReady = true;
                checkReady();
            }
        });

        return () => {
            if (userRef && dataListener) {
                off(userRef, dataListener);
            }
            unsubscribe();
        };
    }, []);

    // Check for first visit to show login modal
    useEffect(() => {
        if (!loading && !currentUser) {
            const hasVisited = localStorage.getItem('hasVisitedSite');
            if (!hasVisited) {
                // Small delay for better UX
                const timer = setTimeout(() => {
                    openLoginModal('register'); // Show register for new users
                    localStorage.setItem('hasVisitedSite', 'true');
                }, 1000);
                return () => clearTimeout(timer);
            }
        }
    }, [loading, currentUser]);

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

    const registerUser = async (email: string, password: string, name: string, mobile: string) => {
        try {
            // NOTE: We use "Email/Password" auth provider for "Mobile/Password" login.
            // The 'email' argument here is a synthetic email (e.g. "9876543210@travelapp.local")
            // This allows us to use password authentication with a mobile number.
            // Ensure "Email/Password" provider is ENABLED in Firebase Console.

            // Dynamically import to keep bundle size optimized if not always used, 
            // but standard imports are fine. using dynamic just to be safe with user imports as per request
            const { createUserWithEmailAndPassword } = await import('firebase/auth');
            const { ref, set } = await import('firebase/database');

            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            const userRef = ref(db, `users/${user.uid}`);
            const userData = {
                email,
                name,
                mobile,
                role: 'user',
                createdAt: new Date().toISOString()
            };

            await set(userRef, userData);
            console.log("User data saved to database:", userData);

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
        modalView,
        openLoginModal,
        closeLoginModal,
        heroSlides // Expose the preloaded slides
    };

    return (
        <AuthContext.Provider value={value}>
            {loading ? (
                <div className="min-h-screen flex items-center justify-center bg-gray-900 overflow-hidden">
                    <div className="relative flex items-center justify-center">
                        {/* Central Logo */}
                        <div className="relative z-10 w-24 h-24 md:w-32 md:h-32 bg-white rounded-full overflow-hidden border-4 border-white shadow-xl">
                            <img src="/logom.jpg" alt="Travel App Logo" className="w-full h-full object-cover" />
                        </div>

                        {/* Spinning Ring with Bus */}
                        <div className="absolute w-36 h-36 md:w-48 md:h-48 animate-spin-slow rounded-full border-2 border-dashed border-gray-600 flex items-center justify-center">
                            {/* Bus Container - Positioned at the top of the ring */}
                            <div className="absolute -top-5 left-1/2 transform -translate-x-1/2">
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="transform drop-shadow-lg">
                                    <g transform="scale(0.8) translate(3,3)">
                                        {/* Bus Body */}
                                        <rect x="2" y="6" width="20" height="14" rx="2" fill="#ef4444" stroke="white" strokeWidth="1" />
                                        {/* Windows */}
                                        <rect x="4" y="8" width="4" height="4" rx="0.5" fill="white" />
                                        <rect x="9" y="8" width="4" height="4" rx="0.5" fill="white" />
                                        <rect x="14" y="8" width="4" height="4" rx="0.5" fill="white" />
                                        {/* Wheels */}
                                        <circle cx="7" cy="20" r="2.5" fill="#1f2937" stroke="gray" strokeWidth="1" />
                                        <circle cx="17" cy="20" r="2.5" fill="#1f2937" stroke="gray" strokeWidth="1" />
                                        {/* Lights */}
                                        <rect x="20" y="15" width="2" height="3" fill="#fbbf24" />
                                    </g>
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            ) : children}
        </AuthContext.Provider>
    );
};
