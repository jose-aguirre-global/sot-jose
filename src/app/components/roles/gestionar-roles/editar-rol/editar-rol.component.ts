import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-editar-rol',
  templateUrl: './editar-rol.component.html',
  styleUrls: ['./editar-rol.component.css']
})
export class EditarRolComponent implements OnInit {

  @Input('idRolEditar') idRolEditar: number;

  permisosAyB: any = {
    tipo: 'ayb',
    titulo: 'Alimentos y Bebidas'
  };

  constructor() { }

  ngOnInit(): void {
  }

}
