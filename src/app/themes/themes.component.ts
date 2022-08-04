import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
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
    },
    {
      class: 'button-default-default',
      value: 'RECTANGLE_REGULAR',
    },
    {
      class: 'button-round-primary',
      value: 'CIRCLE_SOLID',
    },
    {
      class: 'button-round-default',
      value: 'CIRCLE_REGULAR',
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

  onUpdateDesign() {
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

  onSelectButton(buttonType: any) {
    this.designForm.controls['button_type'].setValue(buttonType);
    this.onUpdateDesign();
  }

  onSelectFont(font: string) {
    this.designForm.controls['font'].setValue(font);
    this.onUpdateDesign();
  }

}
