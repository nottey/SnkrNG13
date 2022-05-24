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
    return this.http.get<upcomingPost []>('/api/upcoming/true');
  }

  get(pKey: string, rKey: string) {
    return this.http.get('/api/upcoming/' + pKey + '/' + rKey ); 
  }

  postData(formData: any) {
    return this.http.post<boolean>('/api/upcoming', formData);
  }

  putData(id: string, formData: upcomingPost) { 
    return this.http.put('/api/upcoming/' + id, formData);
  }

  deleteData(pKey: string, rKey: string) {
    return this.http.delete('/api/upcoming/' + pKey + '/' + rKey); 
  }

  /*deleteData(formData: upcomingPost) {
    let httpParams = new HttpParams().set('aaa', '111');
    httpParams.set('bbb', '222');

    return this.http.delete( ('/api/upcoming/' , formData);
    //return this.http.delete('/api/upcoming/' + pKey);
    //return this.http.delete('/api/upcoming/', { params: { pKey, rKey } });
  }*/

}
