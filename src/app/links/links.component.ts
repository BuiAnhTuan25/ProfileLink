import { Component, Input, OnInit, Output } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { LinksService } from '../_service/links-service/links.service';
import { TYPE_LINK } from '../_model/type-link';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from '../_service/data-service/data.service';
import { SocialService } from '../_service/social-service/social.service';


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
  isVisibleHeader: boolean = false;
  isVisibleSocial:boolean=false;
  validForm:boolean=true;
  title: string = '';
  titleSocial:string='';
  type:string='';
  id:number=1;
  file!:NzUploadFile;
  selectedSocial:any;
  listLinks: any[] = [];
  socials:any[]=[];
  newSocials:any[]=[];

  listSocials:any[] = [
    {
      social_name:'Facebook',
      social_icon: 'facebook',
      social_link: 'facebook.com',
    },
    {
      social_name:'Youtube',
      social_icon: 'youtube',
      social_link: 'youtube.com',
    },
    {
      social_name:'Instagram',
      social_icon: 'instagram',
      social_link: 'instagram.com',
    },
    {
      social_name:'Github',
      social_icon: 'github',
      social_link: 'github.com',
    },
    {
      social_name:'Twitter',
      social_icon: 'twitter',
      social_link: 'twitter.com',
    },
    {
      social_name:'Linkedin',
      social_icon: 'linkedin',
      social_link: 'linkedin.com',
    },
  ];
  modalForm: FormGroup = this.fb.group({
    id: [null],
    profile_id:[null],
    title: [null, Validators.required],
    url: [null],
    picture: [null],
    click_count:[null],
    type:[TYPE_LINK.LINK],
  });
  socialForm: FormGroup = this.fb.group({
    id: [null],
    profile_id:[null],
    social_name: [null],
    links: [null,Validators.required],
    social_icon: [null],
    click_count:[null],
  });

  constructor(
    private linksService: LinksService,
    private msg: NzMessageService,
    private fb: FormBuilder,
    private data: DataService,
    private socialService:SocialService,
  ) {}

  async ngOnInit() {
    // this.data.receiveProfile.subscribe(profile=>this.profile=profile);
    await this.getLinks(this.profile.id);
    await this.getSocials(this.profile.id);
    
    
  }

  async getLinks(profileId: number) {
    await this.linksService.getListLinks(profileId, 0, 999).toPromise().then((res:any)=>{
      if (res.success) {
        this.listLinks = res.data;
        this.data.notifyCountValue(this.listLinks);
      }
      else this.msg.error('Get list link false');

    }); 
  }

  async getSocials(profileId:number){
    await this.socialService.getListSocial(profileId,0,999).toPromise().then((res:any)=>{
      if(res.success){
        this.socials=res.data;
        this.data.sendSocials(this.socials);
        this.filterSocial(this.socials);
        
      }
      else this.msg.error('Get list social false');
    })
  }

  handleCancel(): void {
    this.isVisible = false;
    this.modalForm.reset();
    this.avatarUrl = '';
    this.mode='';
  }

  socialModalCancel(): void {
    this.isVisibleSocial = false;
    this.socialForm.reset();
    this.mode='';
    this.selectedSocial=this.newSocials[0];
  }

  handleCancelHeader(): void {
    this.isVisibleHeader = false;
    this.modalForm.reset();
    this.mode='';
  }

  openModal(data: any, edit: boolean,type:string) {
    this.type=type;
    this.isVisible = true;
    this.modalForm.reset();
    this.avatarUrl='';
    this.mode='';
    if (edit) {
      this.mode = 'edit';

      if(type=='link') this.title = 'EDIT LINK';
      if(type=='header') this.title = 'EDIT HEADER';
      
      this.modalForm.patchValue(data);
      this.avatarUrl = data.picture;
    } else {
      this.mode = 'create';
      if(type=='link') this.title = 'CREATE LINK';
      if(type=='header') this.title = 'CREATE HEADER';
    }
  }

  openSocialModal(data:any,edit:boolean){
    this.isVisibleSocial=true;
    this.socialForm.reset();
    if(edit){
      this.mode='edit';
      this.titleSocial='EDIT SOCIAL';
      this.selectedSocial=data;
      this.socialForm.patchValue(data);
    }else {
      this.mode='create';
      this.titleSocial='CREATE SOCIAL';
    }
  }

  async handleOk() {
    for (const i in this.modalForm.controls) {
      this.modalForm.controls[i].markAsDirty();
      this.modalForm.controls[i].updateValueAndValidity();
    }
    if(this.type == 'link' && this.modalForm.controls['url'].value==null){
      this.validForm=false;
      this.modalForm.controls['url'].setErrors({ urlExist: true });
    } else this.validForm=true;
    if(this.modalForm.valid && this.validForm){
      if(this.mode==='create'){
        this.modalForm.controls['profile_id'].setValue(this.id);
        this.modalForm.controls['click_count'].setValue(0);

        if(this.type == 'link') this.modalForm.controls['type'].setValue(TYPE_LINK.LINK);
        if(this.type == 'header') this.modalForm.controls['type'].setValue(TYPE_LINK.HEADER);

        await this.linksService.addLink(this.modalForm.value,this.file).toPromise().then((res:any)=>{
          if(res.success){
            this.msg.success('Add success');
            this.listLinks.push(res.data);
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

  onDelete() {
    this.linksService.deleteLink(this.modalForm.controls['id'].value).toPromise().then((res:any)=>{
       if(res.success){
        const i=this.listLinks.findIndex((x)=>
          x.id==res.data.id);
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

  socialChange(event:any){
    this.selectedSocial=event;
  }

  filterSocial(socials:any[]){
    this.newSocials=[...this.listSocials];
    for(let i=0;i<this.listSocials.length;i++){
      for(let j=0;j<socials.length;j++){
        if(this.listSocials[i].social_name==socials[j].social_name){
          this.newSocials.splice(i,1,null);
          break;
        }
      }
    }
    this.newSocials=this.newSocials.filter((x)=>x!=null);
    this.selectedSocial=this.newSocials[0];
  }
}

