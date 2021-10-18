import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ComandasVmModel } from '../models/comandasVMModel';

@Injectable({
  providedIn: 'root'
})
export class CocinabarService {

  constructor(private http: HttpClient) { }

  private apiUrl = environment.apiUrl;

  GetDatosCocina() {
    return this.http.get(this.apiUrl + 'api/Roomservices/Detalles/Comandas/Cocina');
  }

  GetDatosBar() {
    return this.http.get(this.apiUrl + 'api/Roomservices/Detalles/Comandas/Bar');
  }

  PostComanda(model: any) {
    return this.http.put(this.apiUrl + 'api/Roomservices/Siguiente/Status/Comanda', model);
  }
}
