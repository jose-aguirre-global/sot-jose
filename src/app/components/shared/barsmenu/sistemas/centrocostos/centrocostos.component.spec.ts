import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CentrocostosComponent } from './centrocostos.component';

describe('CentrocostosComponent', () => {
  let component: CentrocostosComponent;
  let fixture: ComponentFixture<CentrocostosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CentrocostosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CentrocostosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
