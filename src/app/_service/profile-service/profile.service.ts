import { formatDate } from '@angular/common';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  BASE_PATH = 'http://localhost:8080/api/v1.0/profile';
  headers = new HttpHeaders().set('Content-Type', 'application/json');
  constructor(private http:HttpClient) { }

  getProfile(id:number){
    return this.http.get(this.BASE_PATH+"/"+id,{headers:this.headers});
  }

  addProfile(profile:any,file?:any){
    const formdata = new FormData();
    formdata.append('file',file);
    formdata.append('fullname',profile.fullname);
    formdata.append('shortBio',profile.short_bio);
    formdata.append('about',profile.about);
    formdata.append('birthday',formatDate(profile.birthday,'yyyy-MM-dd','en_US'));
    formdata.append('gender',profile.gender);
    formdata.append('location',profile.location);
    formdata.append('profileLink',profile.profile_link);
    formdata.append('avatarLink',profile.avatar_link);
    formdata.append('clickCount',profile.click_count);
    formdata.append('userId',profile.user_id);
    formdata.append('designId',profile.design_id);
    return this.http.post(this.BASE_PATH,formdata);
  }

  updateProfile(profile:any,id:number,file?:any){
    const formdata = new FormData();
    formdata.append('file',file);
    formdata.append('fullname',profile.fullname);
    formdata.append('shortBio',profile.short_bio);
    formdata.append('about',profile.about);
    formdata.append('birthday',formatDate(profile.birthday,'yyyy-MM-dd','en_US'));
    formdata.append('gender',profile.gender);
    formdata.append('location',profile.location);
    formdata.append('profileLink',profile.profile_link);
    formdata.append('avatarLink',profile.avatar_link);
    formdata.append('clickCount',profile.click_count);
    formdata.append('userId',profile.user_id);
    formdata.append('designId',profile.design_id);
    return this.http.put(this.BASE_PATH+"/"+id,formdata);
  }

  deleteProfile(id:number){
    return this.http.delete(this.BASE_PATH+"/"+id);
  }
}
