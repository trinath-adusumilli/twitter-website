import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelatedWordsGraphComponent } from './related-words-graph.component';

describe('RelatedWordsGraphComponent', () => {
  let component: RelatedWordsGraphComponent;
  let fixture: ComponentFixture<RelatedWordsGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RelatedWordsGraphComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RelatedWordsGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
