import { Injectable, Output, EventEmitter } from '@angular/core';
import { LoginModel}from '../../models/loginModel';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
  })

  export class InterfaceComanda {

    // Creamos la comanda
    comanda: any;
    idComanda: number;
    
    
    // Con output creamos el nuevo EventEmitter. De este objeto obtendremos los cambios.
    @Output()
    comandaEmitter = new EventEmitter<any>();
  
  
    constructor() { }

    loginModel: LoginModel = {
      identificadorUsuario: '',
      sinValor: false,
      // valorVerificarBin: '',
      tipoCredencial: 1,
      valorVerificarStr: ''
    };
  
    // Cambiamos el atributo this.comanda y llamamos a cambioComanda().
    setComanda(modificarComanda: any) {
      this.comanda = modificarComanda;
      this.cambiosComanda();
    }
  
    // Emitimos los cambio de this.comanda.
    cambiosComanda() {
      this.comandaEmitter.emit(this.comanda);
    }

    SetReinciarIdComanda()
    {
      this.idComanda = 0;
      this.ReinciarIdComanda();
    }

    ReinciarIdComanda()
    {
      this.comandaEmitter.emit(this.idComanda);
    }

    SetObtenerModificarCoamnda(comandaModificaVM:any)
    {      
      this.ModificarComanda(comandaModificaVM);     
    }

    ModificarComanda(comandaModificaVM:any)
    {
      this.comandaEmitter.emit(comandaModificaVM);
    }

    validateCortesia(error:any) {

        this.comandaEmitter.emit(error);
    }
  }