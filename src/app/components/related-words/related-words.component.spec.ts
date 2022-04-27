import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelatedWordsComponent } from './related-words.component';

describe('RelatedWordsComponent', () => {
  let component: RelatedWordsComponent;
  let fixture: ComponentFixture<RelatedWordsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RelatedWordsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RelatedWordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
