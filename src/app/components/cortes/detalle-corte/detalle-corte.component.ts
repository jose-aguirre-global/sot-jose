import { Component, OnInit, Input } from '@angular/core';

//Services
import { InicioService } from 'src/app/services/inicio.service';
import { CortesService } from 'src/app/services/cortes.service';

declare var $: any;

@Component({
  selector: 'app-detalle-corte',
  templateUrl: './detalle-corte.component.html',
  styleUrls: ['./detalle-corte.component.css']
})


export class DetalleCorteComponent implements OnInit {

  constructor(
    private incioService: InicioService,
    private cortesService: CortesService 
    ) {
  }



  @Input() idCorte: number = 0;

  opcTipoPago = [];
  valor_importe: number = 0.0;
  concepto_seleccionado: number = 0;
  concepto_seleccionado_descartar_id: number;
  concepto_seleccionado_descartar_concepto: string;
  concepto_seleccionado_descartar_valor: number;
  incidenciaTurnoSeleccionada: number = 0;
  fail: string ="";

  valor_agua: number;
  valor_gas: number;
  valor_luz: number;

  monedas = {
    miles : 0,
    quinientos: 0,
    doscientos: 0,
    cientos: 0,
    cincuentas: 0,
    veintes: 0,
    diez: 0,
    cincos: 0,
    dos: 0,
    unos: 0,
    centavos: 0,
    euros: 0,
    dolares: 0
  }

  listaPagosHabitacion = [
    {
      fecha: '03/10/2020',
      hora: '06:06:06 AM',
      ticket: 'H56876',
      total: 250.00,
      cajero: 'ROBERTA ITZEL PABLO ORTEGA',
      valet: 'FILEMON AGUILAR ESPINOZA'
    },
    {
      fecha: '03/10/2020',
      hora: '06:18:34 AM',
      ticket: 'H35622',
      total: 250.00,
      cajero: 'ROBERTA ITZEL PABLO ORTEGA',
      valet: ''
    },
    {
      fecha: '03/10/2020',
      hora: '08:58:59 AM',
      ticket: 'H32543',
      total: 250.00,
      cajero: 'ROBERTA ITZEL PABLO ORTEGA',
      valet: 'JORGE LOPEZ GOMEZ'
    },
    {
      fecha: '03/10/2020',
      hora: '09:34:22 AM',
      ticket: 'H90879',
      total: 250.00,
      cajero: 'ROBERTA ITZEL PABLO ORTEGA',
      valet: 'JORGE LOPEZ GOMEZ'
    },
    {
      fecha: '03/10/2020',
      hora: '01:46:29 AM',
      ticket: 'H09809',
      total: 250.00,
      cajero: 'ROBERTA ITZEL PABLO ORTEGA',
      valet: 'FILEMON AGUILAR ESPINOZA'
    },
    {
      fecha: '03/10/2020',
      hora: '02:23:01 AM',
      ticket: 'H01230',
      total: 250.00,
      cajero: 'ROBERTA ITZEL PABLO ORTEGA',
      valet: 'FILEMON AGUILAR ESPINOZA'
    },
    {
      fecha: '03/10/2020',
      hora: '03:04:12 AM',
      ticket: 'H01200',
      total: 250.00,
      cajero: 'ROBERTA ITZEL PABLO ORTEGA',
      valet: 'FILEMON AGUILAR ESPINOZA'
    },
  ];

