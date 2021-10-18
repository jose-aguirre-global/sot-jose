import { Component, OnInit, Output, EventEmitter } from '@angular/core';

declare var $: any;

@Component({
  selector: 'app-revision-cortes',
  templateUrl: './revision-cortes.component.html',
  styleUrls: ['./revision-cortes.component.css']
})
export class RevisionCortesComponent implements OnInit {

  constructor() { }

  @Output() corteActivo: EventEmitter <number> = new EventEmitter();

  ngOnInit(): void {
  }



}
