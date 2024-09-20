import {
    Component,
    OnInit,
} from '@angular/core';
import { Chart } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Router } from '@angular/router';
import { EmployeesService } from '../../service/employees.service';
import { EnumStatus } from 'src/app/Core/_enum';
import { Helper } from 'src/app/Core/_helper';
Chart.register(ChartDataLabels);

interface realTime {
    name: string;
    code: string;
}

@Component({
    templateUrl: './dashboard-aso.component.html',
    styleUrls: ['./dashboard-aso.component.css'],
})
export class DashboardASOComponent implements OnInit {
    constructor(private router: Router, private _service: EmployeesService) { }

    times: any;
    selectedTimes: any;

    regions: any;
    selectedRegions: any;

    message: string = '';
    display: boolean = false;

    data: any;
    options: any;
    data1: any;
    options1: any;

    basicData: any;
    basicData1: any;
    basicData2: any;
    basicData3: any;
    basicOptions: any;

    is_test: string[] = [];

    months: any;
    selectMonth: any;
    selectDate: any;
    selectStatusCICO: any = [1, 2, 3, 4];
    statusCICO: any[] = [
        { name: 'Chưa CO', value: 1 },
        { name: 'CI Trễ', value: 2 },
        { name: 'CO Sớm', value: 3 },
        { name: 'Không CICO', value: 4 },
    ];
    listDate: any = [{ name: '-- Choose --', code: 'NONE' }];
    listWeek: any = [
        { name: '-- Choose --', code: 'NONE' },
        { name: 'W1', code: 'W1' },
        { name: 'W2', code: 'W2' },
        { name: 'W3', code: 'W3' },
        { name: 'W4', code: 'W4' },
    ];
    selectWeek: any;
    // =========== //
    dataRegion: any;
    optionsRegion: any;
    dataRegionTop: any;
    optionsRegionTop: any;
    // =========== //
    dataSouth: any;
    optionsSouth: any;
    // =========== //
    dataCentral: any;
    optionsCentral: any;
    // =========== //
    dataNorth: any;
    optionsNorth: any;

