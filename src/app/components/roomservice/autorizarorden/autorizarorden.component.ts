import { Component, OnInit, Output, EventEmitter, Input, ViewChild, OnDestroy } from '@angular/core';
import { RoomservService } from 'src/app/services/roomserv.service';
import * as moment from 'moment';
import { interval, Subscription } from 'rxjs';
import { UtilitiesService } from 'src/app/services/utilities.service';
import { ComandasVmModel } from 'src/app/models/comandasVMModel';
import { InicioService } from 'src/app/services/inicio.service';
import { InterfaceComanda } from '../InterfazRoomService';
import { ActivatedRoute, Router } from '@angular/router';
import { CocinaSocketService } from 'src/app/services/sockets/cocina.service';
import { RoomListComponent } from '../room-list/room-list.component';
import { HabitacionesSocketService } from 'src/app/services/sockets/habitaciones.service';

declare var $: any;

@Component({
  selector: 'app-autorizarorden',
  templateUrl: './autorizarorden.component.html',
  styleUrls: ['./autorizarorden.component.css']
})
export class AutorizarordenComponent implements OnInit, OnDestroy {

  // Sockets
  cocinaSocket$: Subscription;
  @Output() actualizarHabitaciones = new EventEmitter<number>();

  @Output() modificarComanda: EventEmitter<any> = new EventEmitter<any>();
  comandaModificada: any;

  constructor(
    private roomservService: RoomservService,
    private utilities: UtilitiesService,
    private inicioService: InicioService,
    private habitacionesSocket: HabitacionesSocketService,
    private cocinaSocket: CocinaSocketService,
    private interfaceComanda: InterfaceComanda,
    private router: Router) {

  }

  objTemp: any;
  idHabitacion: number;
  ordersList = [];
  viewNumHabitacion = 0;
  tiposPago = [];
  tipoPago = 0;
  tiposTarjeta = [];
  tipoTarjeta = 0;
  orderAux: any;
  cobrarTotal: any;
  idComandaAux: any;
  propina: any = '';
  error: string;
  userTemp: string;

  sendObject: ComandasVmModel = {
    idComanda: 0,
    credencial: {
      identificadorUsuario: '',
      tipoCredencial: 0,
      valorVerificarStr: '',
      valorVerificarBin: null
    },
    idsArticulosComanda: [],
    marcarComoCortesia: false,
    pagos: [],
    propina: {

      valor: 0,
      IdTipoTarjeta: 0,
      referencia: '',
      NumeroTarjeta: ''
    },
    user:'',

  };

  ngOnInit(): void {

    this.GetTiposPago();
    this.ObtenerTipoTarjeta();
    this.error = '';
    $('#errorRoomService').hide();

    this.interfaceComanda.comandaEmitter.subscribe((data:any) => {
      if(data.error != undefined){

        this.error = data.error;
        $('#huellaAutorizarOrden').modal('hide');
        $('#ModalMetodosPagoComanda').modal('show');

        $('#errorRoomService').show();
        throw new Error("Campos invalidos");
      }
    });

    this.sendObject.user = sessionStorage.user;

    // Socket
    this.initSocketCocina();
  }

  ngOnDestroy(){
    this.cocinaSocket$.unsubscribe();
  }

  GetRoomComanda(habitacion: any) {
    this.idHabitacion = habitacion.id;
    this.viewNumHabitacion = habitacion.habitacionElectron;
    sessionStorage.setItem('idHabitacion', habitacion.id.toString());

    this.getOrdenesHabitacion();
    //$('.modal-autorizarOrden').show();
    $('.modal-autorizarOrden').modal('show');
  }

  getOrdenesHabitacion(){
    this.roomservService.GetOrdersDetail(this.idHabitacion)
      .subscribe((response: any) => {
        if( response.result.length > 0){
          this.ordersList = response.result;
          this.cobrarTotal = parseFloat(response.result.total).toFixed(2);
          this.idComandaAux = response.result.idComanda;

          this.SetTimeStamps(this.ordersList);
        } else {
          $('.modal-autorizarOrden').modal('hide');
        }
    });
  }

