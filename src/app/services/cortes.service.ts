import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CortesService {

  constructor(private http: HttpClient) { }

  private apiUrl = environment.apiUrl;
  user = sessionStorage.user;

  GetConceptosActivos() {
    return this.http.get(this.apiUrl + 'api/Conceptosgastos/ObtenerConceptosActivos');
  }

}
