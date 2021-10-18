import { Component, OnInit } from '@angular/core';
import { pluck } from 'rxjs/operators';
import { ControlGastosService } from 'src/app/services/cortes/control-gastos.service';

@Component({
  selector: 'app-control-gastos',
  templateUrl: './control-gastos.component.html',
  styleUrls: ['./control-gastos.component.css']
})
export class ControlGastosComponent implements OnInit {

  listaCortes: any[] = [];

  constructor( private service: ControlGastosService ) { }

  ngOnInit(): void {
    this.getListaCortes();
  }

  getListaCortes(){
    this.service.getResumenesCortesEnRevision()
      .pipe( pluck('result') )
      .subscribe( (data:any) => {
        this.listaCortes = data;
      });
  }

}
