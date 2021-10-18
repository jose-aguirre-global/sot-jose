import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConceptoscancelacionComponent } from './conceptoscancelacion.component';

describe('ConceptoscancelacionComponent', () => {
  let component: ConceptoscancelacionComponent;
  let fixture: ComponentFixture<ConceptoscancelacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConceptoscancelacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConceptoscancelacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
