import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { UiService } from 'src/app/shared/ui.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  form: FormGroup = {} as FormGroup;
  isLoading = false;
  private loadingSub: Subscription = {} as Subscription;

  constructor(private authService: AuthService,
    private uiServise: UiService) { }

  ngOnInit(): void {
    this.loadingSub = this.uiServise.loadingStateChanged.subscribe(loading => {
      this.isLoading = loading;
    });
    this.form = new FormGroup({
      'email': new FormControl(null, [Validators.required, Validators.email]),
      'password': new FormControl(null, [Validators.required, Validators.minLength(6)])
    });
  }

  onSubmit() {
    console.log(this.form.value);
    this.authService.loginUser({
      email: this.form.value.email,
      password: this.form.value.password
    })
  }

  ngOnDestroy(): void {
    if (this.loadingSub) {
      this.loadingSub.unsubscribe();
    }
  }
}
