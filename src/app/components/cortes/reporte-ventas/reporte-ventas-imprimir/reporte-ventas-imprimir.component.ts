import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-reporte-ventas-imprimir',
  templateUrl: './reporte-ventas-imprimir.component.html',
  styleUrls: ['./reporte-ventas-imprimir.component.css']
})
export class ReporteVentasImprimirComponent implements OnInit {

  tablaE;
  ImpresionReportes;
  fechaGlobal;

  constructor() {}

  ngOnInit(): void {
    this.ImpresionReportes  = JSON.parse(sessionStorage.ReporteVentaImprimir);    
    this.impresionReporte();
    sessionStorage.removeItem('ReporteVentaImprimir')
    this.fecha()



  }

  imprSelec(nombre) {
    var ficha = document.getElementById(nombre);
    var ventimp = window.open(' ', 'popimpr');
    ventimp.document.write(ficha.innerHTML);
    ventimp.document.close();
    ventimp.print();
    ventimp.close();
  }

  impresionReporte(){
    if(this.ImpresionReportes.length == 0){
      console.log('Se consume la api')
    }else{
      this.tablaE = this.ImpresionReportes;
      console.log(this.tablaE)
    }
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
