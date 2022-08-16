import { Component, HostListener, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AuthenticationService } from '../_service/auth-service/authentication.service';
import { UserService } from '../_service/user-service/user.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  admin:any;
  listUser:any[]=[];
  listUserChecked:any[]=[];
  isAllDisplayDataChecked = false;
  isIndeterminate = false;
  isLoading:boolean=false;
  isLoadingUpgrade:boolean=false;
  isLoadingCancel:boolean=false;
  scrollY :string='';
  usernameSearch:string='';
  pagination:any={
    page:1,
    page_size:20
  };
  total!:number;
  size: any = 'small';
  mapOfCheckedId: { [key: string]: boolean } = {};
  constructor(private userService:UserService,private msg:NzMessageService, private auth: AuthenticationService) { }

  ngOnInit(): void {
    this.admin=JSON.parse(localStorage.getItem('auth-user')!);
    this.getListUserUpdateRole();
  }

  getListUserUpdateRole(){
    this.isLoading=true;
    this.userService.getUserUpdateRole(true,this.usernameSearch,this.pagination.page-1,this.pagination.page_size).subscribe((res:any)=>{
      if(res.success){
        this.isLoading=false;
        this.listUser=res.data;
        this.total=res.pagination.total;
      }
    });
  }

  upgradeRole(user:any){
    if(user.role==='USER') user.role='USER_VIP';
    else if(user.role==='USER_VIP') user.role='ADMIN';

    this.isLoadingUpgrade=true;
    this.userService.upgradeRole(user,user.id).subscribe((res:any)=>{
      if(res.success){
        this.isLoadingUpgrade=false;
        const i = this.listUser.findIndex((x) => x.id == res.data.id);
          this.listUser.splice(i, 1);
          this.msg.success('Upgrade role successfully');
      }
      else {
        this.isLoadingUpgrade=false;
        this.msg.error('Upgrade role failed')
      } 
    })
  }

  upgradeRoleList(){
    this.listUserChecked.forEach(user=>{
      if(user.role==='USER') user.role='USER_VIP';
      else if(user.role==='USER_VIP') user.role='ADMIN';
    })

    this.userService.upgradeRoleList(this.listUserChecked).subscribe((res:any)=>{
      if(res.success){
        if(res.data.length==this.listUser.length) this.listUser=[];
        for(let i=0;i<res.data.length;i++){
          for(let j=0;j<this.listUser.length;j++){
            if(res.data[i].id==this.listUser[j].id){
              this.listUser.splice(j,1);
              break;
            }
          }
        }
        this.msg.success('Upgrade role successfully');
        this.isIndeterminate=false;
        this.listUserChecked=[];
      } else this.msg.error('Upgrade role failed');
    })
  }

  cancelUpgradeRoleList(){
    this.userService.cancelUpgradeRoleList(this.listUserChecked,false).subscribe((res:any)=>{
      if(res.success){
        if(res.data.length==this.listUser.length) this.listUser=[];
        for(let i=0;i<res.data.length;i++){
          for(let j=0;j<this.listUser.length;j++){
            if(res.data[i].id==this.listUser[j].id){
              this.listUser.splice(j,1);
              break;
            }
          }
        }
        this.msg.success('Cancel upgrade role successfully');
        this.isIndeterminate=false;
        this.listUserChecked=[];
      } else this.msg.error('Cancel upgrade role failed');
    })
  }

  cancelRequestUpgradeRole(user:any){
    this.isLoadingCancel=true;
    this.userService.requestUpgradeRole(user.id,false).subscribe((res:any)=>{
      if(res.success){
        this.isLoadingCancel=false;
        const i = this.listUser.findIndex((x) => x.id == res.data.id);
        this.listUser.splice(i, 1);
        this.msg.success('Cancel request for role upgrade successfully')
      } else {
        this.isLoadingCancel=false;
        this.msg.error('Cancel request for role upgrade failed');
      }
    })
  }

  findByUsername(ev:any){
    this.getListUserUpdateRole();
  }

  currentPageDataChange($event: any): void {
    this.refreshStatus();
  }
  refreshStatus(): void {
    if (this.listUser.length === 0) {
      this.isAllDisplayDataChecked = false;
      this.isIndeterminate = false;
    } else {
      this.isAllDisplayDataChecked = this.listUser.every(
        (item) =>
          this.mapOfCheckedId[item.id] ||
          (item.children && item.children.every((element: { id: string | number }) => this.mapOfCheckedId[element.id])),
      );
      this.isIndeterminate =
        this.listUser.some(
          (item) =>
            this.mapOfCheckedId[item.id] ||
            (item.children && item.children.some((element: { id: string | number }) => this.mapOfCheckedId[element.id])),
        ) && !this.isAllDisplayDataChecked;
    }
    const newUsers: any[] = [];
    this.listUser
      .filter(
        (item) =>
          this.mapOfCheckedId[item.id] ||
          (item.children && item.children.some((element: { id: string | number }) => this.mapOfCheckedId[element.id])),
      )
      .forEach((item) => {
        newUsers.push(item);
      });
    this.listUserChecked = [...newUsers];
  }
  checkAll(value: boolean): void {
    this.listUser.forEach((item) => {
      this.mapOfCheckedId[item.id] = value;
      // tslint:disable-next-line:no-unused-expression
      item.children &&
        item.children.forEach((element: any) => {
          this.mapOfCheckedId[element.id] = value;
        });
    });

    this.refreshStatus();
  }

  nzPageIndexChange(page: number): void {
    this.pagination.page = page;
    this.getListUserUpdateRole();
  }

  ngAfterContentInit() {
    this.calculateHeightBodyTable();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.calculateHeightBodyTable();
  }

  calculateHeightBodyTable() {
    this.scrollY = `calc(100vh - 320px)`;
  }

  comeBackHome(){
    window.location.pathname = '/home';
  }

  logout(){
    this.auth.doLogout();
  }
}
