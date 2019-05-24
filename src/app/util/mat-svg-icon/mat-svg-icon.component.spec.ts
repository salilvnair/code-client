import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatSvgIconComponent } from './mat-svg-icon.component';

describe('MatSvgIconComponent', () => {
  let component: MatSvgIconComponent;
  let fixture: ComponentFixture<MatSvgIconComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MatSvgIconComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MatSvgIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
