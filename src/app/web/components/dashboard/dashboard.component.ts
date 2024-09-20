import { DatePipe } from '@angular/common';
import {
    Component,
    OnInit,
    OnDestroy,
    OnChanges,
    SimpleChanges,
} from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { Product } from '../../models/product';
import { ProductService } from '../../service/product.service';
import { Subscription } from 'rxjs';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { ChartService } from '../../service/chart.service';
import { Helper } from 'src/app/Core/_helper';
import { Pf } from 'src/app/_helpers/pf';
import { Chart } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Router } from '@angular/router';
import { EnumLocalStorage, EnumStatus, EnumSystem } from 'src/app/Core/_enum';
import * as Highcharts from 'highcharts';
import { EncryptDecryptService } from 'src/app/Service/encrypt-decrypt.service';
Chart.register(ChartDataLabels);

@Component({
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {
    menu_id = 5;
    check_permissions() {
        const menu = JSON.parse(localStorage.getItem('menu') + '').filter(
            (item: any) => item.menu_id == this.menu_id && item.check == 1
        );
        if (menu.length > 0) {
        } else {
            this.router.navigate(['/empty']);
        }
    }
    project_id: any = 0;
    products!: Product[];

    chartData: any;

    chartOptions: any;

    subscription!: Subscription;
    icon_eye = 'pi pi-eye-slash';
    icon_sort = 'pi pi-sort-numeric-down-alt';
    constructor(
        private productService: ProductService,
        public layoutService: LayoutService,
        private _service: ChartService,
        private messageService: MessageService,
        private router: Router,
        private edService: EncryptDecryptService,
        
    ) {


        this.subscription = this.layoutService.configUpdate$.subscribe(() => {
            this.initChart();
        });
    }

    getFormatedDate(date: Date, format: string) {
        const datePipe = new DatePipe('en-US');
        return datePipe.transform(date, format);
    }
    selectMonth!: any;

    ListMonth: any = [];

    PlanDate: any;

    today!: any;
    day!: number;
    monthString!: string;
    yearCurrent!: any;
    monthToday!: any;

    ListChart: any = [];

    month: number = 0;

    sidebarVisible: boolean = false;

    items_menu: any;

    home: any;

    barChart!: any;

    chooseTop!: any;

    dateChartEnd!: any;

    dateFormat!: any;

    top: any = 5;

    optionTop!: any[];

    checked: boolean = true;

    showTable1: boolean = false;
    showTable2: boolean = false;
    showTable3: boolean = false;

    checkEye: boolean = true;

    isShowDetail: boolean = false;
    currentDate: any;
    ngOnInit() {

        this.project_id = Helper.ProjectID();
        const today = new Date();
        this.yearCurrent = today.getFullYear();
        this.monthToday = today.getMonth() + 1;
        this.day = today.getDate();
        this.today = Pf.DateToInt(today);

        this.monthString = this.monthToday.toString().padStart(2, '0');
        this.currentDate = parseInt(this.yearCurrent + this.monthString);
        // if (Helper.IsNull(this.selectMonth) == true) {
        //     this.selectMonth = {
        //         name: `${this.yearCurrent} - Tháng ${this.monthString}`,
        //         code: parseInt(this.yearCurrent + this.monthString),
        //         month: this.monthToday,
        //     };
        // }

        this.items_menu = [{ label: ' Dashboard' }];
        this.home = { icon: 'pi pi-chart-bar', routerLink: '/' };

        try {
            this.check_permissions();
        } catch (error) { }
        this.initChart();
        let newDate = new Date();
        this.PlanDate = this.getFormatedDate(newDate, 'YYYY-MM-dd');

        const dataMonth = Helper.getMonth();
        this.ListMonth = dataMonth.ListMonth;

        if (Helper.IsNull(this.selectMonth) == true) {
            this.selectMonth = this.ListMonth?.find(
                (i: any) => i?.code == this.currentDate
            );
        }
        this.onChooseMonth();

        if (this.dateFormat === undefined) {
            this.top = +5;
            this.dateFormat = this.today;
            this.chooseTop = this.day;
        }
        // this.getBarChartPOSM()
        // this.dataBarCharPOSMReason()
        // console.clear()

        this.loadUser();
    }

    user_profile: string = 'current';
    currentUser: any;
    userProfile: any;

    loadUser() {
        if (this.user_profile == EnumSystem.current) {
            let _u = localStorage.getItem(EnumLocalStorage.user);

            this.currentUser = JSON.parse(
                this.edService.decryptUsingAES256(_u)
            );
            this.currentUser.employee[0]._status =
                this.currentUser.employee[0].status == 1 ? true : false;
            this.userProfile = this.currentUser.employee[0];
        } 
    }

    checkUserCUS(): any {
        return this.userProfile.level == 'CUS'  ? true : false;
    }

    data_progress: any = {
        data: undefined,
        total: 0,
        labelsData: [],
        percent: [],
        values: [],
        background: [],
    };

    data_status: any = {
        data: undefined,
        total: 0,
        labelsData: [],
        percent: [],
        values: [],
        background: [],
    };

    data_reason: any = {
        data: undefined,
        total: 0,
        labelsData: [],
        percent: [],
        values: [],
        background: [],
    };

    dataProgress: any;
    optionsProgress: any;
    centerTextProgress: any;

    isLoading_Filter: boolean = false;

    dataStatus: any;
    optionsStatus: any;

    dataReason: any;
    optionsReason: any;

    initChart() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue(
            '--text-color-secondary'
        );
        const surfaceBorder =
            documentStyle.getPropertyValue('--surface-border');

        this.chartData = {
            labels: [
                'January',
                'February',
                'March',
                'April',
                'May',
                'June',
                'July',
            ],
            datasets: [
                {
                    label: 'First Dataset',
                    data: [65, 59, 80, 81, 56, 55, 40],
                    fill: false,
                    backgroundColor:
                        documentStyle.getPropertyValue('--bluegray-700'),
                    borderColor:
                        documentStyle.getPropertyValue('--bluegray-700'),
                    tension: 0.4,
                },
                {
                    label: 'Second Dataset',
                    data: [28, 48, 40, 19, 86, 27, 90],
                    fill: false,
                    backgroundColor:
                        documentStyle.getPropertyValue('--green-600'),
                    borderColor: documentStyle.getPropertyValue('--green-600'),
                    tension: 0.4,
                },
            ],
        };
    }
    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    // date min max
    dateMin: any;
    dateMax: any;

    // call data chart
    dataAuditTC!: any;
    dataAuditKTC!: any;
    dataAudit2!: any;
    pie!: any;
    pie2!: any;
    pie3!: any;
    monthSelect!: any;
    onChooseMonth() {
        const year = this.selectMonth.code.toString().substr(0, 4); // Convert the substring to a number
        this.monthSelect = this.selectMonth.month;
        const monthCurrent = +this.today.toString().substr(4, 2);
        const dayCurrent = this.today.toString().substr(6, 8);
        let day = '01';

        if (
            this.dateChartEnd === undefined &&
            this.monthSelect == monthCurrent
        ) {
            day = dayCurrent;
        } else {
            day = (this.dateChartEnd + '').substr(8, 2);
        }

        this.getData();
        this.dateMin = Pf.convertYYmmToISODate(this.selectMonth.code);
        const getdateMax = Pf.convertDDToISODate(this.dateMin);
        const res = Pf.DateToInt(getdateMax);
        const TopDayMax = res.toString().substr(6, 8);

        if (day >= TopDayMax) {
            day = TopDayMax;
        }

        // this.dateChartEnd = year + "-" + (this.monthSelect < 10 ? "0" + this.monthSelect : this.monthSelect) + "-" + day
        this.dateChartEnd = year + '-' + this.monthSelect + '-' + day;

        this.optionTop = this.optionTop = [
            {
                value: this.day,
                key: this.day,
            },
            {
                value: 10,
                key: 10,
            },
            {
                value: TopDayMax,
                key: TopDayMax,
            },
        ];
        this.dateMax = Pf.convertToISODate(res);
        this.handleSearchEnd();
        this.isShowDetail = false;

        this.getBarChartPOSM();
    }

    label!: string;
    label2!: string;
    label3!: string;
    tablePie3: any[] = [];
    tablePie2: any[] = [];
    tablePie1: any[] = [];

    summaryShop: number = 0;
    totalEmployee: number = 0;
    getData() {
        this.dataAuditTC = undefined;
        this.dataAuditKTC = undefined;
        this.dataAudit2 = undefined;

        this._service
            .ewo_chart_AuditbyMonth(
                Helper.ProjectID(),
                Helper.IsNull(this.selectMonth) == true
                    ? this.month
                    : this.selectMonth.code
            )
            .subscribe((res: any) => {
                if (res.result === EnumStatus.ok) {
                    var total = 0;
                    this.summaryShop = 0;
                    var label = `TIẾN ĐỘ THỰC HIỆN ${this.selectMonth === null
                        ? this.monthToday
                        : this.selectMonth.month
                        }`;
                    const audit = res.data.filter(
                        (i: any) => i.id_chart === 'audit'
                    );

                    try {
                        const countEmp = res.data.filter(
                            (i: any) => i.id_chart === 'employeeCall'
                        );
                        this.totalEmployee = countEmp[0].values;
                    } catch (error) { }

                    this.dataAudit2 = [];
                    for (const i of audit) {
                        let color = i.backgroundColor;
                        let value = i.values;
                        let label = `${i.label} ${i.values == undefined ? 0 : i.values
                            } CH`;
                        let label_ = `${i.label}`;
                        total += i.values;
                        this.dataAudit2.push({
                            color: color,
                            label: label,
                            value: value,
                            percent: 'null',
                            label_: label_,
                        });
                        this.tablePie1.push({
                            label: label,
                            value: value,
                            percent: 'null',
                        });
                    }
                    this.summaryShop = total;
                    this.dataAudit2.forEach((i: any) => {
                        var percent = ((i.value / total) * 100).toFixed(2);
                        i.percent = percent;
                    });

                    this.tablePie1.forEach((i: any) => {
                        var percent = ((i.value / total) * 100).toFixed(2);
                        i.percent = percent;
                    });
                    this.dataAudit2 = this.dataAudit2.map((i: any) => ({
                        name: i.label,
                        label: i.label_,
                        value: i.value,
                        y: parseFloat(i.percent), //isNaN(i.percent) ? 0 :
                        color: i.color,
                    }));
                    this.pie = [];

                    this.pie.push({
                        data: this.dataAudit2,
                        label: label,
                        total: total,
                    });

                    // data  audit-tc-ktc
                    if (
                        res.data.some((i: any) => i.id_chart === 'audit-tc-ktc')
                    ) {
                        total = 0;
                        label = 'TỔNG HỢP TÌNH TRẠNG BÁO CÁO';
                        const audit = res.data.filter(
                            (i: any) => i.id_chart === 'audit-tc-ktc'
                        );
                        this.dataAuditTC = [];
                        for (const i of audit) {
                            let color = i.backgroundColor;
                            let value = i.values;
                            let label = `${i.label} ${i.values == undefined ? 0 : i.values
                                } CH`;
                            total += i.values;
                            this.dataAuditTC.push({
                                color: color,
                                label: label,
                                value: value,
                                percent: 'null',
                            });
                            this.tablePie2.push({
                                color: color,
                                label: label,
                                value: value,
                                percent: 'null',
                            });
                        }
                        this.dataAuditTC.forEach((i: any) => {
                            var percent = ((i.value / total) * 100).toFixed(2);
                            i.percent = percent; // console.log(percent)
                        });
                        this.tablePie2.forEach((i: any) => {
                            var percent = ((i.value / total) * 100).toFixed(2);
                            i.percent = percent; // console.log(percent)
                        });
                        this.dataAuditTC = this.dataAuditTC.map((i: any) => ({
                            name: i.label,
                            y: parseFloat(i.percent), //isNaN(i.percent) ? 0 :
                            color: i.color,
                        }));
                        this.pie2 = [];
                        this.pie2.push({
                            data: this.dataAuditTC,
                            label: label,
                            total: total,
                        });
                    }

                    // data audit-ktc-ld
                    // if (res.data.some((i: any) => (i.id_chart === 'audit-ktc-ld'))) {
                    total = 0;
                    label = 'TỔNG HỢP CÁC LÝ DO BÁO CÁO KTC';
                    let auditktc = res.data.filter(
                        (i: any) => i.id_chart === 'audit-ktc-ld'
                    );
                    this.dataAuditKTC = [];
                    for (const i of auditktc) {
                        let color = i.backgroundColor;
                        let value = i.values;
                        let label = `${i.label} ${i.values == undefined ? 0 : i.values
                            } BC`;
                        total += i.values;
                        this.tablePie3.push({
                            color: color,
                            label: label,
                            value: value,
                            percent: 'null',
                        });
                        this.dataAuditKTC.push({
                            label: label,
                            value: value,
                            percent: 'null',
                        });
                    }
                    this.dataAuditKTC.forEach((i: any) => {
                        var percent = ((i.value / total) * 100).toFixed(2);
                        i.percent = percent; // console.log(percent)
                    });
                    this.tablePie3.forEach((i: any) => {
                        var percent = ((i.value / total) * 100).toFixed(2);
                        i.percent = percent; // console.log(percent)
                    });

                    this.dataAuditKTC = this.dataAuditKTC.map((i: any) => ({
                        name: i.label,
                        y: parseFloat(i.percent), //isNaN(i.percent) ? 0 :
                        color: i.color,
                    }));

                    this.pie3 = [];
                    //   console.log(total)
                    this.pie3.push({
                        data: this.dataAuditKTC,
                        label: label,
                        total: total,
                    });

                    // }
                }

                this.label2 =
                    Helper.IsNull(this.pie2) != true ? this.pie2[0].label : '';
                this.label =
                    Helper.IsNull(this.pie) != true ? this.pie[0].label : '';
                this.label3 =
                    Helper.IsNull(this.pie3) != true ? this.pie3[0].label : '';
            });
    }

    // barchart
    getColumnChart() {
        this.barChart = undefined;
        this._service
            .ewo_chart_AuditReport(
                Helper.ProjectID(),
                this.dateFormat,
                this.top
            )
            .subscribe((res: any) => {
                if (res.result == EnumStatus.ok) {
                    this.barChart = [];
                    let column = res.data.calendar.map(
                        (item: any) => item.TheDate
                    );
                    let bar = res.data.data.map(
                        (item: any) => item.number_of_report
                    );
                    this.barChart.push({ column: column, bar: bar });
                }
                // console.log(this.barChart)
            });
    }
    // search column chart
    handleSearchEnd() {
        this.dateFormat = Pf.StringDateToInt(this.dateChartEnd);
        this.getColumnChart();
    }
    handleSearchTop() {
        this.top = this.chooseTop;
        this.getColumnChart();
    }

    addChart(e: any) {
        this.isShowDetail = true;
        this.dataDetailDate = +Pf.StringDateToInt(e);
        this.getBarChart();
    }
    handleEye() {
        this.isShowDetail = false;
        this.checkEye = true;
    }

    // bar-column chart
    dataBarChart!: any;
    dataDetailDate!: number;
    topBarChart: number = 5;
    Sort: string = 'DESC';
    optionTopBarChart: any[] = [
        {
            value: 5,
            key: 5,
        },
        {
            value: 10,
            key: 10,
        },
        {
            value: 30,
            key: 30,
        },
        {
            value: 'All',
            key: 999,
        },
    ];
    dataDetailDateTime: any;
    getBarChart() {
        this.dataBarChart = [];
        this.dataDetailDateTime = Pf.convertToISODate(this.dataDetailDate);

        this._service
            .ewo_chart_AuditTopEmployeeReport(
                Helper.ProjectID(),
                this.dataDetailDate,
                this.topBarChart,
                this.Sort
            )
            .subscribe(
                (res: any) => {
                    if (res.result === EnumStatus.ok) {
                        const data = res.data;
                        let barChart = [];
                        let i = 0;
                        for (const item of data) {
                            i++;
                            let y = item.employeeReport;
                            let name = item.employee_name;
                            let color = Helper.colorArray(i);
                            barChart.push({ y, name, color });
                        }
                        this.dataBarChart = barChart;
                        // console.log(this.dataBarChart)
                    }
                },
                (error) => {
                    console.log('Error', error);
                }
            );
    }

    item_Posm: any = null;
    selectPOSM(event: any) {
        this.item_Posm = event != null ? event : null;
        this.getBarChartPOSM();
    }

    listPOSM(event: any) {
        this.item_Posm = this.item_Posm == null ? event : this.item_Posm;
        this.getBarChartPOSM();
    }

    dataPOSM: any = {
        categories: [],
        series: [],
        dataValues: [],
        dataTarget: [],
    };
    dataPOSMReason: any = {
        categories: [],
        series: [],
        dataReason: [],
        dataReasonName: '',
    };
    clearDataPOSM() {
        this.dataPOSM.categories = [];
        this.dataPOSM.series = [];
        this.dataPOSM.dataValues = [];
        this.dataPOSM.dataTarget = [];
    }
    clearDataPOSMReason() {
        this.dataPOSMReason.dataReason = [];
        this.dataPOSMReason.dataReasonName = '';
    }

    dataAll: any = [];

    getBarChartPOSM() {
        var posm_id = '';
        this.item_Posm?.forEach((element: any) => {
            posm_id += element.id + ' ';
        });
        try {
            this._service
                .ewo_chart_POSM_TotalQuantity(
                    Helper.ProjectID(),
                    Helper.IsNull(this.selectMonth) == true
                        ? 0
                        : this.selectMonth.code,
                    //0,
                    posm_id
                )
                .subscribe((data: any) => {
                    if (data.result == EnumStatus.ok) {
                        this.clearDataPOSM();
                        data.data.dataPOSM.forEach((element: any) => {
                            this.dataPOSM.categories.push(element.posm_code);
                            this.dataPOSM.dataValues.push(element.values);
                            this.dataPOSM.dataTarget.push(
                                element.target_install
                            );
                        });

                        this.dataPOSM.series.push({
                            name: 'Values',
                            data: this.dataPOSM.dataValues,
                            color: Helper.colorArray(5),
                        });
                        this.dataPOSM.series.push({
                            name: 'Target Install',
                            data: this.dataPOSM.dataTarget,
                            color: Helper.colorArray(2),
                        });

                        this.clearDataPOSMReason();
                        this.dataPOSMReason.series = [];

                        data.data.dataReason.forEach(
                            (element: any, index: any) => {
                                this.dataPOSMReason.categories.push(
                                    element.posm_code
                                );
                                this.clearDataPOSMReason();
                                const dataValues = data.data.dataReason.filter(
                                    (x: any) =>
                                        x.report_status_id ==
                                        element.report_status_id
                                );
                                dataValues.forEach((y: any) => {
                                    this.dataPOSMReason.dataReasonName =
                                        y.report_status_name;
                                    this.dataPOSMReason.dataReason.push(
                                        y.sumReason
                                    );
                                });
                                this.dataPOSMReason.series.push({
                                    name: this.dataPOSMReason.dataReasonName,
                                    data: this.dataPOSMReason.dataReason,
                                });
                            }
                        );

                        this.dataPOSMReason.categories =
                            this.getDistinctObjects(
                                this.dataPOSMReason.categories,
                                null
                            );
                        this.dataPOSMReason.series = this.getDistinctObjects(
                            this.dataPOSMReason.series,
                            'name'
                        );

                        this.dataBarCharPOSM();
                        this.dataBarCharPOSMReason();

                        // console.log(this.dataPOSMReason.series)
                        // this.dataAll = [...this.dataPOSMReason.series,...this.dataPOSMReason.series ]
                        // console.log(this.dataPOSMReason.categories)
                    }
                });
        } catch (error) { }
    }

    dataBarCharPOSM() {
        // @ts-ignore
        Highcharts.chart('dataPOSM', {
            chart: {
                type: 'bar',
            },
            title: {
                text: 'Thống kê số lượng POSM đăng kí so với số lượng POSM đã lắp đặt',
                align: 'left',
            },
            // subtitle: {
            //     text: 'Source: <a ' +
            //         'href="https://en.wikipedia.org/wiki/List_of_continents_and_continental_subregions_by_population"' +
            //         'target="_blank">Wikipedia.org</a>',
            //     align: 'left'
            // },
            xAxis: {
                // categories: ['Africa', 'America', 'Asia', 'Europe'],
                categories: this.dataPOSM.categories,
                title: {
                    // text: 'POSM',
                    // align: 'high'
                },
                gridLineWidth: 1,
                lineWidth: 0,
                labels: {
                    style: {
                        fontSize: '14px',
                        fontWeight: '500',
                    },
                },
            },
            yAxis: {
                min: 0,
                title: {
                    // (millions)
                    text: 'Quantity',
                    align: 'high',
                },
                labels: {
                    overflow: 'justify',
                    style: {
                        fontSize: '14px',
                        fontWeight: '500',
                    },
                },
                gridLineWidth: 0,
            },
            tooltip: {
                //     valueSuffix: ' millions'
                // formatter: function () {
                //     return 'The value for <b>' + this.x + '</b> is <b>' + this.y + '</b>, in series ' + this.series.name;
                // }

                padding: 2,
                style: {
                    fontSize: '12px',
                    cursor: 'pointer',
                    fontWeight: '600',
                },
            },

            plotOptions: {
                bar: {
                    // borderRadius: '50%',
                    dataLabels: {
                        enabled: true,
                        style: {
                            enabled: true,
                            // y: -20,
                            verticalAlign: 'top',
                            fontSize: '14px',
                            fontWeight: '500',
                            format: '{point.label}',
                        },
                    },
                    groupPadding: 0.1,
                },
            },
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'top',
                x: -40,
                y: 80,
                floating: true,
                borderWidth: 1,
                backgroundColor:
                    Highcharts.defaultOptions?.legend?.backgroundColor ||
                    '#FFFFFF',
                shadow: true,

                itemStyle: {
                    fontSize: '12px',
                    fontWeight: '500',
                },
                squareSymbol: false,
                symbolPadding: 4,
                symbolWidth: 30,
                symbolRadius: 0,
                alignColumns: true,
            },
            credits: {
                enabled: false,
            },
            series: this.dataPOSM.series,
        });
    }

    dataBarCharPOSMReason() {
        // @ts-ignore
        Highcharts.chart('dataPOSMReason', {
            chart: {
                type: 'column',
            },
            title: {
                text: 'Lý do lắp đặt POSM không thành công',
            },
            xAxis: {
                categories: this.dataPOSM.categories,
                labels: {
                    style: {
                        fontSize: '14px',
                        fontWeight: '500',
                    },
                },
            },
            yAxis: {
                categories: undefined,
                title: {
                    text: null,
                },
                labels: {
                    style: {
                        fontSize: '14px',
                        fontWeight: '500',
                    },
                },
            },
            credits: {
                enabled: false,
            },
            plotOptions: {
                column: {
                    dataLabels: {
                        enabled: true,

                        style: {
                            enabled: true,
                            // y: -20,
                            verticalAlign: 'top',
                            fontSize: '14px',
                            fontWeight: '500',
                            format: '{point.label}',
                        },
                    },
                    cursor: 'pointer',
                    // selected: true,
                    // allowPointSelect: true,
                    // pointWidth: 50,
                },
            },
            tooltip: {
                // shared: true,
                padding: 2,
                style: {
                    fontSize: '12px',
                    cursor: 'pointer',
                    fontWeight: '600',
                },
            },
            legend: {
                itemStyle: {
                    fontSize: '12px',
                    fontWeight: '500',
                },
                squareSymbol: false,
                symbolPadding: 4,
                symbolWidth: 30,
                symbolRadius: 0,
                alignColumns: true,
            },
            series: this.dataPOSMReason.series,
        });
    }

    getDistinctObjects(dataList: any, property: any) {
        const uniqueValues = new Set();
        return dataList.filter((obj: any) => {
            const value = Helper.IsNull(property) == true ? obj : obj[property];
            if (!uniqueValues.has(value)) {
                uniqueValues.add(value);
                return true;
            }
            return false;
        });
    }

    NotiIsNull(value: any, name: any): any {
        let result = 0;
        if (Helper.IsNull(value) == true) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: name,
            });
            result = 1;
        } else {
            result = 0;
        }
        return result;
    }

    handleSort() {
        if (this.checked === true) {
            this.Sort = 'DESC';
        } else {
            this.Sort = 'ASC';
        }
        this.getBarChart();
    }

    handleSearchTopBarChart() {
        this.getBarChart();
    }

    convertDate(str: any) {
        if (str !== undefined) {
            var date = new Date(str),
                mnth = ('0' + (date.getMonth() + 1)).slice(-2),
                day = ('0' + date.getDate()).slice(-2);
            return Number([date.getFullYear(), mnth, day].join(''));
        } else {
            return '';
        }
    }

    actionTable(e: any) {
        if (e == 1) {
            this.showTable1 = !this.showTable1;
        }
        if (e == 2) {
            this.showTable2 = !this.showTable2;
        }
        if (e == 3) {
            this.showTable3 = !this.showTable3;
        }
    }
}
