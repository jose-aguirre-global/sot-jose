// Angular
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

// Models
import { HabitacionesModel } from 'src/app/models/habitaciones'
import { FiltroModel } from 'src/app/models/filtro';
import { articulosModel } from 'src/app/models/articulos'
import { RentaHabitacionModel } from 'src/app/models/rentaHabitacion';
import { LoginModel } from 'src/app/models/loginModel';
import { HabitacionesResponse,ResultHabitaciones } from 'src/app/models/habitaciones-response.interface';

// Services
import { InicioBehaviorsService } from 'src/app/services/inicio-behaviors.service';
import { LoginService } from 'src/app/services/login.service';
import { InicioService } from 'src/app/services/inicio.service';
import { LimpiezaService } from 'src/app/services/limpieza.service';
import { MatriculaService } from 'src/app/services/matricula.service';
import { ExtrasService } from  'src/app/services/extras.service';
import { UtilitiesService } from 'src/app/services/utilities.service';
import {RoomservService}from 'src/app/services/roomserv.service'

// Otros
import * as moment from 'moment';
import { HuellaComponent } from '../huella/huella.component';
import { MultiusuarioSocketService } from 'src/app/services/sockets/multiusuario.service';
import { HabitacionesSocketResponse } from 'src/app/models/socketResponse';
import { RoomListComponent } from '../roomservice/room-list/room-list.component';
import { AutorizarordenComponent } from '../roomservice/autorizarorden/autorizarorden.component';
import { CocinaSocketService } from 'src/app/services/sockets/cocina.service';
import { HabitacionesSocketService } from 'src/app/services/sockets/habitaciones.service';


declare var $: any;

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css'],

})

export class InicioComponent implements OnInit, OnDestroy {


  FechaHora: Date = new Date();
  auxApie: boolean;
  eventos: Subscription;
  loader: boolean = true;
  totalCount = 3;

  // Mensaje Error Renta Habitación
  errorRentaHabitacion: string = 'Hubo un error al Rentar la Habitación';

  // Nuevo Filtro
  idEstadoFiltro: number = 0;
  idHabitacion: number = 0;

  // Huella Component
  @ViewChild('child_huella') child_huella : HuellaComponent;

  // Sockets
  multiusuarioSocket$ : Subscription;
  cocinaSocket$       : Subscription;
  habitacionesSocket$ : Subscription;

  // Room Service
  @ViewChild('child_roomService') child_roomService : RoomListComponent;
  @ViewChild('child_autorizarOrden') child_autorizarOrden : AutorizarordenComponent;

  constructor(
    private loginService: LoginService,
    private incioService: InicioService,
    private limpiezaService: LimpiezaService,
    private matriculaService: MatriculaService,
    private utilitiesService: UtilitiesService,
    private inicioBehaviors: InicioBehaviorsService,
    private router: Router,
    private roomServService : RoomservService,
    private habitacionesSocket: HabitacionesSocketService,
    private cocinaSocket: CocinaSocketService,
    private socketMultiusuario : MultiusuarioSocketService,
    private extrasService: ExtrasService
    ) {
      this.ResetListaFiltros();
      this.ResetRenta();
    }

  loginModel: LoginModel = {
    identificadorUsuario: '',
    sinValor: false,
    //valorVerificarBin: '',
    tipoCredencial: 1,
    valorVerificarStr: '',
  };

  AsignarHabitaciones: boolean;
  CobrarHabitaciones:boolean;
  ConsultarComanda: boolean;

  userOptions = false;
  MenuHamOptions = false;
  MenuCortesOptions = false;
  MenuOperacionesOptions = false;
  MenuFajillasOptions = false;
  barOptions = false;

  mensajeError:string='';
  listaFiltros: FiltroModel[];
  listaDatosHabitaciones:HabitacionesModel[];
  articulosM:articulosModel[];
  muchasRentas: RentaHabitacionModel[];
  renta: RentaHabitacionModel;

  tTarifaHabitacion='';
  tPersonasExtra='';
  tHorasExtra='';
  tNochesExtra='';
  tTiempoExtra=true;
  enableTarifas=true;

  habitacion = {
    accion: '',
    idHabitacion: 0,
    numeroHabitacion: 0
  }

  nombreSuperCam: string = "";
  detalleManto: string = "";
  observacionesDetalleHabitacionLibre: string = "";
  matriculaSelect: string = "";

  listTipoEstancia = [];
  ComandasRoomServices =[]
  listaTiposMantenimiento = [];

  arrTar=[];
  opcTipoPago=[];
  TiposTarjeta=[];
  listEmpleados=[];

  arrSkySuite = [];
  arrPoolVilla = [];
  arrPoolSpa = [];
  arrJuniorSuite = [];
  arrTwinSuite = [];
  arrJuniorVilla = [];

  listaHabitaciones = [];
  DatosHabitacion = [];
  resumenesComandas = [];
  articulosComandas = [];
  resumenesVentasHabitacion = [];
  arrArticulos = [];
  arrayHistMato = [];
  arrayListaCamaristasDetalle = [];

  libre: boolean = false;
  sucia: boolean = false;
  ocupada: boolean = false;
  limpieza: boolean = false;
  suspension: boolean = false;
  bloqueada: boolean = false;
  mantto: boolean = false;
  preparada: boolean = false;
  reservada: boolean = false;
  pendiente: boolean = false;
  supervision: boolean = false;
  roomservice:boolean = false;
  mediasucia:boolean = false;
  libredetalle:boolean = false;
  supervisionmtto:boolean = false;
  filterSupervisor: string = '';
  filterCamarista: string = '';
  listaTodosSupervisores = [];
  listaConceptosLiberacion = [];
  listaTodasCamaristas = [];
  filterTipoHabitacion: string = "";

  count: number = 0;
  showDetails = false;
  rentConfirmed = false;
  habitacionCancelID = 0;
  habitacionCancelNum = 0;
  salidaId = 0;
  salidaNumeroH = 0;
  exitConfirmed = false;
  v_obj=0;
  cantidad:number=0;
  existeReporteVinculado:boolean;
  reportesHabilitados : number = 0;
  reportesInhabilitados : number = 0;
  processContinue=false;
  metodosAutorizarOrden: any;
  comandaModificar: any;
  datoRoomService={
    id:0,
    numero:0
  };

  listaFiltrosAux:any;
  errorHabitacionTerminada:string;

  datosHPorCobrar = {
    color:"",
    horasExtra: 0,
    hospedajeExtra: 0,
    idHAbitacion: 0,
    idTipoTarifa: 0,
    marca: "",
    matricula: "",
    modelo: "",
    nombreHabitacion: "",
    numeroHabitacion: "",
    personasExtras: 0,
    precioHabitacion: 0,
    precioHoraExtra: 0,
    precioHospedajeExtra: 0,
    precioPersonaExtra: 0,
    tipoTarifa: "",
    totalHoraExtra: 0,
    totalHospedajeExtra: 0,
    totalPrecioHabitacion: 0,
    totalPrecioPersonasExtras: 0,
    porCobrar:{
      horasExtra:0,
      hospedajeExtra: 1,
      idHAbitacion: 0,
      idTipoTarifa: 0,
      marca: null,
      matricula: null,
      modelo: null,
      nombreHabitacion: null,
      numeroHabitacion: null,
      personasExtras: 0,
      porCobrar: null,
      precioHabitacion: 0,
      precioHoraExtra: 0,
      precioHospedajeExtra: 0,
      precioPersonaExtra: 0,
      tipoTarifa: null,
      totalHoraExtra: 0,
      totalHospedajeExtra: 1900,
      totalPrecioHabitacion: 0,
      totalPrecioPersonasExtras: 0
    }
  }

  APieXCobrar:boolean;
  TotalXCobrar = 0;
  habilitarBotonesXCobrar:boolean;
  numeroHabitacionExtra: number;
  estadoXcobrar = "";
  idUsuario: number;
  userTemp: string;
  contPersonasExtra: number = 0;
  contHorasExtra: number = 0;
  contHospedajeExtra: number = 0;
  numeroHabitacion: number = 0;
  tipoHabitacion: number = 0;
  num_camaristas: number = 0;
  tipoEnvioSupervisor: string = "";
  tipoLiberacion: string = "";
  tipoNormalManto: string = "";
  supervisorValidar: boolean;

  datosCollapse: boolean = false;
  detallesCollapse: boolean = false;
  roomCollapse: boolean = false;

  corteActivo: number = 0;


  abrirDetalleCorte(idCorte){
    this.corteActivo = idCorte;
    $('#revisionCortes').modal('toggle');
    $('#detalleCorte').modal('toggle');
  }

  ngOnInit() {
    sessionStorage.removeItem("userstr");
    sessionStorage.removeItem("valorVerificarStr");

    //this.loginModel=this.utilitiesService.objeto;
    this.loginModel.identificadorUsuario=sessionStorage.identificadorUsuario;
    this.loginModel.tipoCredencial=parseInt(sessionStorage.tipoCredencial);
    this.loginModel.valorVerificarStr = sessionStorage.valorVerificarStr;
    this.AsignarHabitaciones = sessionStorage.AsignarHabitaciones;
    this.CobrarHabitaciones = JSON.parse(sessionStorage.CobrarHabitaciones);
    this.ConsultarComanda = JSON.parse(sessionStorage.ConsultarComanda);
    this.idUsuario = parseInt(sessionStorage.idUsuario);
    this.userTemp = sessionStorage.user;

    if(this.loginModel.identificadorUsuario!=null && this.loginModel.tipoCredencial!=NaN){
      this.HabitacionesResumen();
      //this.ObtenerTipoPago();
      this.ObtenerTipoEstadia();
      this.ObtenerTipoTarjeta();
      this.ObtenerEmpleadosActivos();
      this.ObtenerConceptosMantenimiento();
      this.ObtieneSupervisores()
      this.ObtieneConceptosLieracion();
      this.MostrarTodasCamaristas();
    }
    else if(this.loginModel.identificadorUsuario==null || this.loginModel.tipoCredencial==NaN){
      this.router.navigate(['/login']);
    }
    this.renta.TipoEstancia = 2;

    if(sessionStorage.user == null || sessionStorage.user == undefined || sessionStorage.user == NaN){
      this.router.navigate(['/login']);
    }

    //Sockets
    this.initMultiusuarioSocket();
    this.initCocinaSocket();
    this.initHabitacionesSocket();
  }

  ngOnDestroy(): void {
    this.multiusuarioSocket$.unsubscribe();
    this.cocinaSocket$.unsubscribe();
    this.habitacionesSocket$.unsubscribe();
    this.socketMultiusuario.deseleccionarHabitacion(this.cardSeleccionado);
  }

  initMultiusuarioSocket(){
    this.multiusuarioSocket$ = this.socketMultiusuario.syncSelecciones()
    .subscribe( ( response: HabitacionesSocketResponse ) => {

      if( response.data == "habitaciones"){
        // Cards
        $( ".roomCard" ).removeClass("card-seleccionada");
        $( ".roomCard .span-usuario-card" ).removeClass("usuario-seleccion");
        $( ".roomCard .span-usuario-card" ).text('');

        response.habitaciones.forEach( hab => {
          $( '.roomCard-'+hab.habitacion ).addClass("card-seleccionada");
          $( '.roomCard-'+hab.habitacion+' .span-usuario-card' ).addClass("usuario-seleccion");
          $( '.roomCard-'+hab.habitacion+' .span-usuario-card' ).text(hab.alias);
        });
      }
    });
    this.socketMultiusuario.getSelecciones();
  }

  initCocinaSocket(){
    this.cocinaSocket$ = this.cocinaSocket.syncComandas()
    .subscribe( ( response: any ) => {

      if( this.cardSeleccionado > 0
          && this.cardSeleccionado == Number(response.habitacion)
          && !($(".modal-roomservice").data('bs.modal') || {})._isShown
          && !($(".modal-autorizarOrden").data('bs.modal') || {})._isShown
      ){
        this.HabitacionesResumen( this.cardSeleccionado );
      }
    });
  }

  initHabitacionesSocket(){
    this.habitacionesSocket$ = this.habitacionesSocket.syncHabitaciones()
    .subscribe( ( response: any ) => {

      this.HabitacionesResumen();

      /* if( this.cardSeleccionado > 0
          && this.cardSeleccionado == Number(response.habitacion)
          && !($(".modal-roomservice").data('bs.modal') || {})._isShown
          && !($(".modal-autorizarOrden").data('bs.modal') || {})._isShown
      ){
        this.HabitacionesResumen( this.cardSeleccionado );
      } */
    });
  }

  ResetListaFiltros()
  {
    this.listaFiltros = [
      {
        cantidad: 0,
        idEstado: 1,
        tipo: 'Libre',
        icon: 'far fa-check-circle',
        color: 'icon-green'
      },
      {
        cantidad: 0,
        idEstado: 2,
        tipo: 'Por Cobrar',
        icon: 'icon-cobrar',
        color: 'icon-green'
      },

      {
        cantidad: 0,
        idEstado: 3,
        tipo: 'Preparada',
        icon: 'icon-car',
        color: 'icon-green'
      },
      {
        cantidad: 0,
        idEstado: 4,
        tipo: 'Reservada',
        icon: 'icon-calendar',
        color: 'icon-purple'
      },
      {
        cantidad: 0,
        idEstado: 15,
        tipo: 'Room Service',
        icon: 'icon-roomservice',
        color: 'icon-darkblue'
      },
      {
        cantidad: 0,
        idEstado: 6,
        tipo: 'Bloqueada',
        icon: 'icon-candado',
        color: 'icon-gray'
      },
      {
        cantidad: 0,
        idEstado: 7,
        tipo: 'Ocupada',
        icon: 'icon-pareja-ocupada',
        color: 'icon-red'
      },
      {
        cantidad: 0,
        idEstado: 8,
        tipo: 'Sucia',
        icon: 'icon-sucia',
        color: 'icon-yellow'
      },
      {
        cantidad: 0,
        idEstado: 9,
        tipo: 'Limpieza',
        icon: 'icon-limpieza',
        color: 'icon-blue'
      },
      {
        cantidad: 0,
        idEstado: 10,
        tipo: 'Supervisión',
        icon: 'icon-search',
        color: 'icon-blue'
      },
      {
        cantidad: 0,
        idEstado: 11,
        tipo: 'Mantenimiento',
        icon: 'icon-mantenimiento',
        color: 'icon-gray'
      },
      {
        cantidad: 0,
        idEstado: 13,
        tipo: 'Media Sucia',
        icon: 'icon-sucia',
        color: 'icon-greenlemon'
      },
      {
        cantidad: 0,
        idEstado: 14,
        tipo: 'Con Detalles',
        icon: 'far fa-check-circle',
        color: 'icon-purple'
      },
      {
        cantidad: 0,
        idEstado: 16,
        tipo: 'Alertas',
        icon: 'icon-clock',
        color: 'icon-gray'
      },

    ];
  }

