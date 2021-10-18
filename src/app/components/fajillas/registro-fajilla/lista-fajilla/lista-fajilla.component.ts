import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-lista-fajilla',
  templateUrl: './lista-fajilla.component.html',
  styleUrls: ['./lista-fajilla.component.css']
})
export class ListaFajillaComponent implements OnInit {

  @Input('data')            data          : any;
  @Input('total')           total         : number;
  @Output('eventoFajilla')  eventoFajilla : EventEmitter<boolean> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  aumentarContador( cantidad: number){

    this.data.contador += cantidad;

    if( cantidad > 0 ){
      let total_temp = this.total+(this.data.valor*cantidad);
      if( total_temp <= 5000 ){
        this.data.sumatoria = this.data.contador*this.data.valor;
        this.eventoFajilla.emit(true);
      } else {
        this.data.contador -= cantidad;
      }
    } else {
      if( this.data.contador < 0 ){
        this.data.contador = 0;
      } else {
        this.data.sumatoria = this.data.contador*this.data.valor;
        this.eventoFajilla.emit(true);
      }
    }
  }

}
