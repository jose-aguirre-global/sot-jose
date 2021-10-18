import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { RentaHabitacionModel } from '../models/rentaHabitacion';
import { HabitacionesResponse } from '../models/habitaciones-response.interface';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InicioService {

  constructor(private http: HttpClient) { }

  private apiUrl = environment.apiUrl;

  private subject = new Subject<any>();

  user = sessionStorage.user;

  GetHabitacionesResumen() {
    return this.http.get<HabitacionesResponse>(this.apiUrl + 'api/habitaciones/resumen');
  }

  // GetHabitacion(id: number) {
  //   return this.http.get(this.apiUrl + 'api/habitaciones/obtener/' + id);
  // }

  GetDatosHabitacion(id: number, numeroHabitacion: number) {
    return this.http.get(this.apiUrl + 'api/habitaciones/' + id + '/Numero/' + numeroHabitacion + '/' + sessionStorage.user);
  }

  PrepararHabitacion(id:number){
    return this.http.put(this.apiUrl+'api/habitaciones/'+id+'/Preparar/' + sessionStorage.user, {});
  }

  CancelarPreparacion(id:number){
    //return this.http.put(this.apiUrl+'api/habitaciones/'+id+'/Cancelar/Preparacion/' + sessionStorage.user, {});
    return this.http.put(this.apiUrl + 'api/Habitaciones/' + id + '/Cancelar/Preparacion/Bloqueo/' + sessionStorage.user, {});
  }

  RentarHabitacion(model:RentaHabitacionModel){
    return this.http.post(this.apiUrl+'api/habitaciones/entrada/', model);
  }

  BloqueoRentaHabitacion(model: any):Observable<HttpResponse<object>>{
    return this.http.put(this.apiUrl + 'api/Habitaciones/Bloquear', model, {observe:'response'});
  }

  CancelarBloqueoHabitacion(idHabitacion: string ){
    return this.http.put(this.apiUrl + 'api/Habitaciones/' + idHabitacion + '/Cancelar/Preparacion/Bloqueo/' + sessionStorage.user, {});
  }

  GetTipoPago(){
    return this.http.get(this.apiUrl+'api/habitaciones/Tipos/Pago');
  }

  GetTipoEstadia(){
    return this.http.get(this.apiUrl+'api/habitaciones/Tipos/Estadia');
  }

  GetTipoTarjeta(){
    return this.http.get(this.apiUrl+'api/habitaciones/Tipos/Tarjetas');
  }

  GetTarifas(id:number,tipoEstadia: number){
    return this.http.get(this.apiUrl+'api/habitaciones/'+id+'/TiposTarifas/'+tipoEstadia);
  }

  GetEmpleadosActivos(user:string){
    return this.http.get(this.apiUrl+'api/empleados/Activos/' + user);
  }

  ImprimirMensaje() {
    return 'Hola desde servicios';
  }

  GetStatus(model: any) {
    return this.http.post('https://localhost:44304/api/status/', model);
  }

  ValidarFinalizarRenta(idHabitacion: number):Observable<HttpResponse<object>>{
    return this.http.get(this.apiUrl + 'api/Habitaciones/' + idHabitacion + '/Cuneta/Pedientes/' + sessionStorage.user, {observe: 'response'});
  }

  FinalizarRenta(idHabitacion:number):Observable<HttpResponse<object>>{
    return this.http.put(this.apiUrl + 'api/Habitaciones/' + idHabitacion + '/Estado/Sucia/Finalizar/Ocupacion/' + sessionStorage.user, {},{observe:'response'});
  }

  ObtenerDetalleHabitacionPorCobrar(idHabitacion:any, numHabitacion:any):Observable<HttpResponse<object>>{
    return this.http.get(this.apiUrl + 'api/Habitaciones/' + idHabitacion + '/Numero/' + numHabitacion + '/Detalle/' + sessionStorage.user,{observe:'response'});
  }

  CancelarPendientePorCobrar(model: any) :Observable<HttpResponse<object>>{
    return this.http.put(this.apiUrl + 'api/Rentas/Cancelar/Venta/Pendiente',model,{observe:'response'});
  }

  PagoPorCobrar(model: any) :Observable<HttpResponse<object>>{
    return this.http.put(this.apiUrl + 'api/Rentas/PagarRenta', model ,{observe:'response'});
  }

  ObtenerConceptosMantenimiento(){
    return this.http.get(this.apiUrl + 'api/Mantenimientos/Conceptos');
  }

  CrearMantenimiento(model: any):Observable<HttpResponse<object>>{
    return this.http.post(this.apiUrl + 'api/Mantenimientos', model, {observe:'response'});
  }

  FinalizarMantenimiento(model: any): Observable<HttpResponse<Object>>{
    return this.http.put(this.apiUrl + 'api/Mantenimientos/Finalizar', model, {observe: 'response'});
  }

  HistorialMantenimiento(idHabitacion:any ): Observable<HttpResponse<Object>>{
    return this.http.get(this.apiUrl + 'api/Mantenimientos/Habitacion/' + idHabitacion + '/Historial/' + sessionStorage.user, {observe:'response'})
  }

  FinalizarMediaSucia( idHabitacion:any ): Observable<HttpResponse<Object>>{
    return this.http.put(this.apiUrl + 'api/Habitaciones/' + idHabitacion + '/Estado/MediaSucia/Finalizar/Ocupacion/' + sessionStorage.user, {}, {observe: 'response'});
  }

}