  reload(){
    window.location.reload();
  }

  ResetRenta()
  {
    this.tTiempoExtra=true;
    this.enableTarifas=true;
    this.renta =
    {
      IdHabitacion: 0,
      TarifaHabitaciones:0,
      CantidadpersonasExtra:0,
      TarifaPersonasExtra:0,
      TotalTarifaPersonasExtra:0,
      CantidadHorasExtras:0,
      TarifaHorasExtra:0,
      TotalHorasExtra:0,
      CantidadHospedajeExtra:0,
      TotalHospedajeExtra:0,
      EsAPie:false,
      AutoMatricula:'',
      AutoMarca:'',
      AutoModelo:'',
      AutoColor:'',
      TipoEstancia:2,
      TipoPago:0,
      TipoTarjeta:0,
      Referencia:'',
      NumeroTarjeta:null,
      Total:0,
      Subtotal:0,
      idEmpleadoInterno:0,
      MotivoConsumo:'',
      MontoTarjetaMixto:null,
      MontoEfectivoMixto:null,
      propina:null,
      credencial:{
        TipoCredencial:0,
        IdentificadorUsuario:'',
        ValorVerificarStr:'',
        ValorVerificarBin:''
      },
      user:null
    }

  }

  ResetPropExtra_Habitacion(){
    this.tTarifaHabitacion='';
    this.tPersonasExtra='';
    this.tHorasExtra='';
    this.tNochesExtra='';
    this.tTiempoExtra=true;
    }

  ResetTarifa()
  {
    this.arrTar=[{
      id:0,
      idTipoHabitacion:0,
      precio:0,
      precio_con_iva:0,
      hora_Extra:0,
      hora_extra_con_iva:0,
      precioPersonaExtra:0,
      persona_Extra_con_iva:0,
      desc_TipoEstadia:'',
      tieneTiempoExtra:false
    }]
  }

  ResetOpcPago()
  {
    this.opcTipoPago=[{
      idTipoPago:0,
      desc_TipoPago:'Forma de pago'

  }]
  }

  ResetGruposHabitaciones() {
    this.arrJuniorVilla = [];
    this.arrPoolVilla = [];
    this.arrTwinSuite = [];
    this.arrSkySuite = [];
    this.arrPoolSpa = [];
    this.arrJuniorSuite = [];
  }

  ResetEstatusHabitacion() {
    this.libre = false;
    this.sucia = false;
    this.ocupada = false;
    this.limpieza = false;
    this.suspension = false;
    this.bloqueada = false;
    this.mantto = false;
    this.preparada = false;
    this.reservada = false;
    this.pendiente = false;
    this.supervision = false;
    this.roomservice = false;
    this.mediasucia = false;
    this.libredetalle = false;
    this.supervisionmtto = false;

  }

  ResetHabitacion() {
    this.habitacion = {
      accion: '',
      idHabitacion: 0,
      numeroHabitacion: 0
    }
  }

  ResetDatosHabitacion() {
    this.resumenesComandas = [];
    this.articulosComandas = [];
    this.resumenesVentasHabitacion = [];
    this.arrArticulos = [];
  }

  ResetDatosPago(){
    this.renta.NumeroTarjeta='';
    this.renta.Referencia='';
    this.renta.propina=null;
    this.renta.MotivoConsumo='';
    this.renta.MontoEfectivoMixto=null;
    this.renta.MontoTarjetaMixto=null;
    this.renta.idEmpleadoInterno=0;
    this.mensajeError='';

    // this.ResetOpcPago();
    this.opcTipoPago=[];
    this.ObtenerTipoPago();
  }


  ResetDatosAuto(apie) {
    if (apie) {
      this.renta.AutoMatricula = '';
      this.renta.AutoMarca = '';
      this.renta.AutoModelo = '';
      this.renta.AutoColor = '';
    }
  }


  Home() {
    // Nuevo Filtro
    this.idEstadoFiltro = 0;

    $('.modal').modal('hide');
    this.HideDetails(false);

    this.ResetRenta();
    this.ResetGruposHabitaciones();
    // this.ResetGruposHabitaAlertas();
    this.HabitacionesResumen();
  }

  ShowUserOptions() {
    this.userOptions = true;
    this.showDetails = true;
  }

  ShowMenuHam(){
    this.MenuHamOptions = true;
  }

  ShowMenuFajillas(){
    this.MenuFajillasOptions = true;
  }

  HabitacionesResumen( cardclick: number = 0) {
    this.incioService.GetHabitacionesResumen().subscribe((response: HabitacionesResponse) => {        
        this.listaHabitaciones = response.result;
        this.OrdenarHabitaciones(response.result);
        this.listaFiltrosAux=this.listaFiltros;

        //Cardclick
        if ( cardclick > 0 ){
          const habitacion = this.listaHabitaciones.find(element => element.idHabitacion == cardclick);
          if( habitacion !== null && typeof habitacion !== 'undefined' ){
            this.CardClick(cardclick, habitacion.numeroHabitacion,true, habitacion.datoBase, habitacion.detalle);
          }
        } /* else {
          sessionStorage.numHabitacion = '';
          sessionStorage.idHabitacion = '';
        } */
      });
  }

  async ObtenerHabitacion(idHabitacion, numeroHabitacion, datoBase, detalleMatenimiento) {
    await this.incioService.GetDatosHabitacion(idHabitacion, numeroHabitacion)
      .toPromise().then( (response: any) => {
        this.OrdenarDatosHabitacion([response.result], datoBase, detalleMatenimiento);
    });
  }

  ObtenerTipoPago() {
    this.incioService.GetTipoPago().subscribe((response: any) => {
      this.setTipoPago(response.result);

    });
  }

  ObtenerTipoEstadia(){
    this.incioService.GetTipoEstadia().subscribe((response:any)=>{
      // let initialValue={cod_TipoEstadia:0,desc_TipoEstadia:'Tarifa' };
      this.listTipoEstancia=response.result;
      // this.listTipoEstancia.unshift(initialValue);
      this.listTipoEstancia.reverse();
    });
  }

  ObtenerTipoTarjeta(){
    this.incioService.GetTipoTarjeta().subscribe((response:any)=>{
      let initialValue={cod_TipoTarjeta:0,desc_TipoTarjeta:'Tarjeta' };
      this.TiposTarjeta=response.result;
      this.TiposTarjeta.unshift(initialValue);
    });
  }

  ObtenerTarifas(id:number){

    if(this.renta.TipoEstancia!==0){
      this.renta.IdHabitacion=id;
      this.incioService.GetTarifas(id,this.renta.TipoEstancia).subscribe((response:any)=>{
        this.DefineImportesXHabitacion([response.result]);

      });
    }
    else{
      this.DefineImportesXHabitacion([null]);
    }
  }

  ObtenerEmpleadosActivos() {
    this.incioService.GetEmpleadosActivos(this.userTemp).subscribe((response: any) => {
      this.setPersonalActivo(response.result);
    });
  }

  ObtenerConceptosMantenimiento(){
    this.incioService.ObtenerConceptosMantenimiento().subscribe((response: any) => {
      this.setConceptosMto(response)
    });
  }

  setConceptosMto(conceptos:any[]){
    this.listaTiposMantenimiento = conceptos;
  }

  PreparaHabitacion(idHabitacion: number, numero: number) {
    this.incioService.PrepararHabitacion(idHabitacion)
      .subscribe((response: any) => {
        this.ResetHabitacion();
        this.habitacion.accion = 'prepara';
        this.habitacion.idHabitacion = idHabitacion;
        this.habitacion.numeroHabitacion = numero;
        this.ActualizaHabitaciones( this.habitacion.idHabitacion );
    });
  }

  CancelaPreparacionHabitacion(idHabitacion: number, numero: number) {
    this.incioService.CancelarPreparacion(idHabitacion).subscribe((response: any) => {

      this.ResetHabitacion();
      this.habitacion.accion = 'cancelaPreparacion';
      this.habitacion.idHabitacion = idHabitacion;
      this.habitacion.numeroHabitacion = numero;

      this.ActualizaHabitaciones( this.habitacion.idHabitacion );
    })
  }


  RentaHabitacion(model :RentaHabitacionModel){
    this.incioService.RentarHabitacion(model).subscribe((response:any)=>{
      this.ValidaRentaAplicada(response);
    });


  }

  RentaHabitacionXCobrar(model:any){
    this.incioService.PagoPorCobrar(model).toPromise().then((response: any) =>{
      this.ValidaRentaAplicada(response)
    }).catch(err =>{
    })
  }

  CambiarModalSalirHabitacion(idHabitacion: number, numero: number){
    this.salidaId = idHabitacion;
    this.salidaNumeroH = numero;
    $('#salirModal').modal('hide');
    $('#salirModalEstadoSucia').modal('show');
  }

  ExitHabitacion(idHabitacion: number, numero: number) {

    this.salidaId = idHabitacion;
    this.salidaNumeroH = numero;

    //validamos el estado de la habitación
    let radio = $("input[name='estado_habitacion']:checked").val();
    if(radio == "sucia"){
      //consumimos el servicio que da salida a la habitacion
      this.incioService.FinalizarRenta(this.salidaId).toPromise()
      .then((response:any)=>{
        // Sockets
        this.ActualizaHabitaciones( this.salidaId );
      }).catch((response:any) => {
        this.errorHabitacionTerminada = response.error || response.statusText;
        $('#salirModalError').modal('toggle');
      });
    }else if(radio == "mediasucia"){
      this.incioService.FinalizarMediaSucia(this.salidaId).toPromise()
      .then((response: any)=>{
        if(response.status == 200){
          // Sockets
          this.ActualizaHabitaciones( this.salidaId );
        }else{
          this.errorHabitacionTerminada = response.statusText;
          $('#salirModalError').modal('toggle');
        }
      }).catch((response:any) => {
        this.errorHabitacionTerminada = response.error;
        $('#salirModalError').modal('toggle');
      });
    }
  }

  ObtenerSiTieneReportes( formulario: NgForm){

    if (!formulario.valid) {

      Object.values(formulario.controls).forEach(control => {
        control.markAsTouched();
      });
    } else {
      if (formulario.form.controls.matricula.value != '') {

        let matricula=formulario.form.controls.matricula.value ==this.renta.AutoMatricula ?
        this.renta.AutoMatricula: '';

        this.matriculaService.GetAnswReporteExistente(matricula).subscribe((response:any)=>{
          this.ValidaMatricula(response,formulario);
        });

      }
      else{
        if(this.CobrarHabitaciones){

          this.OpenConfirmFormaPago(formulario);

        }else{
          this.AplicarRentaHabitacion(formulario);

          $('#rentConfirmedModal').modal('toggle');
        }

      }
    }
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

  let initialValue={idTipoPago:0,desc_TipoPago:'Forma de pago', activo:true, selected:true};
  this.opcTipoPago.unshift(initialValue);

  }

  setPersonalActivo(empleados:any[]){
    this.listEmpleados=empleados;
    let initialEmpleado={idEmpleado:0,nombreEmpleado:'Personal Activo *'};
    this.listEmpleados.unshift(initialEmpleado);
  }


  FiltradoHabitaciones(el) {
    // NUEVO FILTRO
    $(".roomCard").addClass("no-filtro");
    if (el.tipo != 'Alertas') {
      this.idEstadoFiltro = el.idEstado;
      $('.id-estado-'+el.idEstado).removeClass("no-filtro");
    } else {
      $('.roomCard-vencida').removeClass("no-filtro");
    }

    // Menú
    $(".nav-item").removeClass("nav-item-active");
    $('.menu-id-estado-'+el.idEstado).addClass("nav-item-active");

    var x = this.listaHabitaciones;
    this.OrdenarHabitaciones(x);

    if(screen.width < 768){
      $('#sidebar, #content, #app-header, #boton-menu').removeClass('active');
      $('#collapseExample2').hide();
    }
  }

  FiltradoHabitacionesTexto(tipo: string) {
    tipo = tipo.replace(/ /g, '-');
    tipo = tipo.replace(/&-/g, '');

    if(tipo.length !=0){
      // Cards
      $('.roomCard').addClass("no-filtro");
      $(".tipo-"+tipo).removeClass("no-filtro");
    }else{
      $('.roomCard').removeClass("no-filtro");
      $(".tipo-"+tipo).addClass("no-filtro");
    }

  }

