import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthGuardTsComponent } from './auth.guard.ts.component';

describe('AuthGuardTsComponent', () => {
  let component: AuthGuardTsComponent;
  let fixture: ComponentFixture<AuthGuardTsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthGuardTsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthGuardTsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
