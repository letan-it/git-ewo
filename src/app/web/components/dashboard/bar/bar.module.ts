import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BarComponent } from './bar.component';
import { HighchartsChartModule } from 'highcharts-angular';


@NgModule({
  declarations: [
    BarComponent
  ],
  imports: [
    CommonModule,
    HighchartsChartModule
  ],
  exports:[BarComponent]

})
export class BarModule { }
