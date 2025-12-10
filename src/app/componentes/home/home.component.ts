// src/app/componentes/home/home.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
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
export class HomeComponent implements OnInit, OnDestroy {
  currentSlide = 0;
  slides = [
    {
      image: '/Carrosel - Cartoes .png',
      title: 'Cartão virtual',
      description: 'Em breve você poderá gerar um cartão virtual para compras online com mais segurança.'
    },
    {
      image: '/Carrosel - Investimento.png',
      title: 'Investimentos',
      description: 'Invista seu dinheiro de forma simples e segura com nossas opções de investimento.'
    },
    {
      image: '/Carrosel - Cashback.png',
      title: 'Cashback',
      description: 'Faça comprras na futura loja do sistema e ganhe cashback.'
    }
  ];
  private slideInterval: any;
  user: any = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const userData = localStorage.getItem('currentUser');
    if (userData) {
      this.user = JSON.parse(userData);
      this.startCarousel();
    } else {
      this.router.navigate(['/login']);
    }
  }

  ngOnDestroy(): void {
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
    }
  }

  startCarousel(): void {
    this.slideInterval = setInterval(() => {
      this.nextSlide();
    }, 5000); // Muda de slide a cada 5 segundos
  }

  nextSlide(): void {
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
  }

  prevSlide(): void {
    this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
  }

  goToSlide(index: number): void {
    this.currentSlide = index;
  }

  formatarNumeroCartao(numero: string): string {
    if (!numero) return '';
    return numero.replace(/(\d{4})(?=\d)/g, '$1 ');
  }

  logout(): void {
    this.authService.logout();
  }
}