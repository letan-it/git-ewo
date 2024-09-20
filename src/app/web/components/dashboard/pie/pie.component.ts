import { Component, Input, SimpleChanges, OnChanges, ViewChild } from '@angular/core';
import * as Highcharts from 'highcharts';
import { Helper } from 'src/app/Core/_helper';

const HighchartsExporting = require('highcharts/modules/exporting');
const HighchartsExportData = require('highcharts/modules/export-data');
HighchartsExporting(Highcharts);
HighchartsExportData(Highcharts);
@Component({
    selector: 'app-pie',
    templateUrl: './pie.component.html',
    styleUrls: ['./pie.component.scss'],
})
export class PieComponent implements OnChanges {
    @Input() pie: any[] = [];
    @Input() tablePie: any[] = [];
    @Input() showTable: boolean = true
    @ViewChild('chart') chart: any;
    chartConstructor = 'chart';
    chartCallback;
    


    percent!: any[];
    total!: number
    updateFlag: boolean = false;
    ishow!: boolean

    Highcharts: typeof Highcharts = Highcharts;
    Options_Pie: Highcharts.Options = {};


    constructor() {
        const self = this;
        this.chartCallback = (chart: any) => {
          self.chart = chart;
        };
      }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['pie']) {
            const dataPie = this.pie;
            this.handleUpdatePie(dataPie);
        }
        if (changes['showTable']) {
            this.ishow = this.showTable
        }
    }

    handleUpdatePie(e: any): void {
        const pie = e?.map((i: any) => ({
            data: i.data,
            total: i.total,
        }));
        if (pie && pie.length > 0) {
            this.percent = pie[0]?.data
            this.total = pie[0]?.total
        }

        (
            this.Options_Pie.chart = {
                backgroundColor: 'white',
                type: 'pie',
                
            }),
            this.Options_Pie.xAxis = {
                title : {
                    text: 'Khảo sát',
                }
            },
            this.Options_Pie.exporting = {
                buttons :{
                    contextButton : {
                        y:-10,
                    }
                },
                tableCaption: '',
                showTable: false,
                filename : Helper.removeSpace(e[0].label)
                
            },
            (this.Options_Pie.credits = {
                enabled: false,
            }),
            (this.Options_Pie.series = [
                {
                    enableMouseTracking: true,
                    animation: {
                        duration: 1000,
                    },
                    name:'Percent',
                    type: 'pie',
                    data: this.percent,
                },
            ]);

        (this.Options_Pie.subtitle = {
            text: `${this.total === 0 ? '' : `Tổng : ${this.total} CH`}`,
            floating: true,
            verticalAlign: 'middle',
            y: 50,
            style: {
                fontSize: '14px',
                fontWeight: '500',
            },
        }),
            (this.Options_Pie.title = {
                text: e[0].label,
                margin: 10,
                style : {'color': '#333333', 'fontSize':'13px'}
            }),
            (this.Options_Pie.credits = {
                enabled: false,
            });

        this.Options_Pie.legend = {
            margin: 30,
            layout: 'horizontal',
            verticalAlign: 'top',
            itemStyle: {
                fontSize: '12px',
                fontWeight: '500',
            },
            squareSymbol: false,
            symbolPadding: 4,
            symbolWidth: 40,
            // symbolHeight: 10,
            symbolRadius: 0,
            //maxHeight: 50,
            alignColumns: false,
        };
        this.Options_Pie.tooltip = {
            valueSuffix: '%',
        };
        (this.Options_Pie.plotOptions = {
            pie: {
                borderWidth: this.total == 0 ? 0 : 2,
                allowPointSelect: true,
                dataLabels: {
                    enabled: true,
                    distance: -35,
                    format: '{point.percentage:.1f}%',
                    backgroundColor: 'white',
                    borderRadius: 5,
                    style: {
                        fontSize: '12px',
                        color: '#333',
                        fontWeight: '500',
                        textOutline: 'none',
                        background: '#fff',
                    },
                },
                
                showInLegend: true,
                innerSize: 160,
            },
        }),
            (this.Options_Pie.tooltip = {
                backgroundColor: 'rgba(0,0,0,0.85)',
                padding: 2,
                style: {
                    fontSize: '12px',
                    cursor: 'pointer',
                    fontWeight: '600',
                },
                headerFormat:
                    '<span style = "color: white"><span style="color: {point.color}; fontSize: 20px ">&#8718;</span>{point.key} : {point.y:.1f}% </span>',
                pointFormat: undefined,
                // shared: true,
                useHTML: true,
            });
        this.updateFlag = true;
    }
}
