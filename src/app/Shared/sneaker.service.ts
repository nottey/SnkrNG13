import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Sneaker } from '../Models/Sneaker';

@Injectable({
  providedIn: 'root'
})
export class SneakerService {

  constructor(private http: HttpClient) { }
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

 /*getAll(){
    return this.http.get<Sneaker[]>('/api/snkr');
  }
 */

  getAll() {
    return this.http.get<Sneaker[]>('/api/sneakers');
  }

  get(id: String) {
    return this.http.get<Sneaker>('/api/sneakers/' + id);
  }

  postData(formData: any) {
    return this.http.post<boolean>('/api/sneakers', formData);
  }

  putData(id: String, formData: any) {
    return this.http.put('/api/sneakers/' + id, formData);
  }

  deleteData(upc: String) {
    return this.http.delete('/api/sneakers/' + upc);
  }
}
