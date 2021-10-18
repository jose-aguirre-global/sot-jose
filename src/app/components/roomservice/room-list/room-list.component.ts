import { Component, Input, Output, OnInit, EventEmitter, ViewChild, OnChanges } from '@angular/core';
import { RoomservService } from 'src/app/services/roomserv.service';
import { InterfaceComanda } from '../InterfazRoomService';
import { Subscription } from 'rxjs';
import { HuellaComponent } from '../../huella/huella.component';
import { CocinaSocketService } from 'src/app/services/sockets/cocina.service';
import { HabitacionesSocketService } from 'src/app/services/sockets/habitaciones.service';


declare var $: any;

@Component({
  selector: 'app-room-list',
  templateUrl: './room-list.component.html',
  styleUrls: ['./room-list.component.css']
})
export class RoomListComponent implements OnInit {

  @Input()
  datosComandaModificar: any;
  @Output()
  actualizarEdoBtn: EventEmitter<any> = new EventEmitter<any>();

  // Huella Component
  @ViewChild('child_huella') child_huella : HuellaComponent;

  clicEventSubs: Subscription;

  constructor(  private roomservService: RoomservService,
                private habitacionesSocket: HabitacionesSocketService,
                private socketCocina: CocinaSocketService,
                private interfaceComanda: InterfaceComanda
  ) {
    this.clicEventSubs = this.roomservService.GetClicEvent().subscribe((response: any) => {
      if (response === '') {

        this.ResetOrders();
      }
    });

  }

  filterWord: string;
  modelModificar: any;

  numHabitacion = 0;
  idHabitacion = 0;

  idComanda = 0;

  alimentos = [];
  bebidas = [];
  otros = [];
  sexspa = [];

  alimentosView = [];
  bebidasView = [];
  otrosView = [];
  sexspaView = [];

  orderList = [];
  orderCortisiesList = [];

  results = {
    subTotal: 0,
    descuento: 0,
    cortesia: 0,
    total: 0
  };

  showInputs = true;
  activatedCortesy = {
    list: false,
    button: false
  };
  countMix = {
    promo: false,
    quantity: 0
  };

  login =
    {
      identificadorUsuario: '',
      sinValor: false,
      // valorVerificarBin: '',
      tipoCredencial: 1,
      valorVerificarStr: '',
      token: ''
    }

    userTemp: string;

  ngOnInit(): void {
    $('.modal-roomservice').on('shown.bs.modal', () => {
      this.numHabitacion = sessionStorage.numHabitacion;
    })

    this.userTemp = sessionStorage.user;
    this.InfoRoom();


    // localStorage.setItem('idHabitacion', this.idHabitacion.toString());
    // localStorage.setItem('numHabitacion', this.viewNumHabitacion.toString());
    this.numHabitacion = parseInt( localStorage.getItem('numHabitacion') );

    this.orderList = [];

    $('#search').val('');
    this.filterWord = "";
    this.FilterLists('');

    this.interfaceComanda.comandaEmitter.subscribe(
      data => {
          this.ResetOrders();
          this.orderList = [];
          this.orderCortisiesList = [];

          this.idComanda = data;
          this.datosComandaModificar = data;

          if (data != undefined && this.idComanda != 0) {

            if(data.comanda.detalleComandas[0].desc_Linea == "Alimentos"  || data.comanda.detalleComandas[0].desc_Linea == "Bebidas"){
              $("#col-tipo-otros" ).addClass( "disable-tipos" );
              $("#col-tipo-sexspa" ).addClass( "disable-tipos" );
            }else if(data.comanda.detalleComandas[0].desc_Linea == "Spa & Sex" || data.comanda.detalleComandas[0].desc_Linea == "Otros"){
              $("#col-tipo-alimentos" ).addClass( "disable-tipos" );
              $("#col-tipo-bebidas" ).addClass( "disable-tipos" );
            }

            if (data.comanda != undefined) {
              if (data.comanda.idComanda != 0 || data.comanda.idComanda != undefined) {

                data.comanda.detalleComandas.forEach((item) => {
                  this.idComanda = data.comanda.idComanda;

                  let iva = 1.160
                  var sinIva = item.precioUnidadConIva / iva;
                  var sinIvaRedondeo = sinIva.toFixed(3);

                  var el =
                  {
                    id: item.cod_Articulo,
                    name: item.desc_Articulo,
                    priceIva: item.precioUnidadConIva,
                    priceWhitOutIva: sinIvaRedondeo,
                    quantity: item.cantidad
                  }

                  this.activatedCortesy.button = false;

                  if (item.esCortesia){
                    if (item.precioUnidadConIva == 0){
                      this.ActivateCortesyModificarPromo();
                    }else{
                      this.ActivateCortesyModificarPromo();
                    }
                  }

                  this.AddItemOrder(el, item.desc_Linea);
                });

                // Sockets
                this.socketCocina.actualizarComanda();

                this.numHabitacion = data.numHabitacion;
              }
            }
          }

          if(
            data.idComandaModificar != undefined
            &&
            data.orderLits != undefined
            &&
            data.user != undefined
          ){
            this.idComanda = data.idComandaModificar;
            this.datosComandaModificar = data.orderLits;
            this.orderList = data.orderLits;
            this.orderCortisiesList = data.orderlistcortesia;
            this.idHabitacion = data.idHabitacion;
            this.login = {
              identificadorUsuario: data.user.usuario,
              sinValor: false,
              // valorVerificarBin: '',
              tipoCredencial: data.user.tipoCredencial,
              valorVerificarStr: data.user.contrasena,
              token: data.user.token
            };

            this.PostData();
          }
      }
    );
  }

