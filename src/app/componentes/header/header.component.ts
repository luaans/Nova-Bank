import { Component, HostListener } from '@angular/core';
import { RouterLink, Router } from "@angular/router"; // 1. Adicionado 'Router' aqui
import { ProfilePictureComponent } from "../profile-picture/profile-picture.component";
import { HttpClient } from '@angular/common/http';
// 2. Importe o RouterLink aqui para que seja reconhecido
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-header',
  // 3. Adicione o CommonModule caso você use diretivas estruturais (como *ngIf, *ngFor) no template.
  imports: [RouterLink, ProfilePictureComponent, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  
  // Variáveis simuladas - estas devem vir de um serviço de autenticação real
  userName: string = 'Nome do Usuário'; 
  currentUser = {
    profilePicUrl: '/perfil.png'
  };

  // 4. CONSTRUTOR CORRIGIDO: Deve ser único e injetar todas as dependências.
  constructor(private http: HttpClient, private router: Router) {} 
  // A injeção de dependência do HttpClient e Router foi combinada em um único construtor.

  // Função chamada pelo botão Deslogar
  logout(): void {
    // 1. Limpar tokens de autenticação (JWT, etc.)
    // Ex: localStorage.removeItem('auth_token');
    
    // 2. Redirecionar o usuário para a página de login
    this.router.navigate(['/login']); 
    
    console.log('Usuário deslogado.');
  }

  uploadNewPicture(file: File): void {
    const formData = new FormData();
    formData.append('profileImage', file);

    // Chama o serviço para enviar o arquivo
    this.http.post<any>('/api/upload-profile-pic', formData).subscribe({
      next: (response) => {
        // Sucesso: atualiza a URL para a nova foto salva
        this.currentUser.profilePicUrl = response.newImageUrl;
        console.log('Upload bem-sucedido!', response);
      },
      error: (err) => {
        console.error('Erro no upload:', err);
        // Opcional: Mostrar uma mensagem de erro ao usuário
      }
    });
  }
}