  initSocketCocina(){
    this.cocinaSocket$ = this.cocinaSocket.syncComandas()
      .subscribe( () =>{
        if( !($(".modal-roomservice").data('bs.modal') || {})._isShown
            && ($(".modal-autorizarOrden").data('bs.modal') || {})._isShown
        ){
          this.getOrdenesHabitacion();
        }
    });
  }

  OpenNewOrderModal() {
    $('.modal-roomservice').modal({backdrop: 'static', keyboard: false});
    //$('.modal-roomservice').show();
    $('.modal-roomservice').modal('show');
    $('.modal-autorizarOrden').modal('hide');

    localStorage.setItem('idHabitacion', this.idHabitacion.toString());
    localStorage.setItem('numHabitacion', this.viewNumHabitacion.toString());

    this.roomservService.SendClicEvent('');
  }

  SetObjectForAuthorize(order, totalPago) {

    $('#ModalMetodosPagoComanda').modal('toggle');

    this.cobrarTotal = totalPago;
    this.idComandaAux = order.idComanda;

    this.sendObject = {
      idComanda: order.idComanda,
      credencial: {
        identificadorUsuario: '',
        tipoCredencial: 0,
        valorVerificarStr: '',
        valorVerificarBin: null
      },
      idsArticulosComanda: [],
      marcarComoCortesia: false,
      pagos: [],
      user: sessionStorage.user
    };

    this.orderAux = order;
  }

  AutorizarComanda(order?) {
    order == undefined ? order = this.orderAux : null;

    if (order.idEstadoPedido === 3) {
      // Por Cobrar
      this.sendObject = {
        idComanda: order.idComanda,
        credencial: {
          identificadorUsuario: '',
          tipoCredencial: 0,
          valorVerificarStr: '',
          valorVerificarBin: null
        },
        idsArticulosComanda: [],
        marcarComoCortesia: false,
        pagos: [],
        user: sessionStorage.user
      };

      this.roomservService.PutOrder(this.sendObject)
        .subscribe((response: any) => {
          if (response.status === 200) {
            this.getOrdenesHabitacion();
            this.cocinaSocket.actualizarComanda();
            this.habitacionesSocket.actualizarHabitacion();
          }
        });
    } else if (order.idEstadoPedido === 4) {
      // Por Pagar

      $('#tipoPago').css({'color':'black'});

      $('#errorRoomService').hide();

      if (this.tipoPago == 0) {
        // Ningun método
        this.error = "Seleccione una forma de pago"
        $('#errorRoomService').show();
        $('#tipoPago').css({'color':'red'});
        throw new Error("Seleccione tipo de Pago");

      } else if (this.tipoPago == 1) {
        // Efectivo
        this.sendObject.pagos = [{
          valor: order.total,
          TipoPago: this.tipoPago
        }];

        this.PagoComanda(this.sendObject);
      } else if (this.tipoPago == 2) {
        // Tarjeta de crédito

        $('#tipoTarjeta').css({'color':'black'});
        $('#LbNumeroTarjeta').css({'color':'black'});
        $('#LbNumAprobacion').css({'color':'black'});

        this.validacionPagos().then(respuesta => {

          if (respuesta) {

            this.sendObject.pagos = [{
              valor: order.total,
              TipoPago: this.tipoPago,
              TipoTarjeta: this.tipoTarjeta,
              Referencia: $('#numAprobacionTarjeta').val(),
              NumeroTarjeta: $('#numTarjeta').val()
            }];

            let prop = $('#propTarjetaRoomService').val();

            prop = prop.replace("$", "");
            prop = prop.replace(",", "");
            prop = prop.replace(",", "");

            let propina = parseFloat(prop);

            if (propina > 0) {
              this.sendObject.propina = {

                valor: propina,
                IdTipoTarjeta: this.tipoTarjeta,
                referencia: $('#numAprobacionTarjeta').val(),
                NumeroTarjeta: $('#numTarjeta').val()
              }
            }

            this.PagoComanda(this.sendObject);
          }
        });

      } else if (this.tipoPago == 8) {
        // Transferencia

        $('#errorRoomService').hide();

        let referencia = $('#numTransRoomServeces').val();

        let validacion = /^[A-Za-z0-9]{4,20}$/;

        if(!validacion.test(referencia)){

            this.error = "La referencia debe tener  minimo 4 caracteres y un maximo de 20 pueden se número y letras";
            $('#errorRoomService').show();
            throw new Error("validacion decimales");
        }

        if (referencia != "") {

          this.sendObject.pagos = [{
            valor: order.total,
            TipoPago: this.tipoPago,
            Referencia: referencia
          }];

          this.PagoComanda(this.sendObject);
        }
        else {

          this.error = "Favor de ingresar la referencia";
          $('#errorRoomService').show();
          throw new Error("validacion de campo")
        }

      } else if (this.tipoPago == 9) {
        // Mixto

        $('#lbNumTajetaMix').css({'color':'black'});
        $('#lbNumAprobTarjRoomMixto').css({'color':'black'});
        $('#tipoTarjetaMixtoRoom').css({'color':'black'});

        this.validacionPagos().then(respuesta => {

          if (respuesta) {

            let efectivo = 1;
            let tarjeta = 2;
            let pagoEfectivo = $('#RoomServiceEfectivoMixto').val();
            let pagoTarjeta = $('#montoTarjetaMixtoRoom').val();

            pagoEfectivo = pagoEfectivo.replace("$", "");
            pagoEfectivo = pagoEfectivo.replace(",", "");
            pagoEfectivo = pagoEfectivo.replace(",", "");

            pagoTarjeta = pagoTarjeta.replace("$", "");
            pagoTarjeta = pagoTarjeta.replace(",", "");
            pagoTarjeta = pagoTarjeta.replace(",", "");

            this.sendObject.pagos = [{
              valor: pagoEfectivo,
              TipoPago: efectivo
            },
            {
              valor: pagoTarjeta,
              TipoPago: tarjeta,
              TipoTarjeta: $('#tipoTarjetaMixtoRoom').val(),
              Referencia: $('#numAprobacionTarjetaRoomMixto').val(),
              NumeroTarjeta: $('#numTarjetaRoomMixto').val()
            },
            ];

            let prop = $('#propTarjetaMixtoRoom').val();

            prop = prop.replace("$", "");
            prop = prop.replace(",", "");
            prop = prop.replace(",", "");

            let propina = parseFloat(prop);

            if (propina > 0) {
              this.sendObject.propina = {

                valor: propina,
                IdTipoTarjeta: this.tipoTarjeta,
                referencia: $('#numAprobacionTarjetaRoomMixto').val(),
                NumeroTarjeta: $('#numTarjetaRoomMixto').val(),
              }
            }
          }
          this.PagoComanda(this.sendObject);
        });
      }
    }
  }


