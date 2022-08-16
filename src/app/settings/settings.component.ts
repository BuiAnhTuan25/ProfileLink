import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { EMAIL_REGEX } from '../_helpers/validator';
import { AuthenticationService } from '../_service/auth-service/authentication.service';
import { ProfileService } from '../_service/profile-service/profile.service';
import { UserService } from '../_service/user-service/user.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
})
export class SettingsComponent implements OnInit {
  isVisible: boolean = false;
  modalForm!: FormGroup;
  settingForm!: FormGroup;
  isLoading: boolean = false;
  isLoadingDelete:boolean=false;
  user: any;
  constructor(
    private fb: FormBuilder,
    private auth: AuthenticationService,
    private msg: NzMessageService,
    private router: Router,
    private profileService:ProfileService,
    private userService:UserService
  ) {}

  ngOnInit(): void {
    this.settingForm = this.fb.group({
      username: [''],
      mail: [''],
      role: [''],
    });
    this.modalForm = this.fb.group({
      mail: ['', [Validators.required, Validators.pattern(EMAIL_REGEX)]],
    });
    this.user = JSON.parse(localStorage.getItem('auth-user')!);
    this.settingForm.patchValue(this.user);
    let index = this.user.mail.indexOf('@');
    let mailHidden = this.user.mail.slice(0, index - 2);
    let mail = this.user.mail.slice(index - 2);
    mailHidden = mailHidden.replace(mailHidden, '*');
    let a = index - 3;
    for (let i = 0; i < a; i++) {
      mailHidden += '*';
    }
    this.settingForm.controls['mail'].setValue(mailHidden + mail);
  }
  openModal() {
    this.isLoading=false;
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
      this.isLoading = true;
      this.auth
        .sendEmailChangePassword(this.modalForm.controls['mail'].value)
        .subscribe((res: any) => {
          if (res.success) {
            this.isLoading = false;
            this.msg.success(
              'Send email change password successfully. Please access your email to change password!'
            );
            this.handleCancel();
            this.router.navigate(['/login']);
          } else {
            this.isLoading = false;
            this.msg.error(res.message);
            this.handleCancel();
          }
        });
    }
  }

  onDeleteUser(){
    this.isLoadingDelete=true;
    this.userService.deleteUser(this.user.id).subscribe((res:any)=>{
      if(res.success){
        this.isLoadingDelete=false;
        this.msg.success('Delete account successfully');
        this.router.navigate(['/login']);
      } else {
        this.isLoadingDelete=false;
        this.msg.error('Delete account failed');
      }
    })
  }

  requestUpgradeRole(){
    this.userService.requestUpgradeRole(this.user.id,true).subscribe((res:any)=>{
      if(res.success){
        this.msg.success('Role upgrade request has been sent')
      } else this.msg.error('Role upgrade request failed');
    })
  }
}