  listaRoomServiceHabitacion = [
    {
      fecha: '03/10/2020',
      hora: '06:06:06 AM',
      ticket: 'H56876',
      total: 250.00,
      cajero: 'ROBERTA ITZEL PABLO ORTEGA',
      mesero: 'FILEMON AGUILAR ESPINOZA'
    },
    {
      fecha: '03/10/2020',
      hora: '06:18:34 AM',
      ticket: 'H35622',
      total: 250.00,
      cajero: 'ROBERTA ITZEL PABLO ORTEGA',
      mesero: ''
    },
    {
      fecha: '03/10/2020',
      hora: '08:58:59 AM',
      ticket: 'H32543',
      total: 250.00,
      cajero: 'ROBERTA ITZEL PABLO ORTEGA',
      mesero: 'JORGE LOPEZ GOMEZ'
    },
    {
      fecha: '03/10/2020',
      hora: '09:34:22 AM',
      ticket: 'H90879',
      total: 250.00,
      cajero: 'ROBERTA ITZEL PABLO ORTEGA',
      mesero: 'JORGE LOPEZ GOMEZ'
    },
    {
      fecha: '03/10/2020',
      hora: '01:46:29 AM',
      ticket: 'H09809',
      total: 250.00,
      cajero: 'ROBERTA ITZEL PABLO ORTEGA',
      mesero: 'FILEMON AGUILAR ESPINOZA'
    },
    {
      fecha: '03/10/2020',
      hora: '02:23:01 AM',
      ticket: 'H01230',
      total: 250.00,
      cajero: 'ROBERTA ITZEL PABLO ORTEGA',
      mesero: 'FILEMON AGUILAR ESPINOZA'
    },
    {
      fecha: '03/10/2020',
      hora: '03:04:12 AM',
      ticket: 'H01200',
      total: 250.00,
      cajero: 'ROBERTA ITZEL PABLO ORTEGA',
      mesero: 'FILEMON AGUILAR ESPINOZA'
    },
  ];

  listaRestauranteHabitacion = [
    {
      fecha: '03/10/2020',
      hora: '06:06:06 AM',
      ticket: 'H56876',
      total: 250.00,
      cajero: 'ROBERTA ITZEL PABLO ORTEGA',
      mesero: 'FILEMON AGUILAR ESPINOZA'
    },
    {
      fecha: '03/10/2020',
      hora: '06:18:34 AM',
      ticket: 'H35622',
      total: 250.00,
      cajero: 'ROBERTA ITZEL PABLO ORTEGA',
      mesero: ''
    },
    {
      fecha: '03/10/2020',
      hora: '08:58:59 AM',
      ticket: 'H32543',
      total: 250.00,
      cajero: 'ROBERTA ITZEL PABLO ORTEGA',
      mesero: 'JORGE LOPEZ GOMEZ'
    },
    {
      fecha: '03/10/2020',
      hora: '09:34:22 AM',
      ticket: 'H90879',
      total: 250.00,
      cajero: 'ROBERTA ITZEL PABLO ORTEGA',
      mesero: 'JORGE LOPEZ GOMEZ'
    },
    {
      fecha: '03/10/2020',
      hora: '01:46:29 AM',
      ticket: 'H09809',
      total: 250.00,
      cajero: 'ROBERTA ITZEL PABLO ORTEGA',
      mesero: 'FILEMON AGUILAR ESPINOZA'
    },
    {
      fecha: '03/10/2020',
      hora: '02:23:01 AM',
      ticket: 'H01230',
      total: 250.00,
      cajero: 'ROBERTA ITZEL PABLO ORTEGA',
      mesero: 'FILEMON AGUILAR ESPINOZA'
    },
    {
      fecha: '03/10/2020',
      hora: '03:04:12 AM',
      ticket: 'H01200',
      total: 250.00,
      cajero: 'ROBERTA ITZEL PABLO ORTEGA',
      mesero: 'FILEMON AGUILAR ESPINOZA'
    },
  ];

