import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { log } from 'console';
import * as moment from 'moment';
import { LimpiezaService } from 'src/app/services/limpieza.service';

declare var $: any;


@Component({
  selector: 'app-limpieza',
  templateUrl: './limpieza.component.html',
  styleUrls: ['./limpieza.component.css']
})

export class LimpiezaComponent implements OnInit {

  @Input('idHabitacionLimpieza') idHabitacionLimpieza: number;
  @Input('tipoEnvioLimpieza') tipoEnvioLimpieza: string;
  @Input('supervisorValidar') supervisorValidar: string;

  @Output() actualizarHabitaciones = new EventEmitter<number>();

  constructor(  private limpiezaService : LimpiezaService ) { }

  ngOnInit(): void {
    this.filterCamarista = "";
    this.loader = false;
    this.MostrarTodasCamaristas();
    this.user = sessionStorage.user;
    this.limpiezaSeleccionada = 0;
  }

  filterCamarista: string;
  userOptions: boolean = true;
  limpiezaSeleccionada: number = 0;

  totalCount:number = 8;
  loader:boolean;

  listaTodasCamaristas = [];
  listaCamaristasSeleccionada = [];
  countcamaristasSeleccionadas:number = this.listaCamaristasSeleccionada.length;

  idHabitacion: number = 0;
  user : string;
  errorLimpieza : string;
  numeroHabitacion: string;

  Reload(){
    location.reload();
  }

  ObtieneCamaristas(camarista:string,userOptions){
    $('#texto_mensaje').text('');
    this.userOptions=userOptions!=undefined ? userOptions:true;
    if(userOptions){
      var listaCamaristas = document.getElementById('objetos_camaristas');
      var cantidad = listaCamaristas.childElementCount;
      for(var i = 1; i < cantidad; i++){
        const compare = listaCamaristas.children[i].children[0].getAttribute('id').toLowerCase();
        if(compare.indexOf(camarista.toLowerCase()) > -1){
          listaCamaristas.children[i].children[0].classList.remove('d-none');
        }else{
          listaCamaristas.children[i].children[0].classList.add('d-none');
        }
      }
    }else{
      $('#texto_mensaje').text('Oops no podemos realizar una busqueda');
    }
  }

  MostrarTodasCamaristas(){
    this.limpiezaService.ObtenerCamaristas().toPromise().then((response: any) => {
      let listaCamaristas:any;
      if(response.status == 200){

        listaCamaristas = response.body;
        listaCamaristas.disponibles.forEach((disp) => {
          this.listaTodasCamaristas.push( disp );
        });

        listaCamaristas.ocupadas.forEach((ocup) => {
          this.listaTodasCamaristas.push( ocup );
        });
        //ordenamos el array
        this.OrdenarArray();

      }else{
        this.listaTodasCamaristas.length = 0;
      }
    }).catch((response:any) => {
      this.listaTodasCamaristas.length = 0;
    });
  }

  ValidarMoverCamaristas(camarista: any, origen:number){
    $('#texto_mensaje').text('');
    if(this.countcamaristasSeleccionadas < 6){
      this.MoverCamarista(camarista, origen);
    }else{
      $('#texto_mensaje').text('No puedes seleccionar mas de 6 camaristas');
      if(origen == 2){
        this.MoverCamarista(camarista, origen);
      }
    }
  }

  MoverCamarista(camarista: any, origen:number){
    if(origen == 1){
      this.RemoveElementTodasCamaristas(camarista.idEmpleado)
      this.listaCamaristasSeleccionada.push(camarista);
      this.countcamaristasSeleccionadas ++;
    }else if(origen == 2){
      this.RemoveElementSeleccionadas(camarista.idEmpleado)
      this.listaTodasCamaristas.push(camarista);
      this.countcamaristasSeleccionadas --;
    }
    this.OrdenarArray();
  }

  //remover un elemento de un array
  RemoveElementTodasCamaristas(key: number) {
    this.listaTodasCamaristas.forEach( (value,index) => {
      if(value.idEmpleado==key)
        this.listaTodasCamaristas.splice(index,1);
    });
  }

  RemoveElementSeleccionadas(key: number) {
    this.listaCamaristasSeleccionada.forEach( (value,index) => {
      if(value.idEmpleado==key)
        this.listaCamaristasSeleccionada.splice(index,1);
    });
  }

