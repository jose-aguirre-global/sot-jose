import { Injectable } from '@angular/core';
import { HttpClient ,HttpHeaders,HttpResponse, HttpErrorResponse} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Subject,observable, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MatriculaService {

  constructor(private http: HttpClient) { }

  private apiUrl = environment.apiUrl;

  GetAnswReporteExistente(matricula: string){
    return this.http.get(this.apiUrl+'api/ReporteMatriculas/'+matricula+'/Reportado');
  }

  GetReportesMatricula(matricula: string):Observable<HttpResponse<object>>{
    return this.http.get(this.apiUrl+'api/ReporteMatriculas/'+matricula, {observe:'response'});
  }

  InhabilitarMatricula(matricula: string, user: any ):Observable<HttpResponse<object>>{
    return this.http.put(this.apiUrl + 'api/ReporteMatriculas/' + matricula +'/Inhabilitar/' + user ,{}, {observe:'response'});
  }

  CrearReportesMatricula(model:any):Observable<HttpResponse<object>>{
    return this.http.post(this.apiUrl + 'api/ReporteMatriculas', model, {observe:'response'});
  }
}
