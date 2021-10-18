import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { loginFingerprintResponse, Raw } from 'src/app/models/fingerprint.interface';
import { LoginModel } from 'src/app/models/loginModel';
import { FingerPrintService } from 'src/app/services/fingerprint.service';
import { LoginService } from 'src/app/services/login.service';
import { SocketsService } from 'src/app/services/sockets/sockets.service';
import { UtilitiesService } from 'src/app/services/utilities.service';

declare var $: any;

@Component({
  selector: 'app-indexlogin',
  templateUrl: './indexlogin.component.html',
  styleUrls: ['./indexlogin.component.css']
})
export class IndexloginComponent implements OnInit {

  // Huella
  timeTnterval            : number        = 0;
  fingerScannerObservable : Subscription  = new Subscription();
  fingerLoginObservable   : Subscription  = new Subscription();
  mensajeScannerDetectado : string        = 'No se encontro el lector de huellas.';
  mensajeResultadoLogin   : string        = '';
  usuarioLogin            : string        = '';
  fingerButtonColor       : string        = 'btn-gray fingerButtonClass';
  fingerButtonLogo        : string        = 'icon-manita_fingerprint';

  constructor(
    private loginService: LoginService,
    private utilitiesService: UtilitiesService,
    private fingerService: FingerPrintService,
    private socketService: SocketsService,
    private router: Router) {
    localStorage.removeItem("userstr");
    localStorage.removeItem("valorVerificarStr");
  }

  loginModel: LoginModel = {
    identificadorUsuario: '',
    sinValor: false,
    // valorVerificarBin: '',
    tipoCredencial: 1,
    valorVerificarStr: ''
  };

  intentos = 0;

  showCortina = true;
  behaviorCortina = true;
  AsignarHabitaciones;
  CobrarHabitaciones;
  ConsultarComanda;

  ngOnInit(): void {
    let topNavBar = document.getElementById('topNavBar');
    topNavBar != null ? topNavBar.classList.add('displayNone') : null;

    let user = sessionStorage.user;

    if ((user == null || user == undefined) ) {
      this.router.navigate(['/login']);
    }
    // Iniciar Servicios Huella
    this.startFingerprintServices();
  }

  ngOnDestroy(): void
  {
    this.stopFingerprintServices();
  }

  stopFingerprintServices()
  {
    //this.fingerService.stopAcquisition();
    this.fingerScannerObservable.unsubscribe();
    this.fingerLoginObservable.unsubscribe();
    clearInterval(this.timeTnterval);
  }

  startFingerprintServices()
  {
    this.fingerDevicesInterval();
    this.initFingerScanner();
  }

  fingerDevicesInterval()
  {
    this.timeTnterval = setInterval( async () =>
    {
          if( this.fingerService.devices.length )
          {
            this.fingerButtonColor        = 'btn-redBold fingerButtonClass';
            this.mensajeScannerDetectado  = '';
          }
          else
          {
            this.fingerButtonColor        = 'btn-gray fingerButtonClass';
            this.fingerButtonLogo         = 'icon-manita_fingerprint';
            this.mensajeScannerDetectado  = 'No se encontro el lector de huellas.';
          }
    }, 1500) as any;
  }

  initFingerScanner()
  {
    this.fingerScannerObservable = this.fingerService
      .samplesAcquiredObservable()
      .subscribe( ( raw ) => {

        if($('#cortina').hasClass('fadeOutUp')){
          this.fingerButtonLogo       = 'fa fa-spinner mt-2vh';
          this.mensajeResultadoLogin  = 'Validando...';
          this.sentFingerLogin(raw);
        }

      });
  }

  sentFingerLogin(raw: Raw)
  {
    this.fingerLoginObservable = this.fingerService.login(raw)
      .subscribe( ( response ) => {
        this.mensajeResultadoLogin  = '';
        this.fingerButtonLogo       = 'icon-manita_fingerprint';

        // Login
        const data = this.fingerprintResponse( response );
        this.ingresoUsuario(data);
      },
      (httpError: HttpErrorResponse) => {
        this.fingerButtonLogo       = 'icon-manita_fingerprint';
        this.mensajeResultadoLogin  = 'Huella no reconocida';
        setTimeout( () =>
        {
          this.mensajeResultadoLogin = '';
        }, 2000);
        this.fingerLoginObservable.unsubscribe();
      });
  }

  fingerprintResponse( response: loginFingerprintResponse){
    const permisos = JSON.parse(response.result.usuario.Empleados[0].Puestos[0].Roles[0].permisos);
    return {
      result: {
        id        : response.result.usuario.Empleados[0].Id,
        idUsuario : response.result.usuario.idUsuario,
        alias     : response.result.usuario.Alias,
        user      : response.result.token,
        permisos  : {
          asignarHabitaciones: permisos.AsignarHabitaciones,
          cobrarHabitaciones: permisos.CobrarHabitaciones,
          consultarComandas: permisos.ConsultarComandas
        }
      }
    };
  };

