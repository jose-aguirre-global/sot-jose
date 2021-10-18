import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InicioService } from 'src/app/services/inicio.service';
import { BrowserModule } from '@angular/platform-browser'
import { $ } from 'protractor';

@Component({
  selector: 'app-ticket-renta',
  templateUrl: './ticket-renta.component.html',
  styleUrls: ['./ticket-renta.component.css']
})
export class TicketRentaComponent implements OnInit {

  idHabitacion: number;
  numeroHabitacion: number;
  idEmpleado: number;


  rentaHabitacion = {
    nombreHabitacion: '',
    precioHabitacion: '',
    //personas extra
    personasExtras: '',
    precioPersonaExtra: '',
    totalPrecioPersonasExtras: '',
    //
    hospedajeExtra: '',
    precioHospedajeExtra: '',
    totalHospedajeExtra: '',
    //
    horasExtra: '',
    precioHoraExtra: '',
    totalHoraExtra: '',
    ///
    subtotal: 0.00,
    //tipo de pago
    tipoPago: '',
    idEmpleado: 0,

  }

  constructor(
    private activatedRoute: ActivatedRoute,
    private inicioService : InicioService
  ) { }


  ngOnInit(): void {

    this.idEmpleado = sessionStorage.idUsuario

    this.activatedRoute.params.subscribe(params => {
      this.idHabitacion = params.idHabitacion;
      this.numeroHabitacion = params.numeroHabitacion;
    });

    this.inicioService.ObtenerDetalleHabitacionPorCobrar(this.idHabitacion, this.numeroHabitacion).subscribe((response: any) => {
      if(response.status == 200){

        this.rentaHabitacion = {
          nombreHabitacion: response.body.nombreHabitacion,
          precioHabitacion: response.body.precioHabitacion,
          //personas extra
          personasExtras: response.body.personasExtras,
          precioPersonaExtra: response.body.precioPersonaExtra,
          totalPrecioPersonasExtras: response.body.totalPrecioPersonasExtras,
          //hospedaje extra
          hospedajeExtra: response.body.hospedajeExtra,
          precioHospedajeExtra: response.body.precioHospedajeExtra,
          totalHospedajeExtra: response.body.totalHospedajeExtra,
          //horas extra
          horasExtra: response.body.horasExtra,
          precioHoraExtra: response.body.precioHoraExtra,
          totalHoraExtra: response.body.totalHoraExtra,
          //totales
          subtotal: parseFloat(response.body.precioHabitacion) + parseFloat(response.body.totalPrecioPersonasExtras) + parseFloat(response.body.totalHospedajeExtra) + parseFloat(response.body.totalHoraExtra),
          //tipo de pago
          tipoPago: response.body.tipoPago,
          idEmpleado: response.body.idEmpleado,

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