  PagoComanda(sendObject: any) {
    this.roomservService.PutOrder(sendObject)
    .subscribe((response: any) => {

      if( response.status === 200 ){
        this.getOrdenesHabitacion();
        this.habitacionesSocket.actualizarHabitacion();
      }

      let operation = this.roomservService.GetOrdersDetail(this.idHabitacion)
        .subscribe((response: any) => {

          if (response.result.length > 0) {

            this.ordersList = response.result;
            this.SetTimeStamps(this.ordersList);
            $('.modal-huella').modal('hide');
            $('body').removeClass('modal-open');
            $('.modal-backdrop').remove();
          }
          $('#ModalMetodosPagoComanda').modal('toggle');
        });
    });
  }

  SetModificarComanda(comanda?: any) {
    this.modificarComanda.emit(comanda);
  }

  ModificaComanda(comanda, numHabitacion) {
    var com = {
      comanda,
      numHabitacion
    }
    this.interfaceComanda.setComanda(com);
    $('.modal-autorizarOrden').modal('hide');
    $('body').removeClass('modal-open');
    $('.modal-backdrop').remove();

    $('.modal-roomservice').modal('show');
  }

  TimeCheck() {
    const contador = interval(30000);

    contador.subscribe((n) => {
      this.SetTimeStamps(this.ordersList);
    });
  }

  SetTimeStamps(array = []) {

    let defineElapsed = (minutos) => {
      return minutos < 10 ? 0 :
        minutos > 10 && minutos < 15 ? 1 :
          minutos > 15 ? 2 : 0;
    }

    array.forEach((el) => {
      let behaviorTimer = {
        timeStamp: '',
        elapsed: 0
      }
      let minutos = moment(new Date()).diff(moment(el.fechaSolicitud), 'minutes');

      behaviorTimer.timeStamp = this.utilities.MinutesToHourMinutes(minutos);
      behaviorTimer.elapsed = defineElapsed(minutos);

      el.timer = behaviorTimer;
    });
  }