  OrdenarArray(){
    this.listaTodasCamaristas.sort( function( a, b ) {
      a = a.nombre.toLowerCase();
      b = b.nombre.toLowerCase();
      return a < b ? -1 : a > b ? 1 : 0;
    });
  }

  AsignarLimpieza(tipoLimpieza: string){
    if(tipoLimpieza == "detallada"){
      this.limpiezaSeleccionada = 1;
    }else if(tipoLimpieza == "normal"){
      this.limpiezaSeleccionada = 2;
    }else if(tipoLimpieza == "retoque"){
      this.limpiezaSeleccionada = 3;
    }else if(tipoLimpieza == "minutosventa"){
      this.limpiezaSeleccionada = 4;
    }else if(tipoLimpieza == "rapida"){
      this.limpiezaSeleccionada = 5;
    }else{
      this.limpiezaSeleccionada = 0;
    }
  }

  ValidarAceptarLimpieza(){
    $('#texto_mensaje').text('');
    if(this.countcamaristasSeleccionadas == 0){
      $('#texto_mensaje').text('Selecciona al menos una Camarista');
    }else{
      if(this.limpiezaSeleccionada == 0){
        $('#texto_mensaje').text('Selecciona un tipo de limpieza');
      }else{
        let idCamaristas:any = [];
        //buscamos los id de los empleados
        this.listaCamaristasSeleccionada.forEach((select) => {
          idCamaristas.push( select.idEmpleado );
        });
        //CrearTareaLimpieza
        let crearTarea = {
            "IdHabitacion": this.idHabitacionLimpieza,
            "IdsEmpleados": idCamaristas,
            "TiposLimpieza": this.limpiezaSeleccionada,
            "User": this.user
        }

        let crearTarea2 = {
          "IdHabitacion": this.idHabitacionLimpieza,
          "IdsEmpleados": idCamaristas,
          "TiposLimpieza": this.limpiezaSeleccionada,
          "User": this.user,
          "Supervisor": this.supervisorValidar,
          "Observaciones": 'front'
        }

        if(this.tipoEnvioLimpieza == "normal"){
          this.limpiezaService.CrearTareaLimpieza(crearTarea).toPromise().then((response: any) =>{
            if(response.status == 200){
              // Sockets
              this.actualizarHabitaciones.emit(this.idHabitacionLimpieza);
              this.limpiezaSeleccionada = 0;
            }else{
              this.errorLimpieza = response.statusText;
            }
          }).catch(response =>{
            this.errorLimpieza = response.error;
            $('#errorLimpieza').modal('toggle');
            $('body').removeClass('modal-open');//eliminamos la clase del body para poder hacer scroll
          })
        }else if(this.tipoEnvioLimpieza == "mantenimiento"){
          this.limpiezaService.CrearTareaLimpiezaMantenimiento(crearTarea2).toPromise().then((response: any) =>{
            if(response.status == 200){
              // Sockets
              this.actualizarHabitaciones.emit(this.idHabitacionLimpieza);
              this.limpiezaSeleccionada = 0;
            }else{
              this.errorLimpieza = response.statusText;
            }
          }).catch(response =>{
            this.errorLimpieza = response.error || response.statusText;
            $('#errorLimpieza').modal('toggle');
            $('body').removeClass('modal-open');//eliminamos la clase del body para poder hacer scroll
          })
        }

      }
    }
  }

  ConfirmarCancelarLimpieza(idHabitacion: number){

    let cancelarLimpieza = {
      "IdHabitacion":idHabitacion,
      "User":this.user
    }
    this.limpiezaService.CancelarLimpieza(cancelarLimpieza).toPromise().then((response: any) => {
      // Sockets
      this.actualizarHabitaciones.emit(idHabitacion);
      /* if(response.estatus == 200){
        // Sockets
        this.actualizarHabitaciones.emit(idHabitacion);
      }else{
        this.errorLimpieza = response.statusText;
      } */
      this.limpiezaSeleccionada = 0;
    }).catch(response =>{
      this.errorLimpieza = response.error;
      $('#errorLimpieza').modal('toggle');
      $('body').removeClass('modal-open');//eliminamos la clase del body para poder hacer scroll
      this.limpiezaSeleccionada = 0;
    });

  }


}
