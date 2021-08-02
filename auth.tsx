import { useState, useEffect, useContext, createContext, ReactNode, ReactElement } from 'react';
import nookies from 'nookies';
import firebase from './firebaseClient';
import 'firebase/auth';
import router from 'next/router';

const PUBLIC_ROUTES: string[] = ['/', '/login', '/register', '/forgot-password'];

const AuthContext = createContext<{ user: firebase.User | null }>({
  user: null,
});

type Props = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: Props): ReactElement => {
  const [user, setUser] = useState<firebase.User | null>(null);

  useEffect(() => {
    firebase.auth().onIdTokenChanged(async (user) => {
      if (!user) {
        if (!PUBLIC_ROUTES.includes(router.pathname)) {
          router.push('/login');
        }
        setUser(null);
        nookies.set(undefined, 'token', '', {});
        return;
      }
      const token = await user.getIdToken();
      setUser(user);
      nookies.set(undefined, 'token', token, {});
    });
  }, []);

  return <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
