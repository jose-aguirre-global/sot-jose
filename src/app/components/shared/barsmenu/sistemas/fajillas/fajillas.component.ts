import { Component, OnInit } from '@angular/core';
import { FajillasModel } from 'src/app/models/fajillas';
import { FajillasService } from 'src/app/services/fajillas.service';

@Component({
  selector: 'app-fajillas',
  templateUrl: './fajillas.component.html',
  styleUrls: ['./fajillas.component.css']
})
export class FajillasComponent implements OnInit {

  constructor(private fajillasService: FajillasService) { }

  ngOnInit(): void {
  }

  model: FajillasModel[] = [];
  value: number;

  AddFajilla(value: number) {
    this.model = [];
    let newElement: FajillasModel = {
      valor: value
    }

    this.model.push(newElement);
  }

  SendPost() {
    
    this.fajillasService.NewFajilla(this.model).subscribe((response) => {
     
    })
  }
}