  listaComisionMeseros = [
    {
      nombre: 'JUAN LOPEZ GOMEZ',
      alimentos: 1425.00,
      bebidas: 1545.00,
      spasex: 725.00,
      puntospagar: 267.00,
      visa: 267.00,
      mastercard: 0.00,
      americanexpress: 0.00,
      comisiontarjeta: 2.00,
      propinas: 32.00,
      totales: 237.00
    },
    {
      nombre: 'MANUEK LOPEZ GOMEZ',
      alimentos: 1425.00,
      bebidas: 1545.00,
      spasex: 725.00,
      puntospagar: 267.00,
      visa: 267.00,
      mastercard: 0.00,
      americanexpress: 0.00,
      comisiontarjeta: 2.00,
      propinas: 32.00,
      totales: 237.00
    }
  ]

  listaComisionVendedores = [
    {
      nombre: 'JUAN LOPEZ GOMEZ',
      fondospagar: 267.00,
      visa: 267.00,
      mastercard: 0.00,
      americanexpress: 0.00,
      comisiontarjeta: 2.00,
      propinas: 32.00,
      totales: 237.00
    },
    {
      nombre: 'MANUEL LOPEZ GOMEZ',
      fondospagar: 267.00,
      visa: 267.00,
      mastercard: 0.00,
      americanexpress: 0.00,
      comisiontarjeta: 2.00,
      propinas: 32.00,
    },
    {
      nombre: 'LEONEL URDIERA ORTIZ',
      fondospagar: 267.00,
      visa: 267.00,
      mastercard: 0.00,
      americanexpress: 0.00,
      comisiontarjeta: 2.00,
      propinas: 32.00,
    }
  ]

  listaGastos = [];

  listaGastosRealizada = [
    {
      id: 1,
      concepto: "Farmacia",
      valor: 750.00
    },
  ]

  listaLecturaMantoHotel = [
    {
      id: "1234",
      numero_corte: 1388,
      fecharegistro: '17/11/2020',
      medida: 12000,
      medidor: "XHFG - 12",
      valor: 12,
      presentacion: "",
      empleado:"JORGE LOPEZ"
    }
  ]

  listaIncidenciasHabitacion = [
  {
    id: 1,
    fecha: '22/12/2020',
    nombre:'',
    descripcion: '',
    zonas:''
  },
  {
    id: 2,
    fecha: '22/12/2020',
    nombre:'',
    descripcion: 'INCIDENCIA DE PRUEBA 2',
    zonas:''
  },
  {
    id: 1,
    fecha: '22/12/2020',
    nombre:'',
    descripcion: 'INCIDENCIA DE PRUEBA 3',
    zonas:''
  }
];

listaIncidenciasTurno = [
  {
    id: 1,
    folio_turno: '601',
    fecha: '22/12/2020',
    area: 'GERENCIA',
    nombre:'SIN',
    descripcion: 'INDICENCIA',
    empleado_registro:'LUIS CRUZ CASTAÑEDA'
  },
  {
    id: 2,
    folio_turno: '601',
    fecha: '22/12/2020',
    area: 'GERENCIA',
    nombre:'SIN',
    descripcion: 'INDICENCIA',
    empleado_registro:'LUIS CRUZ CASTAÑEDA'
  },
  {
    id: 3,
    folio_turno: '601',
    fecha: '22/12/2020',
    area: 'GERENCIA',
    nombre:'SIN',
    descripcion: 'INDICENCIA',
    empleado_registro:'LUIS CRUZ CASTAÑEDA'
  },
  {
    id: 4,
    folio_turno: '601',
    fecha: '22/12/2020',
    area: 'GERENCIA',
    nombre:'SIN',
    descripcion: 'INDICENCIA',
    empleado_registro:'LUIS CRUZ CASTAÑEDA'
  },
];

  titulo_detalle: string = "Desglose de fajillas"

  ngOnInit(): void {
    this.ObtenerTipoPago();
    this.ObtenerTiposGastos();
    this.AjustarDetalleModalALInicio();
  }
  
  ObtenerTipoPago() {
    this.incioService.GetTipoPago().subscribe((response: any) => {
      this.setTipoPago(response.result);
    });
  }

