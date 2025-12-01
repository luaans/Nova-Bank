import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

export interface User {
  id: number;
  nome: string;
  email: string;
  cpf: string;
  renda: number;
  senha: string;
  saldo: number;
  cartao: {
    numero: string;
    nome: string;
    validade: string;
    cvv: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser = signal<User | null>(null);
  private users: User[] = [];

  constructor(private router: Router) {
    // Carrega usuários do localStorage ao inicializar
    const savedUsers = localStorage.getItem('bankUsers');
    if (savedUsers) {
      this.users = JSON.parse(savedUsers);
    }
  }

  cadastrar(usuario: Omit<User, 'id' | 'saldo' | 'cartao'>): boolean {
    // Verifica se o email já está cadastrado
    if (this.users.some(u => u.email === usuario.email)) {
      return false;
    }

    // Cria um novo usuário com dados iniciais
    const novoUsuario: User = {
      ...usuario,
      id: Date.now(),
      saldo: 0,
      cartao: this.gerarCartao(usuario.nome)
    };

    this.users.push(novoUsuario);
    this.salvarUsuarios();
    return true;
  }

  login(email: string, senha: string): boolean {
    const user = this.users.find(u => u.email === email && u.senha === senha);
    if (user) {
      this.currentUser.set(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
      return true;
    }
    return false;
  }

  logout(): void {
    this.currentUser.set(null);
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }

  getCurrentUser() {
    return this.currentUser.asReadonly();
  }

  atualizarSaldo(id: number, novoSaldo: number): void {
    const userIndex = this.users.findIndex(u => u.id === id);
    if (userIndex !== -1) {
      this.users[userIndex].saldo = novoSaldo;
      this.salvarUsuarios();
      
      // Atualiza o usuário atual se for o mesmo
      const currentUser = this.currentUser();
      if (currentUser && currentUser.id === id) {
        this.currentUser.set({...currentUser, saldo: novoSaldo});
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser()));
      }
    }
  }

  private gerarCartao(nome: string) {
    // Gera um número de cartão válido (apenas para demonstração)
    const gerarDigitos = (quantidade: number) => {
      return Array.from({length: quantidade}, () => Math.floor(Math.random() * 10)).join('');
    };
    
    return {
      numero: `5${gerarDigitos(3)} ${gerarDigitos(4)} ${gerarDigitos(4)} ${gerarDigitos(4)}`,
      nome: nome.toUpperCase(),
      validade: `${String(new Date().getMonth() + 1).padStart(2, '0')}/${new Date().getFullYear() + 5}`,
      cvv: gerarDigitos(3)
    };
  }

  private salvarUsuarios(): void {
    localStorage.setItem('bankUsers', JSON.stringify(this.users));
  }
}
