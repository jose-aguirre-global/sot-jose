import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ConfiguracionPropinasModel } from '../models/configPropinas';

@Injectable({
  providedIn: 'root'
})
export class PropinasService {

  constructor(private http: HttpClient) { }

  private apiUrl = environment.apiUrl;

  GetPropinas(user:any ) {
    return this.http.get(this.apiUrl + 'api/configuracionespropinas/' + user);
  }

  PutPropinas(model: any) {
    return this.http.put(this.apiUrl + 'api/configuracionespropinas/', model);
  }

}
