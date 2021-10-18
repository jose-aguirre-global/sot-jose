import { Injectable } from '@angular/core';
import { HttpClient ,HttpHeaders,HttpResponse, HttpErrorResponse} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Subject,observable, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class LimpiezaService {

  constructor(private http: HttpClient) { }

  private apiUrl = environment.apiUrl;

  ObtenerCamaristas():Observable<HttpResponse<object>>{
    return this.http.get(this.apiUrl+'api/Habitaciones/Recamaristas', {observe:'response'});
  }

  BuscarCamaristas(Camarista: string):Observable<HttpResponse<object>>{
    return this.http.get(this.apiUrl+'api/Habitaciones/Recamaristas/' + Camarista, {observe:'response'});
  }

  CrearTareaLimpieza(model: any):Observable<HttpResponse<object>>{
    return this.http.post(this.apiUrl + 'api/Habitaciones/Limpieza', model, {observe:'response'});
  }

  CrearTareaLimpiezaMantenimiento(model: any):Observable<HttpResponse<object>>{
    return this.http.put(this.apiUrl + 'api/Habitaciones/Limpieza/Mantenimiento', model, {observe:'response'});
  }

  CancelarLimpieza(model: any):Observable<HttpResponse<Object>>{
    return this.http.put(this.apiUrl + 'api/Habitaciones/Cancelar/Limpieza', model, {observe:'response'})
  }

  ObtenerSupervisores():Observable<HttpResponse<Object>>{
    return this.http.get(this.apiUrl+'api/Habitaciones/Supervisor', {observe:'response'});
  }

  EnviarSupervisor(idHabitacion: number, idEmpleado: string):Observable<HttpResponse<Object>>{
    return this.http.put(this.apiUrl + 'api/Habitaciones/' + idHabitacion + '/supervisor/' + idEmpleado + '/Enviar/' + sessionStorage.user, {}, {observe:'response'});
  }

  ObtenerConceptosLiberacion():Observable<HttpResponse<Object>>{
    return this.http.get(this.apiUrl+'api/Habitaciones/Conceptos/Liberacion', {observe:'response'});
  }

  FinalizarLimpieza (model: any):Observable<HttpResponse<Object>>{
    return this.http.put(this.apiUrl + 'api/Habitaciones/Finalizar/Limpieza', model, {observe:'response'});
  }

  /************************************ Mantenimiento *******************************/
  EnviarSupervisorMantenimiento(model: any): Observable<HttpResponse<Object>>{
    return this.http.post(this.apiUrl + 'api/Mantenimientos/Supervisar', model, {observe:'response'});
  }

  FinalizarLimpiezaMantenimiento (model: any):Observable<HttpResponse<Object>>{
    return this.http.put(this.apiUrl + 'api/Mantenimientos/Liberar/Habitacion', model, {observe:'response'});
  }

  CambiarSupervisorMantenimiento (model: any):Observable<HttpResponse<Object>>{
    return this.http.put(this.apiUrl + 'api/Mantenimientos/Supervisor', model, {observe:'response'});
  }

}

