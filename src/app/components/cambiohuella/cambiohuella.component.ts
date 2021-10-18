import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginModel } from 'src/app/models/loginModel';
import { LoginService } from 'src/app/services/login.service';


declare var $: any;

@Component({
  selector: 'app-cambiohuella',
  templateUrl: './cambiohuella.component.html',
  styleUrls: ['./cambiohuella.component.css']
})
export class CambiohuellaComponent implements OnInit {

  constructor(
    private loginService: LoginService,
    private router: Router) { }

  isHuella = false;
  isContrasena = true;

  loginModel: LoginModel = {
    identificadorUsuario: '',
    sinValor: false,
    // valorVerificarBin: '',
    tipoCredencial: 1,
    valorVerificarStr: ''
  };

  ngOnInit(): void {

    let user = sessionStorage.getItem("userstr");
    let pass = sessionStorage.getItem("valorVerificarStr");
    let userTemp = sessionStorage.user;

    if ((user == null || user == undefined) || (pass == null || pass == undefined)) {
      this.router.navigate(['/login']);
    }
  }

  esContrasena() {
    if (this.isContrasena)
      this.isHuella = false;
  }

  esHuella() {
    this.isHuella = false;
  }
  recibir(mensaje: any) {
    this.loginModel = mensaje;
  }

  modificarContrasena() {
    $('#usuarioNull').hide();
    $('#PassNull').hide();
    $('#verfPassNull').hide();
    $('#passCom').hide();
    $('#regexPass').hide();

    let cargo: any = document.getElementById('cargo');
    let newpass: any = document.getElementById('newpass');
    let confirmpass: any = document.getElementById('confirmpass');

    let usuario = cargo.value;
    let pass = newpass.value;
    let passConfirm = confirmpass.value;

    usuario.trim();
    pass.trim();
    passConfirm.trim();

    let esCorrecto = this.validacionUser(usuario, pass, passConfirm);

    if (esCorrecto) {
      if (pass != passConfirm)
        $('#passCom').show();
      else {
        const tipoCredencial = sessionStorage.getItem("tipoCredencial");
        var DtoAutorizacion = {
          credencialAutoriza: {
            identificadorUsuario: sessionStorage.getItem("userstr"),
            valorVerificarStr: sessionStorage.getItem("valorVerificarStr"),
            tipoCredencial: ( tipoCredencial ) ? tipoCredencial : 1,
            token: sessionStorage.getItem("token")
          },
          credencialSolicita: {
            identificadorUsuario: usuario,
            valorVerificarStr: pass,
            tipoCredencial: 1
          }
        };

        console.log(DtoAutorizacion);

        this.loginService.CambioContrasena(DtoAutorizacion)
          .subscribe((response: any) => {
            if (response.result == true) {
              sessionStorage.removeItem("userstr");
              sessionStorage.removeItem("valorVerificarStr");
              sessionStorage.removeItem("tipoCredencial");
              sessionStorage.removeItem("token");
              $('#modalModificadoExitoso').modal('toggle');
            } else {
              $('#modalModificadoError').modal('toggle');
            }
          });
      }

    }
  }

  validacionUser(usuario, pass, verfpass) {

    var validado = true;

    if (usuario == null || usuario == undefined || usuario == "") {
      $('#usuarioNull').show();
      return false;
    }

    if (pass == null || pass == undefined || pass == "") {
      $('#PassNull').show();
      return false;
    }

    if (verfpass == null || verfpass == undefined || verfpass == "") {
      $('#verfPassNull').show();
      return false;
    }

    var validaContrasena = /^(?=\w*\d)(?=\w*[A-Z])(?=\w*[a-z])\S{8,16}$/;

    if(!validaContrasena.test(pass))
    {
      $('#regexPass').show();
      return false;
    }

    return validado;
  }

  CambioCorrecto() {
    $('#modalModificadoExitoso').modal('hide');//ocultamos el modal
    $('body').removeClass('modal-open');//eliminamos la clase del body para poder hacer scroll
    $('.modal-backdrop').remove();//eliminamos el backdrop del modal
    this.router.navigate(['/login']);
  }

  CambioError() {
    $('#modalModificadoError').modal('hide');//ocultamos el modal
    $('body').removeClass('modal-open');//eliminamos la clase del body para poder hacer scroll
    $('.modal-backdrop').remove();//eliminamos el backdrop del modal

  }

  Salir()
  {
    sessionStorage.removeItem("userstr");
    sessionStorage.removeItem("valorVerificarStr");
    sessionStorage.removeItem("tipoCredencial");
    sessionStorage.removeItem("token");
    this.router.navigate(['/login']);
  }



}
