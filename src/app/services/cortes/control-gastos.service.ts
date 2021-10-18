import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ControlGastosService {

  constructor( private http : HttpClient) { }

  //https://localhost:44373/api/Cortesturno/ObtenerResumenesCortesEnRevision
  //https://localhost:44373/api/Cortesturno/RevisarCorteTurno?idCorteTurno=6724

  getResumenesCortesEnRevision() {
    return this.http.get(environment.apiUrl + 'api/Cortesturno/ObtenerResumenesCortesEnRevision');
  }

  getRevisarCorteTurno( corte: number = 0 ) {
    return this.http.get(environment.apiUrl + `api/Cortesturno/RevisarCorteTurno?idCorteTurno=${corte}`);
  }
}
