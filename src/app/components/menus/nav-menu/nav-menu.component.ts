import { Time } from '@angular/common';
import { Component, OnInit } from '@angular/core';


declare var $: any;

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent implements OnInit {

  fecha = new Date();
  time=new Date();

  constructor() {}

  ngOnInit(): void {
    setInterval(() => {
      this.time = new Date();
    }, 1000);


    // debugger
  }

  isExpanded = false;

  collapse() {
    this.isExpanded = false;
  }

  toggle() {
    this.isExpanded = !this.isExpanded;
  }

  ToggleNav() {
    $('#sidebar, #content, #app-header, #boton-menu').toggleClass('active');
    this.isExpanded = !this.isExpanded;

    var ancho = screen.width
    if(ancho < 768 && this.isExpanded == true){
      $('#collapseExample2').hide();
    }else{
      $('#collapseExample2').show();
    }
  }






}