  ObtenerTiposGastos(){    
    this.cortesService.GetConceptosActivos().toPromise().then((response: any) => {
      if(response.status == 200){
        this.listaGastos = response.result;
      }else{
        this.listaGastos.length = 0;
      }
    }).catch(err =>{
      console.log(err);
    })
  }
  
  setTipoPago(tipoPago: any[]){
    tipoPago.forEach(el => {
      if(el.idTipoPago<3 ){
        this.opcTipoPago.push(el);
      }
      else if(el.idTipoPago>5 && el.idTipoPago<9){
        this.opcTipoPago.push(el);
      }else if(el.idTipoPago==9 ){
        this.opcTipoPago.push(el);
      }
    });
  }
  
  operacion(tipo: number, fajilla: string){
    if(fajilla == "miles"){
      if(this.monedas.miles == 0){
        if(tipo == 1 ){
          this.monedas.miles = this.monedas.miles + 1;
        }
      }else if(this.monedas.miles >= 0){
        if(tipo == 1 ){
          this.monedas.miles = this.monedas.miles + 1;
        }else if(tipo == 2){
          this.monedas.miles = this.monedas.miles - 1;
        }
      }
    }else if(fajilla =="quinientos"){
      if(this.monedas.quinientos == 0){
        if(tipo == 1 ){
          this.monedas.quinientos = this.monedas.quinientos + 1;
        }
      }else if(this.monedas.quinientos >= 0){
        if(tipo == 1 ){
          this.monedas.quinientos = this.monedas.quinientos + 1;
        }else if(tipo == 2){
          this.monedas.quinientos = this.monedas.quinientos - 1;
        }
      }

    }else if(fajilla =="doscientos"){
      if(this.monedas.doscientos == 0){
        if(tipo == 1 ){
          this.monedas.doscientos = this.monedas.doscientos + 1;
        }
      }else if(this.monedas.doscientos >= 0){
        if(tipo == 1 ){
          this.monedas.doscientos = this.monedas.doscientos + 1;
        }else if(tipo == 2){
          this.monedas.doscientos = this.monedas.doscientos - 1;
        }
      }

    }else if(fajilla =="cientos"){
      if(this.monedas.cientos == 0){
        if(tipo == 1 ){
          this.monedas.cientos = this.monedas.cientos + 1;
        }
      }else if(this.monedas.cientos >= 0){
        if(tipo == 1 ){
          this.monedas.cientos = this.monedas.cientos + 1;
        }else if(tipo == 2){
          this.monedas.cientos = this.monedas.cientos - 1;
        }
      }

    }else if(fajilla =="cincuentas"){
      if(this.monedas.cincuentas == 0){
        if(tipo == 1 ){
          this.monedas.cincuentas = this.monedas.cincuentas + 1;
        }
      }else if(this.monedas.cincuentas >= 0){
        if(tipo == 1 ){
          this.monedas.cincuentas = this.monedas.cincuentas + 1;
        }else if(tipo == 2){
          this.monedas.cincuentas = this.monedas.cincuentas - 1;
        }
      }

    }else if(fajilla =="veintes"){
      if(this.monedas.veintes == 0){
        if(tipo == 1 ){
          this.monedas.veintes = this.monedas.veintes + 1;
        }
      }else if(this.monedas.veintes >= 0){
        if(tipo == 1 ){
          this.monedas.veintes = this.monedas.veintes + 1;
        }else if(tipo == 2){
          this.monedas.veintes = this.monedas.veintes - 1;
        }
      }

    }else if(fajilla =="diez"){
      if(this.monedas.diez == 0){
        if(tipo == 1 ){
          this.monedas.diez = this.monedas.diez + 1;
        }
      }else if(this.monedas.diez >= 0){
        if(tipo == 1 ){
          this.monedas.diez = this.monedas.diez + 1;
        }else if(tipo == 2){
          this.monedas.diez = this.monedas.diez - 1;
        }
      }

    }else if(fajilla =="cincos"){
      if(this.monedas.cincos == 0){
        if(tipo == 1 ){
          this.monedas.cincos = this.monedas.cincos + 1;
        }
      }else if(this.monedas.cincos >= 0){
        if(tipo == 1 ){
          this.monedas.cincos = this.monedas.cincos + 1;
        }else if(tipo == 2){
          this.monedas.cincos = this.monedas.cincos - 1;
        }
      }

    }else if(fajilla =="dos"){
      if(this.monedas.dos == 0){
        if(tipo == 1 ){
          this.monedas.dos = this.monedas.dos + 1;
        }
      }else if(this.monedas.dos >= 0){
        if(tipo == 1 ){
          this.monedas.dos = this.monedas.dos + 1;
        }else if(tipo == 2){
          this.monedas.dos = this.monedas.dos - 1;
        }
      }

    }else if(fajilla =="unos"){
      if(this.monedas.unos == 0){
        if(tipo == 1 ){
          this.monedas.unos = this.monedas.unos + 1;
        }
      }else if(this.monedas.unos >= 0){
        if(tipo == 1 ){
          this.monedas.unos = this.monedas.unos + 1;
        }else if(tipo == 2){
          this.monedas.unos = this.monedas.unos - 1;
        }
      }

    }else if(fajilla =="centavos"){
      if(this.monedas.centavos == 0){
        if(tipo == 1 ){
          this.monedas.centavos = this.monedas.centavos + 1;
        }
      }else if(this.monedas.centavos >= 0){
        if(tipo == 1 ){
          this.monedas.centavos = this.monedas.centavos + 1;
        }else if(tipo == 2){
          this.monedas.centavos = this.monedas.centavos - 1;
        }
      }

    }else if(fajilla =="euros"){
      if(this.monedas.euros == 0){
        if(tipo == 1 ){
          this.monedas.euros = this.monedas.euros + 1;
        }
      }else if(this.monedas.euros >= 0){
        if(tipo == 1 ){
          this.monedas.euros = this.monedas.euros + 1;
        }else if(tipo == 2){
          this.monedas.euros = this.monedas.euros - 1;
        }
      }

    }else if(fajilla =="dolares"){
      if(this.monedas.dolares == 0){
        if(tipo == 1 ){
          this.monedas.dolares = this.monedas.dolares + 1;
        }
      }else if(this.monedas.dolares >= 0){
        if(tipo == 1 ){
          this.monedas.dolares = this.monedas.dolares + 1;
        }else if(tipo == 2){
          this.monedas.dolares = this.monedas.dolares - 1;
        }
      }

    }
    
  }

