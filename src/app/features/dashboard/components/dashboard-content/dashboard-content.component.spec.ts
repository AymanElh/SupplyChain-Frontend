import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { DashboardContentComponent } from './dashboard-content.component';

describe('DashboardContentComponent', () => {
  let component: DashboardContentComponent;
  let fixture: ComponentFixture<DashboardContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardContentComponent],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardContentComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create the dashboard content component', () => {
    expect(component).toBeTruthy();
  });

  it('should have 4 summary KPI cards', () => {
    expect(component.statsCards.length).toBe(4);
  });

  it('should have 4 production stages', () => {
    expect(component.productionStages.length).toBe(4);
  });

  it('should allow toggling timeframes', () => {
    component.setPeriod('today');
    expect(component.selectedPeriod()).toBe('today');
    component.setPeriod('week');
    expect(component.selectedPeriod()).toBe('week');
  });
});
