import { Component, OnInit } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';
import { NgChartsModule } from 'ng2-charts'; // Módulo do gráfico
import { MatIconModule } from '@angular/material/icon'; // Módulo para usar <mat-icon>

@Component({
  selector: 'app-extrato',
  // IMPORTANTE: Adicionar os módulos que são usados no template
  imports: [
    NgChartsModule,
    MatIconModule
  ],
  standalone: true, // Adicionar se este for um componente standalone
  templateUrl: './extrato.component.html',
  styleUrl: './extrato.component.css'
})
export class ExtratoComponent implements OnInit {

  // Defina o período de tempo (mudar o botão ativo)
  timeFrame: 'Day' | 'Week' | 'Month' | 'Year' = 'Month';

  //Dados mockados para a lista de pagamentos
  payments = [
    { icon: 'music_note', date: 'Today', time: '4:30 PM', amount: 212.00 },
    { icon: 'movie_creation', date: 'Today', time: '6:00 PM', amount: 468.00 },
    { icon: 'theaters', date: 'Today', time: '9:30 PM', amount: -642.00 }
  ];

  //Configuração do gráfico (chart.js)
  public chartData: ChartData<'line'> = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        // PROPRIEDADES QUE ESTAVAM FALTANDO:
        data: [1500, 3000, 2000, 7000, 4500, 5000, 3500], 
        label: 'Earnings',
        
        // Propriedades existentes
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 6,
        borderColor: '#4C44FF', // Cor da linha principal
        backgroundColor: (context: any) => { 
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) { return; }

          let gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          
          // Azul Neon (#4C44FF) com opacidade para o topo
          gradient.addColorStop(0, 'rgba(76, 68, 255, 0.5)'); 
          
          // Azul Neon (#4C44FF) com baixa opacidade para a base (efeito de "esmaecimento")
          gradient.addColorStop(1, 'rgba(76, 68, 255, 0.05)'); 

          return gradient;
        },
      }
    ]
  };

  public chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        min: 0,
        max: 7000,
        grid: {
          color: 'rgba(255, 255, 255, 0.2)',
          borderDash: [5, 5],
        },
        ticks: {
          color: 'white',
          callback: (value) => `$${value}`,
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: 'white'
        }
      }
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'white',
        titleColor: 'black',
        bodyColor: 'black',
        // Outras configurações de tooltip
      }
    }
  };

  ngOnInit() {
    // Implementação da inicialização
  }
  
  // Exemplo de função para mudar o timeFrame no HTML
  setTimeFrame(frame: 'Day' | 'Week' | 'Month' | 'Year'): void {
      this.timeFrame = frame;
      // Aqui você adicionaria a lógica para recarregar os dados do gráfico
  }
  
  // Exemplo de função para voltar (se for um botão de voltar)
  goBack(): void {
      console.log('Navegar de volta...');
      // Implementação da navegação
  }
}