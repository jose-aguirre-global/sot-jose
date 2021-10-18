import { Component, OnInit } from '@angular/core';
import { ConcetocancelacionService } from 'src/app/services/concetocancelacion.service';
import { UtilitiesService } from 'src/app/services/utilities.service';

@Component({
  selector: 'app-conceptoscancelacion',
  templateUrl: './conceptoscancelacion.component.html',
  styleUrls: ['./conceptoscancelacion.component.css']
})
export class ConceptoscancelacionComponent implements OnInit {

  constructor(
    private concetocancelacionService: ConcetocancelacionService,
    private utilitiesService: UtilitiesService
  ) { }

  motivos: any;

  ngOnInit(): void {
    this.concetocancelacionService.GetConceptos().subscribe((response) => {
     
      this.motivos = response;
      this.SetPropertyName(this.motivos);
    });
    this.concetocancelacionService.GetTiposConceptos().subscribe((response) => {
      
    });
  }

  SetPropertyName(array = []) {
    array.forEach((el) => {
      el.name = this.utilitiesService.RemoveBlankSpaces(el.concepto);
    });
  }

  SetForEdit(element: any) {
   
  }
}