  OrdenarDatosHabitacion(habitacion: any[], datoBase:string, detalleMatenimiento: string) {

    this.ResetEstatusHabitacion();
    this.ResetDatosHabitacion();

    //limpiamos los datos de las camaristas
    this.arrayListaCamaristasDetalle.length = 0;
    this.num_camaristas = 0;
    this.num_camaristas = datoBase.split(',').length;

    if(this.num_camaristas == 2){
      datoBase = datoBase.split(',')[1];
    }else if(this.num_camaristas >= 3){
      for(var i = 1; i < this.num_camaristas - 1; i++){
        let arrayVal = datoBase.split(',')[i];
        if(arrayVal != "0" && arrayVal != "1" && arrayVal != "2" && arrayVal != "3" && arrayVal != "4" && arrayVal != "5" ){
          this.arrayListaCamaristasDetalle.push(datoBase.split(',')[i]);
        }
      }
      datoBase = "";
    }
    //collapse
    $('#collapsedatosHabitacion').removeClass('show');
    $('#detallesHabitacion').removeClass('show');
    $('#roomService').removeClass('show');
    $('#datosCollapse').attr('aria-expanded', 'false');
    $('#detalleCollapse').attr('aria-expanded', 'false');
    $('#roomCollapse').attr('aria-expanded', 'false');

    this.nombreSuperCam = datoBase;
    this.detalleManto = detalleMatenimiento;

    habitacion.forEach(el => {

      this.matriculaSelect = el.matricula;
      this.observacionesDetalleHabitacionLibre = el.observacionesDetalleHabitacionLibre;
      let countresumenesComandas = el.resumenesComandas.length;

      if(countresumenesComandas != 0){
        setTimeout(() => {
          $('#roomService').addClass('show');
          $('#roomCollapse').attr('aria-expanded', 'true');
        }, 100);
      }else{
        setTimeout(() => {
          $('#collapsedatosHabitacion').addClass('show');
          $('#detallesHabitacion').addClass('show');
          $('#datosCollapse').attr('aria-expanded', 'true');
          $('#detalleCollapse').attr('aria-expanded', 'true');
        }, 150);
      }

      switch (el.estado) {
        case 0:
          el.NombreEstado = 'En creación';
          //collapse
          break;
        case 1:
          el.NombreEstado = 'Libre';
          this.libre = true;
          break;
        case 2:
          el.NombreEstado = 'Por Cobrar';
          this.pendiente = true;
          break;
        case 3:
          el.NombreEstado = 'Preparada';
          this.preparada = true;
          break;
        case 4:
          el.NombreEstado = 'Reservada';
          this.reservada = true;
          break;
        case 5:
          el.NombreEstado = 'Preparada y reservada';
          this.preparada = true;
          this.reservada = true;
          break;
        case 6:
          el.NombreEstado = 'Bloqueada';
          this.bloqueada = true;
          break;
        case 7:
          el.NombreEstado = 'Ocupada';
          this.ocupada = true;
          break;
        case 8:
          el.NombreEstado = 'Sucia';
          this.sucia = true;
          break;
        case 9:
          el.NombreEstado = 'Limpieza';
          this.limpieza = true;
          break;
        case 10:
          el.NombreEstado = 'Supervisión';
          this.supervision = true;
          break;
        case 11:
          el.NombreEstado = 'Mantenimiento';
          this.mantto = true;
          break;
        case 12:
          el.NombreEstado = 'Supervisor de Mantenimiento';
          this.supervisionmtto = true;
          break;
        case 13:
          el.NombreEstado = 'Media Sucia';
          this.mediasucia = true;
          break;
        case 14:
          el.NombreEstado = 'Libre con Detalle';
          this.libredetalle = true;
          break;
        case 15:
          el.NombreEstado = 'Room Service';
          this.roomservice = true;
          break;
      }

      el.Comandas = this.DefineComanda(el.resumenesComandas);

      if (el.fechaEntrada != null) {
        el.FechaEntrada = this.ExtraeFecha(el.fechaEntrada);
        el.HoraEntrada = this.ExtraeHora(el.fechaEntrada);
      } else {
        el.FechaEntrada = '';
        el.HoraEntrada = '';
      }

      if (el.fechaSalida != null) {
        el.FechaSalida = this.ExtraeFecha(el.fechaSalida);
        el.HoraSalida = this.ExtraeHora(el.fechaSalida);
      } else {
        el.FechaSalida = '';
        el.HoraSalida = '';
      }

      if (el.marca == "A PIE" || el.marca == null) {
        el.DatosAuto = " ";
      } else {
        el.DatosAuto = el.marca + ',' + el.modelo + ',' + el.color;
      }

      if (el.resumenesComandas.length > 0) {
        this.articulosComandas = el.Comandas.articulos;
      } else {
        this.articulosComandas = this.articulosM;
      }

    });
    let habitaciones = [];

    habitacion.forEach(element =>{

      this.roomServService.ObtenerDetalleComandasPorHabitacion(element.id)
        .toPromise().then((response:any)=>{

          this.ComandasRoomServices= response.body.result;

          let object:any = {
            Comandas:element.Comandas,
            DatosAuto: element.DatosAuto,
            FechaEntrada:element.FechaEntrada,
            FechaSalida:element.FechaSalida,
            HoraEntrada:element.HoraEntrada,
            HoraSalida:element.HoraSalida,
            NombreEstado:element.NombreEstado,
            color:element.color,
            cortesiaHabitacion:element.cortesiaHabitacion,
            cortesias:element.cortesias,
            descuentos:element.descuentos,
            estado:element.estado,
            fechaEntrada:element.fechaEntrada,
            fechaSalida:element.fechaSalida,
            habitacion:element.habitacion,
            habitacionElectron:element.habitacionElectron,
            hospedajeExtra:element.hospedajeExtra,
            id:element.id,
            linea:element.linea,
            marca:element.marca,
            matricula:element.matricula,
            modelo:element.modelo,
            numeroHospedajeExtra:element.numeroHospedajeExtra,
            numeroPersonasExtra:element.numeroPersonasExtra,
            numeroServicio:element.numeroServicio,
            numeroServicioElectron:element.numeroServicioElectron,
            paquetes:element.paquetes,
            personasExtra:element.personasExtra,
            poseeComanda:element.poseeComanda,
            precioHabitacion:element.precioHabitacion,
            reservacion:element.reservacion,
            reservacionElectron:element.reservacionElectron,
            restaurante:element.restaurante,
            resumenesComandas:element.resumenesComandas,
            resumenesVentasHabitacion:element.resumenesVentasHabitacion,
            servicioRestaurante:element.servicioRestaurante,
            tarjetaV:element.tarjetaV,
            tipo:element.tipo,
            tipoLimpieza:element.tipoLimpieza,
            total:element.total,
            ComandasRoomServices:this.ComandasRoomServices
          }

          habitaciones.push(object);

          this.listaDatosHabitaciones =  habitaciones;
      });
    });
  }

  ExtraeFecha(fecha: string) {
    var Fecha = moment(fecha).format("DD/MM/YYYY");
    return Fecha;
  }

  ExtraeHora(hora: string) {
    var Hora = moment(hora).format('h:mm:ss a');
    return Hora;
  }


  DefineComanda(resumenComanda: any[]) {
    let comandas = {
      articulos: [],
      total: 0
    };

    resumenComanda.forEach(el => {
      this.arrArticulos = this.arrArticulos.concat(el.articulos);
      comandas.articulos = this.arrArticulos;
      comandas.total += el.total;
    });
    return comandas;
  }

  OrdenarHabitaciones(habitaciones: any[]) {

    // this.ResetGruposHabitaAlertas();
    this.ResetGruposHabitaciones();
    this.ResetListaFiltros();

    habitaciones.forEach((el) => {
      this.nombreSuperCam = el.datoBase

      el.idEstado = this.DefineIconComanda(el.idEstadoComanda, el.idEstado).state;
      switch (el.nombreTipo) {
        case 'Junior Villa':
          this.arrJuniorVilla.push(el);
          el.definition = this.DefinirEstado(el.idEstado, el.esVencida, el.idEstadoComanda);
          el.definition.nombre = el.datoBase === 'Junior Villa' ? null : el.datoBase.toLowerCase();
          break;

        case 'Pool Villa':
          this.arrPoolVilla.push(el);
          el.definition = this.DefinirEstado(el.idEstado, el.esVencida, el.idEstadoComanda);
          el.definition.nombre = el.datoBase === 'Pool Villa' ? null : el.datoBase.toLowerCase();
          break;

        case 'Twin Suite':
          this.arrTwinSuite.push(el);
          el.definition = this.DefinirEstado(el.idEstado, el.esVencida, el.idEstadoComanda);
          el.definition.nombre = el.datoBase === 'Twin Suite' ? null : el.datoBase.toLowerCase();
          break;

        case 'Pool & Spa':
          this.arrPoolSpa.push(el);
          el.definition = this.DefinirEstado(el.idEstado, el.esVencida, el.idEstadoComanda);
          el.definition.nombre = el.datoBase === 'Pool & Spa' ? null : el.datoBase.toLowerCase();
          break;

        case 'Junior Suite':
          this.arrJuniorSuite.push(el);
          el.definition = this.DefinirEstado(el.idEstado, el.esVencida, el.idEstadoComanda);
          el.definition.nombre = el.datoBase === 'Junior Suite' ? null : el.datoBase.toLowerCase();
          break;

        case 'Sky Suite':
          this.arrSkySuite.push(el);
          el.definition = this.DefinirEstado(el.idEstado, el.esVencida, el.idEstadoComanda);
          el.definition.nombre = el.datoBase === 'Sky Suite' ? null : el.datoBase.toLowerCase();
          break;
      }
    });

    //Ordenamiento
    /* this.arrJuniorVilla.sort( (a,b) => b.idHabitacion - a.idHabitacion);
    this.arrPoolVilla.sort( (a,b) => b.idHabitacion - a.idHabitacion);
    this.arrTwinSuite.sort( (a,b) => b.idHabitacion - a.idHabitacion);
    this.arrPoolSpa.sort( (a,b) => b.idHabitacion - a.idHabitacion);
    this.arrJuniorSuite.sort( (a,b) => b.idHabitacion - a.idHabitacion);
    this.arrSkySuite.sort( (a,b) => b.idHabitacion - a.idHabitacion); */
  }

  DefineIconComanda = (id = null, estado) => {

    let result = {
      state: 0,
      cpyIcon: ''
    };
    if (id === null) {
      result.state = estado;
      result.cpyIcon = 'icon-pareja-ocupada';
    }
    else {
      result.state = 15;
      result.cpyIcon = 'icon-roomservice'
    }
    return result;
  }

  DefinirEstado(idEstado: number, esVencida: boolean, idEstadoComanda: number) {

    let estadoDefinition = {
      copyEstado: '',
      claseCss: '',
      icon: '',
      iconColor: '',
      alertCss: ''
    };

    switch (idEstado) {
      case 0:
        estadoDefinition.copyEstado = 'En creación';
        estadoDefinition.claseCss = '';
        estadoDefinition.icon = '';
        estadoDefinition.iconColor = '';
        this.DefinirFiltros(this.listaFiltros, estadoDefinition.icon, estadoDefinition.copyEstado, esVencida,null);
      break;
      case 1:
        estadoDefinition.copyEstado = 'Libre';
        estadoDefinition.claseCss = 'paint-green';
        estadoDefinition.icon = 'far fa-check-circle';
        estadoDefinition.iconColor = 'icon-green';
       this.DefinirFiltros(this.listaFiltros, estadoDefinition.icon, estadoDefinition.copyEstado, esVencida,null);
         break;
      case 2:
        estadoDefinition.copyEstado = 'Por Cobrar';
        estadoDefinition.claseCss = 'paint-hybridGreen';
        estadoDefinition.icon = 'icon-cobrar';
        estadoDefinition.iconColor = 'icon-green';
        estadoDefinition.alertCss = esVencida ? 'alert-red' : '';
        this.DefinirFiltros(this.listaFiltros, estadoDefinition.icon, estadoDefinition.copyEstado, esVencida,idEstadoComanda);
       break;
      case 3:
        estadoDefinition.copyEstado = 'Preparada';
        estadoDefinition.claseCss = 'paint-green';
        estadoDefinition.icon = 'icon-car';
        estadoDefinition.iconColor = 'icon-green';
        this.DefinirFiltros(this.listaFiltros, estadoDefinition.icon, estadoDefinition.copyEstado, esVencida,null);
        break;
      case 4:
        estadoDefinition.copyEstado = 'Reservada';
        estadoDefinition.claseCss = 'paint-purple';
        estadoDefinition.icon = 'icon-calendar';
        estadoDefinition.iconColor = 'icon-purple';
        this.DefinirFiltros(this.listaFiltros, estadoDefinition.icon, estadoDefinition.copyEstado, esVencida,null);
        break;
      case 5:
        estadoDefinition.copyEstado = 'Preparada y reservada';
        estadoDefinition.claseCss = 'paint-purple';
        estadoDefinition.icon = 'icon-calendar';
        estadoDefinition.iconColor = 'icon-purple';
        this.DefinirFiltros(this.listaFiltros, estadoDefinition.icon, estadoDefinition.copyEstado, esVencida,null);
        break;
      case 6:
        estadoDefinition.copyEstado = 'Bloqueada';
        estadoDefinition.claseCss = 'paint-purple';
        estadoDefinition.icon = 'icon-candado';
        estadoDefinition.iconColor = 'icon-gray';
        this.DefinirFiltros(this.listaFiltros, estadoDefinition.icon, estadoDefinition.copyEstado, esVencida,null);
        break;
      case 7:
        estadoDefinition.copyEstado = 'Ocupada';
        estadoDefinition.claseCss = 'paint-red';
        estadoDefinition.icon = this.DefineIconComanda(idEstadoComanda, idEstado).cpyIcon;
        estadoDefinition.iconColor = 'icon-red';
        estadoDefinition.alertCss = esVencida ? 'alert-red' : '';
        this.DefinirFiltros(this.listaFiltros, estadoDefinition.icon, estadoDefinition.copyEstado, esVencida, idEstadoComanda);
        break;
      case 8:
        estadoDefinition.copyEstado = 'Sucia';
        estadoDefinition.claseCss = 'paint-yellow';
        estadoDefinition.icon = 'icon-sucia';
        estadoDefinition.iconColor = 'icon-yellow';
        estadoDefinition.alertCss = esVencida ? 'alert-yellow' : '';
        this.DefinirFiltros(this.listaFiltros, estadoDefinition.icon, estadoDefinition.copyEstado, esVencida, null);
        break;
      case 9:
        estadoDefinition.copyEstado = 'Limpieza';
        estadoDefinition.claseCss = 'paint-blue';
        estadoDefinition.icon = 'icon-limpieza';
        estadoDefinition.iconColor = 'icon-blue';
        estadoDefinition.alertCss = esVencida ? 'alert-blue' : '';
        this.DefinirFiltros(this.listaFiltros, estadoDefinition.icon, estadoDefinition.copyEstado, esVencida,null);
        break;
      case 10:
        estadoDefinition.copyEstado = 'Supervisión';
        estadoDefinition.claseCss = 'paint-blue';
        estadoDefinition.icon = 'icon-search';
        estadoDefinition.iconColor = 'icon-blue';
        estadoDefinition.alertCss = esVencida ? 'alert-blue' : '';
        this.DefinirFiltros(this.listaFiltros, estadoDefinition.icon, estadoDefinition.copyEstado, esVencida, null);
        break;
      case 11:
        estadoDefinition.copyEstado = 'Mantenimiento';
        estadoDefinition.claseCss = 'paint-gray';
        estadoDefinition.icon = 'icon-mantenimiento';
        estadoDefinition.iconColor = 'icon-gray';
        this.DefinirFiltros(this.listaFiltros, estadoDefinition.icon, estadoDefinition.copyEstado, esVencida,null);
        break;
      case 12:
        estadoDefinition.copyEstado = 'Supervisión';
        estadoDefinition.claseCss = 'paint-blue';
        estadoDefinition.icon = 'icon-search';
        estadoDefinition.iconColor = 'icon-blue';
        estadoDefinition.alertCss = esVencida ? 'alert-blue' : '';
        this.DefinirFiltros(this.listaFiltros, estadoDefinition.icon, estadoDefinition.copyEstado, esVencida, null);
        break;
      case 13:
        estadoDefinition.copyEstado = 'Media Sucia';
        estadoDefinition.claseCss = 'paint-greenlemon';
        estadoDefinition.icon = 'icon-sucia';
        estadoDefinition.iconColor = 'icon-greenlemon';
        estadoDefinition.alertCss = esVencida ? 'alert-greenlemon' : '';
        this.DefinirFiltros(this.listaFiltros, estadoDefinition.icon, estadoDefinition.copyEstado, esVencida,null);
        break;
      case 14:
        estadoDefinition.copyEstado = 'Con Detalles';
        estadoDefinition.claseCss = 'paint-purple';
        estadoDefinition.icon = 'far fa-check-circle';
        estadoDefinition.iconColor = 'icon-purple';
        estadoDefinition.alertCss = esVencida ? 'alert-purple' : '';
        this.DefinirFiltros(this.listaFiltros, estadoDefinition.icon, estadoDefinition.copyEstado, esVencida,null);
        break;
      case 15:
        estadoDefinition.copyEstado = 'Room Service';
        estadoDefinition.claseCss = 'paint-red';
        estadoDefinition.icon = 'icon-roomservice';
        estadoDefinition.iconColor = 'icon-red';
        this.DefinirFiltros(this.listaFiltros, estadoDefinition.icon, estadoDefinition.copyEstado, esVencida,idEstadoComanda);
        break;
    }

    return estadoDefinition;
  }

