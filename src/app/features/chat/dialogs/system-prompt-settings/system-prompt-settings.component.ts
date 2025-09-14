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
  MatExpansionPanelHeader,
  MatExpansionPanelTitle
} from '@angular/material/expansion';

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
  folderEditing: Record<string, boolean> = {};

  ngOnInit() {
    this.loadPrompts();
  }

  loadPrompts() {
    this.ollamaService.loadSystemPrompts();
    this.systemPrompts = [...this.ollamaService.systemPromptsSignal()].map(p => ({...p, editing: false}));
    this.updateFolders();
  }

  updateFolders() {
    const uniqueFolders = [...new Set(this.systemPrompts.map(p => p.folder))];
    this.folders = uniqueFolders;
  }

  startEditFolderName(folder: string) {
    this.editedFolderName = folder;
    this.folderEditing = {...this.folderEditing, [folder]: true};
  }

  saveFolderName(oldFolder: string) {
    const newName = this.editedFolderName.trim();
    if (!newName || newName === oldFolder) {
      this.folderEditing = {...this.folderEditing, [oldFolder]: false};
      return;
    }
    this.systemPrompts = this.systemPrompts.map(p =>
      p.folder === oldFolder ? {...p, folder: newName} : p
    );
    this.updateFolders();
    this.ollamaService.saveSystemPrompts(this.systemPrompts);
    this.folderEditing = {...this.folderEditing, [oldFolder]: false};
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

  addNewPrompt(folder: string) {
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

  removePrompt(index: number) {
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

  closeDialog() {
    this.dialogRef.close();
  }

  importFromCSV(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (!fileInput.files?.length) return;
    const file = fileInput.files[0];
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      const content = e.target?.result as string;
      this.parseCSV(content);
    };
    reader.readAsText(file);
  }

  parseCSV(csvContent: string) {
    const lines = csvContent.split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    const folderIndex = headers.indexOf('foldername');
    const promptIndex = headers.indexOf('prompt');
    if (folderIndex === -1 || promptIndex === -1) {
      this.snackBar.open('CSV must contain "foldername" and "prompt" columns.', 'Close', {duration: 3000});
      return;
    }
    const newPrompts: (SystemMessage & { editing?: boolean })[] = [];
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      const values = line.split(',');
      const folder = values[folderIndex]?.trim();
      const content = values[promptIndex]?.trim();
      if (!folder || !content) continue;
      newPrompts.push({
        sys_msg_id: crypto.randomUUID(),
        role: 'system',
        content,
        active: true,
        folder,
        editing: false,
      });
    }
    if (newPrompts.length) {
      this.systemPrompts = [...this.systemPrompts, ...newPrompts];
      this.updateFolders();
      this.ollamaService.saveSystemPrompts(this.systemPrompts);
      this.snackBar.open(`Imported ${newPrompts.length} prompts.`, 'Close', {duration: 3000});
    } else {
      this.snackBar.open('No valid prompts found in CSV.', 'Close', {duration: 3000});
    }
  }

  importFromJSON(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (!fileInput.files?.length) return;
    const file = fileInput.files[0];
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      const content = e.target?.result as string;
      this.parseJSON(content);
    };
    reader.readAsText(file);
  }

  parseJSON(jsonContent: string) {
    try {
      const parsedData = JSON.parse(jsonContent);
      if (!Array.isArray(parsedData)) {
        this.snackBar.open('JSON must be an array of objects with "folder" and "prompt" properties.', 'Close', {duration: 3000});
        return;
      }
      const newPrompts: (SystemMessage & { editing?: boolean })[] = [];
      for (const item of parsedData) {
        if (!item.folder || !item.prompt) continue;
        newPrompts.push({
          sys_msg_id: crypto.randomUUID(),
          role: 'system',
          content: item.prompt,
          active: true,
          folder: item.folder,
          editing: false,
        });
      }
      if (newPrompts.length) {
        this.systemPrompts = [...this.systemPrompts, ...newPrompts];
        this.updateFolders();
        this.ollamaService.saveSystemPrompts(this.systemPrompts);
        this.snackBar.open(`Imported ${newPrompts.length} prompts.`, 'Close', {duration: 3000});
      } else {
        this.snackBar.open('No valid prompts found in JSON.', 'Close', {duration: 3000});
      }
    } catch (e) {
      this.snackBar.open('Invalid JSON format.', 'Close', {duration: 3000});
    }
  }

  exportToJSON() {
    const data = this.systemPrompts.map(p => ({
      folder: p.folder,
      prompt: p.content,
    }));
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], {type: 'application/json'});
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'system-prompts.json';
    a.click();
    window.URL.revokeObjectURL(url);
  }
}
