import { HttpClient ,HttpHeaders,HttpResponse, HttpErrorResponse} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject,observable, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ComandasVmModel } from '../models/comandasVMModel';

@Injectable({
  providedIn: 'root'
})
export class RoomservService {

  constructor(private http: HttpClient) { }

  private apiUrl = environment.apiUrl;

  private subject = new Subject<any>();

  data: any;

  SendClicEvent(data: any) {
    this.subject.next(data);
  }

  GetClicEvent() {
    return this.subject.asObservable();
  }

  GetRoomInfo() {
    return this.http.get(this.apiUrl + 'api/Articulos/Lineas');
  }

  PostPayload(model: any) {
    return this.http.post(this.apiUrl + 'api/Roomservices/Comanda', model);
  }

  GetIdRentaActual(idHabitacion: number) {
    return this.http.get(this.apiUrl + 'api/Roomservices/Habitacion/' + idHabitacion + '/Renta');
  }

  GetOrdersDetail(idHabitacion: number) {
    return this.http.get(this.apiUrl + 'api/roomservices/detalle/comanda/habitacion/' + idHabitacion);
  }

  PutOrder(model: ComandasVmModel) {
    return this.http.put(this.apiUrl + 'api/Roomservices/Siguiente/Status/Comanda', model);
  }

  CancelarComanda(model: any) {
    return this.http.put(this.apiUrl + 'api/Roomservices/Cancelar/Comanda', model)
  }

  ModificarComanda(model: any):Observable<HttpResponse<object>>{
    return this.http.put(this.apiUrl + 'api/Roomservices/Comanda', model, {observe:'response'});
  }

  Imprimir(idComanda: number) {
    return this.http.get(this.apiUrl + 'api/Roomservices/Imprimir/'+ idComanda)
  }

  ObtenerDetalleComandasPorHabitacion(idHabitacion:number):Observable<HttpResponse<object>>{
    return this.http.get(this.apiUrl + 'api/roomservices/detalle/comanda/habitacion/' + idHabitacion,{observe:'response'});
  }

  PagoComanda(model: any) :Observable<HttpResponse<object>>{
    return this.http.put(this.apiUrl + 'api/Roomservices/Siguiente/Status/Comanda', model,{observe:'response'});
  }


}
