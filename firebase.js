import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-analytics.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyCxP69amZOTsQpSrQ-DbM8xzC8sExP16Uc",
  authDomain: "alsanadandalbanwancampaign.firebaseapp.com",
  databaseURL: "https://alsanadandalbanwancampaign-default-rtdb.firebaseio.com",
  projectId: "alsanadandalbanwancampaign",
  storageBucket: "alsanadandalbanwancampaign.firebasestorage.app",
  messagingSenderId: "721098499723",
  appId: "1:721098499723:web:7de15fab82e1e25b9f568e",
  measurementId: "G-5LVDBGZNXZ"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const auth = getAuth(app);
const db = getDatabase(app);

export { app, analytics, auth, db };