  AjustarDetalleModalALInicio(){
    let ventana_ancho = $(window).width();
    if(ventana_ancho <= 769){
      $('#modalapartadoCorte').removeClass('col-6');
      $('#modalapartadoDetalle').removeClass('col-6');
      $('#modalapartadoCorte').addClass('col-12');
      $('#modalapartadoDetalle').addClass('col-12');

      $('#modalapartadoCorte').addClass('pt-5');
      $('#modalapartadoCorte').addClass('pl-5');
      $('#modalapartadoCorte').addClass('pr-5');

      $('#modalapartadoDetalle').addClass('pl-5');
      $('#modalapartadoDetalle').addClass('pr-5');
      $('#modalapartadoDetalle').addClass('pb-5');

      $('#modalapartadoDetalle').addClass('d-none');
    }else{
      $('#modalapartadoCorte').removeClass('col-12');
      $('#modalapartadoDetalle').removeClass('col-12');
      $('#modalapartadoCorte').addClass('col-6');
      $('#modalapartadoDetalle').addClass('col-6');   

      $('#modalapartadoCorte').removeClass('pt-5');
      $('#modalapartadoCorte').removeClass('pl-5');
      $('#modalapartadoCorte').removeClass('pr-5');

      $('#modalapartadoDetalle').removeClass('pl-5');
      $('#modalapartadoDetalle').removeClass('pr-5');
      $('#modalapartadoDetalle').removeClass('pb-5');
      
      $('#modalapartadoDetalle').removeClass('d-none');
    }    
  }

