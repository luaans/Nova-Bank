// transacoes.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

// ... (código existente)

export class TransacoesComponent implements OnInit {
  // ... (código existente)

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    const userData = localStorage.getItem('currentUser');
    if (userData) {
      this.formData.set({ ...this.formData(), ...JSON.parse(userData) });
    }
  }

  // Atualizar o método processTransaction
  processTransaction() {
    if (!this.isFormValid()) {
      console.error('Tentativa de transação com formulário inválido.');
      return;
    }
    
    const data = this.formData();
    let novoSaldo = this.authService.getCurrentUser()?.saldo || 0;
    
    if (data.transactionType === 'deposito') {
      novoSaldo += Number(data.valor);
    } else if (data.transactionType === 'saque' || data.transactionType === 'pix') {
      novoSaldo -= Number(data.valor);
    }
    
    // Atualiza o saldo no serviço de autenticação
    this.authService.atualizarSaldo(novoSaldo);
    
    // Simulação de sucesso
    this.isTransactionSuccessful.set(true);

    // Resetar o formulário após 3 segundos
    setTimeout(() => {
      this.formData.set({ transactionType: null });
      this.isTransactionSuccessful.set(false);
    }, 3000);
  }
}