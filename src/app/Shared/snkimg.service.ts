import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SnkimgService {
  readonly snkrImgAPI = environment.snkrImgAPI;

  constructor(private http: HttpClient) { }
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  getAllImages() {
    return this.http.get<any[]>(this.snkrImgAPI);
  }

  getImage(id: String) {
    return this.http.get<any>(this.snkrImgAPI + id);
  }

  deleteData(id: String) {
    return this.http.delete(this.snkrImgAPI + id);
  }

  upload(formData: any) {
    return this.http.post(this.snkrImgAPI, formData);
  }

  public uploadImage(image: File): Observable<any> {
    const formData = new FormData();
    formData.append('image', image);
    return this.http.post(this.snkrImgAPI, formData);
  }

   

}
