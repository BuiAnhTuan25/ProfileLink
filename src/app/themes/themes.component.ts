import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { Observable, Observer } from 'rxjs';
import { DataService } from '../_service/data-service/data.service';
import { DesignService } from '../_service/design-service/design.service';
import { ProfileService } from '../_service/profile-service/profile.service';

@Component({
  selector: 'app-themes',
  templateUrl: './themes.component.html',
  styleUrls: ['./themes.component.css'],
})
export class ThemesComponent implements OnInit {
  @Input() profile: any;
  design: any;
  userDesign: any;
  designForm!: FormGroup;
  username: string = '';
  role:string='';
  isVisibleDesign: boolean = false;
  indexButton!:number;
  indexFont!:number;
  file:any;
  loading:boolean=false;
  backgroundUrl:string='';
  fonts: any[] = [
    {
      name: 'Georgia',
    },
    {
      name: 'Cursive',
    },
    {
      name: 'Monaco',
    },
    {
      name: 'Courier New',
    },
    {
      name: 'Verdana',
    },
    {
      name: 'Papyrus',
    },
    {
      name: 'Lucida Console',
    },
    {
      name: 'Brush Script MT',
    },
  ];
  buttonTypes: any[] = [
    {
      class: 'button-default-primary',
      value: 'RECTANGLE_SOLID',
      type:'default'
    },
    {
      class: 'button-default-default',
      value: 'RECTANGLE_REGULAR',
      type:'default'
    },
    {
      class: 'button-round-primary',
      value: 'CIRCLE_SOLID',
      type: 'round'
    },
    {
      class: 'button-round-default',
      value: 'CIRCLE_REGULAR',
      type: 'round'
    },
  ];
  listDesign: any[] = [];

  constructor(
    private designService: DesignService,
    private dataService: DataService,
    private profileService: ProfileService,
    private msg: NzMessageService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.username = JSON.parse(localStorage.getItem('auth-user')!).username;
    this.role = JSON.parse(localStorage.getItem('auth-user')!).role;

    this.dataService.receiveDesign.subscribe((design) => {
      this.design = design;
      if(this.design.type=='USER_CREATE'){
        this.isVisibleDesign=true;
        this.designForm.patchValue(design);
        this.backgroundUrl=design.background_image;
        this.setButtonIndex(design);
        this.setFontIndex(design);
      } 
      else this.isVisibleDesign=false;
    });

    this.designForm = this.fb.group({
      id: [null],
      background_color: ['#FFFFFF'],
      background_image: [null],
      background_type: [0],
      button_type: ['CIRCLE_SOLID'],
      button_color: ['#FFFFFF'],
      text_color: ['#000000'],
      font: ['Cursive'],
      type: ['USER_CREATE'],
      name: [this.username],
    });
    this.getAllDesign();
  }
  getAllDesign() {
    this.designService.getAllDesign(0, 999).subscribe((res) => {
      if (res.success) {
        this.listDesign = res.data;
      }
    });
  }

  onClickDesign(design: any) {
    if (this.design != design || this.userDesign != design) {
      this.profile.design_id = design.id;
      this.profileService
        .updateProfile(this.profile, this.profile.id)
        .subscribe((res: any) => {
          if (res.success) {
            this.msg.success('Change design success');
            this.dataService.sendDesign(design);
            if (design != this.userDesign) this.isVisibleDesign = false;
          } else this.msg.error('Change design false');
        });
    }
  }

  onCreateDesign() {
    this.designService.getByNameDesign(this.username).subscribe((res: any) => {
      if (res.data) {
        this.designForm.patchValue(res.data);
        this.backgroundUrl=res.data.background_image;
        this.userDesign = res.data;
        this.onClickDesign(this.userDesign);
        this.isVisibleDesign = true;
      } else this.addDesign();
    });
  }

  addDesign() {
    this.designService
      .addDesign(this.designForm.value)
      .subscribe((res: any) => {
        if (res.success) {
          this.designForm.patchValue(res.data);
          this.userDesign = res.data;
          this.onClickDesign(this.userDesign);
          this.isVisibleDesign = true;
        } else this.msg.error(res.message);
      });
  }

  onUpdateDesign(backgroundType?:string,file?:any) {
    if(backgroundType) this.designForm.controls['background_type'].setValue(backgroundType);
    if(file){
      this.designService
      .updateDesign(this.designForm.value, this.designForm.controls['id'].value,file)
      .subscribe((res: any) => {
        if (res.success) {
          this.designForm.patchValue(res.data);
          this.userDesign = res.data;
          this.dataService.sendDesign(this.userDesign);
        } else this.msg.error(res.message);
      });
    } else
    this.designService
      .updateDesign(this.designForm.value, this.designForm.controls['id'].value)
      .subscribe((res: any) => {
        if (res.success) {
          this.designForm.patchValue(res.data);
          this.userDesign = res.data;
          this.dataService.sendDesign(this.userDesign);
        } else this.msg.error(res.message);
      });
  }

  onSelectButton(buttonType: any,index:number) {
    this.designForm.controls['button_type'].setValue(buttonType);
    this.indexButton=index;
    this.onUpdateDesign();
  }

  onSelectFont(font: string,index:number) {
    this.designForm.controls['font'].setValue(font);
    this.indexFont=index;
    this.onUpdateDesign();
  }

  setButtonIndex(design:any){
   for(let i=0;i<this.buttonTypes.length;i++){
    if(this.buttonTypes[i].value==design.button_type){
      this.indexButton=i;
      break;
    }
   }
  }

  setFontIndex(design:any){
    for(let i=0;i<this.fonts.length;i++){
      if(this.fonts[i].name==design.font){
        this.indexFont=i;
        break;
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
      this.file = file;
      this.onUpdateDesign('IMAGE',this.file);
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
          this.backgroundUrl = img;
        });
        break;
      case 'error':
        this.msg.error('Network error');
        this.loading = false;
        break;
    }
  }

  changeBackgroundType(backgroundType:string){
    this.designForm.controls['background_type'].setValue(backgroundType);
    this.onUpdateDesign();
  }
}
