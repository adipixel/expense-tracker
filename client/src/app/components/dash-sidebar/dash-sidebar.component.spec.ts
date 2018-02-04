import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashSidebarComponent } from './dash-sidebar.component';

describe('DashSidebarComponent', () => {
  let component: DashSidebarComponent;
  let fixture: ComponentFixture<DashSidebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashSidebarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
