import { Component, Input, OnInit, Output } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { LinksService } from '../_service/links-service/links.service';
import { TYPE_LINK } from '../_model/type-link';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from '../_service/data-service/data.service';


@Component({
  selector: 'app-links',
  templateUrl: './links.component.html',
  styleUrls: ['./links.component.css'],
})
export class LinksComponent implements OnInit {
  @Input() profile:any;
  mode!: string;
  loading = false;
  avatarUrl?: string;
  isVisible: boolean = false;
  title: string = '';
  id:number=1;
  file!:NzUploadFile;
  listLinks: any[] = [];

  listSocials = [
    {
      icon: 'facebook',
      link: 'facebook.com',
    },
    {
      icon: 'youtube',
      link: 'youtube.com',
    },
  ];
  modalForm: FormGroup = this.fb.group({
    id: [null],
    profile_id:[null],
    title: [null, Validators.required],
    url: [null, Validators.required],
    picture: [null],
    click_count:[null],
    type:[TYPE_LINK.LINK],
  });

  constructor(
    private linksService: LinksService,
    private msg: NzMessageService,
    private fb: FormBuilder,
    private data: DataService,
  ) {}

  async ngOnInit() {
    // this.data.receiveProfile.subscribe(profile=>this.profile=profile);
    await this.getLinks(this.profile.id);
    this.data.notifyCountValue(this.listLinks);
  }

  async getLinks(profileId: number) {
    await this.linksService.getListLinks(profileId, 0, 10).toPromise().then((res:any)=>{
      if (res.success) {
        this.listLinks = res.data;
      }
    }); 
  }

  handleCancel(): void {
    this.isVisible = false;
    this.modalForm.reset();
    this.avatarUrl = '';
  }

  openModal(data: any, edit: boolean) {
    this.isVisible = true;
    this.modalForm.reset();
    this.avatarUrl='';
    if (edit) {
      this.mode = 'edit';
      this.title = 'EDIT';
      this.modalForm.patchValue(data);
      this.avatarUrl = data.picture;
    } else {
      this.mode = 'create';
      this.title = 'ADD';
    }
  }

  async handleOk() {
    for (const i in this.modalForm.controls) {
      this.modalForm.controls[i].markAsDirty();
      this.modalForm.controls[i].updateValueAndValidity();
    }
    if(this.modalForm.valid){
      if(this.mode==='create'){
        this.modalForm.controls['profile_id'].setValue(this.id);
        this.modalForm.controls['click_count'].setValue(0);
        this.modalForm.controls['type'].setValue(TYPE_LINK.LINK);
        await this.linksService.addLink(this.modalForm.value,this.file).toPromise().then((res:any)=>{
          if(res.success){
            this.msg.success('Add success');
            this.listLinks=[res.data,...this.listLinks];
            this.data.notifyCountValue(this.listLinks);
            this.handleCancel();
          }
          else{
            this.msg.error('Add false');
          }
        });
      }
      else{
        await this.linksService.updateLink(this.modalForm.value,this.modalForm.controls['id'].value,this.file).toPromise().then((res)=>{
          if(res.success){
            this.msg.success('Update success');
            const i=this.listLinks.findIndex((x)=>x.id==res.data.id);
            this.listLinks.splice(i,1,res.data);
            this.data.notifyCountValue(this.listLinks);
            this.handleCancel();
          }
          else{
            this.msg.error('Update false');
          }
        });
      }
    }  
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

  deleteLink() {
    this.linksService.deleteLink(this.modalForm.controls['id'].value).toPromise().then((res:any)=>{
       if(res.success){
        const i=this.listLinks.findIndex((x)=>{
          x.id==res.data.id});
          this.listLinks.splice(i,1);
          this.data.notifyCountValue(this.listLinks);
          this.handleCancel();
          this.msg.success('Delete success');
       }
       else {
        this.msg.success('Delete success');
       }

    });
    
  }
}

