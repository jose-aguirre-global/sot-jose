import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-incidencias-turno',
  templateUrl: './incidencias-turno.component.html',
  styleUrls: ['./incidencias-turno.component.css']
})
export class IncidenciasTurnoComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  fechaFiltro:any;
  fechaFiltroFinal:any;
  idGlobal:string
  nombreIncidencia:string;
  detallesIncidencia:string;

  tablaE = [
    {
      Id:'1',
      Folio:'601',
      Fecha:'10/11/2020',
      Area:'Gerencia',
      Nombre:'Sin',
      Descripcion:'SIN INCIDENCIA',
      Empleado:'MARCO ANTONIO TORRES  MARTINEZ',
      Descartada:true
    },
    {
      Id:'2',
      Folio:'602',
      Fecha:'11/11/2020',
      Area:'Gerencia',
      Nombre:'Sin',
      Descripcion:'SIN INCIDENCIA',
      Empleado:'MARCO ANTONIO TORRES  MARTINEZ',
      Descartada:true
    },
    {
      Id:'3',
      Folio:'603',
      Fecha:'12/11/2020',
      Area:'Gerencia',
      Nombre:'Sin',
      Descripcion:'SIN INCIDENCIA',
      Empleado:'MARCO ANTONIO TORRES  MARTINEZ',
      Descartada:false
    },
    {
      Id:'4',
      Folio:'604',
      Fecha:'13/11/2020',
      Area:'Gerencia',
      Nombre:'Sin',
      Descripcion:'SIN INCIDENCIA',
      Empleado:'MARCO ANTONIO TORRES  MARTINEZ',
      Descartada:true
    },
    {
      Id:'5',
      Folio:'605',
      Fecha:'14/11/2020',
      Area:'Gerencia',
      Nombre:'Sin',
      Descripcion:'SIN INCIDENCIA',
      Empleado:'MARCO ANTONIO TORRES  MARTINEZ',
      Descartada:false
    },
    {
      Id:'6',
      Folio:'606',
      Fecha:'15/11/2020',
      Area:'Gerencia',
      Nombre:'Sin',
      Descripcion:'SIN INCIDENCIA',
      Empleado:'MARCO ANTONIO TORRES  MARTINEZ',
      Descartada:false
    },
    {
      Id:'7',
      Folio:'607',
      Fecha:'16/11/2020',
      Area:'Gerencia',
      Nombre:'Sin',
      Descripcion:'SIN INCIDENCIA',
      Empleado:'MARCO ANTONIO TORRES  MARTINEZ',
      Descartada:true
    },
    {
      Id:'8',
      Folio:'608',
      Fecha:'17/11/2020',
      Area:'Gerencia',
      Nombre:'Sin',
      Descripcion:'SIN INCIDENCIA',
      Empleado:'MARCO ANTONIO TORRES  MARTINEZ',
      Descartada:false
    }
  ];

  buscarRangoFechas(){

      var table = document.getElementById('tabla-cont');

      //AJUSTAMOS LAS FECHAS  
      let rfinicial = new Date(this.fechaFiltro.split('-')[0], this.fechaFiltro.split('-')[1] -1, this.fechaFiltro.split('-')[2] )
      let rffinal = new Date(this.fechaFiltroFinal.split('-')[0], this.fechaFiltroFinal.split('-')[1] -1 , this.fechaFiltroFinal.split('-')[2] )
      
      //recorremos la tabla
      for(let i=0; i<table.children[1].childElementCount; i++){
        let fechaTabla: any = table.children[1].children[i].children[1].innerHTML;
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

  registrarIncidencia(){
    $('#registrarIncidencia').modal('toggle');
  }

  eliminarIncidencia(){
    $('#eliminarIncidencia').modal('toggle');
  }

  eliminaIncidencia(){
    $('#eliminarIncidencia').modal('toggle');
    $('#eliminadoExitoso').modal('toggle');
  }

  descartarIncidencia(){
    $('#descartarIncidencia').modal('toggle');
  }

  descartaIncidencia(){
    $('#descartarIncidencia').modal('toggle');
    $('#descartadoExitoso').modal('toggle');
  }

  RegistrodeIncidencia(){
    $('#registrarIncidencia').modal('toggle');
    $('#registroExitoso').modal('toggle');
  }

  ImprimirReporte(){
      const url = this.router.serializeUrl(this.router.createUrlTree(['/ImprimirReporteIncidencias/']))
      window.open(url, 'popup', 'width=800px,height=800px');
  }

  activar(id){
    $(".fila").removeClass("table-active");
    $('#fila_' + id).addClass("table-active");
    $("#modificar").removeClass("disable-buttons");
    $("#eliminar").removeClass("disable-buttons");
    $("#descartar").removeClass("disable-buttons");


    this.idGlobal = id;
    console.log(this.idGlobal);
  }
}

