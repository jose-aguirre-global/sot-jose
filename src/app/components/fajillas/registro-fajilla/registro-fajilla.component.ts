import { Component, OnInit } from '@angular/core';

interface Fajilla{
  valor: number;
  contador: number;
  sumatoria: number;
}

@Component({
  selector: 'app-registro-fajilla',
  templateUrl: './registro-fajilla.component.html',
  styleUrls: ['./registro-fajilla.component.css']
})
export class RegistroFajillaComponent implements OnInit {

  // Total
  total           : number = 0;

  // Pesos
  totalPesos      : number = 0;

  // Euros
  precioEuro      : number = 23.60;
  contadorEuros   : number = 0;
  totalEuros      : number = 0;

  // Dolares
  precioDolar     : number = 22.20;
  contadorDolares : number = 0;
  totalDolares    : number = 0;

  estructuraFajilla: Fajilla[] = [];

  constructor() { }

  ngOnInit(): void {
    this.limpiarFajilla();
  }

  limpiarFajilla(){
    this.total              = 0;

    this.totalPesos         = 0;

    this.contadorEuros      = 0;
    this.totalEuros         = 0;

    this.contadorDolares    = 0;
    this.totalDolares       = 0;

    this.estructuraFajilla  = [
      { valor: 1000, contador: 0, sumatoria: 0},
      { valor: 500, contador: 0, sumatoria: 0},
      { valor: 200, contador: 0, sumatoria: 0},
      { valor: 100, contador: 0, sumatoria: 0},
      { valor: 50, contador: 0, sumatoria: 0},
      { valor: 20, contador: 0, sumatoria: 0},
      { valor: 10, contador: 0, sumatoria: 0},
      { valor: 5, contador: 0, sumatoria: 0},
      { valor: 2, contador: 0, sumatoria: 0},
      { valor: 1, contador: 0, sumatoria: 0},
      { valor: 0.5, contador: 0, sumatoria: 0}
    ];
  }

  eventoFajilla(){
    this.totalPesos = 0;
    for(let i of this.estructuraFajilla) this.totalPesos+=i.sumatoria;
    this.total = this.totalPesos+this.totalEuros+this.totalDolares;
  }

  aumentarDolar( cantidad: number ){
    this.contadorDolares            += cantidad;
    if( this.contadorDolares < 0 )  this.contadorDolares = 0;
    this.totalDolares               = this.precioDolar*this.contadorDolares;
    this.total                      = this.totalPesos+this.totalEuros+this.totalDolares;
    if( this.total > 5000 )         this.aumentarDolar(-1);
  }

  aumentarEuro( cantidad: number ){
    this.contadorEuros            += cantidad;
    if( this.contadorEuros < 0 )  this.contadorEuros = 0;
    this.totalEuros               = this.precioEuro*this.contadorEuros;
    this.total                    = this.totalPesos+this.totalEuros+this.totalDolares;
    if( this.total > 5000 )         this.aumentarEuro(-1);
  }
}
