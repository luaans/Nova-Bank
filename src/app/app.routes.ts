import { Routes } from '@angular/router';
import { LoginComponent } from './componentes/login/login.component';
import { HomeComponent } from './componentes/home/home.component';
import { ExtratoComponent } from './componentes/extrato/extrato.component';


export const routes: Routes = [
  {path: '', redirectTo: '/login', pathMatch: 'full' },
  {path: 'login', component: LoginComponent},
  { path: 'home', component: HomeComponent },
  { path: 'extrato', component: ExtratoComponent},
];
