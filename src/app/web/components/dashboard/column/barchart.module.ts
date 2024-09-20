import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BarchartComponent } from './barchart.component';
import { HighchartsChartModule } from 'highcharts-angular';



@NgModule({
  declarations: [
    BarchartComponent
  ],
  imports: [
    CommonModule,
    HighchartsChartModule
  ],
  exports: [BarchartComponent]
})
export class BarchartModule { }
