import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardContentComponent } from '../components/dashboard-content/dashboard-content.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, DashboardContentComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
}
