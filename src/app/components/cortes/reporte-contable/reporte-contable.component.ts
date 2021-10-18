import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-reporte-contable',
  templateUrl: './reporte-contable.component.html',
  styleUrls: ['./reporte-contable.component.css']
})
export class ReporteContableComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  fechaFiltro;
  fechaFiltroFinal;
  FiltroCortes;
  corteInicial;
  corteFinal;

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

  buscarRangoFechas(){

    var table = document.getElementById('tabla-cont3');

    //AJUSTAMOS LAS FECHAS  
    let rfinicial = new Date(this.fechaFiltro.split('-')[0], this.fechaFiltro.split('-')[1] -1, this.fechaFiltro.split('-')[2] )
    let rffinal = new Date(this.fechaFiltroFinal.split('-')[0], this.fechaFiltroFinal.split('-')[1] -1 , this.fechaFiltroFinal.split('-')[2] )
    
    console.log(table, table.children[1].childElementCount);
    
    //recorremos la tabla
    for(let i=0; i<table.children[1].childElementCount; i++){
      
      let fechaTabla: any = table.children[1].children[i].children[2].innerHTML;
      
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

FiltrosCortes(){

  if(this.FiltroCortes == false){
    $( "#contendor-filtros-cortes" ).addClass( "disable-tipos" );
  }else{
    $( "#contendor-filtros-cortes" ).removeClass( "disable-tipos" );
  }

}

FiltradoCortes(){
  var table = document.getElementById('tabla-cont3');
    
  for(let i=0; i<table.children[1].childElementCount; i++){
    console.log(i);
    
    let corteTabla: any = table.children[1].children[i].children[0].innerHTML;

    if(this.corteInicial == "" || this.corteFinal == ""){
      table.children[1].children[i].classList.remove('d-none');
    }else{
      if(corteTabla >= this.corteInicial && corteTabla <= this.corteFinal){
        table.children[1].children[i].classList.remove('d-none');
      }else{
        table.children[1].children[i].classList.add('d-none');
      }
    }
  }
}

ImprimirReporte(){
  const url = this.router.serializeUrl(this.router.createUrlTree(['/ImprimirReporteContable/']))
  window.open(url, 'popup', 'width=800px,height=800px');
}

}
