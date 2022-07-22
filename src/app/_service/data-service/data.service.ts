import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private listData: Subject<any> = new Subject<any>();
  private design: Subject<any> = new Subject<any>();
  private socials: Subject<any> = new Subject<any>();

  public get dataFromChild() {
    return this.listData;
  }

  public notifyCountValue(data: any) {
    this.listData.next(data);
  }

  public get receiveDesign() {
    return this.design;
  }

  public sendDesign(design: any) {
    this.design.next(design);
  }

  public get receiveSocials() {
    return this.socials;
  }

  public sendSocials(socials: any) {
    this.socials.next(socials);
  }
}
