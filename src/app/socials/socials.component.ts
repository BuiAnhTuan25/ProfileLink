import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { DataService } from '../_service/data-service/data.service';
import { SocialService } from '../_service/social-service/social.service';

@Component({
  selector: 'app-socials',
  templateUrl: './socials.component.html',
  styleUrls: ['./socials.component.css'],
})
export class SocialsComponent implements OnInit {
  @Input() profile: any;
  socials: any[] = [];
  newSocials: any[] = [];
  selectedSocial: any;
  titleSocial: string = '';
  isVisibleSocial: boolean = false;
  isLoadingSave:boolean=false;
  isLoadingDelete:boolean=false;
  mode!: string;

  listSocials: any[] = [
    {
      social_name: 'Facebook',
      social_icon: 'facebook',
      social_link: 'facebook.com',
    },
    {
      social_name: 'Youtube',
      social_icon: 'youtube',
      social_link: 'youtube.com',
    },
    {
      social_name: 'Instagram',
      social_icon: 'instagram',
      social_link: 'instagram.com',
    },
    {
      social_name: 'Github',
      social_icon: 'github',
      social_link: 'github.com',
    },
    {
      social_name: 'Twitter',
      social_icon: 'twitter',
      social_link: 'twitter.com',
    },
    {
      social_name: 'Linkedin',
      social_icon: 'linkedin',
      social_link: 'linkedin.com',
    },
  ];
  socialForm: FormGroup = this.fb.group({
    id: [''],
    profile_id: [''],
    social_name: [''],
    links: ['', Validators.required],
    social_icon: [''],
    click_count: [''],
  });

  constructor(
    private fb: FormBuilder,
    private socialService: SocialService,
    private msg: NzMessageService,
    private data: DataService
  ) {}

  ngOnInit() {
    this.getSocials(this.profile.id);
  }

  getSocials(profileId: number) {
    this.socialService
      .getListSocial(profileId, 0, 999)
      .subscribe((res: any) => {
        if (res.success) {
          this.socials = res.data;
          this.data.sendSocials(this.socials);
          this.filterSocial(this.socials);
        } else this.msg.error('Get list social failed');
      });
  }

  socialModalCancel(): void {
    this.isVisibleSocial = false;
    this.socialForm.reset();
    this.mode = '';
    this.selectedSocial = this.newSocials[0];
  }

  openSocialModal(data: any, edit: boolean) {
    this.isVisibleSocial = true;
    this.socialForm.reset();
    if (edit) {
      this.mode = 'edit';
      this.titleSocial = 'EDIT SOCIAL';
      this.selectedSocial = data;
      this.socialForm.patchValue(data);
    } else {
      this.mode = 'create';
      this.titleSocial = 'CREATE SOCIAL';
    }
  }

  socialChange(event: any) {
    this.selectedSocial = event;
  }

  filterSocial(socials: any[]) {
    this.newSocials = [...this.listSocials];
    for (let i = 0; i < this.listSocials.length; i++) {
      for (let j = 0; j < socials.length; j++) {
        if (this.listSocials[i].social_name == socials[j].social_name) {
          this.newSocials.splice(i, 1, null);
          break;
        }
      }
    }
    this.newSocials = this.newSocials.filter((x) => x != null);
    this.selectedSocial = this.newSocials[0];
  }

  onDeleteSocial() {
    this.isLoadingDelete=true;
    this.socialService
      .deleteSocial(this.socialForm.controls['id'].value)
      .subscribe((res: any) => {
        if (res.success) {
          this.isLoadingDelete=false;
          const i = this.socials.findIndex((x) => x.id == res.data.id);
          this.socials.splice(i, 1);
          this.data.sendSocials(this.socials);
          this.filterSocial(this.socials);
          this.socialModalCancel();
          this.msg.success('Delete social successfully');
        } else {
          this.isLoadingDelete=false;
          this.msg.error('Delete social failed');
        
        }
      });
  }
  saveSocial() {
    for (const i in this.socialForm.controls) {
      this.socialForm.controls[i].markAsDirty();
      this.socialForm.controls[i].updateValueAndValidity();
    }

    if (this.socialForm.valid) {
      this.socialForm.controls['social_name'].setValue(
        this.selectedSocial.social_name
      );
      this.socialForm.controls['social_icon'].setValue(
        this.selectedSocial.social_icon
      );
      this.socialForm.controls['profile_id'].setValue(this.profile.id);
      this.socialForm.controls['click_count'].setValue(0);

      this.isLoadingSave=true;
      if(this.mode == 'create'){
        this.socialService
        .addSocial(this.socialForm.value)
        .subscribe((res: any) => {
          if (res.success) {
            this.isLoadingSave=false;
            this.socials.push(res.data);
            this.data.sendSocials(this.socials);
            this.socialModalCancel();
            this.filterSocial(this.socials);
            this.msg.success('Add social successfully');
          } else {
            this.isLoadingSave=false;
            this.msg.error('Add social failed');
          }
        });
      }
      if(this.mode == 'edit'){
        this.socialService
        .updateSocial(this.socialForm.value,this.socialForm.controls['id'].value)
        .subscribe((res: any) => {
          if (res.success) {
            this.isLoadingSave=false;
            const i = this.socials.findIndex((x) => x.id == res.data.id);
            this.socials.splice(i, 1, res.data);
            this.data.sendSocials(this.socials);
            this.socialModalCancel();
            this.msg.success('Add social successfully');
          } else {
            this.isLoadingSave=false;
            this.msg.error('Add social failed');
          }
        });
      }
      
    }
  }
}
