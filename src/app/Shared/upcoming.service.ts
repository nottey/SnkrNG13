import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { upcomingPost } from '../Models/upcomingPost'; 



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
    //return this.http.get<any[]>('/api/upcoming');
    return this.http.get<upcomingPost []>('/api/upcoming');
  }

  get(pKey: string, rKey: string) {
    return this.http.get('/api/upcoming/' + pKey + '/' + rKey ); 
  }

  postData(formData: upcomingPost) { 
    return this.http.post('/api/upcoming', formData);
  }

  putData(id: string, formData: upcomingPost) {
    formData.upc = id;
    return this.http.put('/api/upcoming/' + id, formData);
  }

  AddToCollection(pKey: string, rKey: string, add:string) {
    return this.http.put('/api/upcoming/' + pKey + '/' + rKey + '/' + add ,'');
  }

  deleteData(pKey: string, rKey: string) {
    return this.http.delete('/api/upcoming/' + pKey + '/' + rKey); 
  }

}
