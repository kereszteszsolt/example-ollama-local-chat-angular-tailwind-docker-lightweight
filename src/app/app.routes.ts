import { Routes } from '@angular/router';
import { ChatPageComponent } from './features/chat/pages/chat-page/chat-page.component';

export const routes: Routes = [
  { path: 'chat', component: ChatPageComponent, pathMatch: 'full' },
  { path: '**', redirectTo : 'chat' },
];
