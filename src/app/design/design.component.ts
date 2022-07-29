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
  avatarUrl?: string;
  file!: NzUploadFile;
  profileForm!: FormGroup;
  user: any;

  constructor(
    private msg: NzMessageService,
    private fb: FormBuilder,
    private profileService: ProfileService
  ) {}
  ngOnInit() {
    this.profileForm = this.fb.group({
      id: [null],
      fullname: [null, Validators.required],
      short_bio: [null, Validators.required],
      about: [null],
      birthday: [null, Validators.required],
      gender: [GENDER.MALE, Validators.required],
      avatar_link: [null],
      design_id: [null],
      profile_link: [null],
      location: [null],
      click_count: [null],
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
    if (this.profile != this.profileForm.value || this.file) {
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
            this.msg.success('Update success');
          } else {
            this.msg.error('Update false');
          }
        });
    }
  }
}
