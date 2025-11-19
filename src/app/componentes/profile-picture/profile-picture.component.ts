import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-profile-picture',
  imports: [],
  templateUrl: './profile-picture.component.html',
  styleUrl: './profile-picture.component.css'
})
export class ProfilePictureComponent {
  // Receber a URL atual da imagem do componente pai (header)
  @Input() imageUrl: string = ''; // Caminho

  // Emite o novo arquivo para ser tratado pelo upload
  @Output() fileSelected = new EventEmitter<File>();

  // Armazena a URL temporária para pré-visualizção
  previewUrl: string | ArrayBuffer | null = null;

  // ABre o seletor de arquivo
  openFileSelector(fileInput: HTMLInputElement): void{
    fileInput.click();
  }

  // Trata o arquivo selecionado para pré-visualização e emissão
  onFileChange(event: Event): void{
    const input = event.target as HTMLInputElement;
    if(input.files && input.files[0]){
      const file = input.files[0];

      // Pré-visualiza a imagem
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result;
      };
      reader.readAsDataURL(file);

      // Eimite o arquivo para o componente pai slavar (Back-End)
      this.fileSelected.emit(file);
    }
  }

  // Retorna a URL a ser exibida (pré-visualização > URL atual)
  get displayUrl(): string {
    return this.previewUrl ? this.previewUrl as string : this.imageUrl;
  }
} 
