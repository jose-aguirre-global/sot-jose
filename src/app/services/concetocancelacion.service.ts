import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConcetocancelacionService {

  constructor(private http: HttpClient) { }

  private apiUrl = environment.apiUrl;
  user = sessionStorage.user;


  GetConceptos() {
    return this.http.get(this.apiUrl + 'api/Conceptossistema/' + this.user);
  }

  GetTiposConceptos() {
    return this.http.get(this.apiUrl + 'api/Conceptossistema/Tipos');
  }
}
