import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PieComponent } from './pie.component';
import { HighchartsChartModule } from 'highcharts-angular';
import { TableModule } from 'primeng/table';


@NgModule({
  declarations: [PieComponent],
  imports: [
    CommonModule,
    HighchartsChartModule,
    TableModule
  ],
  exports: [PieComponent]
})
export class PieModule { }
