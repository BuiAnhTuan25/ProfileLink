import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import {
  NzContextMenuService,
  NzDropdownMenuComponent,
} from 'ng-zorro-antd/dropdown';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { DrawerDesignComponent } from '../drawer-design/drawer-design.component';
import { DesignService } from '../_service/design-service/design.service';

@Component({
  selector: 'app-list-design',
  templateUrl: './list-design.component.html',
  styleUrls: ['./list-design.component.css'],
})
export class ListDesignComponent implements OnInit {
  @ViewChild('designDrawer') designDrawer!: DrawerDesignComponent;
  listDesign: any[] = [];
  listDesignChecked: any[] = [];
  isAllDisplayDataChecked = false;
  isIndeterminate = false;
  isLoading: boolean = false;
  scrollY: string = '';
  nameSearch: string = '';
  mapOfCheckedId: { [key: string]: boolean } = {};
  isVisibleDrawer: boolean = false;
  titleDrawer: string = '';
  designContext: any;
  constructor(
    private designService: DesignService,
    private msg: NzMessageService,
    private nzContextMenuService: NzContextMenuService,
    private modal: NzModalService,
  ) {}

  ngOnInit() {
    this.getAllDesign();
  }

  getAllDesign() {
    this.designService
      .getAllDesign(0, 999, this.nameSearch)
      .subscribe((res: any) => {
        if (res.success) {
          this.listDesign = res.data;
        } else this.msg.error('Get all design failed');
      });
  }

  findByName() {
    this.getAllDesign();
  }

  deleteListDesign() {
    this.designService
      .deleteListDesign(this.listDesignChecked)
      .subscribe((res: any) => {
        if (res.success) {
          for (let i = 0; i < res.data.length; i++) {
            for (let j = 0; j < this.listDesign.length; j++) {
              if (res.data[i].id == this.listDesign[j].id) {
                this.listDesign.splice(j, 1);
                break;
              }
            }
          }
          this.isIndeterminate = false;
          this.listDesignChecked = [];
          this.msg.success('Delete list design successfully');
        } else this.msg.error('Delete list design failed');
      });
  }

  deleteDesign(id?: number) {
    let idDesign: number;
    id ? (idDesign = id) : (idDesign = this.designContext.id);
    this.designService.deleteDesign(idDesign!).subscribe((res: any) => {
      if (res.success) {
        const i = this.listDesign.findIndex((x) => x.id == res.data.id);
        this.listDesign.splice(i, 1);
        this.msg.success('Delete design successfully');
      } else this.msg.error('Delete design failed');
    });
  }

  onDeleteDrawer(id: number) {
    const i = this.listDesign.findIndex((x) => x.id == id);
    this.listDesign.splice(i, 1);
  }

  onCreateDrawer(data: any) {
    this.listDesign.push(data);
  }

  onUpdatetDrawer(data: any) {
    const i = this.listDesign.findIndex((x) => x.id == data.id);
    this.listDesign.splice(i, 1, data);
  }

  refreshStatus(): void {
    if (this.listDesign.length === 0) {
      this.isAllDisplayDataChecked = false;
      this.isIndeterminate = false;
    } else {
      this.isAllDisplayDataChecked = this.listDesign.every(
        (item) =>
          this.mapOfCheckedId[item.id] ||
          (item.children &&
            item.children.every(
              (element: { id: string | number }) =>
                this.mapOfCheckedId[element.id]
            ))
      );
      this.isIndeterminate =
        this.listDesign.some(
          (item) =>
            this.mapOfCheckedId[item.id] ||
            (item.children &&
              item.children.some(
                (element: { id: string | number }) =>
                  this.mapOfCheckedId[element.id]
              ))
        ) && !this.isAllDisplayDataChecked;
    }
    const newUsers: any[] = [];
    this.listDesign
      .filter(
        (item) =>
          this.mapOfCheckedId[item.id] ||
          (item.children &&
            item.children.some(
              (element: { id: string | number }) =>
                this.mapOfCheckedId[element.id]
            ))
      )
      .forEach((item) => {
        newUsers.push(item);
      });
    this.listDesignChecked = [...newUsers];
  }
  checkAll(value: boolean): void {
    this.listDesign.forEach((item) => {
      this.mapOfCheckedId[item.id] = value;
      // tslint:disable-next-line:no-unused-expression
      item.children &&
        item.children.forEach((element: any) => {
          this.mapOfCheckedId[element.id] = value;
        });
    });

    this.refreshStatus();
  }

  ngAfterContentInit() {
    this.calculateHeightBodyTable();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.calculateHeightBodyTable();
  }

  calculateHeightBodyTable() {
    this.scrollY = `calc(100vh - 270px)`;
  }

  openDrawer(mode: string, data?: any) {
    let design: any;
    data ? (design = data) : (design = this.designContext);
    this.designDrawer.openDrawer(design, mode);
  }

  contextMenu(
    $event: MouseEvent,
    menu: NzDropdownMenuComponent,
    data: any
  ): void {
    this.nzContextMenuService.create($event, menu);
    this.designContext = data;
  }

  closeMenu(): void {
    this.nzContextMenuService.close();
  }

  onDuplication() {
    this.openDrawer('create', this.designContext);
  }

  showDeleteConfirm(): void {
    this.modal.confirm({
      nzTitle: 'Are you sure delete this item?',
      nzOkText: 'Yes',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => this.deleteDesign(),
      nzCancelText: 'No',
      nzOnCancel: () => this.closeMenu()
    });
  }
}
