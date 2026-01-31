import { Customer } from "../models/customer.model";


export interface CustomerState {
  customers: Customer[];
  selectedCustomer: Customer | null;
  
  currentPage: number;
  totalPages: number;
  totalElements: number;
  pageSize: number;
  
  isLoading: boolean;        
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;       
  
  error: string | null;
  
  searchQuery: string;
  sortBy: string;
}

export const initialCustomerState: CustomerState = {
  customers: [],
  selectedCustomer: null,
  currentPage: 0,
  totalPages: 0,
  totalElements: 0,
  pageSize: 10,
  isLoading: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  error: null,
  searchQuery: '',
  sortBy: 'id,desc'
};