  Simulation(order: any) {
    order.idEstadoPedido = 4;

    let fechaTiempo = new Date(order.fechaSolicitud);
    if (fechaTiempo) {

    }
  }

  GetTiposPago() {

    this.inicioService.GetTipoPago().subscribe((res: any) => {

      let tiposPagos = []

      tiposPagos = res.result.forEach(element => {

        if( element.idTipoPago == 1
            || element.idTipoPago == 2
            || element.idTipoPago == 6
            || element.idTipoPago == 8
            || element.idTipoPago == 9
        ){

          this.tiposPago.push(element);
        }
      });
    });
  }

  ObtenerTipoTarjeta() {
    this.inicioService.GetTipoTarjeta()
      .subscribe((response: any) => {

        this.tiposTarjeta = response.result;
    });
  }

  AceptarModificarComanda() {
     $('#loaderAutorizarOrden').modal('show');
    let motivo: any = document.getElementById('motivoCancelacion');

    let comandaVM ={
      IdComanda: sessionStorage.getItem("idComanda"),
      Motivo: motivo.value,
      credenciales: {
        identificadorUsuario: sessionStorage.getItem("userstr"),
        valorVerificarStr: sessionStorage.getItem("valorVerificarStr"),
        tipoCredencial: sessionStorage.getItem("tipoCredencial"),
        token: sessionStorage.getItem("token")
      }
    }

    this.roomservService.CancelarComanda(comandaVM)
      .subscribe((response: any) => {
        if (response.status == 200) {
          $('#CancelacionModal').modal('hide');
          $('#loaderAutorizarOrden').modal('hide');
          $('.modal-roomservice').modal('hide');
          $('.modal-autorizarOrden').modal('hide');

          $('body').removeClass('modal-open');
          $('.modal-backdrop').remove();

          sessionStorage.removeItem("userstr");
          sessionStorage.removeItem("valorVerificarStr");
          sessionStorage.removeItem("tipoCredencial");
          sessionStorage.removeItem("token");

          // Sockets
          this.cocinaSocket.actualizarComanda();
          this.habitacionesSocket.actualizarHabitacion();
        } else {
          $('#noCancelado').show();
          $('#loaderAutorizarOrden').modal('hide');
          $('body').removeClass('modal-open');
          $('.modal-backdrop').remove();
        }
    });
  }

  Imprimir(idComanda) {

    const url = this.router.serializeUrl(this.router.createUrlTree(['/ImprimirTicketRoomService/', idComanda]))

    window.open(url, 'popup', 'width=800px,height=800px');
  }

  SalirCancelarComanda() {

    $('#CancelacionModal').modal('toggle');
    $('body').removeClass('modal-open');
    $('.modal-backdrop').remove();
  }

