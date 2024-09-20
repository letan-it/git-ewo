import { ChangeDetectorRef, Component } from '@angular/core';
import { Chart } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import * as Highcharts from 'highcharts';
import { ChartService } from '../../service/chart.service';
import { Helper } from 'src/app/Core/_helper';
import { EnumLocalStorage, EnumStatus, EnumSystem } from 'src/app/Core/_enum';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Pf } from 'src/app/_helpers/pf';
import { MastersService } from '../../service/masters.service';
import { EncryptDecryptService } from 'src/app/Service/encrypt-decrypt.service';
Chart.register(ChartDataLabels);

@Component({
    selector: 'app-dashboard-atd',
    templateUrl: './dashboard-atd.component.html',
    styleUrls: ['./dashboard-atd.component.scss'],
    providers: [MessageService, ConfirmationService],
})
export class DashboardAtdComponent {
    constructor(
        private _service: ChartService,
        private messageService: MessageService,
        private master: MastersService,
        private edService: EncryptDecryptService
    ) {}
    items_menu: any;
    home: any;
    rangeDates: any = [];

    expandedRows = {};
    minDate: any = null;
    maxDate: any = null;
    start: any = null;

    project_id: any = Helper.ProjectID();
    ngOnInit(): void {
        //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
        //Add 'implements OnInit' to the class.

        this.items_menu = [{ label: ' Dashboard ATD' }];
        this.home = { icon: 'pi pi-chart-bar', routerLink: '/' };

        this.loadUser();
        this.checkTypeEmployee();

        this.getDataArea();
        this.getDate();
        this.getData();
        // this.TotalAmountEmployee();
        // this.getDataWorkingTime();
    }
    // Total Working Time
    value: any = null;
    representatives = [
        { name: 'Amy Elsner', image: 'amyelsner.png' },
        { name: 'Anna Fali', image: 'annafali.png' },
        { name: 'Asiya Javayant', image: 'asiyajavayant.png' },
        { name: 'Bernardo Dominic', image: 'bernardodominic.png' },
        { name: 'Elwin Sharvill', image: 'elwinsharvill.png' },
        { name: 'Ioni Bowcher', image: 'ionibowcher.png' },
        { name: 'Ivan Magalhaes', image: 'ivanmagalhaes.png' },
        { name: 'Onyama Limba', image: 'onyamalimba.png' },
        { name: 'Stephen Shaw', image: 'stephenshaw.png' },
        { name: 'Xuxue Feng', image: 'xuxuefeng.png' },
    ];

    statuses = [
        { label: 'Unqualified', value: 'unqualified' },
        { label: 'Qualified', value: 'qualified' },
        { label: 'New', value: 'new' },
        { label: 'Negotiation', value: 'negotiation' },
        { label: 'Renewal', value: 'renewal' },
        { label: 'Proposal', value: 'proposal' },
    ];

    changeDateWokingTime(event: any) {
        const date = Helper.convertDateInt(event);
        this.startDate = date;
        this.endDate = date;
        this.dataWokingTimefilterDay(date);
    }

    dataWokingTimeFilter: any;
    dataWokingTimeByShopFilter: any;
    dataWokingTimefilterDay(date: any) {
        let result = this.dataWokingTimeFilter;
        let resultDetails = this.dataWokingTimeByShopFilter;
        if (date != '' && date != null && date != undefined) {
            result = this.dataWokingTimeFilter.filter(
                (s: any) => s.atd_date == date
            );
            resultDetails = this.dataWokingTimeByShopFilter.filter(
                (s: any) => s.atd_date == date
            );
        }
        this.configDataWokingTime(result, resultDetails);
    }

    listWorkingTime = {
        total_working_time: [],
        detailsbyshop: [],
    };
    loading_WorkingTime: boolean = true;
    reloadDataWokingTime() {
        this.startDate = Helper.transformDateInt(new Date(this.rangeDates[0]));
        this.endDate = Helper.transformDateInt(new Date(this.rangeDates[1]));
        this.getDataWorkingTime();
    }
    getDataWorkingTime() {
        this.loading_WorkingTime = true;
        // project_id, employee_id, manager_id, area, shop_code,  fromDate, todate

        this._service
            .ChartATD_TotalWorkingTime(
                Helper.ProjectID(),
                Helper.IsNull(this.employee_id) != true
                    ? this.employee_id
                    : null,
                Helper.IsNull(this.manager_id) != true ? this.manager_id : null,
                Helper.IsNull(this.selectedArea) != true ? this.itemArea : null,
                this.shop_code,
                this.startDate,
                this.endDate
            )
            .subscribe((data: any) => {
                if (data.result == EnumStatus.ok) {
                    this.configDataWokingTime(
                        data.data.total_working_time,
                        data.data.detailsbyshop
                    );
                    this.dataWokingTimeFilter = data.data.total_working_time;
                    this.dataWokingTimeByShopFilter = data.data.detailsbyshop;
                }
            });
    }

