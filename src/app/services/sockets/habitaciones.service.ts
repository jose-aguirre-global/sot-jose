import { Injectable } from '@angular/core';
import { SocketsService } from './sockets.service';

@Injectable({
  providedIn: 'root'
})
export class HabitacionesSocketService {

  constructor( private socketService: SocketsService) { }

  syncHabitaciones(){
    return this.socketService.fromEvent('habitaciones:sync-habitaciones');
  }

  actualizarHabitacion( habitacion: number = 0 ){
    if( !(habitacion > 0) ){
      habitacion = sessionStorage.idHabitacion;
    }
    return this.socketService.emit('habitaciones:actualizar-habitaciones', { habitacion });
  }
}