  callbackCortesy(){

  }

  ResetOrders() {
    this.orderList = [];
    this.orderCortisiesList = [];

    this.results = {
      subTotal: 0,
      descuento: 0,
      cortesia: 0,
      total: 0
    };


    this.filterWord = "";
    this.orderList = [];
    this.FilterLists('');

    $( "#col-tipo-alimentos" ).removeClass( "disable-tipos" )
    $( "#col-tipo-bebidas" ).removeClass( "disable-tipos" )
    $( "#col-tipo-otros" ).removeClass( "disable-tipos" )
    $( "#col-tipo-sexspa" ).removeClass( "disable-tipos" )
  }

  InfoRoom() {
    this.roomservService.GetRoomInfo().subscribe((response: any) => {
      this.alimentos = response.result.alimentos;
      this.bebidas = response.result.bebidas;
      this.otros = response.result.otros;
      this.sexspa = response.result.sexSpa;

      this.alimentosView = response.result.alimentos;
      this.bebidasView = response.result.bebidas;
      this.otrosView = response.result.otros;
      this.sexspaView = response.result.sexSpa;
    });
  }

  GetZeros() {

    let filteredAlimentos = this.alimentos.filter((el) => {
      return el.priceWhitOutIva == 0;
    });

    let filteredBebidas = this.bebidas.filter((el) => {
      return el.priceWhitOutIva == 0;
    });
    let filteredOtros = this.otros.filter((el) => {
      return el.priceWhitOutIva == 0;
    });
    let filteredSexspa = this.sexspa.filter((el) => {
      return el.priceWhitOutIva == 0;
    });

    this.alimentosView = filteredAlimentos;
    this.bebidasView = filteredBebidas;
    this.otrosView = filteredOtros;
    this.sexspaView = filteredSexspa;
  }

  FilterLists(word: string) {
    word = word.toLowerCase();

    let isCortesy = word.includes('cortesias') || word.includes('costo cero');

    if (isCortesy) {
      this.GetZeros()
    } else {
      this.alimentosView = this.alimentos.filter(item => item.name.toLowerCase().includes(word));
      this.bebidasView = this.bebidas.filter(item => item.name.toLowerCase().includes(word));
      this.otrosView = this.otros.filter(item => item.name.toLowerCase().includes(word));
      this.sexspaView = this.sexspa.filter(item => item.name.toLowerCase().includes(word));
    }

  }

  ExpandOrder(event, item) {

    let elements = [];

    elements = event.path;
    elements.forEach((el) => {
      if (el.classList != undefined)
        if (el.classList.contains('orders-item')) {
          el.classList.contains('grown-orders-item') ? el.classList.remove('grown-orders-item') : el.classList.add('grown-orders-item');
          el.classList.contains('grown-orders-item') ? item.showControls = true : item.showControls = false;
        }
    });
    // event.target.style.minHeight = "108px";
  }

  ExpandCortesyOrder() {

  }

