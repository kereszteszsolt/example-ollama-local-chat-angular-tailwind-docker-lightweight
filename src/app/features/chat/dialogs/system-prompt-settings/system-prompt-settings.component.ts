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
  unsavedChanges = false;

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
    this.systemPrompts = [...this.systemPrompts, this.newMessage as SystemMessage];
    this.updateFolders();
    this.newMessage = {role: 'system', content: '', active: true, folder: ''};
    this.unsavedChanges = true;
  }

  removeMessage(index: number) {
    this.systemPrompts = this.systemPrompts.filter((_, i) => i !== index);
    this.updateFolders();
    this.unsavedChanges = true;
  }

  toggleActive(index: number) {
    this.systemPrompts = this.systemPrompts.map((p, i) =>
      i === index ? {...p, active: !p.active} : p
    );
    this.unsavedChanges = true;
  }

  toggleAllActive(folder: string, active: boolean) {
    this.systemPrompts = this.systemPrompts.map(p =>
      p.folder === folder ? {...p, active} : p
    );
    this.unsavedChanges = true;
  }

  clearFolder(folder: string) {
    this.systemPrompts = this.systemPrompts.filter(p => p.folder !== folder);
    this.updateFolders();
    this.unsavedChanges = true;
  }

  save() {
    this.ollamaService.saveSystemPrompts(this.systemPrompts);
    this.unsavedChanges = false;
    this.snackBar.open('Saved!', 'Close', {duration: 2000});
  }

  closeDialog() {
    if (this.unsavedChanges) {
      this.snackBar.open('You have unsaved changes!', 'Close', {duration: 3000});
      return;
    }
    this.dialogRef.close();
  }

  // TODO: Implement import from CSV/Excel
  importFromCSV(event: Event) {
    // Handle file upload and parsing
  }
}
