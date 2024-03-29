import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { Observable, Observer } from 'rxjs';
import { ProfileService } from '../_service/profile-service/profile.service';
import { GENDER } from '../_model/gender';

@Component({
  selector: 'app-design',
  templateUrl: './design.component.html',
  styleUrls: ['./design.component.css'],
})
export class DesignComponent implements OnInit {
  @Output() sendProfile = new EventEmitter<any>();
  @Input() profile: any;

  loading = false;
  isLoading: boolean = false;
  avatarUrl?: string;
  file!: NzUploadFile;
  profileForm!: FormGroup;
  validForm: boolean = true;
  user: any;

  constructor(
    private msg: NzMessageService,
    private fb: FormBuilder,
    private profileService: ProfileService
  ) {}
  ngOnInit() {
    this.profileForm = this.fb.group({
      id: [''],
      fullname: ['', Validators.required],
      short_bio: ['', Validators.required],
      about: [''],
      birthday: ['', Validators.required],
      gender: [GENDER.MALE, Validators.required],
      avatar_link: [''],
      design_id: [''],
      profile_link: [''],
      location: [''],
      click_count: [''],
    });
    this.pathProfile(this.profile);
  }
  beforeUpload = (
    file: NzUploadFile,
    _fileList: NzUploadFile[]
  ): Observable<boolean> =>
    new Observable((observer: Observer<boolean>) => {
      const isJpgOrPng =
        file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isJpgOrPng) {
        this.msg.error('You can only upload JPG file!');
        observer.complete();
        return;
      }
      const isLt2M = file.size! / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.msg.error('Image must smaller than 2MB!');
        observer.complete();
        return;
      }
      observer.next(isJpgOrPng && isLt2M);
      observer.complete();
      this.file = file;
    });

  private getBase64(img: File, callback: (img: string) => void): void {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result!.toString()));
    reader.readAsDataURL(img);
  }

  handleChange(info: { file: NzUploadFile }): void {
    switch (info.file.status) {
      case 'uploading':
        this.loading = true;
        break;
      case 'done':
        // Get this url from response in real world.
        this.getBase64(info.file!.originFileObj!, (img: string) => {
          this.loading = false;
          this.avatarUrl = img;
        });
        break;
      case 'error':
        this.msg.error('Network error');
        this.loading = false;
        break;
    }
  }

  pathProfile(profile: any) {
    this.profileForm.patchValue(profile);
    this.avatarUrl = profile.avatar_link;
  }

  updateProfile() {
    for (const i in this.profileForm.controls) {
      this.profileForm.controls[i].markAsDirty();
      this.profileForm.controls[i].updateValueAndValidity();
    }
    if (
      (this.profile != this.profileForm.value || this.file) &&
      this.validForm &&
      this.profileForm.valid
    ) {
      this.isLoading = true;
      this.profileService
        .updateProfile(
          this.profileForm.value,
          this.profileForm.controls['id'].value,
          this.file
        )
        .subscribe((res: any) => {
          if (res.success) {
            this.profileForm.patchValue(res.data);
            this.profile = res.data;
            this.avatarUrl = res.data.avatar_link;
            this.sendProfile.emit(this.profile);
            this.msg.success('Update successfully');
            this.isLoading = false;
          } else {
            this.msg.error('Update failed');
            this.isLoading = false;
          }
        });
    }
  }

  checkShortBio() {
    if (
      this.profileForm.controls['short_bio'].value != this.profile.short_bio
    ) {
      this.profileService
        .findByShortBio(this.profileForm.controls['short_bio'].value)
        .subscribe((res: any) => {
          if (res.success) {
            this.validForm = false;
            this.profileForm.controls['short_bio'].setErrors({
              already_exist: true,
            });
          } else this.validForm = true;
        });
    }
  }
}
