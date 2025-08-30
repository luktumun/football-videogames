import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PcGameComponent } from './pc-game';


describe('PcGameComponent', () => {
  let component: PcGameComponent;
  let fixture: ComponentFixture<PcGameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PcGameComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PcGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
