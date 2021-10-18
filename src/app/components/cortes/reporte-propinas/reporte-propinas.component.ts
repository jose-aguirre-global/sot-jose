import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-reporte-propinas',
  templateUrl: './reporte-propinas.component.html',
  styleUrls: ['./reporte-propinas.component.css']
})
export class ReportePropinasComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  
  fechaFiltro;
  fechaFiltroFinal;

  tablaE=[
    {
      folio:"1343",
      estadoCorte:"CERRADO",
      fInicio:"01/11/2020",
      fFin:"02/11/2020"
    },
    {
      folio:"1343",
      estadoCorte:"CERRADO",
      fInicio:"01/11/2020",
      fFin:"02/11/2020"
    },
    {
      folio:"1343",
      estadoCorte:"CERRADO",
      fInicio:"01/11/2020",
      fFin:"02/11/2020"
    },
    {
      folio:"1343",
      estadoCorte:"CERRADO",
      fInicio:"01/11/2020",
      fFin:"02/11/2020"
    },
    {
      folio:"1343",
      estadoCorte:"CERRADO",
      fInicio:"01/11/2020",
      fFin:"02/11/2020"
    }
  ]

  buscarRangoFechas(){

    var table = document.getElementById('tabla-cont4');

    //AJUSTAMOS LAS FECHAS  
    let rfinicial = new Date(this.fechaFiltro.split('-')[0], this.fechaFiltro.split('-')[1] -1, this.fechaFiltro.split('-')[2] )
    let rffinal = new Date(this.fechaFiltroFinal.split('-')[0], this.fechaFiltroFinal.split('-')[1] -1 , this.fechaFiltroFinal.split('-')[2] )
    
    console.log(table, table.children[1].childElementCount);
    
    //recorremos la tabla
    for(let i=0; i<table.children[1].childElementCount; i++){
      console.log(i);
      
      let fechaTabla: any = table.children[1].children[i].children[2].innerHTML;
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

}
