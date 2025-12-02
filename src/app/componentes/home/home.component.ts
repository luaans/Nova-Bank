// src/app/componentes/home/home.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  user: any = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const userData = localStorage.getItem('currentUser');
    if (userData) {
      this.user = JSON.parse(userData);
    } else {
      this.router.navigate(['/login']);
    }
  }

  formatarNumeroCartao(numero: string): string {
    if (!numero) return '';
    return numero.replace(/(\d{4})(?=\d)/g, '$1 ');
  }

  logout(): void {
    this.authService.logout();
  }
}