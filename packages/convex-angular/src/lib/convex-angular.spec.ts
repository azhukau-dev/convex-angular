import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConvexAngular } from './convex-angular';

describe('ConvexAngular', () => {
  let component: ConvexAngular;
  let fixture: ComponentFixture<ConvexAngular>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConvexAngular],
    }).compileComponents();

    fixture = TestBed.createComponent(ConvexAngular);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
