import {Component, inject, OnInit, signal} from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {SupplierService} from '../../services/supplier.service';
import {SupplierResponse} from '../../models/supplier.model';

@Component({
  selector: 'app-supplier-detail',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './supplier-detail.html',
  styleUrl: './supplier-detail.css',
})
export class SupplierDetail implements OnInit{

  private route = inject(ActivatedRoute);
  private router = inject(Router)
  private supplierService = inject(SupplierService);

  supplier = signal<SupplierResponse | null>(null);
  isLoading = signal<boolean>(true);
  notFound = signal<boolean>(false);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadSupplier(+id);
    }
  }

  loadSupplier(id: number): void {
    this.supplierService.getSupplier(id).subscribe({
      next: (supplier) => {
        this.supplier.set(supplier);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
        this.notFound.set(true);
      }
    })
  }

  onEdit(): void {
    const supplier = this.supplier();
    if (supplier) {
      this.router.navigate(['/suppliers', supplier.id, 'edit'])
    }
  }

  onDelete(): void {
    const supplier = this.supplier();
    if (!supplier) return;

    if (confirm(`Are you sure you want to delete supplier "${supplier.name}"?`)) {
      this.supplierService.deleteSupplier(supplier.id).subscribe({
        next: () => {
          this.router.navigate(['/suppliers'])
        }
      })
    }
  }
}
