import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-lista-permisos',
  templateUrl: './lista-permisos.component.html',
  styleUrls: ['./lista-permisos.component.css']
})
export class ListaPermisosComponent implements OnInit {

  @Input('data') data: any = {};
  @Input('idRol') idRol: number = 0;

  constructor() { }

  ngOnInit(): void {
  }

}
