import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class UpcomingService {

  constructor(private http: HttpClient) { }
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  getAll() {
    return this.http.get<any []>('/api/upcoming');
  }

  get(id: String) {
    return this.http.get('/api/upcoming');
  }

  postData(formData: any) {
    return this.http.post('/api/upcoming', formData);
  }

  putData(id: String, formData: any = new FormData()) {
    return this.http.put('/api/upcoming/' + id, formData);
  }

  deleteData(id: String) {
    return this.http.delete('/api/upcoming/' + id);
  }
}
