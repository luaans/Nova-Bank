import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
// 👈 IMPORTAÇÃO NECESSÁRIA
import { provideHttpClient } from '@angular/common/http'; 
// Importe também o Router, caso esteja usando rotas
import { provideRouter } from '@angular/router'; 
import { routes } from './app/app.routes'; // Supondo que você tem um arquivo de rotas

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    // 👇 ADICIONE ISTO: Fornece o HttpClient para toda a aplicação
    provideHttpClient() 
  ]
}).catch(err => console.error(err));