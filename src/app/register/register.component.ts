import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { EMAIL_REGEX, NoSpace } from '../_helpers/validator';
import { GENDER } from '../_model/gender';
import { AuthService } from '../_service/auth-service/auth.service';
import { ProfileService } from '../_service/profile-service/profile.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  validateForm!: FormGroup;
  isLoading: boolean = false;
  profileForm!:FormGroup;
  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private msg: NzMessageService,
    private router: Router,
    private profileService: ProfileService,
  ) {}

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      mail: [
        null,
        [Validators.required, Validators.pattern(EMAIL_REGEX), NoSpace],
      ],
      username: [null, [Validators.required, NoSpace]],
      password: [null, [Validators.required, NoSpace]],
    });
    this.profileForm = this.fb.group({
      id: [null],
      fullname: [null, Validators.required],
      short_bio: [null, [Validators.required, NoSpace]],
      about: [''],
      birthday: [null, Validators.required],
      gender: [GENDER.MALE, Validators.required],
      avatar_link: [''],
      design_id: [2],
      location: [null],
      click_count: [0],
    });
  }

  register() {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    if (this.validateForm.valid) {
      this.isLoading = true;
      this.auth.register(this.validateForm.value).subscribe((res: any) => {
        if (res.success) {
          this.isLoading = false;
          this.profileForm.controls['id'].setValue(res.data.id);
          this.profileService.addProfile(this.profileForm.value).subscribe((res:any)=>{
            if(res.success){

            }
          });
          this.msg.success('Register success,please confirm in your email!');
          this.router.navigate(['/login']);
        } else {
          this.msg.error(res.message);
          this.isLoading=false;
        }
      });
    }
  }
}
