import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarkersListComponent } from './markers-list.component';

describe('MarkersListComponent', () => {
  let component: MarkersListComponent;
  let fixture: ComponentFixture<MarkersListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarkersListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarkersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
