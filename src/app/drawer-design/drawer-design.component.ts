import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzButtonShape, NzButtonType } from 'ng-zorro-antd/button';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { Observable, Observer } from 'rxjs';
import { DesignService } from '../_service/design-service/design.service';

@Component({
  selector: 'app-drawer-design',
  templateUrl: './drawer-design.component.html',
  styleUrls: ['./drawer-design.component.css'],
})
export class DrawerDesignComponent implements OnInit {
  @Output() onDelete = new EventEmitter();
  @Output() onCreate = new EventEmitter();
  @Output() onUpdate = new EventEmitter();

  isVisible: boolean = false;
  title: string = '';
  design: any;
  mode: string = '';
  designForm!: FormGroup;
  indexButton: number = 0;
  indexFont: number = 0;
  file: any;
  fileAvatar: any;
  loading: boolean = false;
  loadingAvatar: boolean = false;
  isLoadingSave: boolean = false;
  isLoadingDelete: boolean = false;
  backgroundUrl: string = '';
  backgroundType: string = '';
  avatarUrl: string = '';
  isPrimary: boolean = false;
  buttonType!: NzButtonType;
  buttonShape!: NzButtonShape;
  erorrPicture:string='';
  validateAvatar: boolean = false;

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
      type: 'default',
    },
    {
      class: 'button-default-default',
      value: 'RECTANGLE_REGULAR',
      type: 'default',
    },
    {
      class: 'button-round-primary',
      value: 'CIRCLE_SOLID',
      type: 'round',
    },
    {
      class: 'button-round-default',
      value: 'CIRCLE_REGULAR',
      type: 'round',
    },
  ];
  constructor(
    private designService: DesignService,
    private msg: NzMessageService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.designForm = this.fb.group({
      id: [null],
      background_color: ['#FFFFFF'],
      background_image: [''],
      background_type: ['COLOR', Validators.required],
      button_type: ['RECTANGLE_SOLID', Validators.required],
      button_color: ['#FFFFFF', Validators.required],
      text_color: ['#000000', Validators.required],
      font: ['Georgia', Validators.required],
      type: ['DEFAULT', Validators.required],
      name: ['', Validators.required],
      picture: [''],
    });
    // this.design.background_color='#FFFFFF';
    // this.design.background_typpe='COLOR';
    // this.design.button_type='RECTANGLE_SOLID';
    // this.design.text_color='#000000';
    // this.design.font='Georgia';
  }

  addDesign() {
    for (const i in this.designForm.controls) {
      this.designForm.controls[i].markAsDirty();
      this.designForm.controls[i].updateValueAndValidity();
    }
    this.checkFile(); 
    if (this.designForm.valid && this.validateAvatar) {
      this.isLoadingSave = true;
      this.designService
        .addDesign(this.designForm.value, this.fileAvatar, this.file)
        .subscribe((res: any) => {
          if (res.success) {
            this.isLoadingSave = false;
            this.isVisible = false;
            this.msg.success('Create design successfully');
            this.onCreate.emit(res.data);
          } else {
            this.isLoadingSave = false;
            this.msg.error('Create design failed');
          }
        });
    }
  }

  updateDesign() {
    for (const i in this.designForm.controls) {
      this.designForm.controls[i].markAsDirty();
      this.designForm.controls[i].updateValueAndValidity();
    }
    
    if (this.designForm.valid) {
      this.isLoadingSave = true;
      this.designService
        .updateDesign(
          this.designForm.value,
          this.designForm.controls['id'].value,
          this.fileAvatar,
          this.file
        )
        .subscribe((res: any) => {
          if (res.success) {
            this.isLoadingSave = false;
            this.isVisible = false;
            this.msg.success('Create design successfully');
            this.onUpdate.emit(res.data);
          } else {
            this.msg.error('Create design failed');
            this.isLoadingSave = false;
          }
        });
    }
  }

  deleteDesign() {
    this.isLoadingDelete = true;
    this.designService
      .deleteDesign(this.designForm.controls['id'].value)
      .subscribe((res: any) => {
        if (res.success) {
          this.isLoadingDelete = false;
          this.isVisible = false;
          this.msg.success('Delete design successfully');
          this.onDelete.emit(this.design.id);
        } else {
          this.isLoadingDelete = false;
          this.msg.error('Delete design failed');
        }
      });
  }

  openDrawer(data: any, mode: string) {
    this.mode = mode;
    this.designForm.reset();
    this.backgroundUrl = '';
    this.avatarUrl = '';
    this.backgroundType='';
    this.file=null;
    this.fileAvatar=null;
    this.indexButton = 0;
    this.indexFont = 0;
    this.isVisible = true;
    if (mode == 'create') {
      this.title = 'CREATE DESIGN';
      if(data){
        this.designForm.patchValue(data);
        this.backgroundUrl = data.background_image;
        this.avatarUrl = data.picture;
        this.backgroundType=data.background_type;
      } else{
        this.designForm.controls['background_color'].setValue('#FFFFFF');
        this.designForm.controls['background_type'].setValue('COLOR');
        this.designForm.controls['button_type'].setValue('RECTANGLE_SOLID');
        this.designForm.controls['button_color'].setValue('#FFFFFF');
        this.designForm.controls['text_color'].setValue('#000000');
        this.designForm.controls['font'].setValue('Georgia');
        this.designForm.controls['type'].setValue('DEFAULT');
        this.backgroundType='COLOR'
      }
      
    } else if (mode == 'edit') {
      this.title = 'EDIT DESIGN';
      this.designForm.patchValue(data);
      this.design = data;
      this.backgroundUrl = data.background_image;
      this.avatarUrl = data.picture;
      this.backgroundType=data.background_type;
      this.setButtonIndex(data);
      this.setFontIndex(data);
    }
  }

  closeDrawer() {
    this.isVisible = false;
    this.designForm.reset();
    this.backgroundUrl = '';
    this.avatarUrl = '';
    this.backgroundType='';
    this.indexButton = 0;
    this.indexFont = 0;
    this.file=null;
    this.fileAvatar=null;
  }

  onSelectButton(buttonType: any, index: number) {
    this.designForm.controls['button_type'].setValue(buttonType);
    this.indexButton = index;
  }

  onSelectFont(font: string, index: number) {
    this.designForm.controls['font'].setValue(font);
    this.indexFont = index;
  }

  setButtonIndex(design: any) {
    for (let i = 0; i < this.buttonTypes.length; i++) {
      if (this.buttonTypes[i].value == design.button_type) {
        this.indexButton = i;
        break;
      }
    }
  }

  setFontIndex(design: any) {
    for (let i = 0; i < this.fonts.length; i++) {
      if (this.fonts[i].name == design.font) {
        this.indexFont = i;
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

  beforeUploadAvatar = (
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
      this.fileAvatar = file;
    });

  handleChangeAvatar(info: { file: NzUploadFile }): void {
    switch (info.file.status) {
      case 'uploading':
        this.loadingAvatar = true;
        break;
      case 'done':
        // Get this url from response in real world.
        this.getBase64(info.file!.originFileObj!, (img: string) => {
          this.loadingAvatar = false;
          this.avatarUrl = img;
        });
        break;
      case 'error':
        this.msg.error('Network error');
        this.loadingAvatar = false;
        break;
    }
  }

  changeBackgroundType(backgroundType: string) {
    this.backgroundType = backgroundType;
    this.designForm.controls['background_type'].setValue(backgroundType);
  }

  checkFile(){
    if (this.mode === 'create' && !this.fileAvatar) {
      this.validateAvatar = false;
      this.erorrPicture = 'Please select picture!';
    } else {
      this.validateAvatar = true;
      this.erorrPicture = '';
    }
  }
}
