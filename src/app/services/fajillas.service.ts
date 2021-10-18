import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { FajillasModel } from '../models/fajillas';

@Injectable({
  providedIn: 'root'
})
export class FajillasService {

  constructor(private http: HttpClient) { }

  private apiUrl = environment.apiUrl;

  NewFajilla(model: FajillasModel[]) {
    return this.http.post(this.apiUrl + 'api/fajillas/crearFajilla', model);
  }
}
