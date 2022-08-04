import { formatDate } from '@angular/common';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  BASE_PATH = 'http://localhost:8080/api/v1.0/profile';
  USER_PATH = 'http://localhost:8080/api/v1.0/user'
  constructor(private http: HttpClient) {}

  getProfile(id: number): Observable<any> {
    return this.http.get(this.BASE_PATH + '/' + id);
  }

  getProfileByShortBio(shortBio: any): Observable<any> {
    return this.http.get(this.BASE_PATH + '/shortbio/'+shortBio);
  }

  addProfile(profile: any, file?: any): Observable<any> {
    const formdata = new FormData();
    formdata.append('file', file);
    formdata.append('id', profile.id);
    formdata.append('fullname', profile.fullname);
    formdata.append('shortBio', profile.short_bio);
    formdata.append('about', profile.about);
    formdata.append(
      'birthday',
      formatDate(profile.birthday, 'yyyy-MM-dd', 'en_US')
    );
    formdata.append('gender', profile.gender);
    formdata.append('location', profile.location);
    formdata.append('avatarLink', profile.avatar_link);
    formdata.append('clickCount', profile.click_count);
    formdata.append('designId', profile.design_id);
    return this.http.post(this.BASE_PATH, formdata);
  }

  updateProfile(profile: any, id: number, file?: any): Observable<any> {
    const formdata = new FormData();
    formdata.append('file', file);
    formdata.append('id', profile.id);
    formdata.append('fullname', profile.fullname);
    formdata.append('shortBio', profile.short_bio);
    formdata.append('about', profile.about);
    formdata.append(
      'birthday',
      formatDate(profile.birthday, 'yyyy-MM-dd', 'en_US')
    );
    formdata.append('gender', profile.gender);
    formdata.append('location', profile.location);
    formdata.append('avatarLink', profile.avatar_link);
    formdata.append('clickCount', profile.click_count);
    formdata.append('designId', profile.design_id);
    return this.http.put(this.BASE_PATH + '/' + id, formdata);
  }

  deleteProfile(id: number): Observable<any> {
    return this.http.delete(this.BASE_PATH + '/' + id);
  }

  deleteUser(id:number):Observable<any>{
    return this.http.delete(this.USER_PATH+'/'+id);
  }

  updateUser(user:any,id:number):Observable<any>{
    return this.http.put(this.USER_PATH+"/"+id,user);
  }
}