  validacionPagos() {

    let promise = new Promise((resolve) => {

      $('#errorRoomService').hide();

      if (this.tipoPago == 2) {

        let tipoTarjeta = $('#tipoTarjeta').val();
        let aprobacionTarjeta = $('#numAprobacionTarjeta').val();
        let numeroTarjeta = $('#numTarjeta').val();
        let propina = $('#propTarjetaRoomService').val();

        if (tipoTarjeta == undefined || tipoTarjeta == 0) {

          $('#tipoTarjeta').css({'color':'red'});

          if(numeroTarjeta.length != 4 || numeroTarjeta == undefined)
            $('#LbNumeroTarjeta').css({'color':'red'});

          if (aprobacionTarjeta.length != 4 || aprobacionTarjeta == undefined)
            $('#LbNumAprobacion').css({'color':'red'});

          this.error = "Selecciona un tipo de pago con tarjeta";
          $('#errorRoomService').show();
          throw new Error("Campos invalidos");
        } else if (aprobacionTarjeta.length != 4 || aprobacionTarjeta == undefined) {

          $('#LbNumAprobacion').css({'color':'red'});

          if (tipoTarjeta == undefined || tipoTarjeta == 0)
            $('#tipoTarjeta').css({'color':'red'});

          if(numeroTarjeta.length != 4 || numeroTarjeta == undefined)
            $('#LbNumeroTarjeta').css({'color':'red'});

          this.error = "El numero de aprobacion debe de ser de 4 digitos";
          $('#errorRoomService').show();
          throw new Error("Campos invalidos");
        }
        else if (numeroTarjeta.length != 4 || numeroTarjeta == undefined) {

          $('#LbNumeroTarjeta').css({'color':'red'});

          if (tipoTarjeta == undefined || tipoTarjeta == 0)
            $('#tipoTarjeta').css({'color':'red'});

            if (aprobacionTarjeta.length != 4 || aprobacionTarjeta == undefined)
            $('#LbNumAprobacion').css({'color':'red'});

          this.error = "El numero de tarjeta debe de ser de 4 digitos";
          $('#errorRoomService').show();
          throw new Error("Campos invalidos");
        }
        else if (propina != "") {

          propina = propina.replace("$", "");
          propina = propina.replace(",", "");
          propina = propina.replace(",", "");

          let numeroDecimal = /^[0-9]{1,100}$|^[0-9]{1,100}\.[0-9]{1,2}$/;

          if (!numeroDecimal.test(propina)) {
            this.error = "debe ingresar una propina correcta ";
            $('#errorRoomService').show();
            throw new Error("Campos invalidos");
          }
          else
            resolve(true);

        } else
          resolve(true);

      }
      else if (this.tipoPago == 9) {

        $('#errorRoomService').hide();

        let tipoTarjeta = $('#tipoTarjetaMixtoRoom').val();
        let aprobacionTarjeta = $('#numAprobacionTarjetaRoomMixto').val();
        let numeroTarjeta = $('#numTarjetaRoomMixto').val();
        let propina = $('#propTarjetaMixtoRoom').val();
        let efectivo = $('#RoomServiceEfectivoMixto').val();
        let montoTarjeta = $('#montoTarjetaMixtoRoom').val();
        $('#lbNumTajetaMix').css({'color':'black'});
        $('#lbNumAprobTarjRoomMixto').css({'color':'black'});
        $('#tipoTarjetaMixtoRoom').css({'color':'black'});

        efectivo = efectivo.replace("$", "");
        efectivo = efectivo.replace(",", "");
        efectivo = efectivo.replace(",", "");

        montoTarjeta = montoTarjeta.replace("$", "");
        montoTarjeta = montoTarjeta.replace(",", "");
        montoTarjeta = montoTarjeta.replace(",", "");

        if (tipoTarjeta == undefined || tipoTarjeta == 0) {

          $('#tipoTarjetaMixtoRoom').css({'color':'red'});

          if (numeroTarjeta.length != 4 || numeroTarjeta == undefined)
            $('#lbNumTajetaMix').css({'color':'red'});

          if (aprobacionTarjeta.length != 4 || aprobacionTarjeta == undefined)
            $('#lbNumAprobTarjRoomMixto').css({'color':'red'});

          this.error = "Selecciona un tipo de pago con tarjeta";
          $('#errorRoomService').show();
          throw new Error("Campos invalidos");

        } else if (aprobacionTarjeta.length != 4 || aprobacionTarjeta == undefined) {

          $('#lbNumAprobTarjRoomMixto').css({'color':'red'});

          if (tipoTarjeta == undefined || tipoTarjeta == 0)
            $('#tipoTarjetaMixtoRoom').css({'color':'red'});

          if (numeroTarjeta.length != 4 || numeroTarjeta == undefined)
            $('#lbNumTajetaMix').css({'color':'red'});

          this.error = "El numero de aprobacion debe de ser de 4 digitos";
          $('#errorRoomService').show();
          throw new Error("Campos invalidos");

        }
        else if (numeroTarjeta.length != 4 || numeroTarjeta == undefined) {

          $('#lbNumTajetaMix').css({'color':'red'});

          if (tipoTarjeta == undefined || tipoTarjeta == 0)
            $('#tipoTarjetaMixtoRoom').css({'color':'red'});

          if (aprobacionTarjeta.length != 4 || aprobacionTarjeta == undefined)
            $('#lbNumAprobTarjRoomMixto').css({'color':'red'});

          this.error = "El numero de tarjeta debe de ser de 4 digitos";
          $('#errorRoomService').show();
          throw new Error("Campos invalidos");
        }
        else if (montoTarjeta == 0 || montoTarjeta == "" || montoTarjeta == undefined) {

          this.error = "Pago Tarjeta no puede estar vacio y debe ser mayor a cero";
          $('#errorRoomService').show();
          throw new Error("Campos invalidos");
        }
        else if (efectivo == 0 || efectivo == "" || efectivo == undefined) {

          this.error = "Pago efectivo no puede estar vacio y debe ser mayor a cero";
          $('#errorRoomService').show();
          throw new Error("Campos invalidos");
        }
        else
          resolve(true);
      }
    });

    return promise;
  }

