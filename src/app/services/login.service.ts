import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { LoginModel } from '../models/loginModel';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) { }

  private apiUrl = environment.apiUrl;

  private subLogin = new Subject<any>();

  data: any;

  Login(model: LoginModel) {
    return this.http.post(this.apiUrl + 'api/permisos/obtenerUsuarioPorCredencial', model);
  }

  SendClicEvent(data: any) {
    this.subLogin.next(data);
  }

  GetClicEvent() {
    return this.subLogin.asObservable();
  }

  Autorizacion(model: LoginModel) {
    return this.http.post(this.apiUrl + 'api/permisos/Autorizacion',model);
  }

  CambioContrasena(model: any)
  {
    return this.http.put(this.apiUrl + 'api/permisos/Contrasena', model);
  }

}
