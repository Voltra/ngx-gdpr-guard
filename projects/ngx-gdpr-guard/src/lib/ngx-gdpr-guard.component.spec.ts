import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxGdprGuardComponent } from './ngx-gdpr-guard.component';

describe('NgxGdprGuardComponent', () => {
  let component: NgxGdprGuardComponent;
  let fixture: ComponentFixture<NgxGdprGuardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NgxGdprGuardComponent]
    });
    fixture = TestBed.createComponent(NgxGdprGuardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
