// src/app/app.routes.ts

import { Routes } from '@angular/router';
import { PcGameComponent } from './pc-game/pc-game';
import { SportVideoComponent } from './sport-video/sport-video';

export const routes: Routes = [
  { path: 'games', component: PcGameComponent },
  { path: 'videos', component: SportVideoComponent },
  { path: '', redirectTo: '/games', pathMatch: 'full' },
  { path: '**', redirectTo: '/games' }
];