    alignTimeline: any = 'top';
    configDataWokingTime(total_working_time: any, detailsbyshop: any) {
        total_working_time = total_working_time.map((x: any) => ({
            ...x,
            _emp: `[${x.employee_id}] - ${x.employee_code} - ${x.employee_name}`,
            _manager: `[${x.manager_id}] - ${x.manager_code} - ${x.manager_name}`,
            cio: `${x.CI} - ${x.CO}`,
        })); 
        total_working_time.forEach((e: any) => {
            e.cio_arr = [];
            let objCI = {
                type: 'C IN',
                time: e.CI,
                photo: e.atd_photo_ci
            };
            let objCO = {};
            e.cio_arr.push(objCI);
            if (e.CO != null) {
                objCO = { 
                    type: 'C OUT', 
                    time: e.CO ,
                    photo: e.atd_photo_co};
                e.cio_arr.push(objCO);
            }
        });
        detailsbyshop = detailsbyshop.map((x: any) => ({
            ...x,
            _emp: `[${x.employee_id}] - ${x.employee_code} - ${x.employee_name}`,
            _shop: `[${x.shop_id}] - ${x.shop_code} - ${x.shop_name}`,
            cio: `${x.CI} - ${x.CO}`,
        }));
        detailsbyshop.forEach((e: any) => {
            e.cio_arr = [];
            let objCI = {  type: 'C IN',  time: e.CI,   photo: e.atd_photo_ci };  let objCO = {}; 
             e.cio_arr.push(objCI);
            if (e.CO != null) {  objCO = { type: 'C OUT', time: e.CO, photo: e.atd_photo_co };  
             e.cio_arr.push(objCO);  }
        });
        this.listWorkingTime.total_working_time = total_working_time;
        this.listWorkingTime.detailsbyshop = detailsbyshop;
        this.loading_WorkingTime = false;
    }
    startDate: any = null;
    endDate: any = null;
    date: any = null;
    itemDate: any = [];
    itemDateTime: any = [];
    getData() {
        // Report Sale Date -> Search start_date -> to_date
        this.itemDate = null;
        this.itemDateTime = null;

        if (
            this.NofiIsNull(this.rangeDates, 'full time') == 1 ||
            this.NofiIsNull(this.rangeDates[0], 'start date') == 1 ||
            this.NofiIsNull(this.rangeDates[1], 'end date') == 1
        ) {
            return;
        } else {
            this.startDate = Helper.transformDateInt(
                new Date(this.rangeDates[0])
            );
            this.endDate = Helper.transformDateInt(
                new Date(this.rangeDates[1])
            );

            if (
                this.checkDate(this.rangeDates, 'Please enter a full Time') ==
                    1 ||
                this.NofiIsNull(this.startDate, 'start date') == 1 ||
                this.NofiIsNull(this.endDate, 'end date') == 1
            ) {
                return;
            } else {
                this.LoadDataEmployeeByDay();
                this.LoadDataEmployeeByDay_Percent();
                this.LoadDataEmployeeBySup();
                this.LoadDataEmployeeByShop();
                this.LoadDataEmployeeByArea();
                this.getDataWorkingTime();
            }
        }
    }

    loading: any = {
        EmployeeByDay: true,
        TimekeepingRate: true,
        EmployeeBySup: true,
        EmployeeByShop: true,
        EmployeeByArea: true,
    };

    ///////////////////// EmployeeByDay /////////////////////

    changeReportDate(event: any) {
        const date = Helper.convertDateInt(event);
        this.startDate = date;
        this.endDate = date;
        this.dataEmployeeByDay_filterDay(date);
        // this.LoadDataEmployeeByDay();
    }

    clearSelectReportDate() {
        this.startDate = Helper.transformDateInt(new Date(this.rangeDates[0]));
        this.endDate = Helper.transformDateInt(new Date(this.rangeDates[1]));
        this.LoadDataEmployeeByDay();
    }

    dataEmployeeByDayFilter: any;
    dataEmployeeByDay_filterDay(date: any) {
        let result = this.dataEmployeeByDayFilter;
        if (date != '' && date != null && date != undefined) {
            result = this.dataEmployeeByDayFilter.filter(
                (s: any) => s.plan_date == date
            );
        }
        this.configEmployeeByDay(result);
    }

    is_loadForm: number = 0;
    first: number = 0;
    totalRecords: number = 0;
    rows: number = 10;
    _pageNumber: number = 1;

    uuid: any = null;
    onPageChange(event: any) {
        this.first = event.first;
        this.rows = event.rows;
    }
    EmployeeByDay: any = {
        titleText: '',
        titleY: '',
        titleX: '',
        categories: [],
        series: [],
        nameDataPlan: '',
        nameDataResult: '',
        nameDataPercent: '',
        dataPlan: [],
        dataResult: [],
        dataPercent: [],
        dataTable: [],
    };

    timekeepingRate: any = {
        titleText: '',
        series: [],
    };

    LoadDataEmployeeByDay() {
        this.loading.EmployeeByDay = true; 
        this.isTableData = false;
        this._service
            .ChartATD_EmployeeByDay(
                Helper.ProjectID(),
                this.startDate,
                this.endDate,
                Helper.IsNull(this.selectedArea) != true ? this.itemArea : null,
                Helper.IsNull(this.manager_id) != true ? this.manager_id : null,
                Helper.IsNull(this.employee_id) != true
                    ? this.employee_id
                    : null,
                this.shop_code
            )
            .subscribe((data: any) => {
                if (data.result == EnumStatus.ok) {
                    this.loading.EmployeeByDay = false; 

                    const result = data.data;
                    this.dataEmployeeByDayFilter = data.data;

                    this.configEmployeeByDay(result);
                } else {
                    this.clearEmployeeByDay();
                }
            });
    }

