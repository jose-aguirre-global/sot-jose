import { Component, OnInit, Input } from '@angular/core';
import { pluck } from 'rxjs/operators';
import { ControlGastosService } from 'src/app/services/cortes/control-gastos.service';

@Component({
  selector: 'app-resumen-corte',
  templateUrl: './resumen-corte.component.html',
  styleUrls: ['./resumen-corte.component.css']
})
export class ResumenCorteComponent implements OnInit {

  @Input('listaCortes') listaCortes: any[] = [];
  idCorte           : number = 0;
  pagosEfectivo     : number = 0;
  pagosTarjeta      : number = 0;
  reservasValidas   : number = 0;
  anticiposReservas : number = 0;

  resumenHabitaciones: any = {};
  resumenRoomService: any = {};
  resumenRestaurante: any = {};
  resumenGastos: any = {};
  resumenTotal: any = {};

  constructor( private service: ControlGastosService ) { }

  cambioCorte(event){
    this.idCorte = event.target.value;
    this.getCorte(this.idCorte);
  }

  getCorte( id: number ){
    this.service.getRevisarCorteTurno(id)
      .pipe( pluck('result') )
      .subscribe( (response) => {
        this.conversionAPI(response);
      });
  }

  ngOnInit(): void {
  }

  conversionAPI( response:any ){
    this.resumenHabitaciones= {
      tipo      : 'habitaciones',
      concepto  : 'Total Habitaciones',
      valor     : response.totalHabitacion,
      conceptos : [
        {
          concepto  : 'Habitaciones',
          valor     : response.habitaciones
        },
        {
          concepto  : 'Personas',
          valor     : response.personasExtra
        },
        {
          concepto  : 'Hospedaje',
          valor     : response.hospedajeExtra
        },
        {
          concepto  : 'Propinas',
          valor     : response.propinasHabitacion
        },
        {
          concepto  : 'Paquetes',
          valor     : response.paquetes
        },
        {
          concepto  : 'Cortesías a habitación',
          valor     : response.cortesiasHabitacion
        },
        {
          concepto  : 'Consumo a habitación',
          valor     : response.consumoHabitacion
        },
        {
          concepto  : 'Descuanto a habitación',
          valor     : response.descuentosHabitacion
        }
      ]
    };
    this.resumenRoomService = {
      tipo      : 'room-service',
      concepto  : 'Total Room Service',
      valor     : response.totalRoomService,
      conceptos : [
        {
          concepto  : 'Room Service',
          valor     : response.roomService
        },
        {
          concepto  : 'Propinas',
          valor     : response.propinasRoomService
        },
        {
          concepto  : 'Cortesías room service',
          valor     : response.cortesiasRoomService
        },
        {
          concepto  : 'Descuentos room service',
          valor     : response.descuentosRoomService
        }
      ]
    };
    this.resumenRestaurante = {
      tipo      : 'restaurante',
      concepto  : 'Total Restaurante',
      valor     : response.totalRestaurante,
      conceptos : [
        {
          concepto  : 'Restaurante',
          valor     : response.servicioRestaurante
        },
        {
          concepto  : 'Propinas',
          valor     : response.propinasRestaurante
        },
        {
          concepto  : 'Cortesías restaurante',
          valor     : response.cortesiasRestautante
        },
        {
          concepto  : 'Consumo restaurante',
          valor     : response.consumoRestaurante
        },
        {
          concepto  : 'Descuentos restaurante',
          valor     : response.descuentosRestaurante
        }
      ]
    };
    this.resumenTotal = {
      tipo      : 'total',
      concepto  : 'Total',
      valor     : response.total,
      conceptos : [
        {
          concepto  : 'Total Habitaciones',
          valor     : response.totalHabitacion
        },
        {
          concepto  : 'Total Room Service',
          valor     : response.totalRoomService
        },
        {
          concepto  : 'Total Restaurante',
          valor     : response.totalRestaurante
        }
      ]
    };
    this.pagosEfectivo      = response.pagosEfectivo;
    this.pagosTarjeta       = response.pagosTarjeta;
    this.reservasValidas    = response.reservasValidas;
    this.anticiposReservas  = response.anticiposReservas;
  }

}
