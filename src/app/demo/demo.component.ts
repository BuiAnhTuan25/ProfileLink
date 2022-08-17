import { Component, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { NzButtonShape, NzButtonType } from 'ng-zorro-antd/button';
import { DataService } from '../_service/data-service/data.service';
import { DesignService } from '../_service/design-service/design.service';
import { BUTTON_TYPE } from '../_model/button_type';
import { LinksService } from '../_service/links-service/links.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ActivatedRoute } from '@angular/router';
import { ProfileService } from '../_service/profile-service/profile.service';
import { SocialService } from '../_service/social-service/social.service';
import { WebsocketService } from '../_service/websocket-service/websocket.service';

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.css'],
})
export class DemoComponent implements OnInit {
  @Input() profile: any;
  @Input() border: any;

  profileBio: any;
  listLinks: any[] = [];
  listSocial: any[] = [];
  isPrimary: boolean = true;
  isBackgroundImage: boolean = false;
  buttonType: NzButtonType = 'primary';
  buttonShape!: NzButtonShape;
  design: any;
  shortBio: any;
  user: any;

  constructor(
    private data: DataService,
    private designService: DesignService,
    private linksService: LinksService,
    private msg: NzMessageService,
    private route: ActivatedRoute,
    private profileService: ProfileService,
    private socialService: SocialService
  ) //private websocket:WebsocketService
  {}

  async ngOnInit() {
    this.data.dataFromChild.subscribe(
      (listLinks) => (this.listLinks = listLinks)
    );
    this.data.receiveSocials.subscribe(
      (listSocial) => (this.listSocial = listSocial)
    );
    this.data.receiveDesign.subscribe((design) => {
      this.design = design;
      this.changeButton(this.design);
    });
    this.shortBio = this.route.snapshot.paramMap.get('short_bio');
    if (this.shortBio) {
      await this.getProfleByShortBio(this.shortBio);
      this.getListLinks(this.profileBio.id);
      this.getSocials(this.profileBio.id);
      this.getDesign(this.profileBio.design_id);
      // this.websocket._connect(this.profileBio.id);
      // setTimeout(()=>this.websocket._send({to:this.profileBio.id,from:"someone",text:"Someone is viewing your profile"}), 1000)
    } else this.getDesign(this.profile.design_id);
  }

  onClickLink(link: any) {
    this.linksService.getLink(link.id).subscribe((res: any) => {
      if (res.success) {
        const linkClick = res.data;
        linkClick.click_count += 1;
        this.linksService
          .updateLink(linkClick, linkClick.id)
          .subscribe((res: any) => {
            if (res.success) {
              // window.open('https://' + linkClick.url, 'mytab');
            } else this.msg.error('False');
          });
      } else this.msg.error('False');
    });
  }

  onClickSocial(social: any) {
    this.socialService.getSocial(social.id).subscribe((res:any)=>{
      if(res.success){
        const socialClick=res.data;
        socialClick.click_count+=1;
        this.socialService.updateSocial(socialClick,socialClick.id).subscribe((res:any)=>{
          if(res.success){
            // window.open('https://' +socialClick.social_icon+'.com/'+ socialClick.links, 'mytab');
          } else this.msg.error('False');
          })
      } else this.msg.error('False');
      })
    }

  getDesign(id: number) {
    this.designService.getDesign(id).subscribe((res: any) => {
      if (res.success) {
        this.design = res.data;
        this.data.sendDesign(this.design);
        this.changeButton(res.data);
      }
    });
  }

  async getProfleByShortBio(shortBio: any) {
    await this.profileService
      .getProfileByShortBio(shortBio)
      .toPromise()
      .then((res: any) => {
        if (res.success) {
          this.profileBio = res.data;
        } else this.msg.error('Get profile false');
      });
  }

  getListLinks(profileId: number) {
    this.linksService.getListLinks(profileId, 0, 999).subscribe((res: any) => {
      if (res.success) {
        this.listLinks = res.data;
      } else this.msg.error('Get list link false');
    });
  }

  getSocials(profileId: number) {
    this.socialService
      .getListSocial(profileId, 0, 999)
      .subscribe((res: any) => {
        if (res.success) {
          this.listSocial = res.data;
        } else this.msg.error('Get list social false');
      });
  }

  changeButton(design: any) {
    if (this.design.background_type == 'IMAGE') {
      this.isBackgroundImage = true;
    } else this.isBackgroundImage = false;

    switch (design.button_type) {
      case BUTTON_TYPE.CIRCLE_SOLID:
        this.isPrimary = true;
        this.buttonType = 'primary';
        this.buttonShape = 'round';
        break;
      case BUTTON_TYPE.CIRCLE_REGULAR:
        this.isPrimary = false;
        this.buttonType = 'default';
        this.buttonShape = 'round';
        break;
      case BUTTON_TYPE.RECTANGLE_SOLID:
        this.isPrimary = true;
        this.buttonType = 'primary';
        this.buttonShape = null;
        break;
      case BUTTON_TYPE.RECTANGLE_REGULAR:
        this.isPrimary = false;
        this.buttonType = 'default';
        this.buttonShape = null;
        break;
    }
  }
}