    LoadDataEmployeeByDay_Percent() { 
        this.loading.TimekeepingRate = true; 
        this._service
            .ChartATD_EmployeeByDay_Percent(
                Helper.ProjectID(),
                this.startDate,
                this.endDate,
                Helper.IsNull(this.selectedArea) != true ? this.itemArea : null,
                Helper.IsNull(this.manager_id) != true ? this.manager_id : null,
                Helper.IsNull(this.employee_id) != true
                    ? this.employee_id
                    : null,
                this.shop_code
            )
            .subscribe((data: any) => {
                if (data.result == EnumStatus.ok) { 
                    this.loading.TimekeepingRate = false; 
                    const result = data.data;
                    // this.dataEmployeeByDayFilter = data.data; 
                    this.configEmployeeByDay_Percent(result);
                } else {
                    this.clearEmployeeByDay_Percent();
                }
            });
    }

    colorEmpDetails ( value : any ) : any{
        switch (value) {
            case true:
                return 'green';  
            default :
                return 'black';
        }
    }
    fontBoldEmpDetails ( value : any ) : any{
        switch (value) {
            case true:
                return 'font-bold';  
            default :
                return '';
        }
    }
    configEmployeeByDay(result: any) {
        this.clearEmployeeByDay();
        this.EmployeeByDay.dataTable = result || [];
        if (this.EmployeeByDay.dataTable.length > 0) {
            this.EmployeeByDay.dataTable.forEach((e: any) => {
                let percent = (e.sum_atd_result / e.sum_working_plan) * 100;
                let percentStr = percent.toFixed(2).toString();
                e.percent = percentStr + ' %'; 
                e.checkPercent = ( percent >= 50 ) ?  true : false;
                e._plan_date = Helper.convertDateStr(e.plan_date);
                
                (e.itemArea =
                    Helper.IsNull(this.selectedArea) != true
                        ? this.itemArea
                        : null),
                    (e.manager_id =
                        Helper.IsNull(this.manager_id) != true
                            ? this.manager_id
                            : null),
                    (e.employee_id =
                        Helper.IsNull(this.employee_id) != true
                            ? this.employee_id
                            : null),
                    (e.shop_code = this.shop_code);
            });
        }
        if (Helper.IsNull(result) != true) {
            

            result.forEach((element: any) => {
                this.EmployeeByDay.categories.push(
                    Helper.convertDateStr1(element.plan_date)
                );
                this.EmployeeByDay.dataPlan.push(element.sum_working_plan);
                this.EmployeeByDay.dataResult.push(element.sum_atd_result);
                this.EmployeeByDay.dataPercent.push(
                    this.percent(
                        element.sum_working_plan,
                        element.sum_atd_result
                    )
                ); 
                 
            });
            
            // Cột
            this.EmployeeByDay.titleText = 'Thống kê chấm công PA theo ngày';
            this.EmployeeByDay.titleY = 'Số lượng';
            this.EmployeeByDay.titleX = 'Phần trăm';

            this.EmployeeByDay.nameDataPlan = 'Số User có lịch làm việc';
            this.EmployeeByDay.nameDataResult = 'Số User có chấm công';
            this.EmployeeByDay.nameDataPercent = 'Tỉ Lệ Chấm Công';
 
        }

        this.dataEmployeeByDay(); 
    }

    configEmployeeByDay_Percent(result: any) { 
        this.clearEmployeeByDay_Percent(); 
        if (Helper.IsNull(result) != true) { 

            this.timekeepingRate.titleText = 'Tỉ lệ chấm công';
            this.timekeepingRate.series = [ 
                {
                    name: 'Số User chưa chấm công',
                    y: result.dataWorkingPlan.length, 
                },
                {
                    name: 'Số User có chấm công',
                    y: result.dataATDResult.length, 
                },
            ];
        }
 
        this.dataTimekeepingRate();
    }

    clearEmployeeByDay() {
        // this.listShopSKU = []

        this.EmployeeByDay.titleText = '';
        this.EmployeeByDay.titleY = '';
        this.EmployeeByDay.titleX = '';
        this.EmployeeByDay.categories = [];
        this.EmployeeByDay.series = [];
        this.EmployeeByDay.nameDataPlan = '';
        this.EmployeeByDay.nameDataResult = '';
        this.EmployeeByDay.nameDataPercent = '';
        this.EmployeeByDay.dataPlan = [];
        this.EmployeeByDay.dataResult = [];
        this.EmployeeByDay.dataPercent = []; 
         
    }

