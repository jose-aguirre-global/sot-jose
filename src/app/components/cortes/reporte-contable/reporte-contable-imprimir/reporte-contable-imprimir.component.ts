import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-reporte-contable-imprimir',
  templateUrl: './reporte-contable-imprimir.component.html',
  styleUrls: ['./reporte-contable-imprimir.component.css']
})
export class ReporteContableImprimirComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    this.fecha();
  }

  fechaGlobal;

  tablaE = [
    {
      Corte: "1340",
      Estado:"CERRADO",
      FInicio:"01/11/2020",
      FCorte:"02/11/2020",
      Recepcionista:"ESMERALDA GUTIERREZ FLORES",
      Habitaciones:"$28,000.00",
      Roomservice:"$8.245.00",
      Restaurante:"$1,092.00",
      Cortesias:"$0.00",
      Gastos:"$0.00",
      Total:"$36,730.00"
    },
    {
      Corte: "1340",
      Estado:"CERRADO",
      FInicio:"01/11/2020",
      FCorte:"02/11/2020",
      Recepcionista:"ESMERALDA GUTIERREZ FLORES",
      Habitaciones:"$28,000.00",
      Roomservice:"$8.245.00",
      Restaurante:"$1,092.00",
      Cortesias:"$0.00",
      Gastos:"$0.00",
      Total:"$36,730.00"
    },
    {
      Corte: "1340",
      Estado:"CERRADO",
      FInicio:"01/11/2020",
      FCorte:"02/11/2020",
      Recepcionista:"ESMERALDA GUTIERREZ FLORES",
      Habitaciones:"$28,000.00",
      Roomservice:"$8.245.00",
      Restaurante:"$1,092.00",
      Cortesias:"$0.00",
      Gastos:"$0.00",
      Total:"$36,730.00"
    },
    {
      Corte: "1340",
      Estado:"CERRADO",
      FInicio:"01/11/2020",
      FCorte:"02/11/2020",
      Recepcionista:"ESMERALDA GUTIERREZ FLORES",
      Habitaciones:"$28,000.00",
      Roomservice:"$8.245.00",
      Restaurante:"$1,092.00",
      Cortesias:"$0.00",
      Gastos:"$0.00",
      Total:"$36,730.00"
    },
    {
      Corte: "1340",
      Estado:"CERRADO",
      FInicio:"01/11/2020",
      FCorte:"02/11/2020",
      Recepcionista:"ESMERALDA GUTIERREZ FLORES",
      Habitaciones:"$28,000.00",
      Roomservice:"$8.245.00",
      Restaurante:"$1,092.00",
      Cortesias:"$0.00",
      Gastos:"$0.00",
      Total:"$36,730.00"
    },
    {
      Corte: "1340",
      Estado:"CERRADO",
      FInicio:"01/11/2020",
      FCorte:"02/11/2020",
      Recepcionista:"ESMERALDA GUTIERREZ FLORES",
      Habitaciones:"$28,000.00",
      Roomservice:"$8.245.00",
      Restaurante:"$1,092.00",
      Cortesias:"$0.00",
      Gastos:"$0.00",
      Total:"$36,730.00"
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
