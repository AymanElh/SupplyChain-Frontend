import {Component, inject, OnInit, signal} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {SupplierService} from '../../services/supplier.service';
import {SupplierResponse} from '../../models/supplier.model';

@Component({
  selector: 'app-supplier-detail',
  standalone: true,
  imports: [],
  templateUrl: './supplier-detail.html',
  styleUrl: './supplier-detail.css',
})
export class SupplierDetail implements OnInit{

  private route = inject(ActivatedRoute);
  private router = inject(Router)
  private supplierService = inject(SupplierService);

  supplier = signal<SupplierResponse | null>(null);
  isLoading = signal<boolean>(true)

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadSupplier(+id);
    }
  }

  loadSupplier(id: number) {
    this.supplierService.getSupplier(id).subscribe({
      next: (supplier) => {
        this.supplier.set(supplier);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
        this.router.navigate(['/suppliers']);
      }
    })
  }
}
