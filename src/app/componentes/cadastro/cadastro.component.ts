// cadastro.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.css']
})
export class CadastroComponent {
  cadastroForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.cadastroForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      cpf: ['', [Validators.required, Validators.pattern(/^\d{11}$/)]],
      renda: ['', [Validators.required, Validators.min(0)]],
      senha: ['', [Validators.required, Validators.minLength(6)]],
      lgpd: [false, Validators.requiredTrue]
    });
  }

  onSubmit() {
    if (this.cadastroForm.valid) {
      const formValue = this.cadastroForm.value;
      const usuario = {
        nome: formValue.nome,
        email: formValue.email,
        cpf: formValue.cpf,
        renda: parseFloat(formValue.renda),
        senha: formValue.senha
      };

      if (this.authService.cadastrar(usuario)) {
        alert('Cadastro realizado com sucesso! Faça login para continuar.');
        this.router.navigate(['/login']);
      } else {
        this.errorMessage = 'Este email já está cadastrado.';
      }
    } else {
      this.errorMessage = 'Por favor, preencha todos os campos corretamente.';
    }
  }

  get formControls() {
    return this.cadastroForm.controls;
  }
}