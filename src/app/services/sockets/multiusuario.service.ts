import { Injectable } from '@angular/core';
import { SocketsService } from './sockets.service';

@Injectable({
  providedIn: 'root'
})
export class MultiusuarioSocketService {

  constructor( private socketService: SocketsService) { }

  getSelecciones(){
    return this.socketService.emit('multiusuario:get', { token: sessionStorage.user });
  }

  syncSelecciones(){
    return this.socketService.fromEvent('multiusuario:sync');
  }

  onDisconnect() {
    return this.socketService.fromEvent('disconnect');
  }

  seleccionarHabitacion( habitacion: number, habitacion_anterior: number = 0 ){
    const data = {
      token: sessionStorage.user,
      habitacion,
      habitacion_anterior
    }
    return this.socketService.emit('multiusuario:seleccionar', data);
  }

  deseleccionarHabitacion( habitacion: number ){
    const data = {
      token: sessionStorage.user,
      habitacion
    }
    return this.socketService.emit('multiusuario:deseleccionar', data);
  }

  limpiarSelecciones(){
    const data = {
      token: sessionStorage.user
    }
    return this.socketService.emit('multiusuario:limpiar-selecciones', data);
  }
}