    ngOnInit() {
        this.showFiter = 0;

        this.times = [
            { name: '(All)', code: 'T1' },
            { name: 'Tháng 4 năm 2023', code: 'T2' },
            { name: 'Tháng 5 năm 2023', code: 'T3' },
        ];

        this.regions = [
            { name: '(All)', code: 'A' },
            { name: 'HCMC', code: 'B' },
            { name: 'HCMP', code: 'C' },
            { name: 'MK', code: 'D' },
            { name: 'North 1', code: 'E' },
        ];

        // Số ASO thực hiện
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--white-500');

        this.data = {
            labels: [
                'Thành công: 1.385(86.51%)',
                'Không thành công:216(13.49%)',
            ],
            datasets: [
                {
                    data: [86.51, 13.49],
                    backgroundColor: [
                        documentStyle.getPropertyValue('--blue-500'),
                        documentStyle.getPropertyValue('--red-500'),
                    ],
                    hoverBackgroundColor: [
                        documentStyle.getPropertyValue('--blue-400'),
                        documentStyle.getPropertyValue('--red-400'),
                    ],
                },
            ],
        };

        this.options = {
            cutout: '60%',
            plugins: {
                legend: {
                    labels: {
                        color: textColor,
                    },
                },
                datalabels: {
                    labels: {
                        value: {
                            color: 'white',
                            weight: 1000,
                        },
                    },
                },
            },
        };

        // Tổng thực hiện

        const textColorSecondary = documentStyle.getPropertyValue(
            '--text-color-secondary'
        );
        const surfaceBorder =
            documentStyle.getPropertyValue('--surface-border');

        this.data1 = {
            labels: ['Tháng 4', 'Tháng 5'],
            datasets: [
                {
                    type: 'bar',
                    label: 'Thành công',
                    backgroundColor:
                        documentStyle.getPropertyValue('--red-500'),
                    data: [41, 52],
                },
                {
                    type: 'bar',
                    label: 'Không thành công',
                    backgroundColor:
                        documentStyle.getPropertyValue('--blue-500'),
                    data: [100, 500],
                },
            ],
        };

        this.options1 = {
            maintainAspectRatio: false,
            aspectRatio: 0.8,
            plugins: {
                tooltips: {
                    mode: 'index',
                    intersect: false,
                },
                legend: {
                    labels: {
                        color: textColor,
                    },
                },
                datalabels: {
                    labels: {
                        value: {
                            color: 'white',
                            weight: 1000,
                        },
                    },
                },
            },
            scales: {
                x: {
                    stacked: true,
                    ticks: {
                        color: textColorSecondary,
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false,
                    },
                },
                y: {
                    stacked: true,
                    ticks: {
                        color: textColorSecondary,
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false,
                    },
                },
            },
        };

        // Tổng số ASO không thành công

        // backgroundColor: ['rgba(255, 159, 64, 0.2)', 'rgba(75, 192, 192, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(153, 102, 255, 0.2)'],
        // borderColor: ['rgb(255, 159, 64)', 'rgb(75, 192, 192)', 'rgb(54, 162, 235)', 'rgb(153, 102, 255)'],

        this.basicData = {
            labels: ['Total'],
            datasets: [
                {
                    label: 'Cửa hàng đang sửa chữa',
                    data: [3],
                    backgroundColor: ['firebrick'],
                    borderColor: ['firebrick'],
                    borderWidth: 1,
                },
                {
                    label: 'Cửa hàng đóng cửa tạm thời (revisit)',
                    data: [50],
                    backgroundColor: ['tomato'],
                    borderColor: ['tomato'],
                    borderWidth: 1,
                },
                {
                    label: 'Cửa hàng đóng cửa tạm thời (revisit)',
                    data: [50],
                    backgroundColor: ['aqua'],
                    borderColor: ['aqua'],
                    borderWidth: 1,
                },
                {
                    label: 'Cửa hàng đóng cửa vĩnh viễn',
                    data: [0],
                    backgroundColor: ['aquamarine'],
                    borderColor: ['aquamarine'],
                    borderWidth: 1,
                },
                {
                    label: 'Cửa hàng không xác định được do không được phép vào bên trong khu vực',
                    data: [11],
                    backgroundColor: ['cadetblue'],
                    borderColor: ['cadetblue'],
                    borderWidth: 1,
                },
                {
                    label: 'Cửa hàng thay đổi loại hình kinh doanh',
                    data: [4],
                    backgroundColor: ['chartreuse'],
                    borderColor: ['chartreuse'],
                    borderWidth: 1,
                },
                {
                    label: 'Chủ cửa hàng đi vắng (revisit)',
                    data: [6],
                    backgroundColor: ['crimson'],
                    borderColor: ['crimson'],
                    borderWidth: 1,
                },
                {
                    label: 'Khách hàng từ chối hợp tác',
                    data: [127],
                    backgroundColor: ['palevioletred'],
                    borderColor: ['palevioletred'],
                    borderWidth: 1,
                },
                {
                    label: 'Không tìm thấy',
                    data: [15],
                    backgroundColor: ['lightcoral'],
                    borderColor: ['lightcoral'],
                    borderWidth: 1,
                },
                {
                    label: 'Thành công',
                    data: [0],
                    backgroundColor: ['powderblue'],
                    borderColor: ['powderblue'],
                    borderWidth: 1,
                },
            ],
        };

        this.basicOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: textColor,
                    },
                },
                datalabels: {
                    labels: {
                        value: {
                            color: 'white',
                            weight: 1000,
                        },
                    },
                },
            },

            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: textColorSecondary,
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false,
                    },
                },
                x: {
                    ticks: {
                        color: textColorSecondary,
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false,
                    },
                },
            },
        };

        // ASO đúng địa chỉ & SĐT

        this.basicData1 = {
            labels: ['Tháng 4'],
            datasets: [
                {
                    label: 'ASO đúng địa chỉ & SĐT',
                    data: [510],
                    backgroundColor: ['lightseagreen'],
                    borderColor: ['lightseagreen'],
                    borderWidth: 1,
                },
            ],
        };

        // ASO có mua hàng

        this.basicData2 = {
            labels: ['Tháng 4'],
            datasets: [
                {
                    label: 'ASO có mua hàng tháng trước',
                    data: [1250000],
                    backgroundColor: ['lightseagreen'],
                    borderColor: ['lightseagreen'],
                    borderWidth: 1,
                },
            ],
        };

        // ASO đạt Hero SKU

        this.basicData3 = {
            labels: ['Tháng 4'],
            datasets: [
                {
                    label: 'ASO đạt Hero SKU',
                    data: [810],
                    backgroundColor: ['lightseagreen'],
                    borderColor: ['lightseagreen'],
                    borderWidth: 1,
                },
            ],
        };

        // =============================== //
        this.months = [
            { name: '-- Choose --', code: 'NONE' },
            { name: 'T4-2023', code: '202304' },
            { name: 'T5-2023', code: '202305' },
            { name: 'T6-2023', code: '202306' },
        ];

        for (let i = 0; i < 31; i++) {
            this.listDate.push({ name: i + 1 + '', code: i + 1 + '' });
        }
        this.loadChartRegion();
        this.loadChartRegionTop();
        this.loadChartCentral();
        this.loadChartSouth();
        this.loadChartNorth();
    }

    showFiter: number = 1;
    ShowHideFiter() {
        if (this.showFiter == 1) {
            this.showFiter = 0;
        } else {
            this.showFiter = 1;
        }
    }

    ListEmployee: any = [];
    filter(pageNumber: number) {
        let is_test = 0;

        this.ListEmployee = [];
        this._service
            .ewo_GetEmployeeList(
                10,
                1,
                '',
                '',
                '',
                '',
                '','',
                14,
                1,
                Helper.ProjectID(),
                -1,
                '',
                ''
            )
            .subscribe((data: any) => {
                if (data.result == EnumStatus.ok) {
                    if (data.data.length > 0) {
                        this.ListEmployee = data.data;
                    } else {
                        this.message = 'No data';
                        this.display = true;
                    }
                }
            });
    }

    OK() {
        // this.EmployeeEdit = false;
        this.display = false;
    }

    loadChartRegion() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue(
            '--text-color-secondary'
        );
        const surfaceBorder =
            documentStyle.getPropertyValue('--surface-border');

        this.dataRegion = {
            labels: ['CENTRAL', 'NORTH', 'SOUTH'],
            datasets: [
                {
                    label: 'CI Sớm',
                    backgroundColor: '#4472c4',
                    borderColor: '#4472c4',
                    data: [65, 59, 80],
                },
                {
                    label: 'Chưa CO',
                    backgroundColor: '#ed7d31',
                    borderColor: '#ed7d31',
                    data: [28, 48, 40],
                },
                {
                    label: 'CI Trễ',
                    backgroundColor: '#a5a5a5',
                    borderColor: '#a5a5a5',
                    data: [18, 28, 41],
                },
                {
                    label: 'Không CICO',
                    backgroundColor: '#ffc000',
                    borderColor: '#ffc000',
                    data: [22, 38, 34],
                },
            ],
        };

        this.optionsRegion = {
            maintainAspectRatio: false,
            aspectRatio: 0.8,
            plugins: {
                title: {
                    display: true,
                    text: 'FAIL BY REGION',
                },
                legend: {
                    labels: {
                        color: textColor,
                    },
                },
                datalabels: {
                    formatter: Math.round,
                    anchor: 'center',
                    align: 'left',
                    color: 'black',
                    labels: {
                        value: {
                            color: 'white',
                        },
                    },
                },
            },

            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary,
                        font: {
                            weight: 500,
                        },
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false,
                        display: false,
                    },
                },
                y: {
                    ticks: {
                        display: false,
                        color: textColorSecondary,
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false,
                        display: false,
                    },
                },
            },
        };
    }
    loadChartRegionTop() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue(
            '--text-color-secondary'
        );
        const surfaceBorder =
            documentStyle.getPropertyValue('--surface-border');
        this.dataRegionTop = {
            labels: [
                'Phan Ngọc Thoại Linh',
                'Nguyễn Thùy Trang',
                'Đỗ Ngọc Phương Anh',
                'Huỳnh Dương Công Minh',
                'Nguyễn Mộng Tuyền',
                'Trần Kim Bằng',
                'Huỳnh Thị Thùy Trang',
                'Nguyễn Phúc Lợi',
                'Lê Văn Ẩn',
                'Huỳnh Thị Ngọc',
            ],
            datasets: [
                {
                    type: 'bar',
                    label: 'CI Sớm',
                    backgroundColor: '#4472c4',
                    data: [50, 25, 12, 48, 90, 76, 42, 31, 45, 21],
                },
                {
                    type: 'bar',
                    label: 'Chưa CO',
                    backgroundColor: '#ed7d31',
                    data: [21, 84, 24, 75, 37, 65, 34, 90, 76, 42],
                },
                {
                    type: 'bar',
                    label: 'CI Trễ',
                    backgroundColor: '#a5a5a5',
                    data: [41, 52, 24, 74, 23, 21, 32, 65, 34, 77],
                },
                {
                    type: 'bar',
                    label: 'Không CICO',
                    backgroundColor: '#ffc000',
                    data: [41, 52, 24, 74, 23, 21, 32, 65, 34, 77],
                },
            ],
        };

        this.optionsRegionTop = {
            indexAxis: 'y',
            maintainAspectRatio: false,
            aspectRatio: 0.8,
            plugins: {
                title: {
                    display: true,
                    text: 'Top 10 Fail By DTM',
                },
                tooltips: {
                    mode: 'index',
                    intersect: false,
                },
                legend: {
                    display: false,
                    labels: {
                        color: textColor,
                    },
                },
                datalabels: {
                    formatter: Math.round,
                    anchor: 'start',
                    align: 'left',
                    color: 'white',
                    labels: {
                        value: {
                            color: 'white',
                        },
                        font: {
                            size: 8,
                        },
                    },
                },
            },
            scales: {
                x: {
                    stacked: true,
                    ticks: {
                        display: false,
                        color: textColorSecondary,
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false,
                        display: false,
                    },
                },
                y: {
                    stacked: true,
                    ticks: {
                        color: textColorSecondary,
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false,
                        display: false,
                    },
                },
            },
        };
    }

    loadChartCentral() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue(
            '--text-color-secondary'
        );
        const surfaceBorder =
            documentStyle.getPropertyValue('--surface-border');

        this.dataCentral = {
            labels: ['Central 1', 'Central 2', 'Central 3'],
            datasets: [
                {
                    label: 'CI Sớm',
                    backgroundColor: '#4472c4',
                    borderColor: '#4472c4',
                    data: [65, 59, 80],
                },
                {
                    label: 'Chưa CO',
                    backgroundColor: '#ed7d31',
                    borderColor: '#ed7d31',
                    data: [28, 48, 40],
                },
                {
                    label: 'CI Trễ',
                    backgroundColor: '#a5a5a5',
                    borderColor: '#a5a5a5',
                    data: [18, 28, 41],
                },
                {
                    label: 'Không CICO',
                    backgroundColor: '#ffc000',
                    borderColor: '#ffc000',
                    data: [22, 38, 34],
                },
            ],
        };

        this.optionsCentral = {
            maintainAspectRatio: false,
            aspectRatio: 0.8,
            plugins: {
                title: {
                    display: true,
                    text: 'CENTRAL',
                },
                legend: {
                    display: false,
                    labels: {
                        color: textColor,
                    },
                },
                datalabels: {
                    formatter: Math.round,
                    anchor: 'center',
                    align: 'left',
                    color: 'black',
                    labels: {
                        value: {
                            color: 'white',
                        },
                    },
                },
            },

            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary,
                        font: {
                            weight: 500,
                        },
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false,
                        display: false,
                    },
                },
                y: {
                    ticks: {
                        display: false,
                        color: textColorSecondary,
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false,
                        display: false,
                    },
                },
            },
        };
    }
    loadChartSouth() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue(
            '--text-color-secondary'
        );
        const surfaceBorder =
            documentStyle.getPropertyValue('--surface-border');

        this.dataSouth = {
            labels: ['HCM', 'MK', 'SE'],
            datasets: [
                {
                    label: 'CI Sớm',
                    backgroundColor: '#4472c4',
                    borderColor: '#4472c4',
                    data: [65, 59, 80],
                },
                {
                    label: 'Chưa CO',
                    backgroundColor: '#ed7d31',
                    borderColor: '#ed7d31',
                    data: [28, 48, 40],
                },
                {
                    label: 'CI Trễ',
                    backgroundColor: '#a5a5a5',
                    borderColor: '#a5a5a5',
                    data: [18, 28, 41],
                },
                {
                    label: 'Không CICO',
                    backgroundColor: '#ffc000',
                    borderColor: '#ffc000',
                    data: [22, 38, 34],
                },
            ],
        };

        this.optionsSouth = {
            maintainAspectRatio: false,
            aspectRatio: 0.8,
            plugins: {
                title: {
                    display: true,
                    text: 'SOUTH',
                },
                legend: {
                    display: false,
                    labels: {
                        color: textColor,
                    },
                },
                datalabels: {
                    formatter: Math.round,
                    anchor: 'center',
                    align: 'left',
                    color: 'black',
                    labels: {
                        value: {
                            color: 'white',
                        },
                    },
                },
            },

            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary,
                        font: {
                            weight: 500,
                        },
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false,
                        display: false,
                    },
                },
                y: {
                    ticks: {
                        display: false,
                        color: textColorSecondary,
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false,
                        display: false,
                    },
                },
            },
        };
    }
    loadChartNorth() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue(
            '--text-color-secondary'
        );
        const surfaceBorder =
            documentStyle.getPropertyValue('--surface-border');

        this.dataNorth = {
            labels: ['North 1', 'North 2', 'North 3'],
            datasets: [
                {
                    label: 'CI Sớm',
                    backgroundColor: '#4472c4',
                    borderColor: '#4472c4',
                    data: [65, 59, 80],
                },
                {
                    label: 'Chưa CO',
                    backgroundColor: '#ed7d31',
                    borderColor: '#ed7d31',
                    data: [28, 48, 40],
                },
                {
                    label: 'CI Trễ',
                    backgroundColor: '#a5a5a5',
                    borderColor: '#a5a5a5',
                    data: [18, 28, 41],
                },
                {
                    label: 'Không CICO',
                    backgroundColor: '#ffc000',
                    borderColor: '#ffc000',
                    data: [22, 38, 34],
                },
            ],
        };

        this.optionsNorth = {
            maintainAspectRatio: false,
            aspectRatio: 0.8,
            plugins: {
                title: {
                    display: true,
                    text: 'NORTH',
                },
                legend: {
                    display: false,
                    labels: {
                        color: textColor,
                    },
                },
                datalabels: {
                    formatter: Math.round,
                    anchor: 'center',
                    align: 'left',
                    color: 'black',
                    labels: {
                        value: {
                            color: 'white',
                        },
                    },
                },
            },

            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary,
                        font: {
                            weight: 500,
                        },
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false,
                        display: false,
                    },
                },
                y: {
                    ticks: {
                        display: false,
                        color: textColorSecondary,
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false,
                        display: false,
                    },
                },
            },
        };
    }
}
