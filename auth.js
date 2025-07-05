import { auth } from './firebase.js';
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

export function loginWithEmail(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

export function requireAuth(callback) {
  onAuthStateChanged(auth, user => {
    if (user) {
      callback(user);
    } else {
      window.location.href = '/login.html';
    }
  });
}

export function logout() {
  return signOut(auth);
}
