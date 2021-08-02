import { useState, useEffect, useContext, createContext, ReactNode, ReactElement } from 'react';
import { useRouter } from 'next/router';
import nookies from 'nookies';
import firebase from './firebaseClient';
import 'firebase/auth';

const AuthContext = createContext<{ user: firebase.User | null }>({
  user: null,
});

type Props = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: Props): ReactElement => {
  const router = useRouter();
  const [user, setUser] = useState<firebase.User | null>(null);

  useEffect(() => {
    firebase.auth().onIdTokenChanged(async (user) => {
      if (!user) {
        setUser(null);
        nookies.set(undefined, 'token', '', {});
        router.push('/login');
        return;
      }
      const token = await user.getIdToken();
      setUser(user);
      nookies.set(undefined, 'token', token, {});
    });
  }, [router]);

  return <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