  DefinirFiltros(list: FiltroModel[], iconStr: string, typeStr: string, overTime: boolean, idEstadoComanda?:number) {

    list.forEach((el) => {

        if (typeStr === el.tipo) {
            el.cantidad++;
          el.icon = iconStr;
        }

      });

      if (overTime) {
        list.forEach((el) => {

            if ('Alertas' === el.tipo) {
              el.cantidad++;
              el.icon = 'icon-clock' + ' ' + 'icon-gray';
            }

        });
      }
      this.listaFiltros = list;
  }

  DefineImportesXHabitacion(tarifas: any[]) {
    this.inicioBehaviors.limpiarValores();
    this.tTiempoExtra=false;
    this.enableTarifas=true;
    this.renta.CantidadpersonasExtra=0;
    this.renta.CantidadHospedajeExtra=0;
    this.renta.CantidadHorasExtras=0;


    //si seleccionamos un tipo de Tarifa

    if(this.renta.TipoEstancia!=0){
      tarifas.forEach(el => {
        //si trae tarifas
        if(el!=null){

          this.renta.TarifaHabitaciones=el.precio_con_iva;
          this.renta.TarifaPersonasExtra=el.persona_Extra_con_iva;
          this.renta.TarifaHorasExtra=el.hora_extra_con_iva;

          if(el.tieneTiempoExtra==true){
            this.tTiempoExtra=true;
            this.tHorasExtra=(0).toFixed(2);
          }

          this.tTarifaHabitacion=(this.renta.TarifaHabitaciones).toFixed(2);
          this.tNochesExtra=(0).toFixed(2);
          this.tPersonasExtra=(0).toFixed(2);
          this.renta.Total=this.renta.TarifaHabitaciones;
        } else { //si no trae tarifas

          this.tTiempoExtra=true;
          this.ResetTarifa();
          this.enableTarifas=false;

          this.renta.TarifaHabitaciones=0;
          this.renta.TarifaHorasExtra=0;
          this.renta.TarifaPersonasExtra=0;
          this.tTarifaHabitacion=(0).toFixed(2);


           // this.tTarifaHabitacion=(this.renta.TarifaHabitaciones).toFixed(2);
           // this.tHorasExtra=(0).toFixed(2);
           // this.tNochesExtra=(0).toFixed(2);
           // this.tPersonasExtra=(0).toFixed(2);

          this.renta.Total=this.renta.TarifaHabitaciones;
        }

      });
    } else{
      this.tTiempoExtra=true;
      this.ResetTarifa();
      this.enableTarifas=true;

      this.renta.TarifaHabitaciones=0;
      this.renta.TarifaHorasExtra=0;
      this.renta.TarifaPersonasExtra=0;
      this.renta.Total=this.renta.TarifaHabitaciones;
      this.tTarifaHabitacion=(0).toFixed(2);

      this.renta.Total=this.renta.TarifaHabitaciones;
    }
  }


  cardSeleccionado: number = 0;
  habitacionSeleccionada: number = 0;
  async CardClick(id, numeroHabitacion, show, datoBase, detalleMatenimiento) {

    if( (!$('.roomCard-'+id).hasClass( 'card-seleccionada' )) || id == this.cardSeleccionado ){
      //this.showDetails = !this.showDetails;
      this.showDetails = show;
      await this.ObtenerHabitacion(id, numeroHabitacion, datoBase, detalleMatenimiento);

      // Cards
      $(".roomCard").addClass("no-filtro");
      $('.roomCard-'+id).removeClass("no-filtro");

      // Sockets
      this.socketMultiusuario.seleccionarHabitacion(id, this.cardSeleccionado);
      this.cardSeleccionado = id;
      this.habitacionSeleccionada = numeroHabitacion;
      sessionStorage.numHabitacion = numeroHabitacion;
      sessionStorage.idHabitacion = id;
    }
  }

  HideDetails(isHome = false) {
    // Nuevo Filtro
    const idEstado = this.idEstadoFiltro;
    if( idEstado > 0 )
    {
      $(".nav-item").removeClass("nav-item-active");
      $('.menu-id-estado-'+idEstado).addClass("nav-item-active");

      $(".roomCard").addClass("no-filtro");
      $('.id-estado-'+idEstado).removeClass("no-filtro");
    }
    else
    {
      $(".roomCard").removeClass("no-filtro");
    }

    // this.showDetails = !this.showDetails;
    isHome ? (this.showDetails ? null : this.showDetails = false) : this.showDetails = false;
    this.userOptions === true ? this.userOptions = false : null;
    this.MenuHamOptions === true ? this.MenuHamOptions = false : null;
    this.MenuCortesOptions === true ? this.MenuCortesOptions = false : null;
    this.MenuOperacionesOptions === true ? this.MenuOperacionesOptions = false : null;
    this.MenuFajillasOptions === true ? this.MenuFajillasOptions = false : null;

    // Sockets
    if( this.cardSeleccionado > 0 ) this.socketMultiusuario.deseleccionarHabitacion(this.cardSeleccionado);
    this.cardSeleccionado = 0;
    this.habitacionSeleccionada = 0;
    sessionStorage.numHabitacion = '';
    sessionStorage.idHabitacion = '';
  }

  EvaluaHabitacion(el: any) {
    this.rentConfirmed = false;
    if (el.estado == 1 || el.estado == 14 || el.estado == 6) {
      this.PreparaHabitacion(el.id, el.habitacionElectron);
    }
    else if (el.estado == 3 || el.estado == 2) {
      this.OpenModalHabitacion(el);
    }
  }

  toggleMenuCortes( event )
  { 
    this[event] = true;
  }

  PrepararHabitacion(el: any) {
    this.rentConfirmed = false;
    this.count = this.count + 1;

    if (this.count == 1) {
      this.PreparaHabitacion(el.id, el.habitacionElectron);
      this.count = 0;
    }
    else {
      this.OpenModalHabitacion(el);
    }
  }

  AgregarExtra(el: any) {
    this.DatosHabitacion = [el];
    this.habilitarBotonesXCobrar = true;
    if (el.estado == 7) {
      this.contPersonasExtra = 0;
      this.contHorasExtra = 0;
      this.contHospedajeExtra = 0;
      this.habitacionPorCobrar(el.id, el.habitacionElectron);
      //$('#formaExtra').attr('disabled', false);
    }
    this.DatosHabitacion = [el];
    this.habilitarBotonesXCobrar = true;
  }

  Mantenimiento(el: any){
    this.DatosHabitacion = [el];
    $('#enviarMantenimiento').modal('toggle');
  }

  TerminarMantenimiento(el: any){
    this.DatosHabitacion = [el];
    this.numeroHabitacion = el.habitacionElectron;
    $('#terminarMantenimiento').modal('toggle');
  }

  HistorialMantenimiento(el: any){
    this.arrayHistMato = [];
    this.arrayHistMato.length = 0;

    this.DatosHabitacion = [el];
    $('#historialMantenimiento').modal('toggle');
    //buscamos el historial de mto de la habitacion
    this.incioService.HistorialMantenimiento(el.id).toPromise().then((response:any)=>{
      if(response.status == 200){
        this.arrayHistMato = response.body;
      }else{
        this.arrayHistMato = [];
        this.arrayHistMato = [{}];
      }
    }).catch((response:any) => {
      this.arrayHistMato = [];
    })

  }

  EnviarLimpieza(el: any, numeroCiclo:number, tipoNormalManto:string, supervisorValidar:boolean){
    // this.habitacion.idHabitacion = el.id;
    // this.habitacion.numeroHabitacion = el.habitacionElectron;
    this.idHabitacion = el.id;
    this.tipoNormalManto = tipoNormalManto;
    this.supervisorValidar = supervisorValidar;
    $('#enviarLimpieza').modal('toggle');

    if(numeroCiclo == 1){
      $("#limpieza_normal").prop( "disabled", false );
      $("#limpieza_detallada").prop( "disabled", false );
      $("#limpieza_retoque").prop( "disabled", true );
      $("#limpieza_rapida").prop( "disabled", true );
    }else if(numeroCiclo == 2){
      $("#limpieza_normal").prop( "disabled", true );
      $("#limpieza_detallada").prop( "disabled", true );
      $("#limpieza_retoque").prop( "disabled", false );
      $("#limpieza_rapida").prop( "disabled", false );
    }else if(numeroCiclo == 3){
      $("#limpieza_normal").prop( "disabled", true );
      $("#limpieza_detallada").prop( "disabled", true );
      $("#limpieza_retoque").prop( "disabled", true );
      $("#limpieza_rapida").prop( "disabled", false );
    }else if(numeroCiclo == 4){
      $("#limpieza_normal").prop( "disabled", true );
      $("#limpieza_detallada").prop( "disabled", true );
      $("#limpieza_retoque").prop( "disabled", false );
      $("#limpieza_rapida").prop( "disabled", true );
    }

  }

  TerminarMantenimientoExito(idHabitacion: number){
    $('#terminarMantenimiento').modal('toggle');

    let finalizarMto = {
      "IdHabitacion": idHabitacion,
      "User":this.userTemp
    }

    this.incioService.FinalizarMantenimiento(finalizarMto).toPromise().then((response:any)=>{
      if(response.status == 200){
        // Socket
        this.ActualizaHabitaciones(idHabitacion);
      }else{
        this.errorHabitacionTerminada = response.statusText;
        $('#salirModalError').modal('toggle');
      }
    }).catch((response:any) => {
      this.errorHabitacionTerminada = response.error;
      $('#salirModalError').modal('toggle');
    })
  }

  EnviarSupervision(el:any, tipoSupervisor: string){
    this.DatosHabitacion = [el];
    this.idHabitacion = el.id;
    this.tipoEnvioSupervisor = tipoSupervisor;
    $('#enviarSupervision').modal('show');
  }

  LiberarHabitacion(el){
    this.DatosHabitacion = [el];
    this.idHabitacion = el.id;
    this.numeroHabitacion = el.habitacionElectron;
    this.tipoLiberacion = "normal";
    $('#liberarHabitacion').modal('toggle');
  }

  LiberarHabitacionMto(el){
    this.DatosHabitacion = [el];
    this.idHabitacion = el.id;
    this.numeroHabitacion = el.habitacionElectron;
    this.tipoLiberacion = "mantenimiento";
    $('#liberarHabitacion').modal('toggle');
  }

  camaristaEnTurno(el){
    this.DatosHabitacion = [el];
    this.idHabitacion = el.id;
    this.numeroHabitacion = el.habitacionElectron;
    $('#camaristaEnTurno').modal('toggle');
  }

