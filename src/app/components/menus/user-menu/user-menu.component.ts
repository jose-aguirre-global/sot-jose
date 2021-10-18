import { Component, OnInit } from '@angular/core';
import { MultiusuarioSocketService } from 'src/app/services/sockets/multiusuario.service';

declare var $: any;

@Component({
  selector: 'app-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.css']
})
export class UserMenuComponent implements OnInit {

  tipoCredencial: number;

  constructor( private socketMultiusuario: MultiusuarioSocketService ){}

  ngOnInit(): void {
    this.tipoCredencial = sessionStorage.tipoCredencial;
  }

  limpiarSocketsHabitaciones(){
    if( sessionStorage.tipoCredencial == 1 ){
      this.socketMultiusuario.limpiarSelecciones();
    }
  }

  openModal( modal: string = '') {
    $('#'+modal).modal('toggle');
    document.querySelector('.modal-backdrop').remove();
  }

}