  ValidaTarjeta(event: any) {

    $('#errorRoomService').hide();
    $('#LbNumeroTarjeta').css({'color':'black'});
    $('#lbNumTajetaMix').css({'color':'black'});

    let valor = event.target.value;
    let Entero = valor.replace(/[^\d]*/g, '');

    if (Entero.length != 4 || Entero == undefined){

      let tajeta = $('#numTarjeta').val();
      let tarjetaMixto = $('#numTarjetaRoomMixto').val();

      if(tajeta !=""|| tajeta != undefined )
        $('#LbNumeroTarjeta').css({'color':'red'});

      if(tarjetaMixto !=""|| tarjetaMixto != undefined )
        $('#lbNumTajetaMix').css({'color':'red'});
    }

    event.target.value = Entero;

  }

  ValidaNumeroAprobacion(event: any) {

    $('#errorRoomService').hide();

    $('#LbNumAprobacion').css({'color':'black'});
    $('#lbNumAprobTarjRoomMixto').css({'color':'black'});

    let valor = event.target.value;
    let Entero = valor.replace(/[^\d]*/g, '');

    if(Entero.length != 4 || Entero == undefined){

      let numAprotajeta = $('#numAprobacionTarjeta').val();
      let numAproTarjetaMixto = $('#numAprobacionTarjetaRoomMixto').val();

      if(numAprotajeta !=""|| numAprotajeta != undefined )
        $('#LbNumAprobacion').css({'color':'red'});

      if(numAproTarjetaMixto !=""|| numAproTarjetaMixto != undefined )
        $('#lbNumAprobTarjRoomMixto').css({'color':'red'});
    }


    event.target.value = Entero;

  }

  validacionTransferencia(event: any){

    $('#errorRoomService').hide();

    let valor = event.target.value;

    let validacion = /^[A-Za-z0-9]{4,20}$/;

    if(!validacion.test(valor)){

      this.error = "La referencia debe tener  minimo 4 caracteres y un maximo de 20 pueden se número y letras";
      $('#errorRoomService').show();
      throw new Error("validacion decimales");
    }

  }