    clearEmployeeByDay_Percent() {

        this.timekeepingRate.titleText = '';
        this.timekeepingRate.series = [];
    }
    isTableData = false;
    hightChart: any = null;
    dataEmployeeByDay() {
        this.hightChart = Highcharts.getOptions();
        // @ts-ignore
        Highcharts.chart('dataEmployeeByDay', {
            chart: {
                zooming: {
                    type: 'xy',
                },
            },
            title: {
                text: this.EmployeeByDay.titleText,
                align: 'center',
            },
            xAxis: [
                {
                    categories: this.EmployeeByDay.categories,
                    crosshair: true,
                },
            ],
            yAxis: [
                {
                    // Primary yAxis
                    labels: {
                        format: '{value}',
                        style: {
                            color: this.hightChart.colors[1],
                        },
                    },
                    title: {
                        text: this.EmployeeByDay.titleY,
                        style: {
                            color: this.hightChart.colors[1],
                        },
                    },
                },
                {
                    // Secondary yAxis
                    title: {
                        text: this.EmployeeByDay.titleX,
                        style: {
                            color: this.hightChart.colors[0],
                        },
                    },
                    labels: {
                        format: '{value}%',
                        style: {
                            color: this.hightChart.colors[0],
                        },
                    },
                    opposite: true,
                },
            ],
            tooltip: {
                shared: true,
            },
            // legend: {
            //   // align: 'left',
            //   align: 'center',
            //   x: 80,
            //   verticalAlign: 'bottom',
            //   y: 60,
            //   floating: true,
            //   backgroundColor: 'rgba(255,255,255,0.25)'
            // },
            plotOptions: {
                series: {
                    borderWidth: 0,
                    dataLabels: {
                        enabled: true,
                        format: '{point.y}',
                    },
                },
            },
            credits: {
                enabled: false,
            },
            series: [
                {
                    name: this.EmployeeByDay.nameDataPlan,
                    type: 'column',
                    yAxis: 1,
                    data: this.EmployeeByDay.dataPlan,
                    tooltip: {
                        valueSuffix: '',
                    },
                },
                {
                    name: this.EmployeeByDay.nameDataResult,
                    type: 'column',
                    yAxis: 1,
                    data: this.EmployeeByDay.dataResult,
                    tooltip: {
                        valueSuffix: '',
                    },
                },

                {
                    name: this.EmployeeByDay.nameDataPercent,
                    type: 'spline',
                    data: this.EmployeeByDay.dataPercent,
                    tooltip: {
                        valueSuffix: ' %',
                    },
                },
            ],
            exporting: {
                menuItemDefinitions: {
                    // Custom definition
                    label: {
                        onclick: () => {
                            this.isTableData = !this.isTableData;
                        },
                        text: 'View Data Table',
                    },
                },
                buttons: {
                    contextButton: {
                        menuItems: [
                            'viewFullscreen',
                            'printChart',
                            'separator',
                            'downloadPNG',
                            'downloadJPEG',
                            'downloadPDF',
                            'downloadSVG',
                            'separator',
                            'downloadCSV',
                            'downloadXLS',
                            'label',
                        ],
                    },
                },
            },
        });
    }

