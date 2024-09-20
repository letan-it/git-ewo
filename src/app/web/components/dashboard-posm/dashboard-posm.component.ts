import { Component } from '@angular/core';
import { ChartService } from '../../service/chart.service';
import { Chart } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import * as Highcharts from 'highcharts';
import { ConfirmationService, MessageService } from 'primeng/api';
import { MastersService } from '../../service/masters.service';
import { EncryptDecryptService } from 'src/app/Service/encrypt-decrypt.service';
import { Helper } from 'src/app/Core/_helper';
import { EnumLocalStorage, EnumStatus } from 'src/app/Core/_enum';
import { Pf } from 'src/app/_helpers/pf';
import { PosmService } from '../../service/posm.service';

@Component({
    selector: 'app-dashboard-posm',
    templateUrl: './dashboard-posm.component.html',
    styleUrls: ['./dashboard-posm.component.scss'],
    providers: [MessageService, ConfirmationService],
})
export class DashboardPosmComponent {
    constructor(
        private _service: ChartService,
        private _servicePOSM: PosmService,
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
        this.items_menu = [{ label: ' Dashboard POSM' }];
        this.home = { icon: 'pi pi-chart-bar', routerLink: '/' };

        this.loadUser();
        this.getDataArea();
        this.getDate();
        this.getData();
        this.loadDataChart();
    }
    checkManager: boolean = true;
    checkTypeEmployee() {
        if (this.userProfile.employee_type_id == 8) {
            this.checkManager = false;
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
    item_Province: any;
    selectProvince(event: any) {
        this.item_Province = event != null ? event : 0;
    }
    item_Posm: any = null;
    selectPOSM(event: any) {
        this.item_Posm = event != null ? event : null;
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
    clearSelectArea() {
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

    item_ShopType: any = '';
    selectShopType(event: any) {
        this.item_ShopType = '';
        if (Helper.IsNull(event) != true && event.length > 0) {
            event.forEach((element: any) => {
                this.item_ShopType += element.code + ',';
            });
        } else {
            this.item_ShopType = '';
        }
    }
    clearSelectShopType(event: any) {
        this.item_ShopType = event == true ? '' : this.item_ShopType;
    }
    hightChart: any = null;
    loading: any = {
        totalPOSMAreas: true,
        listProvince: true,
        listShopType: true,
        listEmployee: true,
    };

    TPAreas: any = {
        titleText: '',
        series: [],
    };
    listProvince: any = {
        titleText: '',
        series: [],
    };
    listShopType: any = {
        titleText: '',
        series: [],
    };
    listEmployee: any = {
        titleText: '',
        titleY: '',
        titleX: '',
        categories: [],
        series: [],
        nameData: '',
        data: [],
    };

    dataSalesRegionArea() {
        this.loading.totalPOSMAreas = true;
        this.loading.listProvince = true;
        this.loading.listShopType = true;
        this.loading.listEmployee = true;

        this._servicePOSM
            .POSM_results_SummaryPOSM(
                Helper.ProjectID(),
                this.startDate,
                this.endDate,
                Helper.IsNull(this.selectedArea) != true ? this.itemArea : null,
                Helper.IsNull(this.item_Province) != true
                    ? this.item_Province
                    : null,
                Helper.IsNull(this.item_ShopType) != true
                    ? this.item_ShopType
                    : null,
                Helper.IsNull(this.manager_id) != true ? this.manager_id : null,
                Helper.IsNull(this.employee_id) != true
                    ? this.employee_id
                    : null,
                Helper.IsNull(this.item_Posm) != true ? this.item_Posm : null
            )
            .subscribe((data: any) => {
                if (data.result == EnumStatus.ok) {
                    this.loading.totalPOSMAreas = false;
                    this.loading.listProvince = false;
                    this.loading.listShopType = false;
                    this.loading.listEmployee = false;
                    this.clearTotalPOSMAreas();
                    this.clearTotalPOSMProvince();
                    this.clearTotalPOSMShopType();
                    this.clearTotalPOSMEmp();

                    if (
                        Helper.IsNull(data.data) != true &&
                        Helper.IsNull(data.data.listAreas) != true &&
                        data.data.listAreas.length > 0
                    ) {
                        const result = data.data.listAreas || [];
                        result.forEach((element: any) => {
                            this.TPAreas.series.push({
                                name: element.areas,
                                y: element.total_posm,
                            });
                        });
                        // Tròn - POSM - Area
                        this.TPAreas.titleText = `Thống kê số lượng POSM đã lắp đặt theo khu vực`;

                        const provinceData = data.data.listProvince || [];
                        provinceData.forEach((e: any) => {
                            this.listProvince.series.push({
                                name: e.province_name,
                                y: e.total_posm,
                            });
                        });
                        this.listProvince.titleText =
                            'Thống kê số lượng POSM đã lắp đặt theo tỉnh';

                        const shopTypeData = data.data.listShopType || [];
                        shopTypeData.forEach((e: any) => {
                            this.listShopType.series.push({
                                name: e.shop_type_name,
                                y: e.total_posm,
                            });
                        });
                        this.listShopType.titleText =
                            'Thống kê số lượng POSM đã lắp đặt theo loại cửa hàng';
                    }
                    this.totalPOSMAreas();
                    this.totalPOSMProvince();
                    this.totalPOSMShopType();

                    const empData = data.data.listEmployee || [];
                    this.configPOSMEmployee(empData);
                } else {
                    this.clearTotalPOSMAreas();
                    this.clearTotalPOSMProvince();
                    this.clearTotalPOSMShopType();
                    this.clearTotalPOSMEmp();
                }
            });
    }
    configPOSMEmployee(result: any) {
        if (Helper.IsNull(result) != true) {
            result.forEach((element: any) => {
                const emp =
                    '[' +
                    element.employee_code +
                    ']' +
                    ' ' +
                    element.employee_name;
                this.listEmployee.categories.push(emp);
                this.listEmployee.data.push(element.total_posm);
            });
            // Cột
            this.listEmployee.titleText =
                'Thống kê số lượng POSM đã lắp đặt theo nhân viên';
            this.listEmployee.titleY = 'Số lượng';
            this.listEmployee.titleX = 'Phần trăm';
            this.listEmployee.nameData = 'Nhân viên';

            this.totalPOSMSEmp();
        }
    }
    clearTotalPOSMAreas() {
        this.TPAreas.titleText = '';
        this.TPAreas.series = [];
    }
    clearTotalPOSMProvince() {
        this.listProvince.titleText = '';
        this.listProvince.series = [];
    }
    clearTotalPOSMShopType() {
        this.listShopType.titleText = '';
        this.listShopType.series = [];
    }
    clearTotalPOSMEmp() {
        this.listEmployee = {
            titleText: '',
            titleY: '',
            titleX: '',
            categories: [],
            series: [],
            nameData: '',
            data: [],
        };
    }

    totalPOSMAreas() {
        this.hightChart = Highcharts.getOptions();

        // @ts-ignore
        Highcharts.chart('SalesReportAreaQuantity', {
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie',
            },
            title: {
                text: this.TPAreas.titleText,
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
                    data: this.TPAreas.series,
                },
            ],
            credits: {
                enabled: false,
            },
        });
    }
    totalPOSMProvince() {
        this.hightChart = Highcharts.getOptions();

        // @ts-ignore
        Highcharts.chart('SalesReportProvinceQuantity', {
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie',
            },
            title: {
                text: this.listProvince.titleText,
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
                    data: this.listProvince.series,
                },
            ],
            credits: {
                enabled: false,
            },
        });
    }

