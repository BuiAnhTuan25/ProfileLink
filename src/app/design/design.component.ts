import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { Observable, Observer } from 'rxjs';
import { ProfileService } from '../_service/profile-service/profile.service';
import { GENDER} from '../_model/gender';
import { formatDate } from '@angular/common';
import { DesignService } from '../_service/designservice/design.service';
import { DataService } from '../_service/data-service/data.service';


@Component({
  selector: 'app-design',
  templateUrl: './design.component.html',
  styleUrls: ['./design.component.css'],
})
export class DesignComponent implements OnInit {
  @Input() profile:any;
  @Output() sendProfile = new EventEmitter<any>();
  loading = false;
  avatarUrl?: string;
  file!:NzUploadFile;
  profileForm!: FormGroup;
  user:any;
  design:any;
  listDesign:any[]=[];

  constructor(
    private msg: NzMessageService, 
    private fb: FormBuilder,
    private profileService: ProfileService,
    private designService:DesignService,
    private dataService:DataService) { }
  async ngOnInit() {
    this.profileForm = this.fb.group({
      id: [null],
      fullname: [null, Validators.required],
      short_bio: [null, Validators.required],
      about: [null],
      birthday: [null, Validators.required],
      gender: [GENDER.MALE, Validators.required],
      avatar_link: [null],
      user_id: [null],
      design_id: [null],
      profile_link: [null],
      location: [null],
      click_count: [null],
    });
    // this.user=JSON.parse(localStorage.getItem('auth-user')!);
    // await this.getProfile(this.user.id);
    await this.getAllDesign();
    this.pathProfile(this.profile);
    this.dataService.receiveDesign.subscribe(design=>{
      this.design=design;
    });
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
      this.file=file;
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

  // async getProfile(id: number) {
  // await this.profileService.getProfile(id).toPromise().then((res:any)=>{
  //   if(res.success){
  //     this.profile=res.data;
  //    this.profileForm.patchValue(res.data);
  //    this.avatarUrl=res.data.avatar_link;
  //    this.dataService.sendProfile(res.data);
  //   }
  // });
  // }
  pathProfile(profile:any){
    this.profileForm.patchValue(profile);
    this.avatarUrl=profile.avatar_link;
  }

  async updateProfile(){
    if(this.profile!=this.profileForm.value||this.file){
    await this.profileService.updateProfile(this.profileForm.value,this.profileForm.controls['id'].value,this.file)
    .toPromise().then((res:any)=>{
      if(res.success){
        this.profileForm.patchValue(res.data);
        this.profile=res.data;
        this.avatarUrl=res.data.avatar_link;
        this.sendProfile.emit(this.profile);
        this.msg.success('Update success');
      }
      else{
        this.msg.error('Update false');
      }
    })
  }
  }

  async getAllDesign(){
    await this.designService.getAllDesign(0,999).toPromise().then((res)=>{
      if(res.success){
        this.listDesign=res.data;
      }
    })
  }

  async onClickDesign(design:any){
    if(this.design!=design){
      this.profileForm.controls['design_id'].setValue(design.id);
      await this.profileService.updateProfile(this.profileForm.value,this.profileForm.controls['id'].value).toPromise().then((res:any)=>{
        if(res.success){
          this.msg.success('Change design success');
          this.dataService.sendDesign(design);
        }
        else this.msg.error('Change design false');
      })
    }
  }
}