    ///////////////////// Tỉ lệ chấm công ///////////////////
    dataTimekeepingRate() {
        // @ts-ignore
        Highcharts.chart('dataTimekeepingRate', {
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie',
            },
            title: {
                text: this.timekeepingRate.titleText,
                align: 'center',
            },
            tooltip: {
                pointFormat:
                    '{series.name}: <b>{point.y}</b><br/>' +
                    'Percent: <b>{point.percentage:.1f}%</b>',
            },
            accessibility: {
                point: {
                    valueSuffix: '%',
                },
            },

            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        format:
                            '<span style="font-size: 1.2em"><b>{point.name}</b></span><br>' +
                            '<span style="opacity: 0.6"><b>Quantity:</b> {point.y}</span><br/>' +
                            '<span style="opacity: 0.6">Percent: {point.percentage:.1f} %</span>',
                        connectorColor: 'rgba(128,128,128,0.5)',
                    },
                    showInLegend: true,
                },
            },

            series: [
                {
                    name: 'Sum of Quantity',
                    colorByPoint: true,
                    data: this.timekeepingRate.series,
                },
            ],
            credits: {
                enabled: false,
            },
        });
    }

    ///////////////////// EmployeeBySup /////////////////////
    EmployeeBySup: any = {
        titleText: '',
        titleY: '',
        titleX: '',
        categories: [],
        series: [],
        nameDataPlan: '',
        nameDataResult: '',
        nameDataPercent: '',
        dataPlan: [],
        dataResult: [],
        dataPercent: [],
    };

    LoadDataEmployeeBySup() {
        this.loading.EmployeeBySup = true;

        this._service
            .ChartATD_EmployeeBySup(
                Helper.ProjectID(),
                this.startDate,
                this.endDate,
                Helper.IsNull(this.selectedArea) != true ? this.itemArea : null,
                Helper.IsNull(this.manager_id) != true ? this.manager_id : null,
                Helper.IsNull(this.employee_id) != true
                    ? this.employee_id
                    : null,
                this.shop_code
            )
            .subscribe((data: any) => {
                if (data.result == EnumStatus.ok) {
                    this.loading.EmployeeBySup = false;

                    const result = data.data;
                    // this.dataSKUShopFilter = data.data
                    this.configEmployeeBySup(result);
                } else {
                    this.clearEmployeeBySup();
                }
            });
    }

    configEmployeeBySup(result: any) {
        this.clearEmployeeBySup();
        if (Helper.IsNull(result) != true) {
            result.forEach((element: any) => {
                // this.EmployeeBySup.categories.push(`[${element.employee_id}] - ${element.employee_code} - ${element.employee_name}`)
                this.EmployeeBySup.categories.push(`${element.employee_name}`);
                this.EmployeeBySup.dataPlan.push(element.sum_working_plan);
                this.EmployeeBySup.dataResult.push(element.sum_atd_result);
                this.EmployeeBySup.dataPercent.push(
                    this.percent(
                        element.sum_working_plan,
                        element.sum_atd_result
                    )
                );
            });
            // Cột
            this.EmployeeBySup.titleText = 'Thống kê chấm công PA theo Sup';
            this.EmployeeBySup.titleY = 'Số lượng';
            this.EmployeeBySup.titleX = 'Phần trăm';

            this.EmployeeBySup.nameDataPlan = 'Số User có lịch làm việc';
            this.EmployeeBySup.nameDataResult = 'Số User có chấm công';
            this.EmployeeBySup.nameDataPercent = 'Tỉ Lệ Chấm Công';
        }
        this.dataEmployeeBySup();
    }

    clearEmployeeBySup() {
        // this.listShopSKU = []

        this.EmployeeBySup.titleText = '';
        this.EmployeeBySup.titleY = '';
        this.EmployeeBySup.titleX = '';
        this.EmployeeBySup.categories = [];
        this.EmployeeBySup.series = [];
        this.EmployeeBySup.nameDataPlan = '';
        this.EmployeeBySup.nameDataResult = '';
        this.EmployeeBySup.nameDataPercent = '';
        this.EmployeeBySup.dataPlan = [];
        this.EmployeeBySup.dataResult = [];
        this.EmployeeBySup.dataPercent = [];
    }

    dataEmployeeBySup() {
        this.hightChart = Highcharts.getOptions();
        // @ts-ignore

        Highcharts.chart('dataEmployeeBySup', {
            chart: {
                zooming: {
                    type: 'xy',
                },
            },
            title: {
                text: this.EmployeeBySup.titleText,
                align: 'center',
            },
            xAxis: [
                {
                    categories: this.EmployeeBySup.categories,
                    crosshair: true,
                },
            ],
            yAxis: [
                {
                    // Primary yAxis
                    labels: {
                        format: '{value}',
                        style: {
                            color: this.hightChart.colors[1],
                        },
                    },
                    title: {
                        text: this.EmployeeBySup.titleY,
                        style: {
                            color: this.hightChart.colors[1],
                        },
                    },
                },
                {
                    // Secondary yAxis
                    title: {
                        text: this.EmployeeBySup.titleX,
                        style: {
                            color: this.hightChart.colors[0],
                        },
                    },
                    labels: {
                        format: '{value}%',
                        style: {
                            color: this.hightChart.colors[0],
                        },
                    },
                    opposite: true,
                },
            ],
            tooltip: {
                shared: true,
            },
            // legend: {
            //   align: 'left',
            //   x: 80,
            //   verticalAlign: 'top',
            //   y: 60,
            //   floating: true,
            //   backgroundColor: 'rgba(255,255,255,0.25)'
            // },
            plotOptions: {
                series: {
                    borderWidth: 0,
                    dataLabels: {
                        enabled: true,
                        format: '{point.y}',
                    },
                },
            },
            credits: {
                enabled: false,
            },
            series: [
                {
                    name: this.EmployeeBySup.nameDataPlan,
                    type: 'column',
                    yAxis: 1,
                    data: this.EmployeeBySup.dataPlan,
                    tooltip: {
                        valueSuffix: '',
                    },
                },
                {
                    name: this.EmployeeBySup.nameDataResult,
                    type: 'column',
                    yAxis: 1,
                    data: this.EmployeeBySup.dataResult,
                    tooltip: {
                        valueSuffix: '',
                    },
                },

                {
                    name: this.EmployeeBySup.nameDataPercent,
                    type: 'spline',
                    data: this.EmployeeBySup.dataPercent,
                    tooltip: {
                        valueSuffix: ' %',
                    },
                },
            ],
        });
    }

    ///////////////////// EmployeeByShop /////////////////////
    shop_name: any = '';
    selectShopNameByShop(event: any) {
        this.shop_name = Helper.IsNull(event) != true ? event : '';
        this.dataEmployeeByShop_filterShopName(this.shop_name);
    }
    dataEmployeeByShopFilter: any;
    dataEmployeeByShop_filterShopName(shop_name: string) {
        let result = this.dataEmployeeByShopFilter;
        if (shop_name != '' && shop_name != null && shop_name != undefined) {
            result = this.dataEmployeeByShopFilter.filter((s: any) =>
                s.shop_name.toLowerCase().includes(shop_name.toLowerCase())
            );
        }
        this.configEmployeeByShop(result);
    }

    EmployeeByShop: any = {
        titleText: '',
        titleY: '',
        titleX: '',
        categories: [],
        series: [],
        nameDataPlan: '',
        nameDataResult: '',
        nameDataPercent: '',
        dataPlan: [],
        dataResult: [],
        dataPercent: [],
    };

    LoadDataEmployeeByShop() {
        this.loading.EmployeeBySup = true;

        this._service
            .ChartATD_EmployeeByShop(
                Helper.ProjectID(),
                this.startDate,
                this.endDate,
                Helper.IsNull(this.selectedArea) != true ? this.itemArea : null,
                Helper.IsNull(this.manager_id) != true ? this.manager_id : null,
                Helper.IsNull(this.employee_id) != true
                    ? this.employee_id
                    : null,
                this.shop_code
            )
            .subscribe((data: any) => {
                if (data.result == EnumStatus.ok) {
                    this.loading.EmployeeByShop = false;

                    const result = data.data;
                    this.dataEmployeeByShopFilter = data.data;
                    this.configEmployeeByShop(result);
                } else {
                    this.clearEmployeeByShop();
                }
            });
    }

    configEmployeeByShop(result: any) {
        this.clearEmployeeByShop();
        if (Helper.IsNull(result) != true) {
            result.forEach((element: any) => {
                // this.EmployeeByShop.categories.push(`[${element.shop_id}] - ${element.shop_code} - ${element.shop_name}`)
                this.EmployeeByShop.categories.push(`${element.shop_name}`);
                this.EmployeeByShop.dataPlan.push(element.sum_working_plan);
                this.EmployeeByShop.dataResult.push(element.sum_atd_result);
                this.EmployeeByShop.dataPercent.push(
                    this.percent(
                        element.sum_working_plan,
                        element.sum_atd_result
                    )
                );
            });
            // Cột
            this.EmployeeByShop.titleText = 'Thống kê chấm công PA theo Shop';
            this.EmployeeByShop.titleY = 'Số lượng';
            this.EmployeeByShop.titleX = 'Phần trăm';

            this.EmployeeByShop.nameDataPlan = 'Số User có lịch làm việc';
            this.EmployeeByShop.nameDataResult = 'Số User có chấm công';
            this.EmployeeByShop.nameDataPercent = 'Tỉ Lệ Chấm Công';
        }
        this.dataEmployeeByShop();
    }

    clearEmployeeByShop() {
        // this.listShopSKU = []

        this.EmployeeByShop.titleText = '';
        this.EmployeeByShop.titleY = '';
        this.EmployeeByShop.titleX = '';
        this.EmployeeByShop.categories = [];
        this.EmployeeByShop.series = [];
        this.EmployeeByShop.nameDataPlan = '';
        this.EmployeeByShop.nameDataResult = '';
        this.EmployeeByShop.nameDataPercent = '';
        this.EmployeeByShop.dataPlan = [];
        this.EmployeeByShop.dataResult = [];
        this.EmployeeByShop.dataPercent = [];
    }

    dataEmployeeByShop() {
        this.hightChart = Highcharts.getOptions();
        // @ts-ignore
        Highcharts.chart('dataEmployeeByShop', {
            chart: {
                zooming: {
                    type: 'xy',
                },
            },
            title: {
                text: this.EmployeeByShop.titleText,
                align: 'center',
            },
            xAxis: [
                {
                    categories: this.EmployeeByShop.categories,
                    crosshair: true,
                },
            ],
            yAxis: [
                {
                    // Primary yAxis
                    labels: {
                        format: '{value}',
                        style: {
                            color: this.hightChart.colors[1],
                        },
                    },
                    title: {
                        text: this.EmployeeByShop.titleY,
                        style: {
                            color: this.hightChart.colors[1],
                        },
                    },
                },
                {
                    // Secondary yAxis
                    title: {
                        text: this.EmployeeByShop.titleX,
                        style: {
                            color: this.hightChart.colors[0],
                        },
                    },
                    labels: {
                        format: '{value}%',
                        style: {
                            color: this.hightChart.colors[0],
                        },
                    },
                    opposite: true,
                },
            ],
            tooltip: {
                shared: true,
            },
            // legend: {
            //   align: 'left',
            //   x: 80,
            //   verticalAlign: 'top',
            //   y: 60,
            //   floating: true,
            //   backgroundColor: 'rgba(255,255,255,0.25)'
            // },
            plotOptions: {
                series: {
                    borderWidth: 0,
                    dataLabels: {
                        enabled: true,
                        format: '{point.y}',
                    },
                },
            },
            credits: {
                enabled: false,
            },
            series: [
                {
                    name: this.EmployeeByShop.nameDataPlan,
                    type: 'column',
                    yAxis: 1,
                    data: this.EmployeeByShop.dataPlan,
                    tooltip: {
                        valueSuffix: '',
                    },
                },
                {
                    name: this.EmployeeByShop.nameDataResult,
                    type: 'column',
                    yAxis: 1,
                    data: this.EmployeeByShop.dataResult,
                    tooltip: {
                        valueSuffix: '',
                    },
                },

                {
                    name: this.EmployeeByShop.nameDataPercent,
                    type: 'spline',
                    data: this.EmployeeByShop.dataPercent,
                    tooltip: {
                        valueSuffix: ' %',
                    },
                },
            ],
        });
    }

    ///////////////////// EmployeeByArea /////////////////////
    EmployeeByArea: any = {
        titleText: '',
        titleY: '',
        titleX: '',
        categories: [],
        series: [],
        nameDataPlan: '',
        nameDataResult: '',
        nameDataPercent: '',
        dataPlan: [],
        dataResult: [],
        dataPercent: [],
    };

    LoadDataEmployeeByArea() {
        this.loading.EmployeeBySup = true;

        this._service
            .ChartATD_EmployeeByArea(
                Helper.ProjectID(),
                this.startDate,
                this.endDate,
                Helper.IsNull(this.selectedArea) != true ? this.itemArea : null,
                Helper.IsNull(this.manager_id) != true ? this.manager_id : null,
                Helper.IsNull(this.employee_id) != true
                    ? this.employee_id
                    : null,
                this.shop_code
            )
            .subscribe((data: any) => {
                if (data.result == EnumStatus.ok) {
                    this.loading.EmployeeByArea = false;

                    const result = data.data;
                    // this.dataSKUShopFilter = data.data
                    this.configEmployeeByArea(result);
                } else {
                    this.clearEmployeeByArea();
                }
            });
    }

    configEmployeeByArea(result: any) {
        this.clearEmployeeByArea();
        if (Helper.IsNull(result) != true) {
            result.forEach((element: any) => {
                this.EmployeeByArea.categories.push(element.areas);
                this.EmployeeByArea.dataPlan.push(element.sum_working_plan);
                this.EmployeeByArea.dataResult.push(element.sum_atd_result);
                this.EmployeeByArea.dataPercent.push(
                    this.percent(
                        element.sum_working_plan,
                        element.sum_atd_result
                    )
                );
            });
            // Cột
            this.EmployeeByArea.titleText = 'Thống kê chấm công PA theo Area';
            this.EmployeeByArea.titleY = 'Số lượng';
            this.EmployeeByArea.titleX = 'Phần trăm';

            this.EmployeeByArea.nameDataPlan = 'Số User có lịch làm việc';
            this.EmployeeByArea.nameDataResult = 'Số User có chấm công';
            this.EmployeeByArea.nameDataPercent = 'Tỉ Lệ Chấm Công';
        }
        this.dataEmployeeByArea();
    }

    clearEmployeeByArea() {
        // this.listShopSKU = []

        this.EmployeeByArea.titleText = '';
        this.EmployeeByArea.titleY = '';
        this.EmployeeByArea.titleX = '';
        this.EmployeeByArea.categories = [];
        this.EmployeeByArea.series = [];
        this.EmployeeByArea.nameDataPlan = '';
        this.EmployeeByArea.nameDataResult = '';
        this.EmployeeByArea.nameDataPercent = '';
        this.EmployeeByArea.dataPlan = [];
        this.EmployeeByArea.dataResult = [];
        this.EmployeeByArea.dataPercent = [];
    }

    dataEmployeeByArea() {
        this.hightChart = Highcharts.getOptions();
        // @ts-ignore
        Highcharts.chart('dataEmployeeByArea', {
            chart: {
                zooming: {
                    type: 'xy',
                },
            },
            title: {
                text: this.EmployeeByArea.titleText,
                align: 'center',
            },
            xAxis: [
                {
                    categories: this.EmployeeByArea.categories,
                    crosshair: true,
                },
            ],
            yAxis: [
                {
                    // Primary yAxis
                    labels: {
                        format: '{value}',
                        style: {
                            color: this.hightChart.colors[1],
                        },
                    },
                    title: {
                        text: this.EmployeeByArea.titleY,
                        style: {
                            color: this.hightChart.colors[1],
                        },
                    },
                },
                {
                    // Secondary yAxis
                    title: {
                        text: this.EmployeeByArea.titleX,
                        style: {
                            color: this.hightChart.colors[0],
                        },
                    },
                    labels: {
                        format: '{value}%',
                        style: {
                            color: this.hightChart.colors[0],
                        },
                    },
                    opposite: true,
                },
            ],
            tooltip: {
                shared: true,
            },
            // legend: {
            //   align: 'left',
            //   x: 80,
            //   verticalAlign: 'top',
            //   y: 60,
            //   floating: true,
            //   backgroundColor: 'rgba(255,255,255,0.25)'
            // },
            plotOptions: {
                series: {
                    borderWidth: 0,
                    dataLabels: {
                        enabled: true,
                        format: '{point.y}',
                    },
                },
            },
            credits: {
                enabled: false,
            },
            series: [
                {
                    name: this.EmployeeByArea.nameDataPlan,
                    type: 'column',
                    yAxis: 1,
                    data: this.EmployeeByArea.dataPlan,
                    tooltip: {
                        valueSuffix: '',
                    },
                },
                {
                    name: this.EmployeeByArea.nameDataResult,
                    type: 'column',
                    yAxis: 1,
                    data: this.EmployeeByArea.dataResult,
                    tooltip: {
                        valueSuffix: '',
                    },
                },

                {
                    name: this.EmployeeByArea.nameDataPercent,
                    type: 'spline',
                    data: this.EmployeeByArea.dataPercent,
                    tooltip: {
                        valueSuffix: ' %',
                    },
                },
            ],
        });
    }

    user_profile: any;
    currentUser: any;
    userProfile: any;

    loadUser() {
        let _u = localStorage.getItem(EnumLocalStorage.user);

        this.currentUser = JSON.parse(this.edService.decryptUsingAES256(_u));
        this.currentUser.employee[0]._status =
            this.currentUser.employee[0].status == 1 ? true : false;
        this.userProfile = this.currentUser.employee[0];
    }

    checkManager: boolean = true;
    checkTypeEmployee() {
        if (this.userProfile.employee_type_id == 8) {
            this.checkManager = false;
            // this.manager_id = this.userProfile.employee_id
        } else {
            this.checkManager = true;
        }
    }

    listArea: any = [];
    selectedArea: any = [];
    itemArea: any = '';
    selectArea(event: any) {
        this.itemArea = '';
        if (Helper.IsNull(event.value) != true && event.value.length > 0) {
            event.value.forEach((element: any) => {
                this.itemArea += element.code + ',';
            });
        } else {
            this.itemArea = '';
        }
        // this.getData();
    }

    manager_id: any = '';
    selectManager(event: any) {
        this.manager_id = '';
        if (Helper.IsNull(event) != true) {
            event.forEach((element: any) => {
                this.manager_id += element != null ? element.code + ' ' : '';
            });
        } else {
            this.manager_id = '';
        }
    }

    clearSelectManager(event: any) {
        this.manager_id = event == true ? '' : this.manager_id;
    }

    employee_id: any = '';
    selectEmployee(event: any) {
        this.employee_id = '';
        if (Helper.IsNull(event) != true) {
            event.forEach((element: any) => {
                this.employee_id += element != null ? element.code + ' ' : '';
            });
        } else {
            this.employee_id = '';
        }
    }

    clearSelectEmployee(event: any) {
        this.employee_id = event == true ? '' : this.employee_id;
    }

    shop_code: any = '';
    selectShopCodeOutlet(event: any) {
        this.shop_code = Helper.IsNull(event) != true ? event : '';
        // this.dataSalesReportOutlet()
        // this.dataSalesReportOutlet_filterShopList(this.shop_code)
    }

    clearSelectArea() {
        // this.itemArea = (event == true) ? '' : this.itemArea
        this.selectedArea = [];
        this.itemArea = '';
    }

    getDataArea() {
        this.master.ewo_GetMaster(Helper.ProjectID()).subscribe((data: any) => {
            if (data.result == EnumStatus.ok) {
                this.listArea = [];
                const result = data.data.filter(
                    (x: any) =>
                        x.Status == 1 &&
                        x.ListCode == 'Shop.Areas' &&
                        x.Table == 'ewo.Shops'
                );

                result.forEach((element: any) => {
                    this.listArea.push({
                        name: element.NameVN,
                        code: element.Code,
                    });
                });
            } else {
                this.listArea = [];
            }
        });
    }

    getDate() {
        // this.rangeDates[0] = new Date("2024-01-01")
        // this.rangeDates[1] = new Date("2024-01-03");

        let today = new Date();
        let month = today.getMonth();
        let year = today.getFullYear();

        let prevMonth = month === 0 ? 11 : month - 1;
        let prevYear = prevMonth === 11 ? year - 1 : year;
        this.minDate = new Date();
        this.minDate.setDate(1);
        this.minDate.setMonth(prevMonth);
        this.minDate.setFullYear(prevYear);
        this.maxDate = new Date();
        this.maxDate.setDate(0);
        this.maxDate.setMonth(prevMonth);
        this.maxDate.setFullYear(prevYear);

        this.start = new Date();
        this.start.setDate(1);

        // minDate - minDate ( Today : 01/03/2024 || 02/03/2024)
        if (today.getDate() == 1 || today.getDate() == 2) {
            this.rangeDates[0] = new Date(this.minDate);
            this.rangeDates[1] = new Date(this.maxDate);
        } else {
            this.rangeDates[0] = new Date(this.start);
            this.rangeDates[1] = new Date();
        }
    }

    percent(plan: any, result: any): any {
        return parseFloat(((result / plan) * 100).toFixed(2));
    }
    sum(result: any, element: any): any {
        return (result += element);
    }

    checkDate(time: any, name: any) {
        let check = 0;
        // time.some((e: any) => e == null)
        if (Helper.IsNull(time) == true || time.length != 2) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: name,
            });
            check = 1;
        }
        return check;
    }

    // notification
    NofiIsNull(value: any, name: any): any {
        let check = 0;
        if (Helper.IsNull(value) == true || Pf.checkSpace(value) != true) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: 'Please enter a ' + name,
            });
            check = 1;
        }
        return check;
    }
    getSeverity(status: string): any {
        switch (status) {
            case 'unqualified':
                return 'danger';

            case 'qualified':
                return 'success';

            case 'new':
                return 'info';

            case 'negotiation':
                return 'warning';

            case 'renewal':
                return null;
        }
    }
    urlgallery: any;
    showImage(url: any) {
  
      this.urlgallery = url;
      document.open(
        <string>this.urlgallery,
        'image_default',
        'height=700,width=900,top=100,left= 539.647'
      );
    }

    onImageError(event: any, item: any) { 
        const link_err = EnumSystem.imageError;
        item.employee_image = link_err;
    }

    onImageErrorTimeLine(event: any, item: any) { 
        const link_err = EnumSystem.imageError;
        item.photo = link_err;
    }

    showItem( item : any){
        console.log  ( 'showItem : ', item)
    }
}
