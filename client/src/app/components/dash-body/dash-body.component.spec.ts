import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashBodyComponent } from './dash-body.component';

describe('DashBodyComponent', () => {
  let component: DashBodyComponent;
  let fixture: ComponentFixture<DashBodyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashBodyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashBodyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
