// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { LoginComponent } from './componentes/login/login.component';
import { CadastroComponent } from './componentes/cadastro/cadastro.component';
import { HomeComponent } from './componentes/home/home.component';
import { ExtratoComponent } from './componentes/extrato/extrato.component';
import { TransacoesComponent } from './componentes/transacoes/transacoes.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'cadastro', component: CadastroComponent },
  { 
    path: 'home', 
    component: HomeComponent,
    canActivate: [authGuard]
  },
  { 
    path: 'extrato', 
    component: ExtratoComponent,
    canActivate: [authGuard]
  },
  { 
    path: 'transacoes', 
    component: TransacoesComponent,
    canActivate: [authGuard]
  },
  { path: '**', redirectTo: 'login' }
];