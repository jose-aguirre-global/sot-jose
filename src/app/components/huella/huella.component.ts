// Angular
import { Component, EventEmitter, OnInit, Output, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

// Models
import { LoginModel } from 'src/app/models/loginModel';
import { RentaHabitacionModel } from 'src/app/models/rentaHabitacion';

// Services
import { CocinabarService } from 'src/app/services/cocinabar.service';
import { InicioService } from 'src/app/services/inicio.service';
import { ExtrasService } from  'src/app/services/extras.service';
import { RoomservService } from 'src/app/services/roomserv.service';
import { LoginService } from 'src/app/services/login.service';
import { InterfaceComanda } from '../roomservice/InterfazRoomService'
import { MatriculaService } from 'src/app/services/matricula.service';
import { FingerPrintService } from 'src/app/services/fingerprint.service';

// Interfaces
import { Raw } from 'src/app/models/fingerprint.interface';
import { runInThisContext } from 'vm';

declare var $: any;

@Component({
  selector: 'app-huella',
  templateUrl: './huella.component.html',
  styleUrls: ['./huella.component.css']
})
export class HuellaComponent implements OnInit, OnDestroy {
  totalCount = 3;
  loader =  false;
  loader2 = true;

  // Servicios Huella
  timeTnterval              : number        = 0;
  fingerScannerObservable   : Subscription  = new Subscription();
  mensajeScannerDetectado   : string        = 'No se encontro el lector de huellas.';
  mensajeResultadoLogin     : string        = '';
  usuarioLogin              : string        = '';
  fingerButtonColor         : string        = 'btn-gray fingerButtonClass';
  fingerButtonLogo          : string        = 'icon-manita_fingerprint';
  modoCaptura               : boolean       = false;
  @ViewChild('userName')      userName      : ElementRef;
  @ViewChild('userPassword')  userPassword  : ElementRef;

  // Socket
  @Output() actualizarHabitaciones = new EventEmitter<number>();

  constructor(
    private router: Router,
    private loginService: LoginService,
    private roomservService: RoomservService,
    private incioService: InicioService,
    private cocinaBarService: CocinabarService,
    private interfaceRoomService: InterfaceComanda,
    private matriculaService: MatriculaService,
    private fingerService: FingerPrintService,
    private extrasService:ExtrasService
  ){
    this.roomservService.GetClicEvent()
      .subscribe((response: any) => {
        this.modoAutorizacion = response;
      });
  }

  @Output()
  envioData: EventEmitter<any> = new EventEmitter<any>();

  loginModel: LoginModel = {
    // valorVerificarBin: '',
    identificadorUsuario: '',
    sinValor: false,
    tipoCredencial: 1,
    valorVerificarStr: '',
    token: ''
  };

  modoAutorizacion: string;
  formRenta: NgForm;
  renta: RentaHabitacionModel;
  postingModel: any;
  error:any;

  idComanda: any;
  idHabitacion: any;
  valor: any;
  referencia: any;
  orderlistcortesia: any;
  idMatricula: any;
  idTipoReporte: any;

  idHabitacionPorCobrar: any;

  // Por Cobrar
  XCobrarModel = {
    idHabitacion:0,
    credencial:{
      TipoCredencial:0,
      IdentificadorUsuario:"",
      ValorVerificarStr:"",
      ValorVerificarBin:null
    }
  }
  datosHPorCobrar;
  TotalXCobrar;

  // Token
  user: string;

  ngOnInit(): void {
    this.user = sessionStorage.user;
  }

  ngOnDestroy(): void{
    this.stopFingerprintServices();
  }

  stopFingerprintServices(){
    //this.fingerService.stopAcquisition();
    this.fingerScannerObservable.unsubscribe();
    clearInterval(this.timeTnterval);
    this.modoCaptura = false;
    this.resetFingerprintToken();
    this.userName.nativeElement.value = '';
    this.userPassword.nativeElement.value = '';
    this.fingerButtonLogo       = 'icon-manita_fingerprint';
    this.mensajeResultadoLogin = '';
    this.loader = false;
  }

  startFingerprintServices(){
    this.fingerDevicesInterval();
    this.initFingerScanner();
    this.modoCaptura = true;
    this.resetFingerprintToken();
    this.userName.nativeElement.value = '';
    this.userPassword.nativeElement.value = '';
    this.fingerButtonLogo       = 'icon-manita_fingerprint';
    this.mensajeResultadoLogin = '';
    this.loader = false;
  }

    resetFingerprintToken( token: string = '', credencial: number = 1){
      if( typeof this.renta !== 'undefined'
          &&
          typeof this.renta.credencial !== 'undefined' ){
            this.renta.credencial.Token = token;
            this.renta.credencial.TipoCredencial = credencial;
          }
      if( typeof this.postingModel !== 'undefined'
          &&
          typeof this.postingModel.credencial !== 'undefined' ){
            this.postingModel.credencial.tipoCredencial = credencial;
            this.postingModel.credencial.token = token;
          }
      if( typeof this.loginModel !== 'undefined' ){
          this.loginModel.tipoCredencial = credencial;
          this.loginModel.token = token;
        }
    }

    fingerDevicesInterval(){
      this.timeTnterval = setInterval( async () =>{
            if( this.fingerService.devices.length ){
              this.fingerButtonColor        = 'btn-redBold fingerButtonClass';
              this.mensajeScannerDetectado  = '';
            } else {
              this.fingerButtonColor        = 'btn-gray fingerButtonClass';
              this.fingerButtonLogo         = 'icon-manita_fingerprint';
              this.mensajeScannerDetectado  = 'No se encontro el lector de huellas.';
            }
      }, 1500) as any;
    }

  initFingerScanner(){
    this.fingerScannerObservable = this.fingerService
      .samplesAcquiredObservable()
      .subscribe( (raw) => {
        if( this.modoCaptura ){
          this.modoCaptura = false;
          this.fingerButtonLogo       = 'fa fa-spinner ml-3 mr-3';
          this.mensajeResultadoLogin  = 'Validando...';
          this.getFingerToken(raw);
        }
      });
  }

  messageHuellaNoValida(message: string){
    this.fingerButtonLogo       = 'icon-manita_fingerprint';
    this.mensajeResultadoLogin  = message;
    this.resetFingerprintToken();
    setTimeout( () =>{
      this.mensajeResultadoLogin = '';
      this.modoCaptura = true;
    }, 2000);
  }

  getFingerToken(raw: Raw){
    this.fingerService.login(raw)
      .subscribe( ( response ) => {
          // Huella Reconocida
          this.fingerButtonLogo       = 'icon-manita_fingerprint';
          this.mensajeResultadoLogin = '';
          this.resetFingerprintToken( response.result.token, 2 );
          this.AceptarAutorizar();
      },(httpError: HttpErrorResponse) => {
        // Huella No Reconocida
        this.messageHuellaNoValida('Huella no reconocida');
      });
  }

  SetModoAutorizacion(modo: string | any, data?: any) {
    let modosAutorizacion = {
      'room-service': 'room-service',
      restaurante: 'restaurante',
      bar: 'bar',
      'renta-habitacion': 'renta-habitacion',
      'retablecerPassword': 'retablecerPassword',
      'cancelarComanda': 'cancelarComanda',
      'AutModificarComanda': 'AutModificarComanda',
      'RoomServiceCortesia': 'RoomServiceCortesia',
      'InhabilitarMatricula': 'InhabilitarMatricula',
      'cancelarCobrar' : 'cancelarCobrar',
      'cancelarHabitacionExtra': 'cancelarHabitacionExtra',
      'renta-habitacionXcobrar': 'renta-habitacionXcobrar',
      'bloquearHabitacion': 'bloquearHabitacion',
      'cancelarbloquearHabitacion':'cancelarbloquearHabitacion',
    }

    this.modoAutorizacion = modosAutorizacion[modo];

    if (this.modoAutorizacion == 'restaurante' || this.modoAutorizacion == 'bar') {
      this.postingModel = data;
    }

    // Fingerprint Local Services
    this.startFingerprintServices();
  }

  AceptarAutorizar() {
    switch (this.modoAutorizacion) {
      case 'room-service':
        console.log('Autorizar la comanda del room-service');
        break;
      case 'restaurante':
        this.PostCocinaBar();
        break;
      case 'bar':
        this.PostCocinaBar();
        break;
      case 'renta-habitacion':
        this.AplicaRentaHabitacion();
        break;
      case 'retablecerPassword':
        this.validarAutorizacionRestablecerPassword();
        break;
      case 'cancelarComanda':
        this.cancelarComanda();
        break;
      case 'AutModificarComanda':
        this.AutorizarModificarComanda();
      case 'RoomServiceCortesia':
        this.RoomServiceCortesia();
        break;
      case 'InhabilitarMatricula':
        this.InhabilitarMatricula();
        break;
      case 'cancelarCobrar':
          this.cancelarCobrar();
          break;
      case 'cancelarHabitacionExtra':
        this.cancelarHabitacionExtra();
        break;
      case 'renta-habitacionXcobrar':
        this.AplicaRentaHabitacionXCobrar();
        break;
      case 'bloquearHabitacion':
        this.bloquearHabitacion();
      break;
      case 'cancelarbloquearHabitacion':
        this.cancelarbloquearHabitacion();
      break;
    }
  }

  PostCocinaBar() {
    // Huella ó Login Normal
    this.postingModel.credencial.tipoCredencial = ( this.postingModel.credencial.token ) ? 2 : this.loginModel.tipoCredencial;

    this.postingModel.credencial.identificadorUsuario = this.loginModel.identificadorUsuario;
    this.postingModel.credencial.valorVerificarStr = this.loginModel.valorVerificarStr;

    if (this.modoAutorizacion == 'restaurante') {
      this.cocinaBarService.PostComanda(this.postingModel).subscribe((response: any) => {
        if (response.result && response.status == 200) {
          // Fingerprint Local Services
          this.stopFingerprintServices();

          this.envioData.emit(response);
        } else {
          this.messageHuellaNoValida('No tienes permisos');
        }
      });
    } else if (this.modoAutorizacion == 'bar') {
      this.cocinaBarService.PostComanda(this.postingModel).subscribe((response: any) => {
        if (response.result && response.status == 200) {
        // Fingerprint Local Services
        this.stopFingerprintServices();

        this.envioData.emit(response);
      } else {
        this.messageHuellaNoValida('No tienes permisos');
      }
    });
    }
  }

  PostRoomServiceOrder() {
    if (this.modoAutorizacion == 'room-service') {
      this.cocinaBarService.PostComanda(this.postingModel)
        .subscribe((response: any) => {
          this.envioData.emit(response);
      });
    }
  }

  OpenModal(modo: string, formulario: NgForm, rent: RentaHabitacionModel) {
    if (!formulario.valid) {
      Object.values(formulario.controls).forEach(control => {
        control.markAsTouched();
      });
    } else {
      $('.modal-huella').modal('toggle');
      document.querySelector('.modal-backdrop').remove();
      this.SetModoAutorizacion(modo);
      this.renta = rent;
      this.formRenta = formulario;
    }
  }

  OpenModalAutorizarRestablecimientoPassword(modo: string) {
    $('#restablecerContrasenaModal').modal('hide');
    $('.modal-huella').modal('toggle');
    document.querySelector('.modal-backdrop').remove();
    this.SetModoAutorizacion(modo);
  }

  OpenModaCancelarComanda(modo: string, idComanda:number) {
    $('#huellaAutorizarOrden').modal('show');

    this.SetModoAutorizacion(modo);
    this.idComanda = idComanda;
  }


  OpenModaModificarComanda(
      modo: string,
      postingModel: any,
      idComandaModificar: any,
      idHabitacion: any,
      orderlistCortesia: any
  ){
    // Fingerprint Local Services
    this.startFingerprintServices();

    $('#modificarComandaHuella').modal('toggle');

    this.postingModel = postingModel;
    this.idComanda = idComandaModificar;
    this.idHabitacion = idHabitacion;
    this.orderlistcortesia = orderlistCortesia;

    this.SetModoAutorizacion(modo);
  }

  OpenModalCortesiaComanda(modo: string, idComanda: any, valor: any) {
    this.idComanda = idComanda;
    this.valor = valor;
    this.referencia = $('#observCortesiaRoomService').val();

    if(this.referencia == ""){
      $('#huellaAutorizarOrden').modal('hide');
      $('#ModalMetodosPagoComanda').modal('show');

      this.error = { error: "Favor de agregar Motivo de cortesia"};
      this.interfaceRoomService.validateCortesia(this.error);
    } else {

      $('#huellaAutorizarOrden').modal('toggle');
      $('#ModalMetodosPagoComanda').modal('toggle');

      this.SetModoAutorizacion(modo);
    }
  }

  AplicaRentaHabitacion() {
    if (this.loginModel.identificadorUsuario != null && this.formRenta != null) {

      this.renta.Subtotal = this.renta.Total ? this.renta.Total : 0;
      this.renta.MontoTarjetaMixto = this.renta.MontoTarjetaMixto == null ? this.renta.MontoTarjetaMixto = 0 : this.renta.MontoTarjetaMixto;
      this.renta.MontoEfectivoMixto = this.renta.MontoEfectivoMixto == null ? this.renta.MontoEfectivoMixto = 0 : this.renta.MontoEfectivoMixto;
      this.renta.propina = this.renta.propina == null ? this.renta.propina = 0 : this.renta.propina;
      this.renta.credencial.IdentificadorUsuario = this.loginModel.identificadorUsuario;
      this.renta.credencial.TipoCredencial = this.loginModel.tipoCredencial;
      this.renta.credencial.ValorVerificarStr = this.loginModel.valorVerificarStr;
      this.renta.user = sessionStorage.user;

      this.renta.credencial.TipoCredencial = ( this.renta.credencial.Token ) ? 2 : 1;

      //deshabilitacontroles
      // $("[id*='observCortesia']").attr('disabled', 'disabled');
      // $("[id*='empleadoInt']").attr('disabled', 'disabled');
      // $("[id*='mConsumo']").attr('disabled', 'disabled');
      //deshabilita botones de modal huella

      $("[class*='btnoc']").hide();
      this.loader = true;

      this.incioService.RentarHabitacion(this.renta)
        .subscribe((response: any) => {
          if (response.success == true || response.ok == true) {
            // Ocultar Botones
            $("[id*='btnExitHuella']").attr('disabled', false);
            $("[id*='btnOkHuella']").attr('disabled', false);

            // Fingerprint Local Services
            this.stopFingerprintServices();
            // Valida Renta
            this.ValidaRentaAplicada(response, this.renta.IdHabitacion);

          } else {
            $("[class*='btnoc']").show();
            this.loader = false;
            this.messageHuellaNoValida('No tienes permisos');
          }
        });

    }
  }

  ValidaRentaAplicada(response: any , idHabitacion: number = 0) {
    if (response.success == true || response.ok == true) {
      // Socket
      this.actualizarHabitaciones.emit(idHabitacion);
    } else {
      $('#errorModal').modal('toggle');
      this.loader = false;
      $("[class*='btnoc']").show();
    }
  }

  validarAutorizacionRestablecerPassword() {
    $("#NoAutorizado").hide();
    let login = this.loginModel;

    this.loginService.Autorizacion(login)
      .subscribe((response: any) => {

      if (response.status == 200) {
        $('#loaderIndexLogin').modal('hide');//ocultamos el modal
        $('body').removeClass('modal-open');//eliminamos la clase del body para poder hacer scroll
        $('.modal-backdrop').remove();

        $("#AutorizarModal").modal('hide');//ocultamos el modal
        $('body').removeClass('modal-open');//eliminamos la clase del body para poder hacer scroll
        $('.modal-backdrop').remove();//eliminamos el backdrop del modal

        sessionStorage.setItem("userstr", login.identificadorUsuario),
        sessionStorage.setItem("valorVerificarStr", login.valorVerificarStr);
        sessionStorage.setItem("tipoCredencial", login.tipoCredencial.toString());
        sessionStorage.setItem("token", login.token);

        // Servicios Locales De Huella
        this.stopFingerprintServices();

        this.router.navigate(['/restablecerContrasena']);

      } else {
        this.resetFingerprintToken();
        this.messageHuellaNoValida('No tienes permisos');
      }
    });


  }

  cancelarComanda() {
    $('#loaderHuella').modal('show');

    let login = this.loginModel;
    login.valorVerificarStr

    this.loginService.Autorizacion(login)
      .subscribe((response: any) => {
        if (response.status == 200) {
          $('#loaderIndexLogin').modal('hide');//ocultamos el modal

          $('#huellaAutorizarOrden').modal('hide');
          $('body').removeClass('modal-open');
          $('.modal-backdrop').remove();

          sessionStorage.setItem("userstr", login.identificadorUsuario);
          sessionStorage.setItem("valorVerificarStr", login.valorVerificarStr);
          sessionStorage.setItem("idComanda",this.idComanda);
          sessionStorage.setItem("tipoCredencial", login.tipoCredencial.toString());
          sessionStorage.setItem("token", login.token);

          // Servicios Locales De Huella
          this.stopFingerprintServices();

          $('#CancelacionModal').modal('toggle');
        } else {
          this.resetFingerprintToken();
          this.messageHuellaNoValida('No tienes permisos');
        }
    }, (error) => {
      this.resetFingerprintToken();
      this.messageHuellaNoValida('No tienes permisos');
    });
  }

  salir() {
    // Fingerprint Local Services
    this.stopFingerprintServices();

    $("#NoAutorizado").hide();

    this.loginModel = {
      identificadorUsuario: '',
      sinValor: false,
      // valorVerificarBin: '',
      tipoCredencial: 1,
      valorVerificarStr: ''
    };

    $('.modal-huella').modal('hide');
    $('.modal-roomservice').modal('hide');
    $('.modal-autorizarOrden').modal('hide');
    //$('#btnExitHuella').modal('hide');//ocultamos el modal
    $('body').removeClass('modal-open');//eliminamos la clase del body para poder hacer scroll
    $('.modal-backdrop').remove();

    this.interfaceRoomService.SetReinciarIdComanda();
  }

  AutorizarModificarComanda() {
    let usu = $('#userName').val();
    let pass = $('#contrasena').val();

    var comandaModificaVM = {
      orderLits: this.postingModel,
      orderlistcortesia: this.orderlistcortesia,
      idComandaModificar: this.idComanda,
      idHabitacion: this.idHabitacion,
      user:{
        usuario: usu,
        contrasena: pass,
        tipoCredencial: this.loginModel.tipoCredencial,
        token: this.loginModel.token
      }
    }
    this.interfaceRoomService.SetObtenerModificarCoamnda(comandaModificaVM);
  }

  RoomServiceCortesia() {
    let pagoCortesia = {
        IdComanda: this.idComanda,
        marcarComoCortesia: true,
        pagos: [{
            Valor: this.valor,
            TipoPago: 6,
            referencia: this.referencia
        }],
        credencial: {
          TipoCredencial: this.loginModel.tipoCredencial,
          IdentificadorUsuario: this.loginModel.identificadorUsuario,
          ValorVerificarStr: this.loginModel.valorVerificarStr,
          Token: this.loginModel.token
        },
        user: this.user
      }

      this.roomservService.PagoComanda(pagoCortesia)
        .subscribe( async (response: any) => {
          if (response.body.result == true) {
            // Socket
            this.actualizarHabitaciones.emit( (await sessionStorage.idHabitacion) );

            $('#huellaAutorizarOrden').modal('hide');
            $('body').removeClass('modal-open');
            $('.modal-backdrop').remove();

            // Fingerprint Local Services
            this.stopFingerprintServices();
          } else {
            this.messageHuellaNoValida('No tienes permisos');
          }
      });
  }

  verContrasenaHuella(e) {
    var target = e.target || e.srcElement || e.currentTarget;
    var idAttr = target.attributes.id;
    var value = idAttr.nodeValue;
    var parent = e.target.parentNode;
    var input = e.target.previousSibling;
    if(input.type == "password"){
      input.type = "text";
    } else {
      input.type = "password";
    }
  }

  inhabilitarReporteMatricula(modo: string, idMatricula: any, idTipoReporte: any){
    $('#InhabilitarMatricula').modal('hide');
    $('#huellaInhabilitarMatricula').modal('toggle');
    $('body').removeClass('modal-open');//eliminamos la clase del body para poder hacer scroll
    this.SetModoAutorizacion(modo);
    this.idMatricula = idMatricula;
    this.idTipoReporte = idTipoReporte;
  }

  InhabilitarMatricula (){
    $('#loaderHuella').modal('show');
    let matricula = $('#matricula').val();

    let login = this.loginModel;

    this.loginService.Autorizacion(login)
      .subscribe((response: any) => {
        if (response.status == 200) {
          this.matriculaService.InhabilitarMatricula(this.idMatricula, this.user)
            .toPromise().then((response: any) => {
              if(response.status == 200){
                $('body').removeClass('modal-open');//eliminamos la clase del body para poder hacer scroll
                //ocultamos el modal de la huella
                $('#huellaInhabilitarMatricula').modal('hide');
                //mostramos el modal de exito al deshabilitar
                $('#InhabilitarMatriculaExito').modal('show');
                $('#mat_' + this.idMatricula).removeClass('reportes-box-positivo');
                $('#mat_' + this.idMatricula).removeClass('reportes-box-negativo');
                $('#mat_' + this.idMatricula).removeClass('reportes-box-neutro');

                if(this.idTipoReporte == 1 ){
                  $('#mat_' + this.idMatricula).addClass('reportes-box_checked-positivo');
                  $('#estatus_1').text('Inhabilitado-positivo');
                }else if(this.idTipoReporte == 2){
                  $('#mat_' + this.idMatricula).addClass('reportes-box_checked-negativo');
                  $('#estatus_2').text('Inhabilitado-negativo');
                }else if(this.idTipoReporte == 3){
                  $('#mat_' + this.idMatricula).addClass('reportes-box_checked-neutro');
                  $('#estatus_3').text('Inhabilitado');
                }
              }
            });
        } else {
          this.messageHuellaNoValida('No tienes permisos');
          this.resetFingerprintToken();
          //$('body').removeClass('modal-open');//eliminamos la clase del body para poder hacer scroll
          //$("#NoAutorizado").removeClass('d-none');
          //throw new Error("Usuario no tiene autorización favor de validar");
        }
      });

  }

  cancelarPorCobrar(modo: string, idHabitacion:any){
    $('#CancelarPendienteModal').modal('hide');
    $('#huella').modal('toggle');
    $('body').removeClass('modal-open');//eliminamos la clase del body para poder hacer scroll
    this.XCobrarModel.idHabitacion = idHabitacion;
    this.SetModoAutorizacion(modo);
  }

  cancelarCobrar(){
    let login = this.loginModel;
    login.valorVerificarStr

    this.XCobrarModel.credencial.TipoCredencial = this.loginModel.tipoCredencial
    this.XCobrarModel.credencial.IdentificadorUsuario = this.loginModel.identificadorUsuario;
    this.XCobrarModel.credencial.ValorVerificarStr = this.loginModel.valorVerificarStr;

    let object = {
      idHabitacion: this.XCobrarModel.idHabitacion,
      credencial:{
        TipoCredencial:this.loginModel.tipoCredencial,
        IdentificadorUsuario: this.loginModel.identificadorUsuario,
        ValorVerificarStr:this.loginModel.valorVerificarStr,
        Token:this.loginModel.token
      }
    }

    this.loginService.Autorizacion(login)
      .subscribe((response: any) => {
        if( response.success )
        {
          $("[id*='loader-skeleton']").modal('toggle');
          $('#huella').modal('toggle');
          this.incioService.CancelarPendientePorCobrar(object)
            .toPromise().then((response:any) =>{
              this.stopFingerprintServices();
              window.location.reload();
            });
        } else {
          this.messageHuellaNoValida('No tienes permisos');
          this.resetFingerprintToken();
        }
      });
  }

  cancelarExtra(modo: string, idHabitacion:any){
    $('#salirModalExtra').modal('toggle');
    $('#huella').modal('toggle');
    this.SetModoAutorizacion(modo);
    this.idHabitacion = idHabitacion;
  }

  cancelarHabitacionExtra(){
    let login = this.loginModel;
    this.loginService.Autorizacion(login)
      .subscribe((response: any) => {
        if (response.status == 200) {
          // Loader
          this.loader = true;
          $('#huella').modal('toggle');

          this.extrasService.CancelarOcupacion(this.idHabitacion)
            .toPromise().then((response: any) => {
              if(response.status == 200) {
                // Socket
                this.actualizarHabitaciones.emit(this.idHabitacion);
              }
            }).catch(err => {
              $('#errorTextCancelarExtra').text('');
              if(err.status == 500){
                if(err.error ){
                  $('#errorTextCancelarExtra').text(err.error);
                  $('#cancelarExtraFallo').modal('toggle');
                }
              }
            });
        } else {
          this.messageHuellaNoValida('No tienes permisos');
          this.resetFingerprintToken();
        }
    });
  }

  pagarPorCobrar(modo: string, formulario:NgForm, rent:any, datos:any, TotalXCobrar){
    if (!formulario.valid) {
      Object.values(formulario.controls).forEach(control => {
        control.markAsTouched()
      });
    } else {
      $('.modal-huella').modal('toggle');
      document.querySelector('.modal-backdrop').remove();
      this.SetModoAutorizacion(modo);
      this.renta = rent;
      this.formRenta = formulario;
      this.datosHPorCobrar = datos;
      this.TotalXCobrar = TotalXCobrar;
    }
  }

  AplicaRentaHabitacionXCobrar(){
    let login = this.loginModel;

    this.loginService.Autorizacion(login)
      .subscribe((response: any) => {
        if ( response.success ) {
          this.loader = true;
          //$('#huella').modal('toggle');
          $("[class*='btnoc']").hide();

          let modelCortesia = {
            idHabitacion:0,
              informacionPagos: [{
                  Valor:0,
                  TipoPago:0,
                  Referencia:''
                }],
              credenciales: {
                  TipoCredencial: 0,
                  IdentificadorUsuario:'',
                  ValorVerificarStr:'',
                  ValorVerificarBin:null,
                  Token: ''
              },
              user:this.user
          }

          let modelInterno = {
            idHabitacion:0,
              informacionPagos: [{
                  Valor:0,
                  TipoPago:0
                }],
              consumo:{
                idEmpleadoConsume:"",
                Motivo:""
              },
              credenciales: {
                  TipoCredencial: 0,
                  IdentificadorUsuario:"",
                  ValorVerificarStr:"",
                  ValorVerificarBin:null,
                  Token: ''
                },
              user:this.user
          }

          if(this.renta.TipoPago == 6) {//Pago por cortesia
            modelCortesia.idHabitacion                      = this.datosHPorCobrar.idHAbitacion;
            modelCortesia.credenciales.IdentificadorUsuario = this.loginModel.identificadorUsuario;
            modelCortesia.credenciales.TipoCredencial       = this.loginModel.tipoCredencial;
            modelCortesia.credenciales.ValorVerificarStr    = this.loginModel.valorVerificarStr;
            modelCortesia.credenciales.Token                = this.loginModel.token;

            let modelinfoCortesia = {
              Valor: this.TotalXCobrar,
              TipoPago:this.renta.TipoPago,
              Referencia:this.renta.Referencia
            }
            modelCortesia.informacionPagos.pop();
            modelCortesia.informacionPagos.push(modelinfoCortesia);

            this.incioService.PagoPorCobrar(modelCortesia)
              .toPromise().then((response: any) =>{
                this.ValidaRentaAplicada(response, modelCortesia.idHabitacion);
              }).catch(err =>{
                console.log(err);
              });
          }
          else if(this.renta.TipoPago == 7){//Pago consumo interno
            modelInterno.idHabitacion                       = this.datosHPorCobrar.idHAbitacion;
            modelInterno.credenciales.IdentificadorUsuario  = this.loginModel.identificadorUsuario;
            modelInterno.credenciales.TipoCredencial        = this.loginModel.tipoCredencial;
            modelInterno.credenciales.ValorVerificarStr     = this.loginModel.valorVerificarStr;
            modelInterno.credenciales.Token                 = this.loginModel.token;

            modelInterno.consumo.Motivo                     = this.renta.MotivoConsumo;
            modelInterno.consumo.idEmpleadoConsume          = this.renta.idEmpleadoInterno.toString();

            let modelinfoInterno = {
              Valor: this.TotalXCobrar,
              TipoPago:this.renta.TipoPago
            }

            modelInterno.informacionPagos.pop();
            modelInterno.informacionPagos.push(modelinfoInterno);

            this.incioService.PagoPorCobrar(modelInterno)
              .toPromise().then((response: any) =>{
                this.ValidaRentaAplicada(response, modelInterno.idHabitacion);
              }).catch(err =>{
                console.log(err);
              });
          }
        } else {
          this.messageHuellaNoValida('No tienes permisos');
          this.resetFingerprintToken();
        }


      });
  }

  aceptarBloqueoHabitacion(modo: string, idHabitacion:any){
    $('#bloqueo_fallo').text('');
    let detalles = $('#detalles_bloqueo').val();
    detalles = detalles.trim();
    if (detalles.length != 0 ){
      $('#bloqueoHabitacion').modal('toggle');
      $('#huella').modal('toggle');
      this.SetModoAutorizacion(modo);
      this.idHabitacion = idHabitacion;
    } else {
      $('#bloqueo_fallo').text('La descripcion no puede ir vacia');
    }
  }

  bloquearHabitacion(){
    let login = this.loginModel;
    let descripcion = $('#detalles_bloqueo').val();
    //lanzamos el loader del skeleton
    this.loginService.Autorizacion(login)
    .subscribe((response: any) => {
      if (response.status == 200) {
        // Loader
        this.loader = true;
        $('#huella').modal('toggle');

        let bloquearHabitacion = {
          "IdHabitacion": this.idHabitacion,
          "Descripcion": descripcion,
          "credencial":
          {
            TipoCredencial:2,
            "Token":this.user
          }
        }

        this.incioService.BloqueoRentaHabitacion(bloquearHabitacion).toPromise().then((response: any) => {
          if(response.status == 200){
            // Sockets
            this.actualizarHabitaciones.emit(this.idHabitacion);
          }else{
            $('#BloquearModalError').modal('toggle');
          }
        }).catch(err =>{
            $('#BloquearModalError').modal('toggle');
        })
      }else{
        this.messageHuellaNoValida('No tienes permisos');
        this.resetFingerprintToken();
      }
    });
  }

  cancelarBloqueoHabitacion(modo: string, idHabitacion:any){
    $('#cancelarBloqueoHabitacion').modal('toggle');
    $('#huella').modal('toggle');
    this.SetModoAutorizacion(modo);
    this.idHabitacion = idHabitacion;
  }

  cancelarbloquearHabitacion(){
    let login = this.loginModel;

    this.loginService.Autorizacion(login)
      .subscribe((response: any) => {
        if (response.status == 200) {
          this.incioService.CancelarBloqueoHabitacion(this.idHabitacion).toPromise()
            .then((response: any) => {
              $('#huella').modal('toggle');
              if(response.status == 200){
                // Socket
                this.actualizarHabitaciones.emit(this.idHabitacion);
              }else{
                $('#cancelarBloquearModalError').modal('toggle');
              }
          }).catch(result =>{
            $('#cancelarBloquearModalError').modal('toggle');
          });
        } else {
          this.resetFingerprintToken();
          this.messageHuellaNoValida('No tienes permisos');
        }
    }, (error) => {
      this.resetFingerprintToken();
      this.messageHuellaNoValida('No tienes permisos');
    });
  }

}
