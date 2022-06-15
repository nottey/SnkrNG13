import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Sneaker } from '../Models/Sneaker'; 
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class SneakerService {
  readonly snkrAPI = environment.snkrAPI;

  constructor(private http: HttpClient) { }
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

   getAll() { 
    // return this.http.get<Sneaker[]>('https://snkrappbackend.azurewebsites.net/api/sneakers/');
     //return this.http.get<Sneaker[]>('/api/sneakers');
     console.log("Sneaker Service API: " + this.snkrAPI);
     return this.http.get<Sneaker[]>(this.snkrAPI);
   } 

  getAllwImages(getImage: boolean) { 
    return this.http.get<Sneaker[]>(this.snkrAPI + '?getImages=' + getImage);
  }

  get(id: String) {
    return this.http.get<Sneaker>(this.snkrAPI + '?id=' + id);
  }

  getSneaker(pKey: String, rKey: String, getImage: boolean) {
    return this.http.get<Sneaker>(this.snkrAPI + 'pKey=' + pKey
      + '&rKey=' + rKey
      + '&getImages=' + getImage);
  }

  getByKey(pKey: String, rKey: String) {
    return this.http.get<Sneaker>(this.snkrAPI + pKey + '/' + rKey);
  }

  postData(formData: any) {
    return this.http.post<boolean>(this.snkrAPI, formData);
  }

  putData(id: String, formData: any) {
    return this.http.put(this.snkrAPI, formData);
  }
 
  deleteData(upc: String) {
    return this.http.delete(this.snkrAPI + upc);
  }
}
