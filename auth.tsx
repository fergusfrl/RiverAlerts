import { useState, useEffect, useContext, createContext, ReactNode, ReactElement } from 'react';
import nookies from 'nookies';
import firebaseClient from './firebaseClient';
import firebase from 'firebase/app';
import 'firebase/auth';

const AuthContext = createContext<{ user: firebase.User | null }>({
  user: null,
});

type Props = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: Props): ReactElement => {
  firebaseClient();
  const [user, setUser] = useState<firebase.User | null>(null);

  useEffect(() => {
    return firebase.auth().onIdTokenChanged(async (user) => {
      if (!user) {
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
