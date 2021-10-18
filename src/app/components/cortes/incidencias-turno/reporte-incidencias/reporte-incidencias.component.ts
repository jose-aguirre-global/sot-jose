import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-reporte-incidencias',
  templateUrl: './reporte-incidencias.component.html',
  styleUrls: ['./reporte-incidencias.component.css']
})
export class ReporteIncidenciasComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    this.fecha();
  }

  idHabitacion:string;
  fechaGlobal;
  
  tablaE = [
    {
      Folio:'601',
      Fecha:'10/11/2020',
      Area:'Gerencia',
      Nombre:'Sin',
      Descripcion:'SIN INCIDENCIA',
      Empleado:'MARCO ANTONIO TORRES  MARTINEZ',
      Descartada:true
    },
    {
      Folio:'602',
      Fecha:'11/11/2020',
      Area:'Gerencia',
      Nombre:'Sin',
      Descripcion:'SIN INCIDENCIA',
      Empleado:'MARCO ANTONIO TORRES  MARTINEZ',
      Descartada:true
    },
    {
      Folio:'603',
      Fecha:'12/11/2020',
      Area:'Gerencia',
      Nombre:'Sin',
      Descripcion:'SIN INCIDENCIA',
      Empleado:'MARCO ANTONIO TORRES  MARTINEZ',
      Descartada:false
    },
    {
      Folio:'604',
      Fecha:'13/11/2020',
      Area:'Gerencia',
      Nombre:'Sin',
      Descripcion:'SIN INCIDENCIA',
      Empleado:'MARCO ANTONIO TORRES  MARTINEZ',
      Descartada:true
    },
    {
      Folio:'605',
      Fecha:'14/11/2020',
      Area:'Gerencia',
      Nombre:'Sin',
      Descripcion:'SIN INCIDENCIA',
      Empleado:'MARCO ANTONIO TORRES  MARTINEZ',
      Descartada:false
    },
    {
      Folio:'606',
      Fecha:'15/11/2020',
      Area:'Gerencia',
      Nombre:'Sin',
      Descripcion:'SIN INCIDENCIA',
      Empleado:'MARCO ANTONIO TORRES  MARTINEZ',
      Descartada:false
    },
    {
      Folio:'607',
      Fecha:'16/11/2020',
      Area:'Gerencia',
      Nombre:'Sin',
      Descripcion:'SIN INCIDENCIA',
      Empleado:'MARCO ANTONIO TORRES  MARTINEZ',
      Descartada:true
    },
    {
      Folio:'608',
      Fecha:'17/11/2020',
      Area:'Gerencia',
      Nombre:'Sin',
      Descripcion:'SIN INCIDENCIA',
      Empleado:'MARCO ANTONIO TORRES  MARTINEZ',
      Descartada:false
    }
  ]

  imprSelec(nombre) {
    var ficha = document.getElementById(nombre);
    var ventimp = window.open(' ', 'popimpr');
    ventimp.document.write(ficha.innerHTML);
    ventimp.document.close();
    ventimp.print();
    ventimp.close();
  }

  fecha(){
    var now = new Date();
    var strDateTime = [[this.AddZero(now.getDate()),
    this.AddZero(now.getMonth() + 1),
    now.getFullYear()].join("/"),
    [this.AddZero(now.getHours()),
    this.AddZero(now.getMinutes())].join(":"),
    now.getHours() >= 12 ? "PM" : "AM"].join(" ");
    this.fechaGlobal = strDateTime;
    console.log(this.fechaGlobal)
  }

  AddZero(num) {
    return (num >= 0 && num < 10) ? "0" + num : num + "";
  }

}
