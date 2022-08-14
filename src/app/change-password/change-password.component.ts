import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NoSpace } from '../_helpers/validator';
import { AuthenticationService } from '../_service/auth-service/authentication.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css'],
})
export class ChangePasswordComponent implements OnInit {
  form!: FormGroup;
  code: string = '';
  isLoading: boolean = false;
  checkPassword: boolean = false;
  constructor(
    private fb: FormBuilder,
    private msg: NzMessageService,
    private auth: AuthenticationService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.code = this.route.snapshot.queryParamMap.get('code')!;
    console.log(this.code);
    this.form = this.fb.group({
      newPassword: ['', [Validators.required, NoSpace]],
      confirmPassword: ['', [Validators.required, NoSpace]],
    });
  }

  changePassword() {
    for (const i in this.form.controls) {
      this.form.controls[i].markAsDirty();
      this.form.controls[i].updateValueAndValidity();
    }

    this.checkConfirmPassword();

    if (this.form.valid && this.checkPassword) {
      this.isLoading = true;
      this.auth
        .changePassword(this.code, this.form.controls['newPassword'].value)
        .subscribe((res: any) => {
          if (res.success) {
            this.isLoading = false;
            this.msg.success(
              'Change password success. Please re-login to your account!'
            );
            this.router.navigate(['/login']);
          } else {
            this.isLoading = false;
            this.msg.error(res.message);
          }
        });
    }
  }

  checkConfirmPassword() {
    if (
      this.form.controls['newPassword'].value !=
      this.form.controls['confirmPassword'].value
    ) {
      this.form.controls['confirmPassword'].setErrors({
        confirmPasswordExist: true,
      });
      this.checkPassword = false;
    } else this.checkPassword = true;
  }
}
