import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  USER_BASE = 'http://profilelink.ap-south-1.elasticbeanstalk.com/api/v1.0/user';
  constructor(private http: HttpClient) {}

  getUserUpdateRole(
    isUdateRole: boolean,
    username: string,
    page: number,
    pageSize: number
  ): Observable<any> {
    let param = new HttpParams();
    param = param.append('is-upgrade-role', isUdateRole);
    param = param.append('username', username);
    param = param.append('page', page);
    param = param.append('page-size', pageSize);
    return this.http.get(this.USER_BASE + '/is-upgrade-role', {
      params: param,
    });
  }

  upgradeRole(user: any, id: number): Observable<any> {
    return this.http.put(this.USER_BASE + '/upgrade-role/' + id, user);
  }

  requestUpgradeRole(id: number,isUpgradeRole:boolean): Observable<any> {
    let param=new HttpParams();
    param=param.append('is-upgrade-role',isUpgradeRole);
    return this.http.put(this.USER_BASE+'/role-upgrade-request/'+id,null,{params:param});
  }

  findByUsername(username:string,page:number,pageSize:number): Observable<any>{
    let param=new HttpParams();
    param=param.append('username',username);
    param=param.append('page',page);
    param=param.append('page-size',pageSize);
    return this.http.get(this.USER_BASE+'/find-by-username',{params:param});
  }

  upgradeRoleList(users:any[]): Observable<any>{
    return this.http.put(this.USER_BASE+'/upgrade-role/list',users);
  }

  cancelUpgradeRoleList(users:any[],isUpgradeRole:boolean): Observable<any>{
    let param=new HttpParams();
    param=param.append('is-upgrade-role',isUpgradeRole);
    return this.http.put(this.USER_BASE+'/role-upgrade-request/list',users,{params:param});
  }

  deleteUser(id:number):Observable<any>{
    return this.http.delete(this.USER_BASE+'/'+id);
  }

  updateUser(user:any,id:number):Observable<any>{
    return this.http.put(this.USER_BASE+"/"+id,user);
  }
}
