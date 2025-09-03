// src/app/app.routes.ts

import { Routes } from '@angular/router';
import { PcGameComponent } from './pc-game/pc-game';
import { SportVideoComponent } from './sport-video/sport-video';

export const routes: Routes = [
  { path: 'pcgame', component: PcGameComponent },
  { path: 'sportvideo', component: SportVideoComponent },
  { path: '', redirectTo: '/pcgame', pathMatch: 'full' },
  { path: '**', redirectTo: '/pcgame' }
];