    totalPOSMShopType() {
        this.hightChart = Highcharts.getOptions();

        // @ts-ignore
        Highcharts.chart('SalesReportShopTypeQuantity', {
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie',
            },
            title: {
                text: this.listShopType.titleText,
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
                    data: this.listShopType.series,
                },
            ],
            credits: {
                enabled: false,
            },
        });
    }
    totalPOSMSEmp() {
        this.hightChart = Highcharts.getOptions();
        // // @ts-ignore
        Highcharts.chart('SalesReportEmpQuantity', {
            chart: {
                zooming: {
                    type: 'xy',
                },
            },
            title: {
                text: this.listEmployee.titleText,
                align: 'center',
            },
            xAxis: [
                {
                    categories: this.listEmployee.categories,
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
                        text: this.listEmployee.titleY,
                        style: {
                            color: this.hightChart.colors[1],
                        },
                    },
                },
                {
                    // Secondary yAxis
                    title: {
                        text: this.listEmployee.titleX,
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
                    name: this.listEmployee.nameData,
                    type: 'column',
                    yAxis: 1,
                    data: this.listEmployee.data,
                    tooltip: {
                        valueSuffix: '',
                    },
                },
            ],
        });
    }

    loadDataChart() {
        // Data retrieved from https://gs.statcounter.com/vendor-market-share/mobile/
        // @ts-ignore
        Highcharts.chart('container', {
            chart: {
                styledMode: true,
            },
            title: {
                text: 'Mobile vendor market share, 2021',
                align: 'left',
            },
            xAxis: {
                categories: [
                    'Jan',
                    'Feb',
                    'Mar',
                    'Apr',
                    'May',
                    'Jun',
                    'Jul',
                    'Aug',
                    'Sep',
                    'Oct',
                    'Nov',
                    'Dec',
                ],
            },
            series: [
                {
                    type: 'pie',
                    allowPointSelect: true,
                    keys: ['name', 'y', 'selected', 'sliced'],
                    data: [
                        ['Samsung', 27.79, true, true],
                        ['Apple', 27.34, false],
                        ['Xiaomi', 10.87, false],
                        ['Huawei', 8.48, false],
                        ['Oppo', 5.38, false],
                        ['Vivo', 4.17, false],
                        ['Realme', 2.57, false],
                        ['Unknown', 2.45, false],
                        ['Motorola', 2.22, false],
                        ['LG', 1.53, false],
                        ['Other', 7.2, false],
                    ],
                    showInLegend: true,
                },
            ],
        });
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
                this.dataSalesRegionArea();
                // this.LoadDataEmployeeByDay_Percent();
                // this.LoadDataEmployeeBySup();
                // this.LoadDataEmployeeByShop();
                // this.LoadDataEmployeeByArea();
                // this.getDataWorkingTime();
            }
        }
    }
    getDate() {
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
        if (today.getDate() == 1 || today.getDate() == 2) {
            this.rangeDates[0] = new Date(this.minDate);
            this.rangeDates[1] = new Date(this.maxDate);
        } else {
            this.rangeDates[0] = new Date(this.start);
            this.rangeDates[1] = new Date();
        }
    }

    checkDate(time: any, name: any) {
        let check = 0;
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
}