  AddItemOrder(el: any, type: string, courtesy?: boolean) {

    let added = false;
    el.type = type;
    el.obs = '';

    if(type == "alimentos" || type == "bebidas"){
      $("#col-tipo-otros" ).addClass( "disable-tipos" );
      $("#col-tipo-sexspa" ).addClass( "disable-tipos" );
    }else if(type == "otros" ||type == "sexspa"){
      $("#col-tipo-alimentos" ).addClass( "disable-tipos" );
      $("#col-tipo-bebidas" ).addClass( "disable-tipos" );
    }

    if (this.activatedCortesy.button) {
      //BEGIN CODE FOR ACTIVE COURTESY

      this.orderCortisiesList.forEach((item) => {
        if (item.id === el.id && item.type == type) {
          item.quantity += 1;
          added = true;
        }
      });

      if (added === false) {
        let newElement = Object.assign({}, el);
        if(el.quantity < 1){
          newElement.quantity = 1;
        }
        newElement.cortesia = true;
        this.orderCortisiesList.push(newElement);
        this.OperationsResults(newElement, added);
        this.CheckMixCount();
      } else {
        this.OperationsResults(el, added);
        this.CheckMixCount();
      }
      //END CODE FOR ACTIVE COURTESY
    } else {
      //BEGIN CODE FOR INACTIVE COURTESY
      this.orderList.forEach((item) => {

        if (item.id === el.id && item.type == type) {
          item.quantity += 1;
          added = true;
        }

      });

      if (added === false) {
        if(el.quantity < 1){
          el.quantity = 1;
        }
        //el.quantity = 1;
        el.cortesia = false;

        this.orderList.push(el);
        this.OperationsResults(el, added);

        if (this.countMix.promo == false) {
          el.name.toLowerCase().includes('bot.') ? this.PromoBottle() : null;
        }
      } else {
        this.OperationsResults(el, added);

        if (this.countMix.promo == false) {
          el.name.toLowerCase().includes('bot.') ? this.PromoBottle() : null;
        }
      }
      //END CODE FOR INACTIVE COURTESY
    }

    setTimeout(() => {

      let orderBox = document.getElementById('orderBox');
      orderBox.scrollTop = orderBox.scrollHeight + 31;

      let orderCourtesiesBox = document.getElementById('orderCourtesiesBox');
      if (orderCourtesiesBox != null) {
        orderCourtesiesBox.scrollTop = orderCourtesiesBox.scrollHeight + 31;
      }
    }, 100);



  }

  QuantityOperation(el: any, substract = false) {
    if (!substract) {
      el.quantity += 1;
      this.OperationsResults(el, true);
    } else {
      if (el.quantity > 1) {
        el.quantity -= 1;
        this.OperationsResults(el, true, false);
      }
    }
  }

  OperationsResults(item: any, added = false, plus = true) {
    if (this.activatedCortesy.button) {
      if (plus) {
        added ? this.results.subTotal += item.priceIva : null;
        added ? this.results.cortesia += item.priceIva : null;

        added ? null : this.results.subTotal += item.priceIva;
        added ? null : this.results.cortesia += item.priceIva;
      } else {
        added ? this.results.subTotal -= item.priceIva : null;
        added ? this.results.cortesia -= item.priceIva : null;
      }
    } else {
      if (plus) {
        added ? this.results.subTotal += item.priceIva : null;
        added ? this.results.total += item.priceIva : null;

        added ? null : this.results.subTotal += item.priceIva;
        added ? null : this.results.total += item.priceIva;
      } else {
        added ? this.results.subTotal -= item.priceIva : null;
        added ? this.results.total -= item.priceIva : null;
      }
    }

  }

