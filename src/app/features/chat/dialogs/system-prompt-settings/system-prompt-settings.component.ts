import {Component, inject, OnInit} from '@angular/core';
import {MatDialogContent, MatDialogRef} from '@angular/material/dialog';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {SystemMessage} from '../../models/message.model';
import {OllamaService} from '../../services/ollama.service';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatTabsModule} from '@angular/material/tabs';

@Component({
  selector: 'ollama-chat-system-prompt-settings',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogContent,
    MatIcon,
    MatButton,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCheckboxModule,
    MatTooltipModule,
    MatIconButton,
    MatExpansionModule,
    MatTabsModule,
  ],
  templateUrl: './system-prompt-settings.component.html',
  styleUrl: './system-prompt-settings.component.scss',
})
export class SystemPromptSettingsComponent implements OnInit {
  dialogRef = inject(MatDialogRef<SystemPromptSettingsComponent>);
  ollamaService = inject(OllamaService);
  snackBar = inject(MatSnackBar);
  systemPrompts: SystemMessage[] = [];
  folders: string[] = [];
  newMessage: Partial<SystemMessage> = {role: 'system', content: '', active: true, folder: ''};
  activeTab = 0;
  editedFolderName: string = '';

  editFolderName(folder: string) {
    this.editedFolderName = folder;
  }

  ngOnInit() {
    this.loadPrompts();
  }

  loadPrompts() {
    this.ollamaService.loadSystemPrompts();
    this.systemPrompts = [...this.ollamaService.systemPromptsSignal()];
    this.updateFolders();
  }

  updateFolders() {
    const uniqueFolders = [...new Set(this.systemPrompts.map(p => p.folder))];
    this.folders = uniqueFolders;
  }

  addMessage() {
    if (!this.newMessage.content || !this.newMessage.folder) return;
    const message: SystemMessage = {
      sys_msg_id: crypto.randomUUID(),
      role: 'system',
      content: this.newMessage.content!,
      active: true,
      folder: this.newMessage.folder!,
    };
    this.systemPrompts = [...this.systemPrompts, message];
    this.updateFolders();
    this.ollamaService.saveSystemPrompts(this.systemPrompts);
    this.newMessage = {role: 'system', content: '', active: true, folder: ''};
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
