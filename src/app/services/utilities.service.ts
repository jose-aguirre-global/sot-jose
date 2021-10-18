import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilitiesService {

  constructor() { }

  public objeto: any;

  AddClassDomElement(domEl: any, className: string) {

    domEl.parentElement.classList.add(className);

  }

  RemoveClassDomElement(domEl: any, className: string) {

    let element = domEl.parentElement;
    if (element !== null) {
      element.classList.remove(className);
    }

  }

  RemoveBlankSpaces(word: string) {
    return word.replace(/\s+/g, '');
  }

  MinutesToHourMinutes(minutes = 0) {
    const num = minutes;
    let result;

    let hours = (num / 60);
    let rhours = Math.floor(hours);
    var minutes = (hours - rhours) * 60;
    var rminutes = Math.round(minutes);

    result = (rhours == 0 ? '00' : rhours) + ':' + (rminutes < 10 ? '0' + rminutes : rminutes);

    return result;
  }


}
