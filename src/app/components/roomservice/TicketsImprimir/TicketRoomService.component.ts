import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RoomservService } from 'src/app/services/roomserv.service';
import { ResumenVentaTicketRoomServices } from 'src/app/models/ResumenVentaTicketRoomServices';
import { BrowserModule } from '@angular/platform-browser'
import { $ } from 'protractor';

@Component({
  selector: 'app-TicketRoomService',
  templateUrl: './TicketRoomService.component.html',
  styleUrls: ['./TicketRoomService.componet.css'],

})

export class TicketRoomServiceComponent implements OnInit {

  constructor(private activatedRoute: ActivatedRoute, private serviceRoomServices: RoomservService) { }

  idComanda: number;

  resumenVenta: ResumenVentaTicketRoomServices = {
    EsComanda: false,
    Items: [],
    ArticulosCortesia: [],
    DtoEmpleadoPuesto: [],
    Hotel: '',
    Direccion: '',
    FechaInicio: null,
    FechaFin: null,
    RazonSocial: '',
    RFC: '',
    Procedencia: '',
    Tipo: '',
    Ticket: '',
    SubTotal: 0,
    Cortesia: 0,
    Descuentos: 0,
    Total: 0,
    Cancelada: false

  };

  ngOnInit(): void {

    this.activatedRoute.params.subscribe(params => {

      this.idComanda = params.idComanda;

    });

    this.serviceRoomServices.Imprimir(this.idComanda).subscribe((response: any) => {

      if (response.status == 200) {

        this.resumenVenta = {

          EsComanda: response.result.esComanda,
          Items: response.result.items,
          ArticulosCortesia: response.result.articulosCortesia,
          DtoEmpleadoPuesto: response.result.empleados,
          Hotel: response.result.hotel,
          Direccion: response.result.direccion,
          FechaInicio: response.result.fechaInicio,
          FechaFin: response.result.fechaFin,
          RazonSocial: response.result.razonSocial,
          RFC: response.result.rfc,
          Procedencia: response.result.procedencia,
          Tipo: response.result.tipo,
          Ticket: response.result.ticket,
          SubTotal: response.result.subTotal,
          Cortesia: response.result.cortesia,
          Descuentos: response.result.descuentos,
          Total: response.result.total,
          Cancelada: response.result.cancelada

        }
      }

    });



    var now = new Date();
    var strDateTime = [[this.AddZero(now.getDate()),
    this.AddZero(now.getMonth() + 1),
    now.getFullYear()].join("/"),
    [this.AddZero(now.getHours()),
    this.AddZero(now.getMinutes())].join(":"),
    now.getHours() >= 12 ? "PM" : "AM"].join(" ");
    document.getElementById("Console").innerHTML = strDateTime;

  }


  imprSelec(nombre) {

    var ficha = document.getElementById(nombre);
    var ventimp = window.open(' ', 'popimpr');
    ventimp.document.write(ficha.innerHTML);
    ventimp.document.close();
    ventimp.print();
    ventimp.close();
  }

  AddZero(num) {
    return (num >= 0 && num < 10) ? "0" + num : num + "";
  }

}

