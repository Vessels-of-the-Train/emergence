'use client';

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, User, Auth } from 'firebase/auth';
import { useState, useEffect } from 'react';

const firebaseConfig = {
    apiKey: "AIzaSyDAV80CafUaTQmE4ogDWSpb1BO5itNvmhk",
    authDomain: "studio-1290704476-65618.firebaseapp.com",
    projectId: "studio-1290704476-65618",
    storageBucket: "studio-1290704476-65618.firebasestorage.app",
    messagingSenderId: "730353954127",
    appId: "1:730353954127:web:5db622e0845f73f602e93a"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export function useFirebase() {
    const [user, setUser] = useState<User | null>(null);
    const [isUserLoading, setIsUserLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setIsUserLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return {
        user,
        isUserLoading,
        auth
    };
}