  validacionPropina(event: any) {

    $('#errorRoomService').hide();

    let cantidad = event.target.value;

    cantidad = cantidad.replace("$", "");
    cantidad = cantidad.replace(",", "");
    cantidad = cantidad.replace(",", "");

    let numeroletra = /^[a-zA-Z ]*$/;
    let numeroDecimal = /^[0-9]{1,100}$|^[0-9]{1,100}\.[0-9]{1,2}$/;


    if (numeroletra.test(cantidad)) {

      let valor = event.target.value;
      let Entero = valor.replace(/[^\d]*/g, '');
      event.target.value = Entero;
      throw new Error("validacion decimales");
    }

    if (!numeroDecimal.test(cantidad)) {

      this.error = "Debe de contener de 1 a 2 decimales";
      $('#errorRoomService').show();
      throw new Error("validacion decimales");
    }

    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    });

    cantidad = formatter.format(cantidad);
    event.target.value = cantidad;

  }

  validacionTarjetaMixto(event: any) {

    $('#errorRoomService').hide();

    let cantidad = event.target.value;

    cantidad = cantidad.replace("$", "");
    cantidad = cantidad.replace(",", "");
    cantidad = cantidad.replace(",", "");

    let numeroletra = /^[a-zA-Z ]*$/;
    let numeroDecimal = /^[0-9]{1,100}$|^[0-9]{1,100}\.[0-9]{1,2}$/;

    if (numeroletra.test(cantidad)) {

      let valor = event.target.value;
      let Entero = valor.replace(/[^\d]*/g, '');
      event.target.value = Entero;
      throw new Error("validacion decimales");
    }

    if (cantidad == "$NaN")
      cantidad = "$0.00";

    if (!numeroDecimal.test(cantidad)) {

      this.error = "Debe de contener de 1 a 2 decimales";
      $('#errorRoomService').show();
      $('#RoomServiceEfectivoMixto').val("$0");
      throw new Error("validacion decimales");
    }

    if (cantidad > this.cobrarTotal) {

      this.error = "Monto no puede ser mayor al total";
      $('#errorRoomService').show();
      $('#montoTarjetaMixtoRoom').val("$0");
      $('#RoomServiceEfectivoMixto').val("$0");
      throw new Error("validacion decimales");
    }

    let pagoEfectivo = this.cobrarTotal - cantidad;

    if (cantidad >= this.cobrarTotal) {

      this.error = "Niguno de los montos puede ser igual a 0";
      $('#errorRoomService').show();
      cantidad = cantidad - 1;
      pagoEfectivo = 1;
    }

    $('#RoomServiceEfectivoMixto').val("$" + pagoEfectivo.toFixed(2));

    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    });

    cantidad = formatter.format(cantidad);
    event.target.value = cantidad;
  }

  validacionEfectivoMixto(event: any) {

    $('#errorRoomService').hide();

    let cantidad = event.target.value;

    cantidad = cantidad.replace("$", "");
    cantidad = cantidad.replace(",", "");
    cantidad = cantidad.replace(",", "");

    let numeroletra = /^[a-zA-Z ]*$/;
    let numeroDecimal = /^[0-9]{1,100}$|^[0-9]{1,100}\.[0-9]{1,2}$/;

    if (numeroletra.test(cantidad)) {

      let valor = event.target.value;
      let Entero = valor.replace(/[^\d]*/g, '');
      event.target.value = Entero;
      throw new Error("validacion decimales");
    }

    if (cantidad == "$NaN")
      cantidad = "$0.00";

    if (!numeroDecimal.test(cantidad)) {

      this.error = "Debe de contener de 1 a 2 decimales";
      $('#errorRoomService').show();
      $('#montoTarjetaMixtoRoom').val("$0");
      throw new Error("validacion decimales");
    }

    if (cantidad > this.cobrarTotal) {

      this.error = "Monto no puede ser mayor al total";
      $('#errorRoomService').show();
      $('#montoTarjetaMixtoRoom').val("$0");
      $('#RoomServiceEfectivoMixto').val("$0");
      throw new Error("validacion decimales");
    }

    let pagoTarjeta = this.cobrarTotal - cantidad;

    if (cantidad >= this.cobrarTotal) {

      this.error = "Niguno de los montos puede ser igual a 0";
      $('#errorRoomService').show();
      cantidad = cantidad - 1;
      pagoTarjeta = 1;

    }

    $('#montoTarjetaMixtoRoom').val("$" + pagoTarjeta.toFixed(2));

    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0

    });

    cantidad = formatter.format(cantidad);
    event.target.value = cantidad;
  }

  validacionTipoPago(event: any){

    $('#errorRoomService').hide();
    $('#tipoPago').css({'color':'black'});

    let dato = event.target.value;

    if(dato == 0){

      $('#tipoPago').css({'color':'red'});
      this.error = "Seleccione una forma de pago";
      $('#errorRoomService').show();
    }else
      $('#errorRoomService').hide();
  }

  validacionTipoTarjeta(event: any){

    $('#errorRoomService').hide();
    $('#tipoTarjeta').css({'color':'black'});

    let dato = event.target.value;

    if(dato == 0){

      $('#tipoTarjeta').css({'color':'red'});
      this.error = "Seleccione una forma de pago";
      $('#errorRoomService').show();
    }else
      $('#errorRoomService').hide();
  }

  validacionTipoTarjetaMixto(event: any){

    $('#errorRoomService').hide();
    $('#tipoTarjetaMixtoRoom').css({'color':'black'});

    let dato = event.target.value;

    if(dato == 0){

      $('#tipoTarjetaMixtoRoom').css({'color':'red'});
      this.error = "Seleccione una forma de pago";
      $('#errorRoomService').show();
    }else
      $('#errorRoomService').hide();
  }

}
