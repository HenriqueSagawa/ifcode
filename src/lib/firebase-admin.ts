import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

const firebaseAdminConfig = {
  credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  }),
}

const adminApp = getApps().length === 0 
  ? initializeApp(firebaseAdminConfig, 'admin')
  : getApps().find(app => app.name === 'admin')

if (!adminApp) {
  throw new Error('Firebase Admin app initialization failed.');
}

export const adminDb = getFirestore(adminApp)
export { adminApp }