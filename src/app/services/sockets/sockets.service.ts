import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class SocketsService {

  constructor( private socket: Socket) {

    let token: string = sessionStorage.user;
    if( typeof token !== 'undefined'
        &&
        token.length > 0 ){
      this.login();
    }

  }

  onConnect() {
    return this.socket.fromEvent('connect');
  }

  onDisconnect() {
    return this.socket.fromEvent('disconnect');
  }

  login(){
    this.socket.emit('usuario:login', { token: sessionStorage.user });
  }

  logout(){
    this.socket.emit('usuario:logout', { token: sessionStorage.user });
  }

  emit( event, data = {} ){
    return this.socket.emit( event, data );
  }

  fromEvent( event ){
    return this.socket.fromEvent( event );
  }
}
