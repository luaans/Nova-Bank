// src/app/componentes/login/login.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      remember: [false]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      
      if (this.authService.login(email, password)) {
        this.router.navigate(['/home']);
      } else {
        this.errorMessage = 'Email ou senha inválidos.';
      }
    }
  }

  onForgotPasswordClick(event: Event) {
    event.preventDefault();
    const emailControl = this.loginForm.get('email');

    if (!emailControl || !emailControl.value || emailControl.invalid) {
      alert('Informe um e-mail válido para receber o link de redefinição de senha.');
      return;
    }

    const email = emailControl.value;
    alert(`Se este e-mail (${email}) estiver cadastrado, enviaremos instruções para redefinir sua senha.`);
  }

  get formControls() {
    return this.loginForm.controls;
  }
}