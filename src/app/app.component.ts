import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SocketsService } from './services/sockets/sockets.service';

declare var $: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

  title = 'clienteElectron';
  showMenu = false;
  onConnect$    : Subscription;
  onDisonnect$  : Subscription;
  conexion: boolean = true;

  constructor(  private router: Router,
                private socketService: SocketsService
  ) {
    router.events.forEach((event) => {

      if (event instanceof NavigationStart) {
        this.showMenu = !( event.url === '/login' || event.url === '/restablecerContrasena');
        document.querySelector('body').style.backgroundColor = 'white';
      }
    });
  }

  ngOnInit(): void {
    this.onConnect$ = this.socketService.onConnect()
        .subscribe( () => this.conexion = true );

    this.onDisonnect$ = this.socketService.onDisconnect()
        .subscribe( () => this.conexion = false );
  }

  ngOnDestroy(): void {
    this.onConnect$.unsubscribe();
    this.onDisonnect$.unsubscribe();
  }


}
