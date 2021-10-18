import { Component, OnInit } from '@angular/core';

declare var $: any;

@Component({
  selector: 'app-gestionar-roles',
  templateUrl: './gestionar-roles.component.html',
  styleUrls: ['./gestionar-roles.component.css']
})
export class GestionarRolesComponent implements OnInit {

  idRolEditar: number = 0;
  idRolBorrar: number = 0;
  mensajeAlerta: string = '';

  constructor() { }

  ngOnInit(): void {
  }

  crearRol(){
    this.idRolEditar = 0;
    $('#modalEditarRoles').modal('show');
    document.querySelector('.modal-backdrop').remove();
  }

  editarRol( idRolEditar:number = 0 ){
    this.idRolEditar = idRolEditar;
    $('#modalEditarRoles').modal('show');
    document.querySelector('.modal-backdrop').remove();
  }

  modalAlerta( idRolBorrar: number = 0 ){
    this.idRolBorrar = idRolBorrar;
    this.mensajeAlerta = '¿Estás seguro de eliminar el rol de Ama de Llaves?';
    $("#modalMensajeGestionarRoles").modal('show');
    document.querySelector('.modal-backdrop').remove();
  }

  borrarRol(){
    $("#modalMensajeGestionarRoles").modal('hide');
    console.log(this.idRolBorrar);
  }

}
