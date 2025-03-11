import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { auth, googleProvider } from '../firebaseConfig';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import {WEBCLIENT_ID} from '@env';

WebBrowser.maybeCompleteAuthSession();

export const useGoogleAuth = () => {
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: WEBCLIENT_ID, // From Firebase Console
  });

  const handleGoogleSignIn = async () => {
    try {
      if (response?.type === 'success') {
        const { id_token } = response.params;
        const credential = GoogleAuthProvider.credential(id_token);
        await signInWithCredential(auth, credential);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      return false;
    }
  };

  return { promptAsync, handleGoogleSignIn, response };
};