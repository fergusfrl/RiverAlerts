import admin from 'firebase-admin';
import { User, Alert } from './types';

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

const getUserRef = (
  uid: string
): FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData> =>
  admin.firestore().collection('users').doc(uid);

/**
 * Get User in SSR.
 *
 * @param uid
 * @returns
 */
export const getUser = async (uid: string): Promise<User> => {
  initializeAdminSDK();
  const userRef = getUserRef(uid);
  const userDoc = await userRef.get();
  return userDoc.data() as User;
};

/**
 * Get User Alerts in SSR.
 *
 * @param uid
 * @returns
 */
export const getUserAlerts = async (uid: string): Promise<Alert[]> => {
  initializeAdminSDK();
  const userRef = getUserRef(uid);
  const alertRefs = await userRef.collection('alerts').get();
  const alerts = alertRefs.docs.map((alertRef) => {
    const alert = alertRef.data() as Alert;
    return alert;
  });
  return alerts;
};

// TODO: implement deleteUser
// export const deleteUser = (uid: string): Promise<void> => {
//   initializeAdminSDK();
//   return admin
//     .auth()
//     .deleteUser(uid)
//     .catch((err) => {
//       throw err;
//     });
// };
