import admin from 'firebase-admin';
import { User } from './types';

const initializeAdminSDK = (): void => {
  if (!admin.apps.length) {
    // if deployed to a GCP environment, ENV VARs not required.
    if (process.env.NODE_ENV === 'production') {
      admin.initializeApp();
    } else {
      const firebaseAuthParams = {
        type: process.env.NEXT_PUBLIC_FIREBASE_ADMIN_TYPE,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_ADMIN_PROJECT_ID,
        privateKeyId: process.env.NEXT_PUBLIC_FIREBASE_ADMIN_PRIVATE_KEY_ID,
        privateKey: process.env.NEXT_PUBLIC_FIREBASE_ADMIN_PRIVATE_KEY,
        clientEmail: process.env.NEXT_PUBLIC_FIREBASE_ADMIN_CLIENT_EMAIL,
        clientId: process.env.NEXT_PUBLIC_FIREBASE_ADMIN_CLIENT_ID,
        authUri: process.env.NEXT_PUBLIC_FIREBASE_ADMIN_AUTH_URI,
        tokenUri: process.env.NEXT_PUBLIC_FIREBASE_ADMIN_TOKEN_URI,
        authProviderX509CertUrl: process.env.NEXT_PUBLIC_FIREBASE_ADMIN_AUTH_PROVIDER_X509_CERT_URL,
        clientC509CertUrl: process.env.NEXT_PUBLIC_FIREBASE_ADMIN_CLIENT_X509_CERT_URL,
      };
      admin.initializeApp({
        credential: admin.credential.cert(firebaseAuthParams),
        // databaseURL: ,
      });
    }
  }
};

export const verifyIdToken = (token: string): Promise<admin.auth.DecodedIdToken> => {
  initializeAdminSDK();
  return admin
    .auth()
    .verifyIdToken(token)
    .catch((err) => {
      throw err;
    });
};

export const getUserDoc = async (uid: string): Promise<User> => {
  initializeAdminSDK();
  const userDoc = await admin.firestore().collection('users').doc(uid).get();
  return userDoc.data() as User;
};

// export const deleteUser = (uid: string): Promise<void> => {
//   initializeAdminSDK();
//   return admin
//     .auth()
//     .deleteUser(uid)
//     .catch((err) => {
//       throw err;
//     });
// };
