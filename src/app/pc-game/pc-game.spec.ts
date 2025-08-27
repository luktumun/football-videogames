import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PcGame } from './pc-game';

describe('PcGame', () => {
  let component: PcGame;
  let fixture: ComponentFixture<PcGame>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PcGame]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PcGame);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
