import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

export interface Transaction {
  id: number;
  type: 'deposito' | 'saque' | 'pix_enviado' | 'pix_recebido' | 'transferencia';
  value: number;
  date: string;
  description: string;
  relatedUserId?: number;
}

export interface User {
  id: number;
  nome: string;
  email: string;
  cpf: string;
  renda: number;
  senha: string;
  saldo: number;
  chavePix: string;
  cartao: {
    numero: string;
    nome: string;
    validade: string;
    cvv: string;
  };
  transactions: Transaction[];
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser: User | null = null;
  private users: User[] = [];
  private transactions: Transaction[] = [];

  constructor(private router: Router) {
    const savedUsers = localStorage.getItem('bankUsers');
    const savedTransactions = localStorage.getItem('bankTransactions');
    const savedCurrentUser = localStorage.getItem('currentUser');

    if (savedUsers) {
      this.users = JSON.parse(savedUsers);
    }

    if (savedTransactions) {
      this.transactions = JSON.parse(savedTransactions);
    }

    if (savedCurrentUser) {
      const userObj: User = JSON.parse(savedCurrentUser);
      const user = this.users.find(u => u.id === userObj.id);
      if (user) {
        this.currentUser = user;
      }
    }
  }

  cadastrar(usuario: Omit<User, 'id' | 'saldo' | 'cartao' | 'transactions' | 'chavePix'>): boolean {
    if (this.users.some(u => u.email === usuario.email)) {
      return false;
    }

    const novoUsuario: User = {
      ...usuario,
      id: Date.now(),
      saldo: 0,
      chavePix: this.gerarChavePix(usuario.cpf),
      cartao: this.gerarCartao(usuario.nome),
      transactions: []
    };

    this.users.push(novoUsuario);
    this.salvarUsuarios();
    return true;
  }

  login(email: string, senha: string): boolean {
    const user = this.users.find(u => u.email === email && u.senha === senha);
    if (user) {
      this.currentUser = user;
      localStorage.setItem('currentUser', JSON.stringify(user));
      return true;
    }
    return false;
  }

  logout(): void {
    this.currentUser = null;
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  depositar(id: number, valor: number, descricao: string = 'Depósito'): boolean {
    const userIndex = this.users.findIndex(u => u.id === id);
    if (userIndex === -1) return false;

    this.users[userIndex].saldo += valor;

    const transaction: Transaction = {
      id: Date.now(),
      type: 'deposito',
      value: valor,
      date: new Date().toISOString(),
      description: descricao
    };

    this.users[userIndex].transactions.unshift(transaction);
    this.transactions.unshift({ ...transaction, relatedUserId: id });

    this.salvarUsuarios();
    this.salvarTransacoes();
    this.atualizarUsuarioAtual();

    return true;
  }

  sacar(id: number, valor: number, descricao: string = 'Saque'): boolean {
    const userIndex = this.users.findIndex(u => u.id === id);
    if (userIndex === -1 || this.users[userIndex].saldo < valor) return false;

    this.users[userIndex].saldo -= valor;

    const transaction: Transaction = {
      id: Date.now(),
      type: 'saque',
      value: valor,
      date: new Date().toISOString(),
      description: descricao
    };

    this.users[userIndex].transactions.unshift(transaction);
    this.transactions.unshift({ ...transaction, relatedUserId: id });

    this.salvarUsuarios();
    this.salvarTransacoes();
    this.atualizarUsuarioAtual();

    return true;
  }

  transferirPix(
    remetenteId: number,
    chavePix: string,
    valor: number,
    descricao: string = 'Transferência PIX'
  ): boolean {
    const remetenteIndex = this.users.findIndex(u => u.id === remetenteId);
    if (remetenteIndex === -1) return false;

    const destinatario = this.users.find(
      u => u.chavePix === chavePix || u.email === chavePix || u.cpf === chavePix
    );
    if (!destinatario || remetenteId === destinatario.id) return false;

    if (this.users[remetenteIndex].saldo < valor) return false;

    this.users[remetenteIndex].saldo -= valor;
    destinatario.saldo += valor;

    const agora = new Date().toISOString();

    const transacaoEnviada: Transaction = {
      id: Date.now(),
      type: 'pix_enviado',
      value: valor,
      date: agora,
      description: descricao,
      relatedUserId: destinatario.id
    };

    const transacaoRecebida: Transaction = {
      id: transacaoEnviada.id,
      type: 'pix_recebido',
      value: valor,
      date: agora,
      description: descricao,
      relatedUserId: remetenteId
    };

    this.users[remetenteIndex].transactions.unshift(transacaoEnviada);
    destinatario.transactions.unshift(transacaoRecebida);
    this.transactions.unshift(transacaoEnviada, transacaoRecebida);

    this.salvarUsuarios();
    this.salvarTransacoes();
    this.atualizarUsuarioAtual();

    return true;
  }

  buscarUsuarioPorChavePix(chavePix: string): User | undefined {
    return this.users.find(
      u => u.chavePix === chavePix || u.email === chavePix || u.cpf === chavePix
    );
  }

  getUserNameById(id: number): string | null {
    const user = this.users.find(u => u.id === id);
    return user ? user.nome : null;
  }

  private atualizarUsuarioAtual() {
    const currentUser = this.currentUser;
    if (currentUser) {
      const updatedUser = this.users.find(u => u.id === currentUser.id);
      if (updatedUser) {
        this.currentUser = updatedUser;
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      }
    }
  }

  private gerarChavePix(cpf: string): string {
    return `pix_${cpf.replace(/\D/g, '')}`;
  }

  private gerarCartao(nome: string) {
    const gerarDigitos = (quantidade: number) => {
      return Array.from({ length: quantidade }, () => Math.floor(Math.random() * 10)).join('');
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

  private salvarTransacoes(): void {
    localStorage.setItem('bankTransactions', JSON.stringify(this.transactions));
  }
}
