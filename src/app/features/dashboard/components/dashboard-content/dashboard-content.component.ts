import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { StatsCardComponent } from '../../../../shared/components/stats-card/stats-card.component/stats-card.component';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge.component';
import { DashboardService, DashboardSummary } from '../../services/dashboard.service';

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
  catalogSkus: number;
  rating: number;
}

@Component({
  selector: 'app-dashboard-content',
  standalone: true,
  imports: [CommonModule, RouterLink, StatsCardComponent, StatusBadgeComponent],
  templateUrl: './dashboard-content.component.html',
  styleUrls: ['./dashboard-content.component.css']
})
export class DashboardContentComponent implements OnInit {
  private dashboardService = inject(DashboardService);

  selectedPeriod = signal<'today' | 'week' | 'month'>('month');
  isLive = false;
  isLoadingSummary = true;
  activeWorkOrders = 57;
  criticalAlerts = 2;

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
    { id: 1, name: 'Apex Industrial Steels', category: 'Heavy Metals', catalogSkus: 14, rating: 4.9 },
    { id: 2, name: 'Nordic Raw Polymers Ltd', category: 'Chemicals & Plastics', catalogSkus: 8, rating: 4.8 },
    { id: 3, name: 'Precision Extrusions Inc', category: 'Aluminum & Alloys', catalogSkus: 6, rating: 4.7 }
  ];

  ngOnInit(): void {
    this.dashboardService.loadSummary().subscribe({
      next: (summary) => {
        this.isLoadingSummary = false;
        if (summary.live) {
          this.isLive = true;
          this.applySummary(summary);
        }
      },
      error: () => {
        this.isLoadingSummary = false;
      }
    });
  }

  setPeriod(period: 'today' | 'week' | 'month'): void {
    this.selectedPeriod.set(period);
  }

  private applySummary(summary: DashboardSummary): void {
    // KPI cards
    this.statsCards = [
      {
        title: 'Total Orders',
        value: summary.totalSupplierOrders.toLocaleString(),
        icon: '📦',
        iconBgColor: 'blue',
        trend: `${summary.pendingCustomerOrders} customer orders pending`,
        trendColor: 'yellow'
      },
      {
        title: 'Inventory Value',
        value: '$' + Math.round(summary.inventoryValue).toLocaleString(),
        icon: '💰',
        iconBgColor: 'green',
        trend: summary.criticalMaterials > 0
          ? `${summary.criticalMaterials} material(s) critical`
          : 'All stock levels healthy',
        trendColor: summary.criticalMaterials > 0 ? 'red' : 'green'
      },
      {
        title: 'Active Suppliers',
        value: summary.totalSuppliers.toLocaleString(),
        icon: '🏭',
        iconBgColor: 'purple',
        trend: `${summary.totalSuppliers} partners registered`,
        trendColor: 'blue'
      },
      {
        title: 'Pending Dispatch',
        value: summary.pendingCustomerOrders.toLocaleString(),
        icon: '⏳',
        iconBgColor: 'yellow',
        trend: 'Awaiting preparation',
        trendColor: 'yellow'
      }
    ];

    // Production pipeline
    const stageMeta = [
      { status: 'IN_WAITING', name: 'Queue & Waiting', color: 'bg-amber-400' },
      { status: 'IN_PRODUCTION', name: 'Active In Production', color: 'bg-blue-500' },
      { status: 'FINISHED', name: 'Finished & Staged', color: 'bg-emerald-500' },
      { status: 'BLOCKED', name: 'Blocked', color: 'bg-rose-500' }
    ] as const;
    const total = summary.productionStages.reduce((sum, stage) => sum + stage.count, 0);
    this.productionStages = summary.productionStages.map((stage, index) => ({
      id: String(index + 1),
      name: stageMeta[index].name,
      count: stage.count,
      percentage: total > 0 ? Math.round((stage.count / total) * 100) : 0,
      color: stageMeta[index].color,
      statusKey: stage.status
    }));
    this.activeWorkOrders = total;

    // Recent orders ledger
    this.recentOrders = summary.recentOrders.map(order => ({
      id: String(order.id),
      orderNumber: `PO-${order.id}`,
      type: 'SUPPLY' as const,
      partyName: order.supplierName,
      date: new Date(order.orderDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      itemsCount: order.items.length,
      totalValue: order.items.reduce((sum, item) => sum + (item.subTotal || 0), 0),
      status: order.status
    }));

    // Materials watchlist (most critical first)
    const ranked = [...summary.materials].sort((a, b) => {
      const urgencyOf = (stock: number, min: number) => stock <= min ? 0 : stock <= min * 2 ? 1 : 2;
      return urgencyOf(a.stock, a.stockMin) - urgencyOf(b.stock, b.stockMin);
    });
    this.lowStockItems = ranked.slice(0, 4).map(material => ({
      id: material.id,
      sku: `MAT-${String(material.id).padStart(3, '0')}`,
      name: material.name,
      category: material.unit,
      stock: material.stock,
      stockMin: material.stockMin,
      unit: material.unit,
      percentRemaining: Math.min(100, Math.round((material.stock / Math.max(1, material.stockMin * 2)) * 100)),
      urgency: (material.stock <= material.stockMin ? 'CRITICAL'
        : material.stock <= material.stockMin * 2 ? 'LOW' : 'NORMAL') as 'CRITICAL' | 'LOW' | 'NORMAL'
    }));
    this.criticalAlerts = summary.criticalMaterials;

    // Key suppliers
    this.keySuppliers = summary.suppliers.slice(0, 3).map(supplier => ({
      id: supplier.id,
      name: supplier.name,
      category: 'Supply partner',
      catalogSkus: supplier.materials?.length ?? 0,
      rating: supplier.rating ?? 0
    }));
  }
}

