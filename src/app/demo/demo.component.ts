import { DOCUMENT } from '@angular/common';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { NzButtonShape, NzButtonType } from 'ng-zorro-antd/button';
import { DataService } from '../_service/data-service/data.service';
import { DesignService } from '../_service/designservice/design.service';
import { BUTTON_TYPE } from '../_model/button_type';
import { LinksService } from '../_service/links-service/links.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.css']
})
export class DemoComponent implements OnInit {
  @Input() profile:any;
  listLinks:any[]=[];
  isPrimary:boolean=true;
  buttonType:NzButtonType='primary';
  buttonShape!:NzButtonShape;
  design:any;

  user:any;

  constructor(
    @Inject(DOCUMENT) private document: any,
    private data: DataService,
    private designService:DesignService,
    private linksService:LinksService,
    private msg: NzMessageService, 
    ) { }

  async ngOnInit() {
    this.data.dataFromChild.subscribe(listLinks => this.listLinks = listLinks);
    await this.getDesign(this.profile.design_id);
    this.data.receiveDesign.subscribe(design=>{
      this.design=design;
      this.changeButton(this.design);
    });
    
  }

  async onClickLink(link:any){
    await this.linksService.getLink(link.id).toPromise().then((res:any)=>{
      if(res.success){
        const linkClick=res.data;
        linkClick.click_count+=1;
          this.linksService.updateLink(linkClick,linkClick.id).toPromise().then((res:any)=>{
          if(res.success){
            this.document.location.href ='https://'+linkClick.url;
          }else this.msg.error('False');
        });
      }else this.msg.error('False');
    })  
  }
  async getDesign(id:number){
    await this.designService.getDesign(id).toPromise().then((res:any)=>{
      if(res.success){
        this.design=res.data;
        this.changeButton(res.data);
      }
    })
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
