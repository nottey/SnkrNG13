import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class SnkimgService {

  constructor(private http: HttpClient) { }
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  getAllImages() {
    return this.http.get<any[]>('/api/sneakerimg');
  }

  getImage(id: String) {
    return this.http.get<any>('/api/sneakerimg/' + id);
  }

  deleteData(id: String) {
    return this.http.delete('/api/sneakerimg/' + id);
  }

  upload(formData: any) {
    return this.http.post('/api/sneakerimg/', formData);
  }

  public uploadImage(image: File): Observable<any> {
    const formData = new FormData();
    formData.append('image', image);
    return this.http.post('/api/sneakerimg/', formData);
  }


  /*postData(formData) {
    return this.http.post('/api/Sneakers', formData);
  }

  putData(id, formData) {
    return this.http.put('/api/Sneakers/' + id, formData);
  }*/

}
