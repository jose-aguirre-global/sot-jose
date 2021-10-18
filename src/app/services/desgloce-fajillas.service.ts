import { Injectable } from '@angular/core';
import { DesgloceFajillasModel } from '../models/desgloceFajillas';

@Injectable({
  providedIn: 'root'
})
export class DesgloceFajillasService {

  constructor() { }

  model: DesgloceFajillasModel[] = [{
    valor: 0,
    copy: 1000,
    resultado: 0
  }, {
    valor: 0,
    copy: 500,
    resultado: 0
  }, {
    valor: 0,
    copy: 200,
    resultado: 0
  }, {
    valor: 0,
    copy: 100,
    resultado: 0
  }, {
    valor: 0,
    copy: 50,
    resultado: 0
  }, {
    valor: 0,
    copy: 20,
    resultado: 0
  }, {
    valor: 0,
    copy: 10,
    resultado: 0
  }, {
    valor: 0,
    copy: 5,
    resultado: 0
  }, {
    valor: 0,
    copy: 2,
    resultado: 0
  }, {
    valor: 0,
    copy: 1,
    resultado: 0
  }, {
    valor: 0,
    copy: 0.50,
    resultado: 0
  }, {
    valor: 0,
    copy: 1,
    resultado: 0
  }, {
    valor: 0,
    copy: 1,
    resultado: 0
  }];

  InitDataForm() {
    return this.model;
  }
}
