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
      });
    }
  }
};

const getUserRef = (
  uid: string
): FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData> =>
  admin.firestore().collection('users').doc(uid);

/**
 * Decodes the provided session token if valid.
 *
 * @param token
 * @returns Promise<admin.auth.DecodedIdToken>
 */
export const verifyIdToken = (token: string): Promise<admin.auth.DecodedIdToken> => {
  initializeAdminSDK();
  return admin
    .auth()
    .verifyIdToken(token)
    .catch((err) => {
      throw err;
    });
};

/**
 * Get User in SSR.
 *
 * @param uid
 * @returns User
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
 * @returns Alert[]
 */
export const getUserAlerts = async (uid: string): Promise<Alert[]> => {
  initializeAdminSDK();
  const userRef = getUserRef(uid);
  const alertRefs = await userRef.collection('alerts').get();
  const alerts = alertRefs.docs.map((alertRef) => {
    const id = alertRef.id;
    const alert = { id, ...alertRef.data() } as Alert;
    return alert;
  });
  return alerts;
};

/**
 * Get a User Alert in SSR.
 *
 * @param uid
 * @param alertId
 * @returns Alert
 */
export const getUserAlert = async (uid: string, alertId: string): Promise<Alert> => {
  initializeAdminSDK();
  const userRef = getUserRef(uid);
  const alertDoc = await userRef.collection('alerts').doc(alertId).get();
  const alert = { id: alertId, ...alertDoc.data() } as Alert;
  return alert;
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