  CambiarCamaristaLimpieza(el){
    this.DatosHabitacion = [el];
    this.idHabitacion = el.id;
    this.numeroHabitacion = el.habitacionElectron;
    this.tipoNormalManto = "normal";
    $('#enviarLimpieza').modal('toggle');
    $("#limpieza_normal").prop( "disabled", true );
    $("#limpieza_detallada").prop( "disabled", true );
    $("#limpieza_retoque").prop( "disabled", false );
  }

  CambiarSupervisorLimpieza(el:any, tipoSupervisor: string){
    this.DatosHabitacion = [el];
    this.idHabitacion = el.id;
    this.numeroHabitacion = el.habitacionElectron;
    this.tipoEnvioSupervisor = tipoSupervisor;
    $('#enviarSupervision').modal('toggle');
  }

  ValidarCamposMantenimiento(el: any){
    let detalles = $('#detalles_mantenimiento').val();
    detalles = detalles.trim();
    if(detalles.length >= 1 && detalles != "Escribe alguna observación para poder continuar" && detalles != "Escribe Alguna Observación Para Poder Continuar" ){
      //radio seleccionado
      let radio_value = $('input:radio[name=radio_mto]:checked').val()

      //consumir el api para realizar el cambio a estado de mantenimiento
      if(radio_value != undefined && radio_value > 0){
        let mantenimiento = {
          "IdHabitacion":el.id,
          "IdConceptoMantenimiento":radio_value,
          "Descripion":detalles,
          "user":this.userTemp
        }

        this.incioService.CrearMantenimiento(mantenimiento).toPromise().then((response:any)=>{
          if(response.status == 200){
            // Socket
            this.ActualizaHabitaciones( el.id );
          }else{
            this.errorHabitacionTerminada = response.statusText;
            $('#salirModalError').modal('toggle');
          }
        }).catch((response:any) => {
          this.errorHabitacionTerminada = response.error;
          $('#salirModalError').modal('toggle');
        })
      }else{
        $('#error_radio').text('Selecciona una opcion')
      }
    }else{
      $('#detalles_mantenimiento').css("background-color", "white");
      $('#detalles_mantenimiento').addClass('borde-fail');
      $('#detalles_mantenimiento').attr("placeholder", "Escribe alguna observación para poder continuar");
      $('#detalles_mantenimiento').addClass('placeholder-textarea-red');
    }
  }

  BloquearHabitacion(el: any) {
    $('#detalles_bloqueo').val('');
    $('#bloqueo_fallo').text('');
    this.numeroHabitacion = el.habitacionElectron;
    this.tipoHabitacion = el.tipo;
    $('#bloqueoHabitacion').modal('toggle');
    this.DatosHabitacion = [el];
  }

  CancelarBloquearHabitacion(el: any){
    this.numeroHabitacion = el.habitacionElectron;
    $('#cancelarBloqueoHabitacion').modal('toggle');
    this.DatosHabitacion = [el];
    this.numeroHabitacion = el.habitacionElectron;
  }

  OpenCancelacionModal(el: any) {
    this.rentConfirmed = false;
    this.habitacionCancelID = el.id;
    this.habitacionCancelNum = el.habitacionElectron;
    $('#CancelaEntradaModal').modal('toggle');
  }

  OpenModalHabitacion(el: any) {

    this.ResetRenta();
    this.ResetTarifa();

   // $("#matricula").inputmask("XXX-XXX");
    var estadoHabitacion = el.NombreEstado;
    this.estadoXcobrar = estadoHabitacion;
    if(estadoHabitacion == "Por Cobrar"){
      this.habitacionPorCobrar(el.id, el.habitacionElectron);
    }else{
      this.renta.TipoEstancia = 2;
      this.ObtenerTarifas(el.id);
      $('#habitacionModal').modal('toggle');
    }
    this.rentConfirmed = false;
    this.DatosHabitacion = [el];
  }

  habitacionPorCobrar(idHabitacion, numHabitacion){
    $("[id*='TarifaHabitaciones2']").val('');
    $("[id*='TarifaPersonasExtra2']").val('');
    $("[id*='TarifaHospedaje2']").val('');
    $("[id*='TarifaHorasExtra2']").val('');

    this.incioService.ObtenerDetalleHabitacionPorCobrar(idHabitacion, numHabitacion).toPromise().then((response:any)=>{
      //Asignando respuesta de la api a objeto
      this.datosHPorCobrar = response.body;

      if(this.datosHPorCobrar.porCobrar == null){

      //Abriendo Modal por cobrar
      $('#modalPorCobrar').modal('toggle');
      if(this.habilitarBotonesXCobrar){
        $("[id*='TarifaHabitaciones2']").val();
        $("[id*='TarifaPersonasExtra2']").val();
        $("[id*='TarifaHospedaje2']").val();
        $("[id*='TarifaHorasExtra2']").val();
      }else{
        $("[id*='TarifaHabitaciones2']").val(this.datosHPorCobrar.precioHabitacion.toFixed(2));
        $("[id*='TarifaPersonasExtra2']").val(this.datosHPorCobrar.totalPrecioPersonasExtras.toFixed(2));
        $("[id*='TarifaHospedaje2']").val(this.datosHPorCobrar.totalHospedajeExtra.toFixed(2));
        $("[id*='TarifaHorasExtra2']").val(this.datosHPorCobrar.totalHoraExtra.toFixed(2));
      }

      //asignacion de valores
      $('#estancia option:eq('+ this.datosHPorCobrar.idTipoTarifa +')').prop('selected', true)
      this.inicioBehaviors.setPersonasExtra(this.datosHPorCobrar.personasExtras)
      this.inicioBehaviors.setHorasExtra(this.datosHPorCobrar.horasExtra);
      this.inicioBehaviors.setHospedaje(this.datosHPorCobrar.hospedajeExtra);

      //Validando si viene a pie
      this.APieXCobrar = this.datosHPorCobrar.matricula == 'A PIE' || this.datosHPorCobrar.matricula == "" ? true: false;

      //Enviando valores a inputs
      if(!this.APieXCobrar ){
        $("[id*='matricula2']").val(this.datosHPorCobrar.matricula);
        $("[id*='marca2']").val(this.datosHPorCobrar.marca);
        $("[id*='modelo2']").val(this.datosHPorCobrar.modelo);
        $("[id*='color2']").val(this.datosHPorCobrar.color);
      }

      //Valor de entrada total
      if(this.habilitarBotonesXCobrar){
        this.TotalXCobrar = 0.0
      }else{
        this.TotalXCobrar = this.datosHPorCobrar.precioHabitacion +
                            this.datosHPorCobrar.totalPrecioPersonasExtras +
                            this.datosHPorCobrar.totalHospedajeExtra +
                            this.datosHPorCobrar.totalHoraExtra;
      }

      }
      else{
          //Abriendo Modal por cobrar
          $('#modalPorCobrar').modal('toggle');
          if(this.habilitarBotonesXCobrar){
            $("[id*='TarifaHabitaciones2']").val('');
            $("[id*='TarifaPersonasExtra2']").val('');
            $("[id*='TarifaHospedaje2']").val('');
            $("[id*='TarifaHorasExtra2']").val('');
          }else{
            $("[id*='TarifaHabitaciones2']").val(this.datosHPorCobrar.porCobrar.precioHabitacion.toFixed(2));
            $("[id*='TarifaPersonasExtra2']").val(this.datosHPorCobrar.porCobrar.totalPrecioPersonasExtras.toFixed(2));
            $("[id*='TarifaHospedaje2']").val(this.datosHPorCobrar.porCobrar.totalHospedajeExtra.toFixed(2));
            $("[id*='TarifaHorasExtra2']").val(this.datosHPorCobrar.porCobrar.totalHoraExtra.toFixed(2));
          }

          //Validando si viene a pie
          this.APieXCobrar = this.datosHPorCobrar.matricula == 'A PIE' || this.datosHPorCobrar.matricula == "" ? true: false;

          //Enviando valores a inputs
          if(!this.APieXCobrar ){
            $("[id*='matricula2']").val(this.datosHPorCobrar.matricula);
            $("[id*='marca2']").val(this.datosHPorCobrar.marca);
            $("[id*='modelo2']").val(this.datosHPorCobrar.modelo);
            $("[id*='color2']").val(this.datosHPorCobrar.color);
          }

          this.TotalXCobrar = this.datosHPorCobrar.porCobrar.precioHabitacion +
                            this.datosHPorCobrar.porCobrar.totalPrecioPersonasExtras +
                            this.datosHPorCobrar.porCobrar.totalHospedajeExtra +
                            this.datosHPorCobrar.porCobrar.totalHoraExtra;
      }
    })
  }

  clickExtra(opt, substract = false, tiempoExtra?: boolean) {
    if (this.renta.TipoEstancia != 0) {

      switch (opt) {
        case 1:
          this.renta.CantidadpersonasExtra = this.inicioBehaviors.addPersonaExtra(substract);
          this.renta.TotalTarifaPersonasExtra = this.renta.CantidadpersonasExtra * this.renta.TarifaPersonasExtra;
          this.tPersonasExtra = (this.renta.TotalTarifaPersonasExtra).toFixed(2);
          break;

      case 2:
        this.renta.CantidadHospedajeExtra = this.inicioBehaviors.addHospedaje(substract);
        this.renta.TotalHospedajeExtra = this.renta.CantidadHospedajeExtra * this.renta.TarifaHabitaciones;
        this.tNochesExtra = (this.renta.TotalHospedajeExtra).toFixed(2);
        break;

        case 3:
          if (tiempoExtra) {
            this.renta.CantidadHorasExtras = 0;
            this.renta.CantidadHorasExtras = this.inicioBehaviors.addHorasExtra(substract);
            this.renta.TotalHorasExtra = this.renta.CantidadHorasExtras * this.renta.TarifaHorasExtra;
            this.tHorasExtra = (this.renta.TotalHorasExtra).toFixed(2);
          }
          break;
      }
      this.renta.Total = this.renta.TarifaHabitaciones + this.renta.TotalTarifaPersonasExtra + this.renta.TotalHospedajeExtra + this.renta.TotalHorasExtra;
    }
  }

  clickExtraXCobrar(opt, substract = false, tiempoExtra?: boolean) {
    if (this.datosHPorCobrar.idTipoTarifa  != 0) {
      //verificamos si es la funcion agregar extras
      if(this.habilitarBotonesXCobrar){
        switch (opt) {
          case 1:
            //contador para perosnas extra no pagadas
            if(substract){
              this.contPersonasExtra --;
            }else{
              this.contPersonasExtra ++;
            }
            this.datosHPorCobrar.personasExtras = this.inicioBehaviors.addPersonaExtra(substract);
            this.datosHPorCobrar.totalPrecioPersonasExtras = this.contPersonasExtra * this.datosHPorCobrar.precioPersonaExtra;
            this.tPersonasExtra = (this.datosHPorCobrar.totalPrecioPersonasExtras).toFixed(2);
            break;

          case 2:
            //contador para horas extra no pagadas
            if(substract){
              this.contHorasExtra --;
            }else{
              this.contHorasExtra ++;
            }

            this.datosHPorCobrar.hospedajeExtra = this.inicioBehaviors.addHospedaje(substract);
            this.datosHPorCobrar.totalHospedajeExtra = this.contHorasExtra  * this.datosHPorCobrar.precioHabitacion;
            this.tNochesExtra = (this.datosHPorCobrar.totalHospedajeExtra).toFixed(2);
            break;

          case 3:
            //contador para hospedaje extra no pagadas
            if (tiempoExtra) {
              if(substract){
                this.contHospedajeExtra --;
              }else{
                this.contHospedajeExtra ++;
              }

              this.datosHPorCobrar.horasExtra = this.inicioBehaviors.addHorasExtra(substract);
              this.datosHPorCobrar.totalHoraExtra = this.contHospedajeExtra  * this.datosHPorCobrar.precioHoraExtra;
              this.tHorasExtra = (this.datosHPorCobrar.totalHoraExtra).toFixed(2);
            }

            break;
        }

        let sP = this.tPersonasExtra.length == 0 ? "0.0" : this.tPersonasExtra;
        let sN = this.tNochesExtra.length == 0 ? "0.0" : this.tNochesExtra;
        let sH = this.tHorasExtra.length == 0 ? "0.0" : this.tHorasExtra;
        this.TotalXCobrar =  parseFloat(sP) + parseFloat(sN) + parseFloat(sH);

      }else{
        switch (opt) {
          case 1:
            this.datosHPorCobrar.personasExtras = this.inicioBehaviors.addPersonaExtra(substract);
            this.datosHPorCobrar.totalPrecioPersonasExtras = this.datosHPorCobrar.personasExtras * this.datosHPorCobrar.precioPersonaExtra;
            this.tPersonasExtra = (this.datosHPorCobrar.totalPrecioPersonasExtras).toFixed(2);
            break;

        case 2:
          this.datosHPorCobrar.hospedajeExtra = this.inicioBehaviors.addHospedaje(substract);
          this.datosHPorCobrar.totalHospedajeExtra = this.datosHPorCobrar.hospedajeExtra  * this.datosHPorCobrar.precioHabitacion;
          this.tNochesExtra = (this.datosHPorCobrar.totalHospedajeExtra).toFixed(2);
          break;

          case 3:
            if (tiempoExtra) {
              //this.renta.CantidadHorasExtras = 0;
              this.datosHPorCobrar.horasExtra = this.inicioBehaviors.addHorasExtra(substract);
              this.datosHPorCobrar.totalHoraExtra = this.datosHPorCobrar.horasExtra  * this.datosHPorCobrar.precioHoraExtra;
              this.tHorasExtra = (this.datosHPorCobrar.totalHoraExtra).toFixed(2);
            }
            break;
        }
        this.TotalXCobrar = this.TotalXCobrar = this.datosHPorCobrar.precioHabitacion +
                            this.datosHPorCobrar.totalPrecioPersonasExtras +
                            this.datosHPorCobrar.totalHospedajeExtra +
                            this.datosHPorCobrar.totalHoraExtra;
      }
    }
  }