  PostData() {
    let defineTotalSinIva = 0;
    let defineArticulosComandas = () => {

      let resultObj = [];
      let defineObj = {
        idArticulo: '',
        cantidad: 0,
        precioUnidad: 0,
        observaciones: '',
        esCortesia: false
      };
      if (this.orderList.length) {

        this.orderList.forEach((el) => {
          defineObj = {
            idArticulo: '',
            cantidad: 0,
            precioUnidad: 0,
            observaciones: '',
            esCortesia: false
          }

          let i = el.quantity;
          defineObj.idArticulo = el.id;
          defineObj.cantidad = el.quantity;
          defineObj.precioUnidad = el.priceWhitOutIva;
          defineObj.observaciones = el.obs;
          defineObj.esCortesia = el.cortesia

          while (i > 0) {
            defineTotalSinIva += el.priceWhitOutIva;
            i--;
          }
          resultObj.push(defineObj);
        });
      }

      if (this.orderCortisiesList.length) {

        this.orderCortisiesList.forEach((el) => {
          defineObj = {
            idArticulo: '',
            cantidad: 0,
            precioUnidad: 0,
            observaciones: '',
            esCortesia: false
          }

          let i = el.quantity;
          defineObj.idArticulo = el.id;
          defineObj.cantidad = el.quantity;
          defineObj.precioUnidad = el.priceWhitOutIva;
          defineObj.observaciones = el.obs;
          defineObj.esCortesia = el.cortesia

          while (i > 0) {
            defineTotalSinIva += el.priceWhitOutIva;
            i--;
          }
          resultObj.push(defineObj);
        });
      }



    this.filterWord = "";
    this.FilterLists('');
    //this.orderList = [];

      return resultObj;
    }


    //$('.modal-roomservice').modal('toggle');

    this.roomservService.GetIdRentaActual(this.idHabitacion)
      .subscribe((res: any) => {
        let postingModel = {
          idRentaActual: 0,
          totalSinIva: defineTotalSinIva,
          total: this.results.subTotal,
          articuloComandas: defineArticulosComandas(),
          user: this.userTemp
        }
        postingModel.totalSinIva = defineTotalSinIva;
        postingModel.idRentaActual = res.result;

        if (this.datosComandaModificar != undefined) { // Modificar Comanda

          let resumenArticulosComanda = [];

          this.orderList.forEach(element => {

            let objectList = {
              idComanda: this.idComanda,
              IdArticulo: element.id,
              desc_Articulo: element.name,
              cantidad: element.quantity,
              precioUnidadConIva: element.priceWhitOutIva,
              esCortesia: element.cortesia
            }
            resumenArticulosComanda.push(objectList);

          });

          this.orderCortisiesList.forEach(element => {

            let objectList = {

              idComanda: this.idComanda,
              IdArticulo: element.id,
              desc_Articulo: element.name,
              cantidad: element.quantity,
              precioUnidadConIva: element.priceWhitOutIva,
              esCortesia: element.cortesia
            }

            resumenArticulosComanda.push(objectList);

          });

          let comandaModificaVM =
          {
            IdComanda: this.idComanda,
            SubtotalConIVA: postingModel.total,
            ResumenArticuloComandas: resumenArticulosComanda,
            credencial: this.login,
            user: this.userTemp
          }

          this.roomservService.ModificarComanda(comandaModificaVM)
            .toPromise().then((response: any) =>{

              if(response.body.success == true){
                // Sockets
                this.socketCocina.actualizarComanda();
                this.habitacionesSocket.actualizarHabitacion();

                this.child_huella.stopFingerprintServices();
                this.orderList = [];

                $('.modal-roomservice').modal('hide');
                $('#modificarComandaHuella').modal('hide');
                $('body').removeClass('modal-open');
                $('.modal-backdrop').remove();

                //$('.modal-autorizarOrden').show();
                $('.modal-autorizarOrden').modal('show');

                //localStorage.setItem('idHabitacion', response.result.idHabitacion.toString());
                //localStorage.setItem('numHabitacion', response.result.numeroHabitacion);
                //$('.modalSuccess').modal('toggle');
                this.datosComandaModificar = undefined;
              }else{
                this.child_huella.resetFingerprintToken();
              }

            }).catch(() =>{
              console.log("Ocurrio un error");
              this.datosComandaModificar = undefined;
            });
        } else { // Crear Nueva Comanda
          this.roomservService.PostPayload(postingModel)
            .subscribe((response: any) => {
              if( response.success )
              {
                // Sockets
                this.socketCocina.actualizarComanda();
                this.habitacionesSocket.actualizarHabitacion();

                sessionStorage.setItem('idHabitacion', response.result.idHabitacion.toString());
                sessionStorage.setItem('numHabitacion', response.result.numeroHabitacion);
                $('.modal-roomservice').modal('hide');
                $('.modalSuccess').modal('toggle');
              }
              else
              {
                if( typeof response.errorException !== 'undefined'
                    &&
                    typeof response.errorException.message !== 'undefined'
                    &&
                    response.errorException.message == "Los artículos con precio cero deben ser marcados como cortesías" ){
                  $('.modalComandaUnsuccess2').modal('toggle');
                }else if(response.errorException.message == "La renta se encuentra vencida"){
                  $('.modalComandaUnsuccess3').modal('toggle');
                  }else{
                    $('.modalComandaUnsuccess').modal('toggle');
                  }
              }
            });
        }

    });
  }

