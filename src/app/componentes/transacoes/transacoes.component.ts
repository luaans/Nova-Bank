import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService, type User } from '../../services/auth.service';
import { HeaderComponent } from '../header/header.component';

interface TransactionForm {
  type: 'deposito' | 'saque' | 'pix' | '';
  value: number | null;
  pixKey?: string;
  description?: string;
}

@Component({
  selector: 'app-transacoes',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HeaderComponent],
  templateUrl: './transacoes.component.html',
  styleUrls: ['./transacoes.component.css']
})
export class TransacoesComponent implements OnInit {
  formData: TransactionForm = {
    type: '',
    value: null,
    pixKey: '',
    description: ''
  };

  currentUser: User | null = null;
  isTransactionSuccessful = false;
  errorMessage = '';
  isLoading = false;
  recipientInfo: { name: string; found: boolean } | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    this.currentUser = user;
  }

  onLogout(): void {
    this.authService.logout();
  }

  checkPixKey() {
    const pixKey = this.formData.pixKey?.trim();
    if (!pixKey || pixKey.length < 3) {
      this.recipientInfo = null;
      return;
    }

    const recipient = this.authService.buscarUsuarioPorChavePix(pixKey);
    if (recipient) {
      this.recipientInfo = { name: recipient.nome, found: true };
    } else {
      this.recipientInfo = { name: '', found: false };
    }
  }

  async processTransaction() {
    if (!this.validateForm()) {
      return;
    }

    const data = this.formData;
    this.isLoading = true;
    this.errorMessage = '';

    try {
      const user = this.currentUser;
      if (!user) {
        this.errorMessage = 'Usuário não encontrado. Faça login novamente.';
        return;
      }

      let success = false;

      switch (data.type) {
        case 'deposito':
          success = this.authService.depositar(
            user.id,
            Number(data.value),
            data.description || 'Depósito realizado'
          );
          break;

        case 'saque':
          success = this.authService.sacar(
            user.id,
            Number(data.value),
            data.description || 'Saque realizado'
          );
          break;

        case 'pix':
          if (!data.pixKey) {
            this.errorMessage = 'Chave PIX é obrigatória';
            return;
          }

          success = this.authService.transferirPix(
            user.id,
            data.pixKey,
            Number(data.value),
            data.description || 'Transferência PIX'
          );
          break;
      }

      if (success) {
        this.isTransactionSuccessful = true;
        this.resetForm();

        const updatedUser = this.authService.getCurrentUser();
        this.currentUser = updatedUser;

        setTimeout(() => {
          this.isTransactionSuccessful = false;
        }, 3000);
      } else {
        this.errorMessage = 'Não foi possível completar a transação. Verifique os dados e tente novamente.';
      }
    } catch (error) {
      console.error('Erro ao processar transação:', error);
      this.errorMessage = 'Ocorreu um erro ao processar sua transação. Tente novamente mais tarde.';
    } finally {
      this.isLoading = false;
    }
  }

  private validateForm(): boolean {
    const data = this.formData;

    if (!data.type) {
      this.errorMessage = 'Selecione o tipo de transação';
      return false;
    }

    if (!data.value || data.value <= 0) {
      this.errorMessage = 'Valor inválido';
      return false;
    }

    if (data.type === 'pix' && !data.pixKey) {
      this.errorMessage = 'Informe a chave PIX do destinatário';
      return false;
    }

    return true;
  }

  private resetForm() {
    this.formData = {
      type: '',
      value: null,
      pixKey: '',
      description: ''
    };
    this.recipientInfo = null;
  }
}