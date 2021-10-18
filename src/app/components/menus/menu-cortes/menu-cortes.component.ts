import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-menu-cortes',
  templateUrl: './menu-cortes.component.html',
  styleUrls: ['./menu-cortes.component.css']
})
export class MenuCortesComponent implements OnInit {

  constructor() { }

  @Output() abrirModal: EventEmitter <string> = new EventEmitter();

  ngOnInit(): void {
  }

}