  AjustarDetalleModal(){
    //obtenemos el tamaño de pantalla
    let ventana_ancho = $(window).width();
    //pantalla mayor 769
    if(ventana_ancho > 769){

      if($('#modalapartadoCorte').hasClass('col-6')){

        $('#modalapartadoCorte').removeClass('col-6');
        $('#modalapartadoCorte').addClass('col-3');
        $('#modalapartadoDetalle').removeClass('col-6');
        $('#modalapartadoDetalle').addClass('col-12');

        //agregamos clases para ajustar el encabezado detalle corte
        $('#encabezadocorte').addClass('ajuste-apartado-corte');
        $('#detalleFajilla').css('padding-left', '25vh');

        //ajustamos incidencias de acuerdo al ancho 
        $('.ancho_incidencias').removeClass('col-6');
        $('.ancho_incidencias').addClass('col-3');

        $( "#modal_maximizar" ).removeClass( "disabled-button-ventana" );
        $( "#modal_minimizar" ).addClass( "disabled-button-ventana" );

      }else{
        $('#modalapartadoCorte').removeClass('col-3');
        $('#modalapartadoCorte').addClass('col-6');
        $('#modalapartadoDetalle').removeClass('col-12');
        $('#modalapartadoDetalle').addClass('col-6');

        //agregamos clases para ajustar el encabezado detalle corte
        $('#encabezadocorte').removeClass('ajuste-apartado-corte');
        $('#detalleFajilla').css('padding-left', '5vh');

        //ajustamos incidencias de acuerdo al ancho 
        $('.ancho_incidencias').removeClass('col-3');
        $('.ancho_incidencias').addClass('col-6');

        $( "#modal_maximizar" ).addClass( "disabled-button-ventana" );
        $( "#modal_minimizar" ).removeClass( "disabled-button-ventana" );
      }
    }else if(ventana_ancho <= 769){
      $('#modalapartadoCorte').removeClass('col-6');
      $('#modalapartadoDetalle').removeClass('col-6');
      $('#modalapartadoCorte').addClass('col-12');
      $('#modalapartadoDetalle').addClass('col-12');

      $('#modalapartadoCorte').addClass('pt-5');
      $('#modalapartadoCorte').addClass('pl-5');
      $('#modalapartadoCorte').addClass('pr-5');

      $('#modalapartadoDetalle').addClass('pl-5');
      $('#modalapartadoDetalle').addClass('pr-5');
      $('#modalapartadoDetalle').addClass('pb-5');

      if($('#modalapartadoDetalle').hasClass('d-none')){
        $('#modalapartadoDetalle').removeClass('d-none')
      }else{
        $('#modalapartadoDetalle').addClass('d-none')
      }
      
      if($( "#modal_maximizar" ).hasClass( "disabled-button-ventana" )){
        $( "#modal_maximizar" ).removeClass( "disabled-button-ventana" );
        $( "#modal_minimizar" ).addClass( "disabled-button-ventana" );
      }else{
        $( "#modal_maximizar" ).addClass( "disabled-button-ventana" );
        $( "#modal_minimizar" ).removeClass( "disabled-button-ventana" );
      }
    
    }    
  }

  CambiarTitulo(newTitulo: string){
    this.titulo_detalle = newTitulo;
  }

  DetallePagosdeHabitacion(pago: any, event: Event){
    $('#pagosHabitaciones tr').removeClass('table-active');
    $(event.target).parent().addClass('table-active');
    console.log(pago);
    $('#modalFormaPago').modal('toggle');
  }

  DetallePagoRoomService(pago: any, event: Event ){
    $('#pagosRoomService tr').removeClass('table-active');
    $(event.target).parent().addClass('table-active');
    console.log(pago);
  }

