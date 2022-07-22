import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NoSpace } from '../_helpers/validator';
import { AuthService } from '../_service/auth-service/auth.service';
import { TokenStorageService } from '../_service/token-storage-service/token-storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  validateForm!: FormGroup;
  isLoggedIn = false;
  isLoginFailed = false;
  isLoading: boolean = false;
  errorMessage = '';
  roles: string[] = [];

  constructor(
    private authService: AuthService,
    private tokenStorage: TokenStorageService,
    private fb: FormBuilder,
    private router: Router
  ) {}
  ngOnInit(): void {
    if (this.tokenStorage.getToken()) {
      this.isLoggedIn = true;
      this.roles = this.tokenStorage.getUser().roles;
    }
    this.validateForm = this.fb.group({
      username: [null, [Validators.required, NoSpace]],
      password: [null, [Validators.required, NoSpace]],
    });
  }

  submitForm(): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    if (this.validateForm.valid) {
      this.isLoading = true;
      this.authService.login(this.validateForm.value).subscribe(
        (data) => {
          this.isLoading = false;
          this.tokenStorage.saveToken(data.data.jwt);
          this.tokenStorage.saveUser(data.data.user);
          this.isLoginFailed = false;
          this.isLoggedIn = true;
          this.roles = this.tokenStorage.getUser().roles;
          //this.reloadPage();
          this.router.navigate(['/home']);
        },
        (err) => {
          this.errorMessage = err.error.message;
          this.isLoginFailed = true;
          this.isLoading = false;
        }
      );
    }
  }
  reloadPage(): void {
    window.location.reload();
  }
}