  SessionOpen() {
    //$('#loaderIndexLogin').modal('show');
    $('#usuarioNull').hide();
    $('#PassNull').hide();
    $('#usuarioContrasenaIncorrectos').hide();

    let esValidado = this.validationUsuario(this.loginModel.identificadorUsuario, this.loginModel.valorVerificarStr);

    if (esValidado) {

      this.loginService.Login(this.loginModel).subscribe((response: any) => {
        if (response.status == 200) {
          this.ingresoUsuario(response);
        }
        else {
          this.intentos++;

          if (this.intentos >= 3)
            $('#btnRestablecerContrasena').show();

          $('#usuarioContrasenaIncorrectos').show();
          $('#loaderIndexLogin').modal('hide');//ocultamos el modal
          $('body').removeClass('modal-open');//eliminamos la clase del body para poder hacer scroll
          $('.modal-backdrop').remove();//eliminamos el backdrop del modal
        }

      });

    }
    else {
      $('#loaderIndexLogin').modal('hide');//ocultamos el modal
      $('body').removeClass('modal-open');//eliminamos la clase del body para poder hacer scroll
      $('.modal-backdrop').remove();
    }
  }

  ingresoUsuario(response)
  {
    $('#usuarioContrasenaIncorrectos').hide();
    $('#loaderIndexLogin').modal('hide');//ocultamos el modal
    $('body').removeClass('modal-open');//eliminamos la clase del body para poder hacer scroll
    $('.modal-backdrop').remove();//eliminamos el backdrop del modal

    this.AsignarHabitaciones = response.result.permisos.asignarHabitaciones;
    this.CobrarHabitaciones = response.result.permisos.cobrarHabitaciones;
    this.ConsultarComanda = response.result.permisos.consultarComandas;

    sessionStorage.setItem('identificadorUsuario', this.loginModel.identificadorUsuario);
    sessionStorage.setItem('tipoCredencial', this.loginModel.tipoCredencial.toString());
    sessionStorage.setItem('valorVerificarStr', this.loginModel.valorVerificarStr.toString());
    sessionStorage.setItem('AsignarHabitaciones',this.AsignarHabitaciones.toString());
    sessionStorage.setItem('CobrarHabitaciones',this.CobrarHabitaciones.toString());
    sessionStorage.setItem('ConsultarComanda',this.ConsultarComanda.toString());
    sessionStorage.setItem('idUsuario',response.result.id);
    sessionStorage.setItem('user',response.result.user);
    sessionStorage.setItem('username',response.result.alias);

    this.socketService.login();

    this.utilitiesService.objeto = this.loginModel;

    this.stopFingerprintServices();
    $('#SelectModal').modal({backdrop: 'static', keyboard: false})
    $('#SelectModal').modal('toggle');
  }

  RedirectHotel() {
    $('#SelectModal').modal('toggle');
    // Detiene los servicios de huella
    this.stopFingerprintServices();

    //this.router.navigate(['/hotel']);
    window.location.replace("hotel");
  }

  RedirectRestaurante(modal: boolean, isBar: number) {
    modal ? $('#SelectModal').modal('toggle') : null;
    this.router.navigate(['/cocina-bar', isBar]);
  }

  RedirectRestablecerContrasenaModal() {
    $('#restablecerContrasenaModal').modal('show');
  }

  RedirectSalirModalRestablecerContrasena() {
    $('#restablecerContrasenaModal').modal('hide');//ocultamos el modal
    $('body').removeClass('modal-open');//eliminamos la clase del body para poder hacer scroll
    $('.modal-backdrop').remove();//eliminamos el backdrop del modal
  }

  RedirectAutorizarRestablecerContrasena() {
    $("#restablecerContrasenaModal").modal('hide');//ocultamos el modal
    $('body').removeClass('modal-open');//eliminamos la clase del body para poder hacer scroll
    $('.modal-backdrop').remove();//eliminamos el backdrop del modal
    $('#AutorizarModal').modal('show');
  }

  validationUsuario(usuario, pass) {
    var validado = true;

    if (usuario == null || usuario == undefined || usuario == "") {
      $('#usuarioNull').show();
      return false;
    }

    if (pass == null || pass == undefined || pass == "") {
      $('#PassNull').show();
      return false;
    }
    return validado;
  }

  verContrasena(){
    $('#passwordLogin').attr('type', function(index, attr) {
          return attr == 'text' ? 'password' : 'text';
        })
  }

}
