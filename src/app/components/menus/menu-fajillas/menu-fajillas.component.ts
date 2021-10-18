import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { RegistroFajillaComponent } from '../../fajillas/registro-fajilla/registro-fajilla.component';

declare var $: any;

@Component({
  selector: 'app-menu-fajillas',
  templateUrl: './menu-fajillas.component.html',
  styleUrls: ['./menu-fajillas.component.css']
})
export class MenuFajillasComponent implements OnInit {

  @Output('cerrarModalEvent') cerrarModalEvent: EventEmitter<boolean> = new EventEmitter();
  @ViewChild('componentRegistroFajilla') componentRegistroFajilla: RegistroFajillaComponent;

  constructor() { }

  ngOnInit(): void {
  }

  nuevaFajilla(){
    this.componentRegistroFajilla.limpiarFajilla();
    $('#modalRegistroFajilla').modal('show');
    document.querySelector('.modal-backdrop').remove();
  }

  cerrarModal(){
    this.cerrarModalEvent.emit(true);
  }

}