 OpenConfirmFormaPago(formulario : NgForm) {
  if(!formulario.valid){
    Object.values(formulario.controls).forEach(control=>{
      control.markAsTouched();
    });
  }
  else
  {
    this.ResetDatosPago();
    $('#confirmModal').modal('toggle');
  }
}

AplicarRentaHabitacion(formulario : NgForm){

  if(!formulario.valid){

    Object.values(formulario.controls).forEach(control=>{
      control.markAsTouched();
    });
  } else {
   this.renta.Subtotal=this.renta.Total ? this.renta.Total:0;

      this.renta.MontoTarjetaMixto=  this.renta.MontoTarjetaMixto==null ? this.renta.MontoTarjetaMixto=0 : this.renta.MontoTarjetaMixto;
      this.renta.MontoEfectivoMixto= this.renta.MontoEfectivoMixto==null ? this.renta.MontoEfectivoMixto=0 : this.renta.MontoEfectivoMixto;
      this.renta.propina= this.renta.propina==null ? this.renta.propina=0 : this.renta.propina;

      this.renta.credencial.IdentificadorUsuario=null;
      this.renta.credencial.TipoCredencial=1;
      this.renta.credencial.ValorVerificarStr=null;
      this.renta.credencial.ValorVerificarBin=null;
      this.renta.user = this.userTemp;
     //si es pago con TDC o mixto
    if(this.renta.TipoPago == 2 || this.renta.TipoPago == 9 )
    {
      if (this.renta.TipoTarjeta != 0) {
        this.mensajeError ='';

        //deshabilita botones
        $("[id*='btnExitFormaPago']").attr('disabled', 'disabled');
        $("[id*='btnOkFormaPago']").attr('disabled', 'disabled');
         //deshabilitacontroles
        $("[id*='tipoTDC']").attr('disabled', 'disabled');
        $("[id*='numTarjeta']").attr('disabled', 'disabled');
        $("[id*='numAppTDC']").attr('disabled', 'disabled');
        $("[id*='propTarjeta']").attr('disabled', 'disabled');

        $("[id*='tipoTDCmixto']").attr('disabled', 'disabled');
        $("[id*='numTarjetaMixto']").attr('disabled', 'disabled');
        $("[id*='NumAppMixto']").attr('disabled', 'disabled');
        $("[id*='montoTarjetaMixto']").attr('disabled', 'disabled');
        $("[id*='montoEfectivoMixto']").attr('disabled', 'disabled');
        $("[id*='propinaTDCMixto']").attr('disabled', 'disabled');
        $("[id*='loader-skeleton']").modal('toggle');
        this.RentaHabitacion(this.renta);
      }
      else
        this.mensajeError = 'Falta seleccionar tipo de Tarjeta';
    }
    else{
      //deshabilita botones
      $("[id*='btnExitFormaPago']").attr('disabled', 'disabled');
      $("[id*='btnOkFormaPago']").attr('disabled', 'disabled');
      //deshabilitacontroles
      $("[id*='numT']").attr('disabled', 'disabled');
      $("[id*='loader-skeleton']").modal('toggle');
        this.RentaHabitacion(this.renta);
    }
  }
}

  ValidaRentaAplicada(response: any) {
    if (response.success == true || response.ok == true) {
      this.rentConfirmed = !this.rentConfirmed;
      // this.ResetRenta();
      // this.HabitacionesResumen();

      // Socket
      this.habitacionesSocket.actualizarHabitacion();
    } else {
      if( response.errorException.message == 'renta_fuera_de_horario_excepcion') {
        this.errorRentaHabitacion = 'Renta fuera de horario'
      }else{
        this.errorRentaHabitacion = response.errorException.message;
      }
      this.ResetRenta();
      $('#confirmModal').modal('hide');
      $('#errorModal').modal('toggle');
    }

    setTimeout(() => {
      $("[id*='loader-skeleton']").modal('hide');
    }, 500);
  }

  SaleRentaHabitacionModal(){
    this.ResetRenta();
    this.ResetTarifa();
    this.ResetPropExtra_Habitacion();
  }

  SaleTipoPagoModal(formulario : NgForm){

    Object.values(formulario.controls).forEach(control=>{
    if(control.status=="INVALID")
      control.setValue({ valid: true,value:control.value});

      // if(control.touched==true)
      //   control.setValue({ touched:false});

    });
    $('#confirmModal').modal('hide');

  }

  ActualizaHabitaciones( habitacion: number = 0) {
    // Sockets
    this.habitacionesSocket.actualizarHabitacion();
    $('.modal').modal('hide');
    if( habitacion > 0){
      this.HabitacionesResumen( habitacion );
    } else if( this.idHabitacion > 0 ) {
      this.HabitacionesResumen( this.idHabitacion );
    } else {
      this.HabitacionesResumen();
    }
  }

  VerDetalle(id: number, numeroHabitacion: number) {
    $('.modal').modal('hide');
      this.ResetRenta();
      this.HabitacionesResumen(id);
    // this.ResetGruposHabitaciones();
    // this.ResetGruposHabitaAlertas();
  }


  VerDetalleRoomService() {
    this.datoRoomService.id=sessionStorage.idHabitacion;
    this.datoRoomService.numero=sessionStorage.numHabitacion;
    $('.modal').modal('hide');

    this.HabitacionesResumen( this.datoRoomService.id );

    /* sessionStorage.removeItem('idHabitacion');
    sessionStorage.removeItem('numHabitacion'); */
  }

  SalidaHabitacion(id: number, numeroHabitacion: number) {
    //validamos si existen pendientes para pagar la habitacion
    this.incioService.ValidarFinalizarRenta(id).toPromise().then((response:any)=>{
      if(response.status == 200){
        this.salidaId = id;
        this.salidaNumeroH = numeroHabitacion;
        $('#salirModal').modal('toggle');
      }
    }).catch((response:any) => {
      this.errorHabitacionTerminada = response.error;
      $('#salirModalError').modal('toggle');
    })
  }


  RedirectHuella(){
    $('#salirModal').modal('toggle');
  }

  ValidaMatricula(response: any, formulario: NgForm) {
        $('#validacionReporte').text('');
        let respuesta = response;
        this.existeReporteVinculado = respuesta.result;
        //si hay reportes vinculados
        if(this.existeReporteVinculado){
          this.reportesHabilitados = respuesta.result.reportesHabilidatdos;
          this.reportesInhabilitados = respuesta.result.reportesInhabilidatdos;
          if(this.reportesHabilitados > 0){
            $('#validacionReporte').text('No hay');
            $('#validaMatriculaModal').modal('toggle')
          }else{
            $('#validacionReporte').text('Hay');
            $('#reporInhabilitadoModal').modal('toggle');
          }
        }else{
          if(this.CobrarHabitaciones){

            this.OpenConfirmFormaPago(formulario);

          }else{
            this.AplicarRentaHabitacion(formulario);

            $('#rentConfirmedModal').modal('toggle');
          }
        }
    }

    SaleReporteInhabilitadoModal(){
      this.ResetRenta();
      this.ResetTarifa();

      $('#habitacionModal').modal('show');
    }

  DefinirEdoRoomService(){
    this.datoRoomService.id=sessionStorage.idHabitacion;
    this.datoRoomService.numero=sessionStorage.numHabitacion;
  }
  //////////// VALIDADORES DE INPUTS//////////////


  ValidateCreditCardNumber() {

    var ccNum=this.renta.NumeroTarjeta;
    var regEntero =/^\d+$/;
    var visaRegEx = /^(?:4[0-9]{12}(?:[0-9]{3})?)$/;
    var mastercardRegEx = /^(?:5[1-5][0-9]{14})$/;
    var amexpRegEx = /^(?:3[47][0-9]{13})$/;
    var discovRegEx = /^(?:6(?:011|5[0-9][0-9])[0-9]{12})$/;
    var isValid = false;

    if (regEntero.test(ccNum)) {
      if (visaRegEx.test(ccNum)) {
        isValid = true;
        this.renta.TipoTarjeta = 1;
        (document.querySelector('.fa-cc-visa')as HTMLElement).style.color="green";
      } else if(mastercardRegEx.test(ccNum)) {
        isValid = true;
        this.renta.TipoTarjeta = 2;
        (document.querySelector('.fa-cc-mastercard')as HTMLElement).style.color="green";
      } else if(amexpRegEx.test(ccNum)) {
        isValid = true;
        this.renta.TipoTarjeta = 3;
        (document.querySelector('.fa-cc-amex')as HTMLElement).style.color="green";
      } else if(discovRegEx.test(ccNum)) {
        isValid = true;
        this.renta.TipoTarjeta = 0;
      }

      if(!isValid) {
        (document.querySelector('.fa-cc-visa')as HTMLElement).style.color="black";
        (document.querySelector('.fa-cc-mastercard')as HTMLElement).style.color="black";
        (document.querySelector('.fa-cc-amex') as HTMLElement).style.color = "black";
        this.renta.TipoTarjeta = 0;
        this.renta.NumeroTarjeta='';
        this.mensajeError='El número de tarjeta es invalido';
      }
    }
    else{
      this.renta.NumeroTarjeta='';
      this.mensajeError='Ingrese un número de tarjeta';
    }
  }

  ValidarNumMatricula(matricula:string){

    // let regMatricula=/^[A-Za-z0-9\s]+$/g;
    // let res=regMatricula.test(matricula);
    let patt= new RegExp( /^[A-Za-z0-9]+$/,'');
    let valida=patt.test(matricula);
    this.renta.AutoMatricula= valida==true ? matricula : matricula.substring(0,matricula.length-1);

    // if (!res || matricula.length<5) {
    //   this.mensajeError='La matricula no es válida';
    // }
  }

  ValidaEnteros(event:any ){
    let valor=event.target.value;
    let Entero=valor.replace(/[^\d]*/g,'');
    event.target.value=Entero;

  }

  ValidaNumTransferencia(event: any){

    let valor=event.target.value;
    let patt= new RegExp(/^[A-Za-z0-9\s]+$/g,'');
    let valida=patt.test(valor);
    let numTransferencia= valida==true ? valor : valor.substring(0,valor.length-1);
    event.target.value=numTransferencia;
  }



  MascaraDecimal(event: any) {

    let valor = event.target.value.toString();
    // var pattern = /^(0|[1-9][0-9]{0,2}(?:(,[0-9]{3})|[0-9]))(\.[0-9]{0,2}){0,1}$/;
    // this.mensajeError = '';

    // if(valor.includes(0) && valor.length==2){
    //   valor = valor.replace(/^(0+)/g, '');
    // }

    // if(!valor.includes('.')) {
    //   valor=valor.replace(/\D/g, "")
    //   .replace(/(^[0-9$])([.][0-9.]{3})$/, '$1,$2')
    //   .replace(/\B(?=(\d{3})+(?!\d)\.?)/g, ",");
    // } else {
    //   let res = pattern.test(valor);
    //   !res ? valor = valor.substring(0,valor.length -1): valor = valor;
    //   !res ? this.mensajeError = 'Solo se permiten 2 decimales.': this.mensajeError='';
    // }

    this.renta.propina = valor.replace(/,/g, "");
    event.target.value = valor;

  }

  MascaraDecimalesPropinas(event:any){
    let valor=event.target.value.toString();
    valor=valor.replace('$','');

    if(valor.includes(0) && valor.length==2){
      valor = valor.replace(/^(0+)/g, '');
    }

    var expreRegular = new RegExp("^[0-9]+([.][0-9]{1,2})?$");
    var exRegular = new RegExp("^[0-9]+([.][0-9]{3,100})?$");
    var exRegularTodo  = new RegExp("(^[a-z]|[A-Z])|([0-9][a-z][A-Z])");

    this.mensajeError='';

    if(!expreRegular.test(valor)){

        if(exRegular.test(valor))
          event.target.value=0

      this.mensajeError='Formato Incorrecto maximo son 2 decimales';
    }

    if(exRegularTodo.test(valor))
    {
      event.target.value = '';
      this.mensajeError='Formato Incorrecto solo se puede tener digitos';
    }
    event.target.value='$'+valor;
  }

  MascaraDecimalMixto(event:any){

    let valor = event.target.value.toString();
    let valornumerico  = event.target.value;
    let idControl=event.target.id;
    var pattern = /^(0|[1-9][0-9]{0,2}(?:(,[0-9]{3})|[0-9]))(\.[0-9]{0,2}){0,1}$/;
    this.mensajeError = '';

    if(valor.includes(0) && valor.length==2){
      valor = valor.replace(/^(0+)/g, '');
    }

    if(!valor.includes('.')) {
      valor=valor.replace(/\D/g, "")
      .replace(/(^[0-9$])([.][0-9.]{3})$/, '$1,$2')
      .replace(/\B(?=(\d{3})+(?!\d)\.?)/g, ",");
    } else {
      let res = pattern.test(valor);
      !res ? valor = valor.substring(0,valor.length -1): valor = valor;
      !res ? this.mensajeError = 'Solo se permiten 2 decimales.': this.mensajeError='';
    }

    this.cantidad=valornumerico;

    if(this.cantidad<this.renta.Total){
      if(this.renta.TipoPago==9){
        if(idControl=='montoTarjetaMixto'){

          let total=this.renta.Total;
          let montoT=total-this.cantidad;
          let valMath=Math.round(montoT*100)/100;
          let valMathCantidad=Math.round(this.cantidad*100)/100;
          this.renta.MontoEfectivoMixto=valMath;
          this.renta.MontoTarjetaMixto=valMathCantidad;

        }
        else if(idControl=='montoEfectivoMixto'){


          let total=this.renta.Total;
          let montoT=total-this.cantidad;
          this.renta.MontoTarjetaMixto=Math.round(montoT*100)/100;
          this.renta.MontoEfectivoMixto= Math.round(this.cantidad*100)/100;
        }
        // else if(idControl=='propinaTDCMixto'){

        //   this.renta.propina=this.cantidad;
        // }
      }
      // else if(this.renta.TipoPago==2 && idControl=='propinaTDCMixto'){
      //   this.renta.propina=this.cantidad;
      // }

    }else{

      if(idControl=='montoTarjetaMixto')
      this.mensajeError='El monto en Tarjeta sobrepasa el Importe total';

      if(idControl=='montoEfectivoMixto')
        this.mensajeError='El monto en efectivo sobrepasa el Importe total';
    }
    event.target.value=this.cantidad;
  }