  DetallesPagoRestaurante(pago: any, event: Event){
    $('#pagosRestaurante tr').removeClass('table-active');
    $(event.target).parent().addClass('table-active');
    console.log(pago);
  }

  DetalleComisionMeseros(mesero: any, event: Event){
    $('#comisionMeseros tr').removeClass('table-active');
    $(event.target).parent().addClass('table-active');
    console.log(mesero);
  }

  DetalleComisionVendedores(mesero: any, event: Event){
    $('#comisionVendedores tr').removeClass('table-active');
    $(event.target).parent().addClass('table-active');
    console.log(mesero);
  }

  DetalleMantenimientoHotel(lectura: any, event: Event){
    $('#matenimientoHotel tr').removeClass('table-active');
    $(event.target).parent().addClass('table-active');
    console.log(lectura);
  }

  seleccionarIncidenciaHabitacion(incidenciahabitacion: any, event: Event){    
    $('#incidenciasHabitacion tr').removeClass('table-active');
    $(event.target).parent().addClass('table-active');
    console.log(incidenciahabitacion);
  }

  seleccionarIncidenciaTurno(seleccionarIncidenciaTurno: any, event: Event){
    this.incidenciaTurnoSeleccionada = seleccionarIncidenciaTurno.id;
    $('#incidenciasTurno tr').removeClass('table-active');
    $(event.target).parent().addClass('table-active');
    console.log(seleccionarIncidenciaTurno);
  }

  RegistrarGasto(){
    $('#agregarGastos').modal('toggle');
  }

  ModificarGasto(){
    this.valor_importe = this.concepto_seleccionado_descartar_valor;
    if(this.concepto_seleccionado_descartar_id == undefined ){
      this.fail = " Selecciona un concepto";
      $('#failMesage').modal('toggle');
      this.valor_importe = 0;
      this.concepto_seleccionado_descartar_id = 0;
    }else{
      if(this.concepto_seleccionado_descartar_id > 0 && this.valor_importe > 0){
        $('#gasto_' + this.concepto_seleccionado_descartar_id).addClass('pintar-active');
        $('#agregarGastos').modal('toggle');
      }else{
        if(this.concepto_seleccionado_descartar_id <= 0){
          this.fail = " Selecciona un concepto";
          $('#failMesage').modal('toggle');
          this.valor_importe = 0;
          this.concepto_seleccionado_descartar_id = 0;
        }else if(this.valor_importe < 0){
          this.fail = "Fallo el importe";
          $('#failMesage').modal('toggle');
          this.valor_importe = 0;
          this.concepto_seleccionado_descartar_id = 0;
        }
      }
    }
  }

  seleccionarConceptoGastos(gasto:any){
    console.log(gasto)
    this.concepto_seleccionado = gasto.id;
    console.log(this.concepto_seleccionado)
    console.log(this.valor_importe);
    
    $('.row').removeClass('pintar-active');
    $('#gasto_' + gasto.id).addClass('pintar-active');
  }

  agregarGasto(){
    console.log(this.concepto_seleccionado, this.valor_importe)
    if(this.concepto_seleccionado_descartar_id > 0 ){
      if(this.valor_importe > 0){
        console.log('editamos')
        console.log('consumir api modificar gasto a corte')
      }else{
        this.fail = "Ingresa una cantidad valida";
        $('#failMesage').modal('toggle');
      }
    }else{
      //console.log('agregamos');
      if(this.valor_importe > 0 && this.concepto_seleccionado >= 0){
        console.log('consumir api agregar gasto a corte')
      }else{
        if(this.valor_importe <= 0){
          this.fail = " Ingresa una cantidad valida";
          $('#failMesage').modal('toggle');
        }else if( this.concepto_seleccionado <= 0){
          this.fail = " Selecciona un gasto";
          $('#failMesage').modal('toggle');
        }
      }
    }
  }