  ActivateCortesy() {
    if (!this.orderCortisiesList.length) {
      this.activatedCortesy.button = !this.activatedCortesy.button;
      this.activatedCortesy.list = !this.activatedCortesy.list;
    } else {
      this.activatedCortesy.button = !this.activatedCortesy.button;
    }

  }

  ActivateCortesyModificar() {
    this.activatedCortesy.list = true ;
    this.activatedCortesy.button = false;
    if (!this.orderCortisiesList.length) {
      this.activatedCortesy.button = !this.activatedCortesy.button;
      this.activatedCortesy.list = !this.activatedCortesy.list;
    } else {
      this.activatedCortesy.button = !this.activatedCortesy.button;
    }

  }

  ActivateCortesyModificarPromo() {
    this.activatedCortesy.list = false;
    this.activatedCortesy.button = false;
    if (!this.orderCortisiesList.length) {
      this.activatedCortesy.button = !this.activatedCortesy.button;
      this.activatedCortesy.list = !this.activatedCortesy.list;
    } else {
      this.activatedCortesy.button = !this.activatedCortesy.button;
    }

    this.activatedCortesy.list = true ;
    this.activatedCortesy.button = true;
  }

  ActivateCortesyModificarMasPromo() {
    this.activatedCortesy.list = true;
    this.activatedCortesy.button = false;
    if (!this.orderCortisiesList.length) {
      this.activatedCortesy.button = !this.activatedCortesy.button;
      this.activatedCortesy.list = !this.activatedCortesy.list;
    } else {
      this.activatedCortesy.button = !this.activatedCortesy.button;
    }

  }

  PromoBottle() {
    this.activatedCortesy.list = true;
    this.activatedCortesy.button = true;
    this.filterWord = 'costo cero';
    this.FilterLists('cortesias');

    this.countMix.quantity = 6;
    this.countMix.promo = true;
  }

  CheckMixCount() {

    if (this.countMix.promo == true) {
      if (this.countMix.quantity === 0) {
        this.activatedCortesy.button = false;
        this.countMix.promo = false;
        this.filterWord = '';
        this.FilterLists('');
        // this.orderList = [];
      } else {
        this.countMix.quantity > 0 ? this.countMix.quantity-- : null;
      }
    }
  }

  OpenModal(habitacion: any) {
    this.idHabitacion = habitacion.id;
    $('.modal-roomservice').modal('show');
  }

  OpenModalModificar(comanda, numHabitacion) {
    this.datosComandaModificar = comanda;
    this.numHabitacion = numHabitacion;

    this.results = {
      subTotal: 0,
      descuento: 0,
      cortesia: 0,
      total: 0
    };

    $('.modal-roomservice').modal('show')
  }

  SetOrderToModify(data: any, habitacion: any) {
    let comandas = [];

    this.numHabitacion = habitacion;

    $('.modal-autorizarOrden').modal('hide');
    $('body').removeClass('modal-open');
    $('.modal-backdrop').remove();

    $('.modal-roomservice').modal('toggle');
  }

  RemoveElement(el: any) {

      let removeOrderList = () => {
        let arrResult = this.orderList.filter((element) => {
          return element != el;
        });

        this.orderList = arrResult;

        let i = el.quantity;
        while (i > 0) {
          this.OperationsResults(el, true, false);
          i--;
        }
      };

      let removeCortesyList = () => {
        let arrResult = this.orderCortisiesList.filter((element) => {
          return element != el;
        });

        this.orderCortisiesList = arrResult;

        let i = el.quantity;
        while (i > 0) {
          this.OperationsResults(el, true, false);
          i--;
        }
      };

    el.cortesia ? removeCortesyList() : removeOrderList();

    if(this.orderList.length  ==  0  && this.orderCortisiesList.length == 0){
      $( "#col-tipo-alimentos" ).removeClass( "disable-tipos" )
      $( "#col-tipo-bebidas" ).removeClass( "disable-tipos" )
      $( "#col-tipo-otros" ).removeClass( "disable-tipos" )
      $( "#col-tipo-sexspa" ).removeClass( "disable-tipos" )
    }


  }

  DefineIdHabitacion(habitacion) {
    this.idHabitacion = habitacion.id;
  }

  Salir() {
    this.ResetOrders();
    this.filterWord = "";

    this.FilterLists('');
    this.orderList = [];

    this.datosComandaModificar = undefined;
    this.idComanda = 0;

    $('.modal-roomservice').modal('hide');
    $('body').removeClass('modal-open');
    $('.modal-backdrop').remove();
  }


}
