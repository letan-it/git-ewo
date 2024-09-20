import { Component, Input, SimpleChanges, OnChanges } from '@angular/core';
import * as Highcharts from 'highcharts';
@Component({
  selector: 'app-bar',
  templateUrl: './bar.component.html',
  styleUrls: ['./bar.component.scss']
})
export class BarComponent implements OnChanges {
  @Input() dataBarChart!: any
  updateFlag: boolean = false;
  Highcharts: typeof Highcharts = Highcharts;
  Options_barColumn: Highcharts.Options = {}



  ngOnChanges(changes: SimpleChanges): void {
    if (changes['dataBarChart']) {

      const data = this.dataBarChart
      this.HandleUpdateChart(data)
    }

  }

  HandleUpdateChart(e: any) {
    const label = e?.map((i: any) => (i.name))
    this.Options_barColumn.yAxis = {
      lineColor: 'red',
      labels: {
        overflow: 'justify',
        style: {
          fontSize: '14px',
          fontWeight: '500',
        }
      },
      title: {
        text: null
      },
      gridLineWidth: 0,
      tickInterval: 5
    },
      this.Options_barColumn.xAxis = {
        categories: label,
        title: {
          text: null,

        },
        labels: {
          style: {
            fontSize: '14px',
            fontWeight: '500',
          }
        },
        lineWidth: 0,
        gridLineWidth: 1,
        min: 0
      }
    this.Options_barColumn.credits = {
      enabled: false,
    },
      this.Options_barColumn.title = {
        text: ''
      },

      this.Options_barColumn.legend = {
        enabled: false,
        layout: 'horizontal',
        verticalAlign: 'top',
        itemStyle: {
          fontSize: '12px',
          fontWeight: '500',
        },
        squareSymbol: false,
        symbolPadding: 4,
        symbolWidth: 40,
        symbolRadius: 0,
        alignColumns: false,

      },
      this.Options_barColumn.plotOptions = {
        bar: {
          // borderRadius: '50%',
          dataLabels: {
            enabled: true,
            style: {
              fontSize: '14px',
              fontWeight: '500',
            }
          },
          // groupPadding: 0.1
        }
      },

      this.Options_barColumn.series = [
        {
          type: 'bar',
          data: e,
          name: 'Report'
        }
      ],
      this.Options_barColumn.tooltip = {
        shared: true,
        padding: 2,
        style: {
          fontSize: '12px',
          cursor: 'pointer',
          fontWeight: '600',
        }
      }
    this.updateFlag = true
  }
}
