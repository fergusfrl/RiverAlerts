import admin from 'firebase-admin';
import serviceAccount from './secrets.json';

const FIREBASE_ADMIN_PARAMS = {
  type: serviceAccount.type,
  projectId: serviceAccount.project_id,
  privateKeyId: serviceAccount.private_key_id,
  privateKey: serviceAccount.private_key,
  clientEmail: serviceAccount.client_email,
  clientId: serviceAccount.client_id,
  authUri: serviceAccount.auth_uri,
  tokenUri: serviceAccount.token_uri,
  authProviderX509CertUrl: serviceAccount.auth_provider_x509_cert_url,
  clientC509CertUrl: serviceAccount.client_x509_cert_url,
};

export const verifyIdToken = (token: string): Promise<admin.auth.DecodedIdToken> => {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(FIREBASE_ADMIN_PARAMS),
      // TODO: add db connection here: "databaseURL: process.env.FIREBASE_DATABASE_URL,""
    });
  }

  return admin
    .auth()
    .verifyIdToken(token)
    .catch((err) => {
      throw err;
    });
};
