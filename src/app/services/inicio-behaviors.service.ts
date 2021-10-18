import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class InicioBehaviorsService {

  constructor() { }

  personaExtra = 0;
  hospedaje = 0;
  horasExtra = 0;

limpiarValores(){
  this.personaExtra = 0;
  this.hospedaje = 0;
  this.horasExtra = 0;
}
  
setPersonasExtra(personasExtra: number){
  this.personaExtra = personasExtra;
}

getPersonasExtra(){
  return this.personaExtra;
}

setHorasExtra(horasExtra: number){
  this.horasExtra = horasExtra;
}

getHorasExtra(){
  return this.horasExtra;
}


setHospedaje(hospedaje: number){
  this.hospedaje = hospedaje;
}

getHospedaje(){
  return this.hospedaje;
}

  addPersonaExtra(substract: boolean) {
    
    if (substract && this.personaExtra>0) {      
        this.personaExtra--;
      } else if(!substract){
      this.personaExtra++;
    }
    return this.personaExtra;
  }

  addHospedaje(substract: boolean) {

    if (substract && this.hospedaje>0) {
      this.hospedaje--;
    } else if(!substract){
      this.hospedaje++;
    }
    return this.hospedaje;
  }

  addHorasExtra(substract: boolean) {
  
    if (substract && this.horasExtra>0) {
      this.horasExtra--;
    } else if(!substract) {
      this.horasExtra++;
    }

    return this.horasExtra;
  }
}
