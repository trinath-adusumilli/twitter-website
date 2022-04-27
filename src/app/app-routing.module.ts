import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MapComponent } from './components/map/map.component';
import { RelatedWordsComponent } from './components/related-words/related-words.component';

const routes: Routes = [
  {path: 'map', component: MapComponent},
  {path: 'related-words', component: RelatedWordsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
