import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { StatsCardComponent } from '../../../../shared/components/stats-card/stats-card.component/stats-card.component';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge.component';

export interface ProductionStage {
  id: string;
  name: string;
  count: number;
  percentage: number;
  color: string;
  statusKey: string;
}

export interface ActivityOrder {
  id: string;
  orderNumber: string;
  type: 'SUPPLY' | 'PRODUCTION';
  partyName: string;
  date: string;
  itemsCount: number;
  totalValue: number;
  status: string;
}

export interface LowStockWatchItem {
  id: number;
  sku: string;
  name: string;
  category: string;
  stock: number;
  stockMin: number;
  unit: string;
  percentRemaining: number;
  urgency: 'CRITICAL' | 'LOW' | 'NORMAL';
}

export interface KeySupplier {
  id: number;
  name: string;
  category: string;
  activeOrders: number;
  fulfilledRate: number;
  rating: number;
}

@Component({
  selector: 'app-dashboard-content',
  standalone: true,
  imports: [CommonModule, RouterLink, StatsCardComponent, StatusBadgeComponent],
  templateUrl: './dashboard-content.component.html',
  styleUrls: ['./dashboard-content.component.css']
})
export class DashboardContentComponent {
  selectedPeriod = signal<'today' | 'week' | 'month'>('month');

  // Executive KPI summary cards
  statsCards = [
    {
      title: 'Total Orders',
      value: '1,234',
      icon: '📦',
      iconBgColor: 'blue',
      trend: '+12.4%',
      trendColor: 'green'
    },
    {
      title: 'Inventory Value',
      value: '$584,230',
      icon: '💰',
      iconBgColor: 'green',
      trend: '+8.1%',
      trendColor: 'green'
    },
    {
      title: 'Active Suppliers',
      value: '42',
      icon: '🏭',
      iconBgColor: 'purple',
      trend: '99.2% on-time',
      trendColor: 'blue'
    },
    {
      title: 'Pending Dispatch',
      value: '28',
      icon: '⏳',
      iconBgColor: 'yellow',
      trend: '-3 vs yesterday',
      trendColor: 'yellow'
    }
  ];

  // Production Stage Pipeline (aligned with Spring backend ProductionOrder states)
  productionStages: ProductionStage[] = [
    { id: '1', name: 'Queue & Waiting', count: 15, percentage: 26, color: 'bg-amber-400', statusKey: 'IN_WAITING' },
    { id: '2', name: 'Active In Production', count: 23, percentage: 40, color: 'bg-blue-500', statusKey: 'IN_PRODUCTION' },
    { id: '3', name: 'Quality Inspection', count: 7, percentage: 12, color: 'bg-indigo-500', statusKey: 'IN_PREPARATION' },
    { id: '4', name: 'Finished & Staged', count: 12, percentage: 22, color: 'bg-emerald-500', statusKey: 'FINISHED' }
  ];

  // Recent operational orders & batches
  recentOrders: ActivityOrder[] = [
    {
      id: '101',
      orderNumber: 'PO-2026-891',
      type: 'SUPPLY',
      partyName: 'Apex Industrial Steels',
      date: 'Today, 10:45 AM',
      itemsCount: 4,
      totalValue: 12450.00,
      status: 'IN_PROGRESS'
    },
    {
      id: '102',
      orderNumber: 'PRD-2026-442',
      type: 'PRODUCTION',
      partyName: 'Turbine Assembly Line B',
      date: 'Today, 09:15 AM',
      itemsCount: 18,
      totalValue: 34800.00,
      status: 'IN_PRODUCTION'
    },
    {
      id: '103',
      orderNumber: 'PO-2026-890',
      type: 'SUPPLY',
      partyName: 'Nordic Raw Polymers Ltd',
      date: 'Yesterday, 16:30',
      itemsCount: 2,
      totalValue: 5820.00,
      status: 'WAITING'
    },
    {
      id: '104',
      orderNumber: 'PRD-2026-440',
      type: 'PRODUCTION',
      partyName: 'Structural Chassis Batch 3',
      date: 'Yesterday, 14:10',
      itemsCount: 8,
      totalValue: 21900.00,
      status: 'FINISHED'
    },
    {
      id: '105',
      orderNumber: 'PO-2026-888',
      type: 'SUPPLY',
      partyName: 'Vanguard Copper Works',
      date: 'Oct 3, 11:20',
      itemsCount: 6,
      totalValue: 18450.00,
      status: 'RECEIVED'
    }
  ];

  // Material Watchlist with threshold progress bars
  lowStockItems: LowStockWatchItem[] = [
    {
      id: 1,
      sku: 'MAT-STL-02',
      name: 'Cold-Rolled Steel Sheet 2mm',
      category: 'Metals',
      stock: 8,
      stockMin: 50,
      unit: 'sheets',
      percentRemaining: 16,
      urgency: 'CRITICAL'
    },
    {
      id: 2,
      sku: 'MAT-CPR-14',
      name: 'High-Conductivity Copper Wire',
      category: 'Wiring',
      stock: 32,
      stockMin: 80,
      unit: 'spools',
      percentRemaining: 40,
      urgency: 'LOW'
    },
    {
      id: 3,
      sku: 'MAT-ALU-08',
      name: 'Extruded Aluminum Profiles 6061',
      category: 'Extrusions',
      stock: 45,
      stockMin: 100,
      unit: 'bars',
      percentRemaining: 45,
      urgency: 'LOW'
    },
    {
      id: 4,
      sku: 'MAT-POL-01',
      name: 'High-Density Polymer Pellets',
      category: 'Polymers',
      stock: 65,
      stockMin: 120,
      unit: 'kg',
      percentRemaining: 54,
      urgency: 'NORMAL'
    }
  ];

  // Top Key Suppliers
  keySuppliers: KeySupplier[] = [
    { id: 1, name: 'Apex Industrial Steels', category: 'Heavy Metals', activeOrders: 14, fulfilledRate: 99.1, rating: 4.9 },
    { id: 2, name: 'Nordic Raw Polymers Ltd', category: 'Chemicals & Plastics', activeOrders: 8, fulfilledRate: 98.4, rating: 4.8 },
    { id: 3, name: 'Precision Extrusions Inc', category: 'Aluminum & Alloys', activeOrders: 6, fulfilledRate: 97.2, rating: 4.7 }
  ];

  setPeriod(period: 'today' | 'week' | 'month'): void {
    this.selectedPeriod.set(period);
  }
}

