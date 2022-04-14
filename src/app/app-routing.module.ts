import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LineChartComponent } from './components/line-chart/line-chart.component';
import { MapComponent } from './components/map/map.component';
import { RelatedWordsGraphComponent } from './components/related-words-graph/related-words-graph.component';

const routes: Routes = [
  {path: 'map', component: MapComponent},
  {path: 'linechart', component: LineChartComponent},
  {path: 'related-words-graph', component: RelatedWordsGraphComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
