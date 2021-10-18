import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ReporteVentasImprimirComponent } from './reporte-ventas-imprimir/reporte-ventas-imprimir.component';
declare var $: any;

@Component({
  selector: 'app-reporte-ventas',
  templateUrl: './reporte-ventas.component.html',
  styleUrls: ['./reporte-ventas.component.css']
})
export class ReporteVentasComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {

    
  }
  
  ngAfterViewInit(): void{
    $("tbody#datos input[type=checkbox]").prop( "checked", false );    
  }

  fechaFiltro;
  fechaFiltroFinal;
  ObjetoImprimir = [];

  tablaE = [
    { 
      Id:1,
      Imprimir:false,
      FolioTurno:'1297',
      Ticket:'H54963',
      Cobrada:false,
      Cancelada:true,
      MotivoCancelacion:'Reservacion Cancelada',
      Clasificacion:"Habitación",
      Valor:"$950.00",
      Fecha:"03/12/2020",
      FormasPAgo:"EFECTIVO"
    },
    {
      Id:2,
      Imprimir:false,
      FolioTurno:'1298',
      Ticket:'H54963',
      Cobrada:true,
      Cancelada:false,
      MotivoCancelacion:'Reservacion Cancelada',
      Clasificacion:"Habitación",
      Valor:"$950.00",
      Fecha:"03/12/2020",
      FormasPAgo:"EFECTIVO"
    },
    {
      Id:3,
      Imprimir:false,
      FolioTurno:'1299',
      Ticket:'H54963',
      Cobrada:true,
      Cancelada:false,
      MotivoCancelacion:'Reservacion Cancelada',
      Clasificacion:"Habitación",
      Valor:"$950.00",
      Fecha:"03/12/2020",
      FormasPAgo:"EFECTIVO"
    },
    {
      Id:4,
      Imprimir:false,
      FolioTurno:'1210',
      Ticket:'H54963',
      Cobrada:false,
      Cancelada:false,
      MotivoCancelacion:'Reservacion Cancelada',
      Clasificacion:"Habitación",
      Valor:"$950.00",
      Fecha:"03/12/2020",
      FormasPAgo:"EFECTIVO"
    },
    {
      Id:5,
      Imprimir:false,
      FolioTurno:'1211',
      Ticket:'H54963',
      Cobrada:false,
      Cancelada:true,
      MotivoCancelacion:'Reservacion Cancelada',
      Clasificacion:"Habitación",
      Valor:"$950.00",
      Fecha:"03/12/2020",
      FormasPAgo:"EFECTIVO"
    }
  ]

  buscarRangoFechas(){

      var table = document.getElementById('tabla-cont2');

      //AJUSTAMOS LAS FECHAS  
      let rfinicial = new Date(this.fechaFiltro.split('-')[0], this.fechaFiltro.split('-')[1] -1, this.fechaFiltro.split('-')[2] )
      let rffinal = new Date(this.fechaFiltroFinal.split('-')[0], this.fechaFiltroFinal.split('-')[1] -1 , this.fechaFiltroFinal.split('-')[2] )
      
      console.log(table, table.children[1].childElementCount);
      
      //recorremos la tabla
      for(let i=0; i<table.children[1].childElementCount; i++){
        console.log(i);
        
        let fechaTabla: any = table.children[1].children[i].children[8].innerHTML;
        console.log(fechaTabla);
        
        let fechaTablaAjustada = new Date(fechaTabla.split('/')[2], fechaTabla.split('/')[1] -1 , fechaTabla.split('/')[0])

        if( rfinicial.toString()  == "Invalid Date" || rffinal.toString() == "Invalid Date"){
          table.children[1].children[i].classList.remove('d-none');
        }else{
          if(fechaTablaAjustada >= rfinicial && fechaTablaAjustada <= rffinal){
            table.children[1].children[i].classList.remove('d-none');
          }else{
            table.children[1].children[i].classList.add('d-none');
          }
        }
      
      }   
  }

  detallesVenta(ticket){
    $('#detallesVenta').modal('toggle');
  }


  ImprimirReporte(){
    this.ObjetoImprimir.length = 0;
    for (const key of this.tablaE){

      console.log($("#defaultCheck_" + key.FolioTurno).is(':checked'));
      if($("#defaultCheck_" + key.FolioTurno).is(':checked')){
        this.ObjetoImprimir.push(key)

      }
      
    }
    sessionStorage.setItem('ReporteVentaImprimir', JSON.stringify(this.ObjetoImprimir));
    console.log('KJSADJKSAD: ',this.ObjetoImprimir);


    const url = this.router.serializeUrl(this.router.createUrlTree(['/ImprimirReporteVentas/']))
    window.open(url, 'popup', 'width=800px,height=800px');

    $("tbody#datos input[type=checkbox]").prop( "checked", false );  
}

  SaliryLimpiar(){
    $("tbody#datos input[type=checkbox]").prop( "checked", false );   
    $("#reporteVentas").modal('toggle');
  }

}