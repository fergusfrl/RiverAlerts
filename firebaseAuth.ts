import admin from 'firebase-admin';

const FIREBASE_ADMIN_PARAMS = {
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

export const verifyIdToken = (token: string): Promise<admin.auth.DecodedIdToken> => {
  if (!admin.apps.length) {
    if (process.env.NODE_ENV === 'production') {
      admin.initializeApp();
    } else {
      admin.initializeApp({
        credential: admin.credential.cert(FIREBASE_ADMIN_PARAMS),
        // TODO: add db connection here: "databaseURL: process.env.FIREBASE_DATABASE_URL,""
      });
    }
  }

  return admin
    .auth()
    .verifyIdToken(token)
    .catch((err) => {
      throw err;
    });
};
