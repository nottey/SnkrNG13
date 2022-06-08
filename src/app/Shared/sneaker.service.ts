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

   getAll() { 
    // return this.http.get<Sneaker[]>('https://snkrappbackend.azurewebsites.net/api/sneakers/');
     return this.http.get<Sneaker[]>('/api/sneakers');
    } 

  getAllwImages(getImage: boolean) {
    return this.http.get<Sneaker[]>('/api/sneakers?getImages=' + getImage );
  }

  get(id: String) {
    return this.http.get<Sneaker>('/api/sneakers?id=' + id);
  }

  getSneaker(pKey: String, rKey: String, getImage: boolean) {
    return this.http.get<Sneaker>('/api/sneakers?pKey=' + pKey + '&rKey=' + rKey + '&getImages=' + getImage );
  }

  getByKey(pKey: String, rKey: String) {
    return this.http.get<Sneaker>('/api/sneakers/' + pKey + '/' + rKey);
  }

  postData(formData: any) {
    return this.http.post<boolean>('/api/sneakers', formData);
  }

  putData(id: String, formData: any) {
    return this.http.put('/api/sneakers/', formData);
  }

  deleteData(upc: String) {
    return this.http.delete('/api/sneakers/' + upc);
  }
}
