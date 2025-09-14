import {Component, inject, OnInit} from '@angular/core';
import {MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {SystemMessage} from '../../models/message.model';
import {OllamaService} from '../../services/ollama.service';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatTooltip} from '@angular/material/tooltip';
import {MatIcon} from '@angular/material/icon';
import {FormsModule} from '@angular/forms';
import {MatInput} from '@angular/material/input';
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelDescription,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle
} from '@angular/material/expansion';
import {MatDivider} from '@angular/material/divider';

@Component({
  selector: 'ollama-chat-system-prompt-settings',
  standalone: true,
  imports: [
    MatIconButton,
    MatTooltip,
    MatIcon,
    FormsModule,
    MatInput,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle,
    MatButton,
    MatDialogContent,
    MatDialogTitle,
    MatDialogActions,
    MatAccordion,
  ],
  templateUrl: './system-prompt-settings.component.html',
  styleUrl: './system-prompt-settings.component.scss',
})
export class SystemPromptSettingsComponent implements OnInit {
  dialogRef = inject(MatDialogRef<SystemPromptSettingsComponent>);
  ollamaService = inject(OllamaService);
  snackBar = inject(MatSnackBar);
  systemPrompts: (SystemMessage & { editing?: boolean })[] = [];
  folders: string[] = [];
  editedFolderName: string = '';

  ngOnInit() {
    this.loadPrompts();
  }

  loadPrompts() {
    this.ollamaService.loadSystemPrompts();
    this.systemPrompts = [...this.ollamaService.systemPromptsSignal()].map(p => ({ ...p, editing: false }));
    this.updateFolders();
  }

  updateFolders() {
    const uniqueFolders = [...new Set(this.systemPrompts.map(p => p.folder))];
    this.folders = uniqueFolders;
  }

  addNewPromptFolder() {
    const now = new Date();
    const timestamp = now.toISOString().replace(/[:.-]/g, '');
    const newFolderName = `New Folder ${timestamp}`;
    const newPrompt: SystemMessage & { editing?: boolean } = {
      sys_msg_id: crypto.randomUUID(),
      role: 'system',
      content: '',
      active: true,
      folder: newFolderName,
      editing: true,
    };
    this.systemPrompts = [...this.systemPrompts, newPrompt];
    this.updateFolders();
    this.ollamaService.saveSystemPrompts(this.systemPrompts);
  }

  addNewMessage(folder: string) {
    const newPrompt: SystemMessage & { editing?: boolean } = {
      sys_msg_id: crypto.randomUUID(),
      role: 'system',
      content: '',
      active: true,
      folder,
      editing: true,
    };
    this.systemPrompts = [...this.systemPrompts, newPrompt];
    this.ollamaService.saveSystemPrompts(this.systemPrompts);
  }

  editPrompt(index: number) {
    this.systemPrompts = this.systemPrompts.map((p, i) =>
      i === index ? {...p, editing: true} : p
    );
  }

  savePrompt(index: number) {
    this.systemPrompts = this.systemPrompts.map((p, i) =>
      i === index ? {...p, editing: false} : p
    );
    this.ollamaService.saveSystemPrompts(this.systemPrompts);
  }

  removeMessage(index: number) {
    this.systemPrompts = this.systemPrompts.filter((_, i) => i !== index);
    this.updateFolders();
    this.ollamaService.saveSystemPrompts(this.systemPrompts);
  }

  toggleActive(index: number) {
    this.systemPrompts = this.systemPrompts.map((p, i) =>
      i === index ? {...p, active: !p.active} : p
    );
    this.ollamaService.saveSystemPrompts(this.systemPrompts);
  }

  toggleAllActive(folder: string, active: boolean) {
    this.systemPrompts = this.systemPrompts.map(p =>
      p.folder === folder ? {...p, active} : p
    );
    this.ollamaService.saveSystemPrompts(this.systemPrompts);
  }

  clearFolder(folder: string) {
    this.systemPrompts = this.systemPrompts.filter(p => p.folder !== folder);
    this.updateFolders();
    this.ollamaService.saveSystemPrompts(this.systemPrompts);
  }

  updateFolderName(folder: string, newName: string) {
    if (!newName.trim()) return;
    this.systemPrompts = this.systemPrompts.map(p =>
      p.folder === folder ? {...p, folder: newName} : p
    );
    this.updateFolders();
    this.ollamaService.saveSystemPrompts(this.systemPrompts);
  }

  closeDialog() {
    this.dialogRef.close();
  }

  importFromCSV(event: Event) {
    // TODO: Implement import from CSV/Excel
  }

  importFromJSON(event: Event) {
    // TODO: Implement import from JSON
  }
}
