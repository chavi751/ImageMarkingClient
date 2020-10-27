import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllSharesComponent } from './all-shares.component';

describe('AllSharesComponent', () => {
  let component: AllSharesComponent;
  let fixture: ComponentFixture<AllSharesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllSharesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllSharesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
