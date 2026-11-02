import admin from 'firebase-admin';
import './admin'; // ensures admin app is initialized

// Verifies the Firebase ID token sent from an authenticated admin
// client. Returns the decoded token (with uid/email) if valid,
// or null if missing/invalid — callers should treat null as
// "reject the request".
export async function verifyAdminRequest(request) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;

  const idToken = authHeader.split('Bearer ')[1];

  try {
    const decoded = await admin.auth().verifyIdToken(idToken);
    return decoded;
  } catch (error) {
    console.error('Admin token verification failed:', error.message);
    return null;
  }
}
