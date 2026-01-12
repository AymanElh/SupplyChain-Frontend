import {Routes} from "@angular/router";
import {MaterialListComponent} from "./pages/material-list-component/material-list-component";
import {MaterialFormComponent} from './pages/material-form-component/material-form-component';


export default [
  {
    path: '',
    component: MaterialListComponent
  },
  {
    path: 'create',
    component: MaterialFormComponent
  }
] as Routes
