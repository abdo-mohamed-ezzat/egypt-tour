import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadyPlansComponent } from './ready-plans.component';

describe('ReadyPlansComponent', () => {
  let component: ReadyPlansComponent;
  let fixture: ComponentFixture<ReadyPlansComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReadyPlansComponent]
    });
    fixture = TestBed.createComponent(ReadyPlansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
