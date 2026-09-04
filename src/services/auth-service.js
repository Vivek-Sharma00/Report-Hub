import { auth } from '../config/firebase-config.js';
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

export class AuthService {
    constructor() {
        this.auth = auth;
    }

    async register(email, password) {
        if (!email || !password) throw new Error("Email and password required.");
        return await createUserWithEmailAndPassword(this.auth, email, password);
    }

    async login(email, password) {
        if (!email || !password) throw new Error("Email and password required.");
        return await signInWithEmailAndPassword(this.auth, email, password);
    }

    async logout() {
        return await signOut(this.auth);
    }

    onAuthStateChange(callback) {
        return onAuthStateChanged(this.auth, callback);
    }
}