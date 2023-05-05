import admin from 'firebase-admin';

import serviceAccount from './serviceAccount.json';

export default admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  storageBucket: 'fridge-app-31398.appspot.com',
});
