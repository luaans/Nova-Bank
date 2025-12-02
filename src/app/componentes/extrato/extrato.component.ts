import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { AuthService, type User, type Transaction } from '../../services/auth.service';

interface TransactionView extends Transaction {
  relatedName?: string | null;
}

@Component({
  selector: 'app-extrato',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent],
  templateUrl: './extrato.component.html',
  styleUrls: ['./extrato.component.css']
})
export class ExtratoComponent implements OnInit {
  currentUser: User | null = null;
  transactions: TransactionView[] = [];

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    this.currentUser = user;

    if (user?.transactions?.length) {
      this.transactions = user.transactions.map(t => ({
        ...t,
        relatedName: t.relatedUserId ? this.authService.getUserNameById(t.relatedUserId) : null
      }));
    }
  }

  onLogout(): void {
    this.authService.logout();
  }
}
