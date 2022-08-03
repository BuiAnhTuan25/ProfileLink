import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DesignService {
  BASE_PATH = 'http://localhost:8080/api/v1.0/design';
  constructor(private http: HttpClient) {}

  getDesign(id: number): Observable<any> {
    return this.http.get(this.BASE_PATH + '/get/' + id);
  }

  addDesign(design: any,file?:any): Observable<any> {
    const formdata = new FormData();
    formdata.append('file', file);
    formdata.append('name', design.name);
    formdata.append('type', design.type);
    formdata.append('backgroundColor', design.background_color);
    formdata.append('backgroundImage', design.background_image);
    formdata.append('backgroundType', design.background_type);
    formdata.append('buttonType', design.button_type);
    formdata.append('buttonColor', design.button_color);
    formdata.append('textColor', design.text_color);
    formdata.append('font', design.font);

    return this.http.post(this.BASE_PATH, formdata);
  }

  updateDesign(design: any, id: number,file?:any): Observable<any> {
    const formdata = new FormData();
    formdata.append('file', file);
    formdata.append('name', design.name);
    formdata.append('type', design.type);
    formdata.append('backgroundColor', design.background_color);
    formdata.append('backgroundType', design.background_type);
    formdata.append('backgroundImage', design.background_image);
    formdata.append('buttonType', design.button_type);
    formdata.append('buttonColor', design.button_color);
    formdata.append('textColor', design.text_color);
    formdata.append('font', design.font);
    
    return this.http.put(this.BASE_PATH + '/' + id, formdata);
  }

  deleteDesign(id: number): Observable<any> {
    return this.http.delete(this.BASE_PATH + '/' + id);
  }
  getAllDesign(page: number, pageSize: number): Observable<any> {
    return this.http.get(
      this.BASE_PATH + '?page=' + page + '&page-size=' + pageSize
    );
  }

  getByNameDesign(name:string){
    return this.http.get(this.BASE_PATH+'/name/'+name);
  }
}