  MascaraDecimalesMixto(event:any){
    let valor=event.target.value.toString();
    let idControl=event.target.id;

    this.cantidad = valor;

    var expreRegular = new RegExp("^[0-9]+([.][0-9]{1,2})?$");
    var exRegular = new RegExp("^[0-9]+([.][0-9]{3,100})?$");
    var exRegularTodo  = new RegExp("(^[a-z]|[A-Z])|([0-9][a-z][A-Z])");

    this.mensajeError='';

    if(!expreRegular.test(valor)){

        if(exRegular.test(valor))
          event.target.value=0

      this.mensajeError='Formato Incorrecto maximo son 2 decimales';
    }

    if(exRegularTodo.test(valor))
    {
      event.target.value = '';
      this.mensajeError='Formato Incorrecto solo se puede tener digitos';
    }

      if(this.cantidad<this.renta.Total){
        if(this.renta.TipoPago==9){
          if(idControl=='montoTarjeta'){

            let total=this.renta.Total;
            let montoT=total-this.cantidad;
            this.renta.MontoEfectivoMixto=montoT;
            this.renta.MontoTarjetaMixto=this.cantidad;
          }
          else if(idControl=='montoEfectivo'){

            let total=this.renta.Total;
            let montoT=total-this.cantidad;
            this.renta.MontoTarjetaMixto=montoT;
            this.renta.MontoEfectivoMixto=this.cantidad;
          }
          else if(idControl=='propinaTDC'){
            this.renta.propina=this.cantidad;
          }
        }
        else if(idControl=='propTarjeta'){
          this.renta.propina=this.cantidad;
        }
        event.target.value=this.cantidad;
      }else{

        if(idControl=='montoTarjeta')
        this.mensajeError='El monto en Tarjeta sobrepasa el Importe total';

        if(idControl=='montoEfectivo')
          this.mensajeError='El monto en efectivo sobrepasa el Importe total';
      }
  }

  cancelarPendiente(){
    $('#CancelarPendienteModal').modal('toggle');
  }

  AplicarRentaHabitacionXCobrar(formulario : NgForm){

  let model = {
    idHabitacion:0,
    propina:null,
    idEmpleadoPropina: null,
    informacionPagos:
        [{
          Valor:0,
          TipoPago:1
        }],
    user:this.userTemp
  }

  let modelTarjeta = {
    idHabitacion:0,
    idEmpleadoPropina: this.idUsuario,
    informacionPagos:
        [{
          Valor:0,
          TipoPago:0,
          NumeroTarjeta:"",
          Referencia:"",
          Tipotarjeta:0,
          propina:0
        }],
    user:this.userTemp
  }

  let modelTransferencia = {
    idHabitacion:0,
    informacionPagos:
        [{
          Valor:0,
          TipoPago:0,
          Referencia:""
        }],
    user:this.userTemp
  }

  let modelCortesia = {
      idHabitacion:0,
        informacionPagos:
          [{
            Valor:0,
            TipoPago:0,
            Referencia:""
          }],
        credenciales:
        {
            TipoCredencial: 0,
            IdentificadorUsuario:"",
            ValorVerificarStr:"",
            ValorVerificarBin:null
        },
      user:this.userTemp
  }

  let modelMixto = {
    idHabitacion:0,
      informacionPagos: [],
      credenciales:
        {
          TipoCredencial: 0,
          IdentificadorUsuario:"",
          ValorVerificarStr:"",
          ValorVerificarBin:null
        },
      user:this.userTemp
  }

  let modelInterno = {
    idHabitacion:0,
      informacionPagos:
        [{
          Valor:0,
          TipoPago:0
        }],
      consumo:{
        idEmpleadoConsume:"",
        Motivo:""
      },
      credenciales:
        {
          TipoCredencial: 0,
          IdentificadorUsuario:"",
          ValorVerificarStr:"",
          ValorVerificarBin:null
        },
      user:this.userTemp
  }

  if(!formulario.valid){

    Object.values(formulario.controls).forEach(control=>{
      control.markAsTouched();
    });
  }
  else
  {

   this.renta.Subtotal=this.TotalXCobrar ? this.TotalXCobrar:0;

      this.renta.MontoTarjetaMixto=  this.renta.MontoTarjetaMixto==null ? this.renta.MontoTarjetaMixto=0 : this.renta.MontoTarjetaMixto;
      this.renta.MontoEfectivoMixto= this.renta.MontoEfectivoMixto==null ? this.renta.MontoEfectivoMixto=0 : this.renta.MontoEfectivoMixto;
      this.renta.propina= this.renta.propina==null ? this.renta.propina=0 : this.renta.propina;

      this.renta.credencial.IdentificadorUsuario=null;
      this.renta.credencial.TipoCredencial=1;
      this.renta.credencial.ValorVerificarStr=null;
      this.renta.credencial.ValorVerificarBin=null;

     //si es pago con TDC o mixto
    if(this.renta.TipoPago == 2 || this.renta.TipoPago == 9 )
    {
      if (this.renta.TipoTarjeta != 0) {
        this.mensajeError ='';

        //deshabilita botones
        $("[id*='btnExitFormaPago']").attr('disabled', 'disabled');
        $("[id*='btnOkFormaPago']").attr('disabled', 'disabled');
         //deshabilitacontroles
        $("[id*='tipoTDC']").attr('disabled', 'disabled');
        $("[id*='numTarjeta']").attr('disabled', 'disabled');
        $("[id*='numAppTDC']").attr('disabled', 'disabled');
        $("[id*='propTarjeta']").attr('disabled', 'disabled');

        $("[id*='tipoTDCmixto']").attr('disabled', 'disabled');
        $("[id*='numTarjetaMixto']").attr('disabled', 'disabled');
        $("[id*='NumAppMixto']").attr('disabled', 'disabled');
        $("[id*='montoTarjetaMixto']").attr('disabled', 'disabled');
        $("[id*='montoEfectivoMixto']").attr('disabled', 'disabled');
        $("[id*='propinaTDCMixto']").attr('disabled', 'disabled');
        $("[id*='loader-skeleton']").modal('toggle');

        if(this.renta.TipoPago == 2){//Pago con tarjeta
          modelTarjeta.idHabitacion = this.datosHPorCobrar.idHAbitacion;

          let modelinfoTar = {
          Valor: this.TotalXCobrar,
          TipoPago:this.renta.TipoPago,
          NumeroTarjeta:this.renta.NumeroTarjeta,
          Referencia:this.renta.Referencia,
          Tipotarjeta:this.renta.TipoTarjeta,
          propina:this.renta.propina
          }

          modelTarjeta.informacionPagos.pop();
          modelTarjeta.informacionPagos.push(modelinfoTar)
          this.RentaHabitacionXCobrar(modelTarjeta);
        }
        else if(this.renta.TipoPago == 9){//Pago mixto
          modelMixto.idHabitacion = this.datosHPorCobrar.idHAbitacion;

          let modelinfoMixtoE = {
            Valor: this.renta.MontoEfectivoMixto,
            TipoPago: 1,
          }

          modelMixto.informacionPagos.push(modelinfoMixtoE);

          let modelinfoMixtoT = {
            Valor: this.renta.MontoTarjetaMixto,
            TipoPago:2,
            Referencia:this.renta.Referencia,
            NumeroTarjeta:parseInt(this.renta.NumeroTarjeta),
            TipoTarjeta:this.renta.TipoTarjeta,
            propina:this.renta.propina
            }

          modelMixto.informacionPagos.push(modelinfoMixtoT);

          modelMixto.credenciales.IdentificadorUsuario = this.loginModel.identificadorUsuario;
          modelMixto.credenciales.TipoCredencial = this.loginModel.tipoCredencial;
          modelMixto.credenciales.ValorVerificarStr = this.loginModel.valorVerificarStr;
          this.RentaHabitacionXCobrar(modelMixto);
        }

      }
      else
        this.mensajeError = 'Falta seleccionar tipo de Tarjeta';
    } else {
      //deshabilita botones
      $("[id*='btnExitFormaPago']").attr('disabled', 'disabled');
      $("[id*='btnOkFormaPago']").attr('disabled', 'disabled');
      //deshabilitacontroles
      $("[id*='numT']").attr('disabled', 'disabled');
      $("[id*='loader-skeleton']").modal('toggle');

        if(this.renta.TipoPago == 1){//Pago en efectivo
          model.idHabitacion = this.datosHPorCobrar.idHAbitacion;
          let modelinfo = {
            Valor: this.TotalXCobrar,
            TipoPago:1
          }

          model.informacionPagos.pop();
          model.informacionPagos.push(modelinfo)
          this.RentaHabitacionXCobrar(model);
        } else if(this.renta.TipoPago == 8){//PAgo por transferencia
          modelTransferencia.idHabitacion = this.datosHPorCobrar.idHAbitacion;
          let modelinfoTrans = {
            Valor: this.TotalXCobrar,
            TipoPago:this.renta.TipoPago,
            Referencia:this.renta.Referencia
          }

          modelTransferencia.informacionPagos.pop();
          modelTransferencia.informacionPagos.push(modelinfoTrans)
          this.RentaHabitacionXCobrar(modelTransferencia);
        } else if(this.renta.TipoPago == 6){//Pago por cortesia
          modelCortesia.idHabitacion = this.datosHPorCobrar.idHAbitacion;
          modelCortesia.credenciales.IdentificadorUsuario = this.loginModel.identificadorUsuario;
          modelCortesia.credenciales.TipoCredencial = this.loginModel.tipoCredencial;
          modelCortesia.credenciales.ValorVerificarStr = this.loginModel.valorVerificarStr;

          let modelinfoCortesia = {
            Valor: this.TotalXCobrar,
            TipoPago:this.renta.TipoPago,
            Referencia:this.renta.Referencia
          }

          modelCortesia.informacionPagos.pop();
          modelCortesia.informacionPagos.push(modelinfoCortesia);
          this.RentaHabitacionXCobrar(modelCortesia);
        } else if(this.renta.TipoPago == 7){//Pago consumo interno
          modelInterno.idHabitacion = this.datosHPorCobrar.idHAbitacion;
          modelInterno.credenciales.IdentificadorUsuario = this.loginModel.identificadorUsuario;
          modelInterno.credenciales.TipoCredencial = this.loginModel.tipoCredencial;
          modelInterno.credenciales.ValorVerificarStr = this.loginModel.valorVerificarStr;
          modelInterno.consumo.Motivo = this.renta.MotivoConsumo;
          modelInterno.consumo.idEmpleadoConsume = this.renta.idEmpleadoInterno.toString();

          let modelinfoInterno = {
            Valor: this.TotalXCobrar,
            TipoPago:this.renta.TipoPago
          }

          modelInterno.informacionPagos.pop();
          modelInterno.informacionPagos.push(modelinfoInterno);
          this.RentaHabitacionXCobrar(modelInterno);
        }
    }
  }
}

mostrarModalCancelarExtra(numeroHabitacion:any){
  $('#salirModalExtra').modal('toggle');
  this.numeroHabitacionExtra = numeroHabitacion;
}

  modalConfirmarAgregarExtra(numeroHabitacion:any){
    $('#agregarExtra').modal('toggle')
    this.numeroHabitacionExtra = numeroHabitacion;
  }

  modalvalidaMatriculaModal(){
    this.renta.AutoMatricula = this.matriculaSelect;
    $('#validaMatriculaModal2').modal('toggle');
  }

  AgregarCosasExtra(el: any){
    //obtenemos los id de la habitacion y le numero de habitacion
    let idhabitacion = el.id;
    let numhabitacion = el.habitacionElectron;
    $('#agregarExtra').modal('toggle');
    $("[id*='loader-skeleton']").modal('toggle');
    //consultamos el api para el ver detalle de la habitacion
    this.extrasService.VerDetalleHabitacion(idhabitacion, numhabitacion).toPromise().then((response: any) => {
      if(response.status == 200){
        let resp = response.body;
        //valores anteriores de la habitacion
        let horasExtra = resp.horasExtra;
        let hospedajeExtra = resp.hospedajeExtra;
        let personasExtras = resp.personasExtras;

        let diferenciaHoras = 0, diferenciaHospedaje = 0, diferenciaPersonas = 0;
        //comparacion de los valores
        if(this.datosHPorCobrar.personasExtras != personasExtras){
          diferenciaPersonas = this.datosHPorCobrar.personasExtras - personasExtras;
        }
        if(this.datosHPorCobrar.hospedajeExtra != hospedajeExtra){
          diferenciaHospedaje = this.datosHPorCobrar.hospedajeExtra - hospedajeExtra;
        }
        if(this.datosHPorCobrar.horasExtra != horasExtra){
          diferenciaHoras = this.datosHPorCobrar.horasExtra - horasExtra;
        }

        let habitacion = {
          "IdHabitacion":idhabitacion,
          "HorasExtras":diferenciaHoras,
          "Renovaciones":diferenciaHospedaje,
          "PersonasExtras":diferenciaPersonas,
          "Automoviles":[{
            "Matricula":"",
            "Marca":"",
            "Modelo":"",
            "Color":""
          }],
          user:this.userTemp
        }

        this.extrasService.AgregarExtras(habitacion).toPromise().then((response: any) => {
          if(response.status == 200){
            //cerramos el skeleton
            $("[id*='loader-skeleton']").modal('hide');
            //modal de terminado
            $('#agregarExtraAceptado').modal('toggle');
            $('body').removeClass('modal-open');//eliminamos la clase del body para poder hacer scroll
          }else if(response.status == 500){
            $('#agregarExtraFallo').modal('toggle');
            $("[id*='loader-skeleton']").modal('toggle');
          }else{
            $('#agregarExtraFallo').modal('toggle');
            $("[id*='loader-skeleton']").modal('toggle');
          }

          this.habilitarBotonesXCobrar = false;
        }).catch(err => {
          if(err.status == 500){

            if(err.error == "La tarifa seleccionada no soporta el pago de horas extra"){
              //error en horas extra
              $('#agregarHorasExtraFallo').modal('toggle');
              //cerramos el skeleton
              $("[id*='loader-skeleton']").modal('toggle');
              $('#agregarExtraFallo').modal('toggle');
            }else{
              //cerramos el skeleton
              $("[id*='loader-skeleton']").modal('toggle');
              $('#agregarExtraFallo').modal('toggle');

            }
          }
          this.habilitarBotonesXCobrar = false;
        });
      }else{
        //alert('La información de la habitación no coincide');
        $('#agregarExtraFallo').modal('toggle');
      }
    });
  }