  seleccionarDetalleGasto(gasto:any, event: Event){
    $('#tablaGastos tr').removeClass('table-active');
    $(event.target).parent().addClass('table-active');
    this.concepto_seleccionado_descartar_id = gasto.id;
    this.concepto_seleccionado_descartar_concepto = gasto.concepto;
    this.concepto_seleccionado_descartar_valor = gasto.valor    
  }
  
  DescartarGasto(){
    // console.log(this.concepto_seleccionado_descartar_id);
    this.valor_importe = this.concepto_seleccionado_descartar_valor;
    if(this.concepto_seleccionado_descartar_id == undefined ){
      this.fail = " Selecciona un concepto";
      $('#failMesage').modal('toggle');
      this.valor_importe = 0;
      this.concepto_seleccionado_descartar_id = 0;
    }else{
      if(this.concepto_seleccionado_descartar_id > 0 && this.valor_importe > 0){
        $('#gasto_' + this.concepto_seleccionado_descartar_id).addClass('pintar-active');
        $('#descartarGasto').modal('toggle');
      }else{
        if(this.concepto_seleccionado_descartar_id <= 0){
          this.fail = " Selecciona un concepto";
          $('#failMesage').modal('toggle');
          this.valor_importe = 0;
          this.concepto_seleccionado_descartar_id = 0;
        }else if(this.valor_importe < 0){
          this.fail = "Fallo el importe";
          $('#failMesage').modal('toggle');
          this.valor_importe = 0;
          this.concepto_seleccionado_descartar_id = 0;
        }
      }
    }
  }

  ConfirmarDescartarGasto(){
    console.log(this.concepto_seleccionado_descartar_id);
    if(this.concepto_seleccionado_descartar_id >= 0){
      console.log('consumir api descartar gasto a corte')
      $('#descartarGasto').modal('toggle');
      $('#confirmardescartarGasto').modal('toggle');
    }else{
      this.fail = "Selecciona un concepto";
      $('#failMesage').modal('toggle');
      this.concepto_seleccionado_descartar_id = 0;
    }
  }

  RegistrarLecturas(){
    $('#registrarLecturas').modal('toggle');
  }

  confirmarRegistroGasto(){
    $('#registrarLecturas').modal('toggle');
    $('#confirmarRegistroGasto').modal('toggle')
  }

  agregarIncidenciaHabitacion(){
    $('#agregarIncidenciaHabitacion').modal('toggle');
  }

  agregadaIncidenciaHab(){
    $('#agregarIncidenciaHabitacion').modal('toggle');
    $('#confirmarRegistroIncidenciaHabitacion').modal('toggle');
  }

  agregarIncidenciaTurno(){
    $('#agregarIncidenciaTurno').modal('toggle');
  }

  agregadaIncidenciaTurno(){
    $('#agregarIncidenciaTurno').modal('toggle');
    $('#confirmarRegistroIncidenciaTurno').modal('toggle');
  }

  descartarIncidenciaTurno(){
    //this.incidenciaTurnoSeleccionada
    $('#descartarIncidenciaTurno').modal('toggle');
  }

  confirmardescartarIncidenciaTurno(){
    $('#descartarIncidenciaTurno').modal('toggle');
    $('#confirmardescartarIncidenciaTurno').modal('toggle');
  }

  eliminarIncidenciaTurno(){
    $('#eliminarIncidenciaTurno').modal('toggle');
  }

  confirmareliminarIncidenciaTurno(){
    $('#eliminarIncidenciaTurno').modal('toggle');
    $('#confirmareliminarIncidenciaTurno').modal('toggle');
  }

  FinalizarCorte(){
    $('#finalizarCorte').modal('toggle');
  }

  confirmarCorte(){
    $('#finalizarCorte').modal('toggle');
    $('#finalizarCorteConfirmacion').modal('toggle');
  }

}
