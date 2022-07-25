import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NoSpace } from '../_helpers/validator';
import { EMAIL_REGEX } from '../_helpers/validator';
import { AuthService } from '../_service/auth-service/auth.service';
import { TokenStorageService } from '../_service/token-storage-service/token-storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  validateForm!: FormGroup;
  isVisible: boolean = false;
  isLoadingSend: boolean = false;
  modalForm!: FormGroup;
  isLoggedIn = false;
  isLoginFailed = false;
  isLoading: boolean = false;
  errorMessage = '';
  roles: string[] = [];

  constructor(
    private authService: AuthService,
    private tokenStorage: TokenStorageService,
    private auth: AuthService,
    private msg: NzMessageService,
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
    this.modalForm = this.fb.group({
      mail: [null, [Validators.required, Validators.pattern(EMAIL_REGEX)]],
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

  openModal() {
    this.isVisible = true;
    this.modalForm.reset();

  }
  handleCancel() {
    this.modalForm.reset();
    this.isVisible = false;
  }
  handleOk() {
    for (const i in this.modalForm.controls) {
      this.modalForm.controls[i].markAsDirty();
      this.modalForm.controls[i].updateValueAndValidity();
    }
    if (this.modalForm.valid) {
      this.isLoadingSend = true;
      this.auth
        .sendEmailForgotPassword(this.modalForm.controls['mail'].value)
        .subscribe((res: any) => {
          if (res.success) {
            this.isLoadingSend = false;
            this.msg.success(
              'Send email forgot password success. Please access your email to check password!'
            );
            this.handleCancel();
            this.router.navigate(['/login']);
          } else {
            this.isLoadingSend = false;
            this.msg.error(res.message);
            this.handleCancel();
          }
        });
    }
  }
}
