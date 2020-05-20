import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AcercaDePage } from './acerca-de.page';

const routes: Routes = [
  {
    path: '',
    component: AcercaDePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AcercaDePageRoutingModule {}
