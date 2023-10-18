import { Injectable } from '@angular/core';
import { User } from './user.model';
import { AuthData } from './auth-data.model';
import { Subject, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from '@angular/fire/auth';
import { TrainingService } from '../training/training.service';
import { UiService } from '../shared/ui.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  authChange = new Subject<boolean>();
  private isAuthenticated = false;
  // private user: User | null = null;

  constructor(private router: Router, private auth: Auth,
    private trainingService: TrainingService,
    private uiServise: UiService) { }

  initAuthListener() {
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        this.isAuthenticated = true;
        this.authChange.next(true);
        this.router.navigate(['/training']);
      } else {
        // User is signed out
        this.trainingService.cancelSubscriptions();
        this.isAuthenticated = false;
        this.authChange.next(false);
        this.router.navigate(['/login']);
      }
    });
  }

  registerUser(authData: AuthData) {
    this.uiServise.loadingStateChanged.next(true);
    createUserWithEmailAndPassword(this.auth, authData.email, authData.password)
      .then((userCredential) => {
        // Signed up 
        this.uiServise.loadingStateChanged.next(false);
      })
      .catch((error: Error) => {
        console.log(error);
        this.uiServise.loadingStateChanged.next(false);
        this.uiServise.showSnackbar(error.message, undefined, 3000);
      });
  }

  loginUser(authData: AuthData) {
    this.uiServise.loadingStateChanged.next(true);
    signInWithEmailAndPassword(this.auth, authData.email, authData.password)
      .then((userCredential) => {
        // Signed in 
        this.uiServise.loadingStateChanged.next(false);
      })
      .catch((error: Error) => {
        console.log(error);
        this.uiServise.loadingStateChanged.next(false);
        this.uiServise.showSnackbar('Invalid email or password !', undefined, 3000);
      });
  }

  logoutUser() {
    signOut(this.auth);
  }

  isAuth() {
    //Old version
    // return this.user != null;
    return this.isAuthenticated;
  }
}
