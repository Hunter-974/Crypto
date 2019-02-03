import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorDateComponent } from './author-date.component';

describe('AuthorDateComponent', () => {
  let component: AuthorDateComponent;
  let fixture: ComponentFixture<AuthorDateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuthorDateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthorDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
