import { Component, OnInit } from '@angular/core';
import { UtilitiesService } from 'src/app/services/utilities.service';

@Component({
  selector: 'app-conceptosgastos',
  templateUrl: './conceptosgastos.component.html',
  styleUrls: ['./conceptosgastos.component.css']
})
export class ConceptosgastosComponent implements OnInit {

  constructor(private utilities: UtilitiesService) { }

  lastElement: any;
  arrConceptos: any[];
  activeIndex: number;

  ngOnInit(): void {
    this.arrConceptos = [
      { visible: true }, { visible: true }, { visible: true }
    ];
  }

  SelectConcept(event, index, visible) {

    if (visible) {
      this.activeIndex = index;

      if (this.lastElement !== undefined && this.lastElement !== null) {
        this.utilities.RemoveClassDomElement(this.lastElement, 'row-active');
      }

      this.utilities.AddClassDomElement(event.target, 'row-active');

      this.lastElement = event.target;
    }


  }

  EditRow() {
    this.arrConceptos[this.activeIndex].visible = false;

    this.utilities.RemoveClassDomElement(this.lastElement, 'row-active');
  }
}
