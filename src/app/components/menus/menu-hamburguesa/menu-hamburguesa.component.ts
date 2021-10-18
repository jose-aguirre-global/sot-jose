import { Component, OnInit, Output,  EventEmitter } from '@angular/core';

@Component({
  selector: 'app-menu-hamburguesa',
  templateUrl: './menu-hamburguesa.component.html',
  styleUrls: ['./menu-hamburguesa.component.css']
})
export class MenuHamburguesaComponent implements OnInit {

  @Output() toggleMenuCortes: EventEmitter<string> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  AbrirMenu(menu:string){
    this.toggleMenuCortes.emit(menu);
  }

}
