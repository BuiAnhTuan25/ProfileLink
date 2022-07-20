import { Component, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { NzButtonShape, NzButtonType } from 'ng-zorro-antd/button';
import { DataService } from '../_service/data-service/data.service';
import { DesignService } from '../_service/designservice/design.service';
import { BUTTON_TYPE } from '../_model/button_type';
import { LinksService } from '../_service/links-service/links.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ActivatedRoute } from '@angular/router';
import { ProfileService } from '../_service/profile-service/profile.service';

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.css']
})
export class DemoComponent implements OnInit {
  @Input() profile:any = {};
  listLinks:any[]=[];
  listSocial:any[]=[];
  isPrimary:boolean=true;
  buttonType:NzButtonType='primary';
  buttonShape!:NzButtonShape;
  design:any;
  shortBio:any;

  user:any;

  constructor(
    private data: DataService,
    private designService:DesignService,
    private linksService:LinksService,
    private msg: NzMessageService, 
    private route:ActivatedRoute,
    private profileService:ProfileService,
    ) { }

  ngOnInit() {
    this.data.dataFromChild.subscribe(listLinks => this.listLinks = listLinks);
    this.data.receiveSocials.subscribe(listSocial => this.listSocial = listSocial);
    this.data.receiveDesign.subscribe(design=>{
      this.design=design;
      this.changeButton(this.design);
    });
    this.shortBio = this.route.snapshot.paramMap.get('short_bio');
    if(this.shortBio){
      this.getProfleByShortBio(this.shortBio);
      this.getListLinks(this.profile.id);
    }
    this.getDesign(this.profile.design_id);
  }

   onClickLink(link:any){
    this.linksService.getLink(link.id).subscribe((res:any)=>{
      if(res.success){
        const linkClick=res.data;
        linkClick.click_count+=1;
          this.linksService.updateLink(linkClick,linkClick.id).toPromise().then((res:any)=>{
          if(res.success){
            document.location.href ='https://'+linkClick.url;
          }else this.msg.error('False');
        });
      }else this.msg.error('False');
    })  
  }

  getDesign(id:number){
   this.designService.getDesign(id).subscribe((res:any)=>{
      if(res.success){
        this.design=res.data;
        this.data.sendDesign(this.design);
        this.changeButton(res.data);
      }
    })
  }
  
  getProfleByShortBio(shortBio:any){
    this.profileService.getProfileByShortBio(shortBio).subscribe((res:any)=>{
    if(res.success){
      this.profile=res.data;
    }else this.msg.error('Get profile false');
    })
  }

 getListLinks(profileId:number){
    this.linksService.getListLinks(profileId, 0, 999).subscribe((res:any)=>{
      if (res.success) {
        this.listLinks = res.data;
      }
    }); 
  }

  changeButton(design:any){
    switch(design.button_type){
      case(BUTTON_TYPE.CIRCLE_SOLID): this.isPrimary=true;this.buttonType='primary';this.buttonShape='round';break;
      case(BUTTON_TYPE.CIRCLE_REGULAR): this.isPrimary=false;this.buttonType='default';this.buttonShape='round';break;
      case(BUTTON_TYPE.RECTANGLE_SOLID): this.isPrimary=true;this.buttonType='primary';this.buttonShape=null;break;
      case(BUTTON_TYPE.RECTANGLE_REGULAR): this.isPrimary=false;this.buttonType='default';this.buttonShape=null;break;
    }
  }
}
