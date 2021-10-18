import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ConfiguracionPropinasModel } from 'src/app/models/configPropinas';
import { PropinasService } from 'src/app/services/propinas.service';

@Component({
  selector: 'app-sistemas',
  templateUrl: './sistemas.component.html',
  styleUrls: ['./sistemas.component.css']
})
export class SistemasComponent implements OnInit {

  constructor(private propinasService: PropinasService) { }

  arrPorcentajeAcumulado = [];
  arrPorcentajeDesc = [];
  arrDias = [];
  userTemp: string;

  configuracionPropinasModel: ConfiguracionPropinasModel[] = [];

  newPropina : {
    user: number,
    propinasVMs:[]
  }

  async ngOnInit() {
    await this.propinasService.GetPropinas(sessionStorage.user).subscribe((response: any) => {

      this.arrPorcentajeAcumulado = response.porcentajesPropinaTipo;
      this.arrPorcentajeDesc = response.porcentajesTarjeta;
      this.arrDias = response.fondosDia;

      this.SetPorcentajeAcumuladoLabels();
      this.SetTarjetasLabels();
      this.SetDiasSemana();

      this.userTemp = sessionStorage.user;

    });


  }

  SetPorcentajeAcumuladoLabels() {

    this.arrPorcentajeAcumulado.forEach((el) => {
      switch (el.idLineaArticulo) {
        case 1797:
          el.label = 'Alimentos'
          break;
        case 1798:
          el.label = 'Bebidas'
          break;
        case 1799:
          el.label = 'Spa & Sex'
          break;
        case 1864:
          el.label = 'Otros'
          break;
      }
    })

  }

  SetTarjetasLabels() {

    this.arrPorcentajeDesc.forEach((el) => {
      switch (el.idTipoTarjeta) {
        case 1:
          el.label = 'Visa'
          break;
        case 2:
          el.label = 'MasterCard'
          break;
        case 3:
          el.label = 'American Express'
          break;

      }
    })

  }

  SetDiasSemana() {
    const semana = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo'];

    this.arrDias.forEach((el) => {
      el.label = semana[el.dia - 1];
    })
  }

  AddElementToPostList(id: number, value: number, section: number) {

    let index = -1;

    // let newElement: ConfiguracionPropinasModel = {
    //   id: id,
    //   modificado: true,
    //   valor: value,
    //   seccion: section,
    //   user: this.userTemp
    // }

    let newPropina = {
      user: this.userTemp,
      propinasVMs:[]
    }

    let propinasVMs =
    {
      Id: id ,
      Valor: value,
      Modificado: true,
      Seccion: section
    }

    newPropina.propinasVMs.push(propinasVMs);
  }

  SendPut() {

    this.propinasService.PutPropinas(this.newPropina).subscribe((response) => {
    })
  }
}
