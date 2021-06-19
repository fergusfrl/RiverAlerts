import { useState, useEffect, useContext, createContext, ReactNode, ReactElement } from 'react';
import nookies from 'nookies';
import firebaseClient from './firebaseClient';
import firebase from 'firebase/app';
import 'firebase/auth';
import { User } from './types';

const AuthContext = createContext<{ user: firebase.User | null; userInfo: User | null }>({
  user: null,
  userInfo: null,
});

type Props = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: Props): ReactElement => {
  firebaseClient();
  const [user, setUser] = useState<firebase.User | null>(null);
  const [userInfo, setUserInfo] = useState<User | null>(null);

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

      const userRef = await firebase.firestore().collection('users').doc(user.uid).get();
      const userDoc = userRef.data() as User;
      setUserInfo(userDoc);
    });
  }, []);

  return <AuthContext.Provider value={{ user, userInfo }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
