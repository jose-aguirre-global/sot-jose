import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-lista-corte',
  templateUrl: './lista-corte.component.html',
  styleUrls: ['./lista-corte.component.css']
})
export class ListaCorteComponent implements OnInit {

  @Input('data') data: any = {};
  @Input('idCorte') idCorte: number = 0;

  constructor() { }

  ngOnInit(): void {
  }


}