  falloAgregarExtras(modal:string){
    $('#' + modal).modal('toggle');
  }

  MascaraDecimalMixtoXCobrar(event:any, NombreEstado: string){

    let valor = event.target.value.toString();
    let valornumerico  = event.target.value;
    let idControl=event.target.id;
    this.mensajeError = '';
    this.cantidad=valornumerico;
    let TotalCuenta = 0;

    if(NombreEstado == "Por Cobrar"){
      TotalCuenta = this.TotalXCobrar;
    }else if(NombreEstado != "Por Cobrar"){
      TotalCuenta = this.renta.Total;
    }
    this.cantidad = (this.cantidad as any).replace(/,/g, "");
    if(this.cantidad<=TotalCuenta){
      if(this.renta.TipoPago==9){
        if(idControl=='montoTarjetaMixto'){

          // let total=this.renta.Total;
          let montoT=TotalCuenta-this.cantidad;
          let valMath=Math.round(montoT*100)/100;
          let valMathCantidad=Math.round(this.cantidad*100)/100;
          this.renta.MontoEfectivoMixto=valMath;
          this.renta.MontoTarjetaMixto=valMathCantidad;

        } else if(idControl=='montoEfectivoMixto'){

          // let total=this.renta.Total;
          let montoT=TotalCuenta-this.cantidad;
          this.renta.MontoTarjetaMixto=Math.round(montoT*100)/100;
          this.renta.MontoEfectivoMixto= Math.round(this.cantidad*100)/100;
        }
      }

    }else{

      if(idControl=='montoTarjetaMixto')
      this.mensajeError='El monto en Tarjeta sobrepasa el Importe total';

      if(idControl=='montoEfectivoMixto')
        this.mensajeError='El monto en efectivo sobrepasa el Importe total';
    }
    event.target.value=this.cantidad;
  }

  verContrasenaHuella(e){
    var target = e.target || e.srcElement || e.currentTarget;
    var idAttr = target.attributes.id;
    var value = idAttr.nodeValue;
    var parent = e.target.parentNode;
    var input = e.target.previousSibling;
    if(input.type == "password"){
      input.type = "text";
    }else{
      input.type = "password";
    }
  }

  CancelarLimpieza(el: any){
    this.numeroHabitacion = el.habitacionElectron;
    this.DatosHabitacion = [el];
    $('#cancelarLimpieza').modal('toggle');
  }

  ObtieneSupervisores(){
    this.limpiezaService.ObtenerSupervisores().toPromise().then((response: any) =>{
      if(response.status = 200){
        this.listaTodosSupervisores = response.body;
      }else{
      }
    }).catch(response =>{
      console.log(response);
    })
  }

  FiltarSupervisor(supervisor: string, userOptions){
    var lista_supervisores = document.getElementById('lista_supervisores');
    var cantidad = lista_supervisores.childElementCount;
    for(var i = 0; i < cantidad; i++){
      const compare = lista_supervisores.children[i].children[0].getAttribute('id').toLowerCase();
      if(compare.indexOf(supervisor.toLowerCase()) > -1){
        lista_supervisores.children[i].children[0].classList.remove('d-none');
      }else{
        lista_supervisores.children[i].children[0].classList.add('d-none');
      }
    }
  }

  ValidarSeleccionSupervisor(){
    $('#error_radio_supervisor').text('');
    let radio = $("input[name='radio_supervisor']:checked").val();
    if(radio != undefined && radio > 0){

      if(this.tipoEnvioSupervisor == 'limpieza'){
        this.limpiezaService.EnviarSupervisor(this.idHabitacion, radio).toPromise().then((response: any) =>{
          if(response.status == 200){
            // Sockets
            this.ActualizaHabitaciones(this.idHabitacion);
          }else{
            this.errorHabitacionTerminada = response.error;
            $('#salirModalError').modal('toggle');
          }
        }).catch(response =>{
          if(response){
            this.errorHabitacionTerminada = response.error;
            $('#salirModalError').modal('toggle');
            $('body').removeClass('modal-open');//eliminamos la clase del body para poder hacer scroll
          }
        })
      }else if(this.tipoEnvioSupervisor == 'mantenimiento'){
        let enviarSupervisorMtto = {
          "IdHabitacion": this.idHabitacion,
          "IdEmpleado": radio,
          "User": this.userTemp
        }
        this.limpiezaService.EnviarSupervisorMantenimiento(enviarSupervisorMtto).toPromise().then((response: any) => {
          if(response.status == 200){
            // Sockets
            this.ActualizaHabitaciones(this.idHabitacion);
          }else{
            this.errorHabitacionTerminada = response.error || response.statusText;
            $('#salirModalError').modal('toggle');
          }
        }).catch(response =>{
          if(response){
            this.errorHabitacionTerminada = response.error;
            $('#salirModalError').modal('toggle');
            $('body').removeClass('modal-open');//eliminamos la clase del body para poder hacer scroll
          }
        })

      }else if(this.tipoEnvioSupervisor == "cambiarmtto"){
        let CambiarSupervisorManto = {
          "IdHabitacion": this.idHabitacion,
          "IdEmpleado": radio,
          "User": this.userTemp
        }

        this.limpiezaService.CambiarSupervisorMantenimiento(CambiarSupervisorManto).toPromise().then((response: any) => {
          if(response.status == 200){
            // Sockets
            this.ActualizaHabitaciones(this.idHabitacion);
          }else{
            this.errorHabitacionTerminada = response.error || response.statusText;
            $('#salirModalError').modal('toggle');
          }
        }).catch(response =>{
          if(response){
            this.errorHabitacionTerminada = response.error;
            $('#salirModalError').modal('toggle');
            $('body').removeClass('modal-open');//eliminamos la clase del body para poder hacer scroll
          }
        });
      }
    }else{
      $('#error_radio_supervisor').text('Selecciona un supervisor');
    }
  }

  ObtieneConceptosLieracion(){
    this.limpiezaService.ObtenerConceptosLiberacion().toPromise().then((response: any) =>{
      if(response.status = 200){
        this.listaConceptosLiberacion = response.body;
        //removemos los elemntos del array
        this.RemoveElementSeleccionadas(23);
        this.RemoveElementSeleccionadas(24);

      }else{
      }
    }).catch(response =>{
      console.log(response);
    })
  }

  RemoveElementSeleccionadas(key: number) {
    this.listaConceptosLiberacion.forEach( (value,index) => {
      if(value.id==key)
        this.listaConceptosLiberacion.splice(index,1);
    });
  }

  ValidarSeleccionConceptos(){
    //validamos si es normal o mantenimiento

    //normal
    if(this.tipoLiberacion == "normal"){
      $('#error_radio_conceptos').text('');
      let radio = $("input[name='radio_concepto']:checked").val();
      if(radio != undefined && radio > 0){
        if(radio != 33 ){
          let descripcion = $('#concepto_detalle_' + radio).val();
          descripcion = descripcion.trim();
          if(descripcion.length != 0){
            this.FinalizarLimpieza(radio, descripcion, 'limpia_detalle');
          }else{
            $('#concepto_detalle_' + radio ).addClass('is-invalid');
            $('#error_radio_conceptos').text('Inserta una observación');
          }
        }else{
          this.FinalizarLimpieza(radio, '','limpia_normal');
        }
      }else{
        $('#error_radio_conceptos').text('Selecciona un tipo de liberación');
      }

    //mantenimiento
    }else if(this.tipoLiberacion == "mantenimiento"){
      $('#error_radio_conceptos').text('');

      let descripcion = $('#concepto_detalle_mtto').val();
      descripcion = descripcion.trim();
      if(descripcion.length != 0){
        this.FinalizarLimpiezaMto(descripcion);
      }else{
        $('#concepto_detalle_mtto').addClass('is-invalid');
        $('#error_radio_conceptos').text('Inserta una descripción');
      }

    }else{
      $('#error_radio_conceptos').text('Error al Liberar');
    }
  }

  FinalizarLimpieza(idConcepto:number, detalle:string, tipo_liberacion:string){
    let conDetalle = false;
    if(tipo_liberacion == "limpia_normal"){
      conDetalle = false;
    }else if(tipo_liberacion == "limpia_detalle"){
      conDetalle = true;
    }

    let finalizarLimpieza = {
      "IdHabitacion": this.idHabitacion,
      "IdConcepto": idConcepto,
      "Observaciones": detalle,
      "User": this.userTemp,
      "Supervisor": true,
      "conDetalle": conDetalle
    }

    this.limpiezaService.FinalizarLimpieza(finalizarLimpieza).toPromise().then((response: any) =>{
      if(response.status == 200){
        this.ActualizaHabitaciones(this.idHabitacion);

        /* if(idConcepto == 35 || idConcepto == 36){
          // Socket
          this.ActualizaHabitaciones(this.idHabitacion);
        }else{
          this.ActualizaHabitaciones(this.idHabitacion);
        } */
      }else{
        this.errorHabitacionTerminada = response.statusText;
        $('#salirModalError').modal('toggle');
      }
    }).catch(response =>{
      if(response){
        this.errorHabitacionTerminada = response.statusText;
        $('#salirModalError').modal('toggle');
        $('body').removeClass('modal-open');//eliminamos la clase del body para poder hacer scroll
      }
    })
  }

  FinalizarLimpiezaMto(detalle:string){
    let finalizarLimpiezaMto = {
      "IdHabitacion": this.idHabitacion,
      "Descripion": detalle,
      "User": this.userTemp
    }

    this.limpiezaService.FinalizarLimpiezaMantenimiento(finalizarLimpiezaMto).toPromise().then((response: any) =>{
      if(response.status == 200){
        this.ActualizaHabitaciones(this.idHabitacion);
      }else{
        this.errorHabitacionTerminada = response.statusText;
        $('#salirModalError').modal('toggle');
      }
    }).catch(response =>{
      if(response){
        this.errorHabitacionTerminada = response.statusText;
        $('#salirModalError').modal('toggle');
        $('body').removeClass('modal-open');//eliminamos la clase del body para poder hacer scroll
      }
    })
  }

  mostrarDetalle(id:any){
    $('.text-detalle-area').addClass('d-none');
    $('#mostrar_text_' + id ).removeClass('d-none');
  }

  FiltrarCamarista(camarista: string, userOptions){
    var listaCamaristas = document.getElementById('camaristas_en_turno');
    var cantidad = listaCamaristas.childElementCount;
    for(var i = 0; i < cantidad; i++){
      const compare = listaCamaristas.children[i].children[0].getAttribute('id').toLowerCase();
      if(compare.indexOf(camarista.toLowerCase()) > -1){
        listaCamaristas.children[i].children[0].classList.remove('d-none');
      }else{
        listaCamaristas.children[i].children[0].classList.add('d-none');
      }
    }
  }

  MostrarTodasCamaristas(){
    this.limpiezaService.ObtenerCamaristas().toPromise().then((response: any) => {
      let listaCamaristas:any;
      if(response.status == 200){

        listaCamaristas = response.body;
        listaCamaristas.disponibles.forEach((disp) => {
          this.listaTodasCamaristas.push( disp );
        });

        listaCamaristas.ocupadas.forEach((ocup) => {
          this.listaTodasCamaristas.push( ocup );
        });
        //ordenamos el array
        this.OrdenarArray();

      }else{
        this.listaTodasCamaristas.length = 0;
      }
    }).catch((response:any) => {
      this.listaTodasCamaristas.length = 0;
    });
  }

  OrdenarArray(){
    this.listaTodasCamaristas.sort( function( a, b ) {
      a = a.nombre.toLowerCase();
      b = b.nombre.toLowerCase();
      return a < b ? -1 : a > b ? 1 : 0;
    });
  }

  ocultarPanel(panel: string){
    if($( '#' + panel + '.d-none').length != 0){
      $( '#' + panel ).removeClass('d-none');
    }else{
      $( '#' + panel ).addClass('d-none');
    }
  }

  Imprimir(idHabitacion: number, numeroHabitacion: number){
    const url = this.router.serializeUrl(this.router.createUrlTree(['/ImprimirTicketHabitacion/', idHabitacion,numeroHabitacion]))
    window.open(url, 'popup', 'width=800px,height=800px');
  }

  GenerarReporte(idHabitacion: number){
    const url = this.router.serializeUrl(this.router.createUrlTree(['/ImprimirReporteMantenimiento/', idHabitacion]))
    window.open(url, 'popup', 'width=800px,height=800px');
  }

  abrirModal( modal ){
    console.log(modal);
    
    $('#'+ modal).modal('toggle');
  }

  Peek(x) {
  }

  showControlGastos(){
    $('#modalControlGastos').modal('toggle');
  }

}
