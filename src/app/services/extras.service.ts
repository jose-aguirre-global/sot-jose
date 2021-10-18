import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { RentaHabitacionModel } from '../models/rentaHabitacion';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExtrasService {

  constructor(private http: HttpClient) { }

  private apiUrl = environment.apiUrl;

  private subject = new Subject<any>();

  user = sessionStorage.user;

  CancelarOcupacion(idHabitacion: number):Observable<HttpResponse<object>>{
    return this.http.put(this.apiUrl+'api/Habitaciones/' + idHabitacion + '/Cancelar/Ocupacion/' + sessionStorage.user ,{}, {observe: 'response'});
  }

  AgregarExtras(model: any ):Observable<HttpResponse<object>>{
    return this.http.put(this.apiUrl + 'api/Rentas/Agregar/Extras', model, {observe:'response'});
  }

  VerDetalleHabitacion(id:number, habitacion:string):Observable<HttpResponse<object>>{
    return this.http.get(this.apiUrl + 'api/Habitaciones/' + id + '/Numero/' + habitacion + '/Detalle/' + sessionStorage.user , {observe: 'response'});
  }

}
