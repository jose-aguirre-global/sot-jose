import { Component, OnDestroy, OnInit } from '@angular/core';
import { CocinabarService } from 'src/app/services/cocinabar.service';
import { interval, Subscription, timer } from 'rxjs';
import * as moment from 'moment';
import { UtilitiesService } from 'src/app/services/utilities.service';
import { ActivatedRoute } from '@angular/router';
import { ComandasVmModel } from 'src/app/models/comandasVMModel';
import { CocinaSocketService } from 'src/app/services/sockets/cocina.service';

declare var $: any;

@Component({
  selector: 'app-cocinabar',
  templateUrl: './cocinabar.component.html',
  styleUrls: ['./cocinabar.component.css']
})
export class CocinabarComponent implements OnInit, OnDestroy {

  constructor(
    private cocinabarService: CocinabarService,
    private utilities: UtilitiesService,
    private socketCocina: CocinaSocketService,
    private activatedRoute: ActivatedRoute
  ) {
  }

  isDarkMode = true;
  comandas = [];

  cooking = [];
  delivering = [];

  modeAutorization: string;

  isBar: boolean;
  PostingModel: ComandasVmModel = {
    idComanda: 0,
    destino: 0,
    idsArticulosComanda: [],
    credencial: {
      tipoCredencial: 0,
      identificadorUsuario: '',
      valorVerificarStr: '',
      valorVerificarBin: null
    },
    marcarComoCortesia: false,
    pagos: [],
    user:''
  };
  resetPostingModel(){
    this.PostingModel = {
      idComanda: 0,
      destino: 0,
      idsArticulosComanda: [],
      credencial: {
        tipoCredencial: 0,
        identificadorUsuario: '',
        valorVerificarStr: '',
        valorVerificarBin: null
      },
      marcarComoCortesia: false,
      pagos: [],
      user:''
    };
  }

  ngOnInit(): void {
    this.ObtnerCocinaBarData();

    let topNavBar = document.getElementById('topNavBar');

    topNavBar.classList.add('displayNone');

    this.PostingModel.user = sessionStorage.user;

    // Sockets
    this.initSocket();
  }

  ngOnDestroy(): void {
    this.comandasSocket$.unsubscribe();
  }

  // Sockets
  comandasSocket$: Subscription;
  initSocket(){
    this.comandasSocket$ = this.socketCocina.syncComandas()
    .subscribe( () => {
      this.ObtnerCocinaBarData();
    });
  }

  TimeCheck() {
    const contador = interval(30000);

    contador.subscribe((n) => {
      this.SetTimeStamps(this.comandas);

    });
  }

  ObtnerCocinaBarData() {
    this.activatedRoute.params.subscribe(params => {

      this.isBar = params['isbar'] == 1 ? true : false;

      this.modeAutorization = params['isbar'] == 1 ? 'bar' : 'restaurante';

      if (!this.isBar) {
        this.cocinabarService.GetDatosCocina().subscribe((response: any) => {

          this.comandas = response.result;
          this.cooking = this.comandas.filter(el => el.estado == 1);
          this.delivering = this.comandas.filter(el => el.estado == 2);

          this.SetTimeStamps(this.comandas);

          this.TimeCheck();
        })
      } else {
        this.cocinabarService.GetDatosBar().subscribe((response: any) => {

          this.comandas = response.result;

          this.SetTimeStamps(this.comandas);
          this.cooking = this.comandas.filter(el => el.estado == 1);
          this.delivering = this.comandas.filter(el => el.estado == 2);

          this.TimeCheck();
        })
      }

    });

  }

  SetTimeStamps(array = []) {

    let defineElapsed = (minutos) => {

      return minutos < 10 ? 0 :
        minutos > 10 && minutos < 15 ? 1 :
          minutos > 15 ? 2 : 0;

    }

    array.forEach((el) => {
      let behaviorTimer = {
        timeStamp: '',
        elapsed: 0
      }
      let minutos = moment(new Date()).diff(moment(el.fechaInicio), 'minutes');

      behaviorTimer.timeStamp = this.utilities.MinutesToHourMinutes(minutos);
      behaviorTimer.elapsed = defineElapsed(minutos);

      el.timer = behaviorTimer;
    });
  }

  PorEntregar(comanda: any) {
    this.PostingModel.idComanda = comanda.id;
    this.PostingModel.idsArticulosComanda = [];
    this.PostingModel.destino = Number(comanda.destino);
    comanda.articulosComanda.forEach(el => {
      this.PostingModel.idsArticulosComanda.push(el.id);
    });

    this.PostingModel.marcarComoCortesia = false;

    $('#autorizacionModal').modal('toggle');
  }

  Respuesta(data: any) {
    if (data.result && data.status == 200) {
      // Sockets
      this.socketCocina.actualizarComanda( this.PostingModel.destino );

      this.resetPostingModel();
      $('#autorizacionModal').modal('hide');
    }
  }

}
