import { Component, OnInit, signal, computed, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

// Definição da interface para os objetos de imagem
interface ImageSlide {
  src: string;
  alt: string;
  title: string;
}

@Component({
  selector: 'app-image-carousel',
  standalone: true,
  imports: [CommonModule], 
  // 💡 Aponta para o arquivo HTML externo
  templateUrl: './carrosel.component.html',
  // 💡 Aponta para o arquivo CSS externo
  styleUrls: ['./carrosel.component.css'], 
  changeDetection: ChangeDetectionStrategy.OnPush, 
})
export class ImageCarouselComponent implements OnInit, OnDestroy {
  
  // Estrutura de dados para o carrossel (Signal)
  images = signal<ImageSlide[]>([]);
  
  // Estado para controlar o slide atual (Signal)
  currentSlide = signal(0); 
  imageCount = computed(() => this.images().length);
  
  private autoPlayInterval: any; 

  ngOnInit() {
    // 💡 Caminhos dos seus arquivos na pasta assets
    this.images.set([
      { 
        src: './Seguranca.png', 
        alt: 'Ilustração de Segurança',
        title: 'Segurança da Informação'
      },
      { 
        src: './Gestao.png', 
        alt: 'Gráfico de Gestão',
        title: 'Gestão Inteligente'
      },
      { 
        src: './Atendimento.png', 
        alt: 'Ícone de Atendimento ao Cliente', 
        title: 'Atendimento Personalizado'
      },
    ]);

    // Inicia o autoplay (a cada 4 segundos)
    this.autoPlayInterval = setInterval(() => this.nextSlide(), 4000);
  }

  ngOnDestroy(): void {
      if (this.autoPlayInterval) {
          clearInterval(this.autoPlayInterval);
      }
  }

  nextSlide() {
    this.currentSlide.update(current => (current + 1) % this.imageCount());
  }

  prevSlide() {
    this.currentSlide.update(current => (current - 1 + this.imageCount()) % this.imageCount());
  }

  goToSlide(index: number) {
    this.currentSlide.set(index);
  }
}