import { Injectable } from '@angular/core';
import { SocketsService } from './sockets.service';

@Injectable({
  providedIn: 'root'
})
export class CocinaSocketService {

  constructor( private socketService: SocketsService) { }

  syncComandas(){
    return this.socketService.fromEvent('cocina:sync-comandas');
  }

  actualizarComanda( habitacion: number = 0 ){
    if( !(habitacion > 0) ){
      habitacion = sessionStorage.idHabitacion;
    }
    return this.socketService.emit('cocina:actualizar-comanda', { habitacion });
  }
}
