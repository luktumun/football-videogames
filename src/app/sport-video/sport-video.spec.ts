import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SportVideo } from './sport-video';

describe('SportVideo', () => {
  let component: SportVideo;
  let fixture: ComponentFixture<SportVideo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SportVideo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SportVideo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
