import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-menu-operaciones',
  templateUrl: './menu-operaciones.component.html',
  styleUrls: ['./menu-operaciones.component.css']
})
export class MenuOperacionesComponent implements OnInit {

  constructor() { }

  @Output() abrirModal: EventEmitter <string> = new EventEmitter();

  ngOnInit(): void {
  }

}
