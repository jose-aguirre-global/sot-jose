import { Component, OnInit } from '@angular/core';
declare var $: any;

@Component({
  selector: 'app-horarios-precios',
  templateUrl: './horarios-precios.component.html',
  styleUrls: ['./horarios-precios.component.css']
})
export class HorariosPreciosComponent implements OnInit {

  constructor() { }

  tipoTarifa:string = "tarifa1";

  ngOnInit(): void {

  }

  idGlobal:string
  clave:string;
  reservacion:string;
  descripcion:string;
  personaExtra:string;
  descripcionCompleta:string;
  detallado:string;
  normal:string;
  retoque:string;
  precioT1:string;
  precioT2:string;
  personaE1:string;
  personaE2:string;
  horaExtra1:string;
  horaExtra2:string;
  horaEntrada1:string;
  horaEntrada2:string;
  horaSalida1:string;
  horaSalida2:string;
  tiempoHospedaje1:string;
  tiempoHospedaje2:string;
  

  tablaE =  [
    {
      Id:"1",
      descripcion:"Junior Villa",
      descripcionE:"JUNIOR VILLA",
      tarifas:"HOTEL, HOTEL",
      motel1:"120",
      motel2:"120",
      detallado:"60",
      normal:"30",
      retoque:"10"
    },
    {
      Id:"2",
      descripcion:"Junior Villa",
      descripcionE:"JUNIOR VILLA",
      tarifas:"HOTEL, HOTEL",
      motel1:"120",
      motel2:"120",
      detallado:"60",
      normal:"30",
      retoque:"10"
    },
    {
      Id:"3",
      descripcion:"Junior Villa",
      descripcionE:"JUNIOR VILLA",
      tarifas:"HOTEL, HOTEL",
      motel1:"120",
      motel2:"120",
      detallado:"60",
      normal:"30",
      retoque:"10"
    },
    {
      Id:"4",
      descripcion:"Junior Villa",
      descripcionE:"JUNIOR VILLA",
      tarifas:"HOTEL, HOTEL",
      motel1:"120",
      motel2:"120",
      detallado:"60",
      normal:"30",
      retoque:"10"
    },
    {
      Id:"5",
      descripcion:"Junior Villa",
      descripcionE:"JUNIOR VILLA",
      tarifas:"HOTEL, HOTEL",
      motel1:"120",
      motel2:"120",
      detallado:"60",
      normal:"30",
      retoque:"10"
    },
    {
      Id:"6",
      descripcion:"Junior Villa",
      descripcionE:"JUNIOR VILLA",
      tarifas:"HOTEL, HOTEL",
      motel1:"120",
      motel2:"120",
      detallado:"60",
      normal:"30",
      retoque:"10"
    },
    {
      Id:"7",
      descripcion:"Junior Villa",
      descripcionE:"JUNIOR VILLA",
      tarifas:"HOTEL, HOTEL",
      motel1:"120",
      motel2:"120",
      detallado:"60",
      normal:"30",
      retoque:"10"
    },
    {
      Id:"8",
      descripcion:"Junior Villa",
      descripcionE:"JUNIOR VILLA",
      tarifas:"HOTEL, HOTEL",
      motel1:"120",
      motel2:"120",
      detallado:"60",
      normal:"30",
      retoque:"10"
    },
    {
      Id:"9",
      descripcion:"Junior Villa",
      descripcionE:"JUNIOR VILLA",
      tarifas:"HOTEL, HOTEL",
      motel1:"120",
      motel2:"120",
      detallado:"60",
      normal:"30",
      retoque:"10"
    }
  ]

  nuevoHorario(){
    $('#nuevoHorario').modal('toggle');
  }

  CrearHorarioHab(){
    $('#nuevoHorarioExitoso').modal('toggle');
  }

  eliminarHorario(){
    $('#eliminarHorario').modal('toggle');
  }

  tipoTarifaActive(){
    //var opcion1 = $('input[name="radioOp1"]:checked').val();
    console.log(this.tipoTarifa);
    
    $('#row-tarifa1').removeClass('disable-tarifas');
    $('#row-tarifa2').removeClass('disable-tarifas');
    if(this.tipoTarifa == 'tarifa1'){
      $('#row-tarifa2').addClass('disable-tarifas');
    }else{
      $('#row-tarifa1').addClass('disable-tarifas');
    }
  }

  activar(id, event:Event){

    $(".fila").removeClass("table-active");
    $(event.target).parent().addClass('table-active');

    this.idGlobal = id;

  }

}
