import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InicioService } from 'src/app/services/inicio.service';
import { BrowserModule } from '@angular/platform-browser'
import { $ } from 'protractor';

@Component({
  selector: 'app-reporte-mantenimiento',
  templateUrl: './reporte-mantenimiento.component.html',
  styleUrls: ['./reporte-mantenimiento.component.css']
})
export class ReporteMantenimientoComponent implements OnInit {


  idHabitacion: number;

  arrayHistManto = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private inicioService : InicioService
  ) { }

  ngOnInit(): void {

    this.activatedRoute.params.subscribe(params => {
      this.idHabitacion = params.idHabitacion;
    });

    this.inicioService.HistorialMantenimiento(this.idHabitacion).toPromise().then((response:any)=>{
      // console.log(response.body);
      if(response.status == 200){
        this.arrayHistManto = response.body;
      }else{
        this.arrayHistManto = [];
        this.arrayHistManto = [{}];
      }
    }).catch((response:any) => {
      this.arrayHistManto = [];
    })

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
