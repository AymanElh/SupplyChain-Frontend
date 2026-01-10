import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {SupplierList} from './features/supply/suppliers/pages/supplier-list/supplier-list';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SupplierList],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('SupplyChainX');
}
