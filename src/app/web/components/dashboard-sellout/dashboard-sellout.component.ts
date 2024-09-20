import { ChangeDetectorRef, Component } from '@angular/core';
import { Chart } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import * as Highcharts from 'highcharts';
import { ChartService } from '../../service/chart.service';
import { Helper } from 'src/app/Core/_helper';
import { EnumLocalStorage, EnumStatus } from 'src/app/Core/_enum';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Pf } from 'src/app/_helpers/pf';
import { MastersService } from '../../service/masters.service';
import { EncryptDecryptService } from 'src/app/Service/encrypt-decrypt.service';
Chart.register(ChartDataLabels);

@Component({
    selector: 'app-dashboard-sellout',
    templateUrl: './dashboard-sellout.component.html',
    styleUrls: ['./dashboard-sellout.component.scss'],
    providers: [MessageService, ConfirmationService],
})
export class DashboardSelloutComponent {
    constructor(
        private _service: ChartService,
        private messageService: MessageService,
        private master: MastersService,
        private edService: EncryptDecryptService
    ) {}
    items_menu: any;
    home: any;

    keys: any = [];
    selectedKey: any = { name: 'Số bán', code: 'amount' };
    top: any = 10;

    project_id: any = Helper.ProjectID();
    ngOnInit(): void {
        //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
        //Add 'implements OnInit' to the class.

        this.items_menu = [{ label: ' Dashboard SellOut' }];
        this.home = { icon: 'pi pi-chart-bar', routerLink: '/' };

        this.keys = [
            { name: 'Số lượng', code: 'quantity' },
            { name: 'Số bán', code: 'amount' },
        ];

        this.keysEmployee = [
            { name: 'Số lượng', code: 'quantity' },
            { name: 'Số bán', code: 'amount' },
        ];
        this.loadUser();
        this.checkTypeEmployee();

        this.getDataArea();
        this.getDate();
        this.getData();
        this.TotalAmountEmployee();
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

                const list = [] as any;
                result.forEach((element: any) => {
                    this.listArea.push({
                        name: element.NameVN,
                        code: element.Code,
                    });
                    list.push({
                        name: element.Values,
                        code: element.Values,
                    });
                    this.listRegion = this.getDistinctObjects(list, 'code');
                });
            } else {
                this.listArea = [];
            }
        });
    }

    minDate: any = null;
    maxDate: any = null;
    start: any = null;
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
    getData() {
        // Report Sale Date -> Search start_date -> to_date
        this.itemDate = null;

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
                this.dataTotalSalesAmount();
                this.dataTotalSalesQuantity();
                this.dataTotalSalesArea();
                this.dataTotalSalesProduct();
                this.dataTotalSalesTopShop();
                this.dataTotalSalesTopEmployee();
                this.dataTotalAmountEmployee();

                // Chua Load Data
                this.dataSalesRegionArea();
                this.dataSalesReportBR();
                this.dataSalesReportOutlet();
                this.dataSalesReportDate();
                this.dataSalesReportProduct();
                this.dataSalesReportSKUEmployee();
                this.dataSalesReportSKUShop();
            }
        }
    }

    clearData() {
        this.rangeDates = [];
        this.startDate = null;
        this.endDate = null;
    }

    filterArray(list: any): any {
        return list.filter(
            (item: any, index: any, self: any) => self.indexOf(item) === index
        );
    }

    // DATA dataTotalSalesQuantity
    date: any = null;
    rangeDates: any = [];
    itemDate: any = [];
    brand_name: any = '';
    shop_code: any = '';
    shop_name: any = '';
    shop_code_sku: any = '';
    shop_name_sku: any = '';
    // [ "2023-12-31T17:00:00.000Z", "2024-01-02T17:00:00.000Z" ]

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

    groupCategory() {
        // @ts-ignore
        Highcharts.chart('container', {
            chart: {
                type: 'bar',
            },
            title: {
                text: '',
            },
            credits: {
                enabled: false,
            },
            xAxis: {
                labels: {
                    autoRotation: false,
                    style: {
                        fontSize: 10,
                    },
                },
                scrollbar: {
                    enabled: true,
                },
                min: 0,
                max: 3,
                categories: [
                    {
                        name: 'Region 1',
                        categories: ['Division A', 'Division B', 'Division C'],
                    },
                    {
                        name: 'Region 2',
                        categories: ['Division D', 'Division E'],
                    },
                    {
                        name: 'Region 3',
                        categories: [
                            'Division F',
                            'Division G',
                            'Division H',
                            'Division I',
                        ],
                    },
                ],
            },
            yAxis: {
                title: {
                    text: '',
                },
            },
            series: [
                {
                    name: 'Divisions',
                    data: [20, 25, 15, 16, 20, 12, 25, 17, 30],
                },
            ],
        });
    }

    SRArea: any = {
        titleText: '',
        titleY: '',
        categories: [],
        dataQuantity: [],
        dataSale: [],
        series: [],
    };
    SRRegion: any = {
        titleText: '',
        titleY: '',
        categories: [],
        dataQuantity: [],
        dataSale: [],
        series: [],
    };
    SRAreaQuantity: any = {
        titleText: '',
        series: [],
    };
    SRAreaSale: any = {
        titleText: '',
        series: [],
    };

    SRRegionQuantity: any = {
        titleText: '',
        series: [],
    };
    SRRegionSale: any = {
        titleText: '',
        series: [],
    };

    loading: any = {
        SalesReportArea: true,
        SalesReportRegion: true,
        SalesReportBR: true,
        SalesReportOutlet: true,
        SalesReportDate: true,
        SalesReportProduct: true,
        SalesReportSKUEmployee: true,
        SalesReportSKUShop: true,
    };

    dataSalesRegionArea() {
        this.loading.SalesReportArea = true;
        this.loading.SalesReportRegion = true;

        this._service
            .ewo_chart_SellOut_SalesReport_Area_Region(
                Helper.ProjectID(),
                this.startDate,
                this.endDate,
                Helper.IsNull(this.selectedArea) != true ? this.itemArea : null,
                Helper.IsNull(this.selectedRegion) != true
                    ? this.itemRegion
                    : null,
                Helper.IsNull(this.item_ShopType) != true
                    ? this.item_ShopType
                    : null,
                Helper.IsNull(this.manager_id) != true ? this.manager_id : null,
                this.brand_name,
                Helper.IsNull(this.itemCategory) != true
                    ? this.itemCategory
                    : null,
                Helper.IsNull(this.itemProduct) != true
                    ? this.itemProduct
                    : null
            )
            .subscribe((data: any) => {
                if (data.result == EnumStatus.ok) {
                    this.loading.SalesReportArea = false;
                    this.loading.SalesReportRegion = false;
                    this.clearSRRegionArea();

                    const result = data.data;
                    const dataRegion = {
                        data: [],
                        quantity: 0,
                        amount: 0,
                    } as any;

                    if (Helper.IsNull(result) != true) {
                        result.forEach((element: any) => {
                            this.SRArea.categories.push(element.area_code);
                            this.SRArea.dataQuantity.push(element.quantity);
                            this.SRArea.dataSale.push(element.amount);

                            this.SRAreaQuantity.series.push({
                                name: element.area_code,
                                y: element.quantity,
                            });
                            this.SRAreaSale.series.push({
                                name: element.area_code,
                                y: element.amount,
                            });
                            // Region
                            dataRegion.data.push(element.region_code);
                        });

                        // Cột
                        this.SRArea.titleText = `Báo cáo số sale Area`;
                        this.SRArea.titleY = `Sum of Quantity & Sum of Value Sale (M - VNĐ)`;

                        this.SRRegion.titleText = `Báo cáo số sale Region`;
                        this.SRRegion.titleY = `Sum of Quantity & Sum of Value Sale (M - VNĐ)`;
                        this.SRRegion.categories = this.filterArray(
                            dataRegion.data
                        );
                        this.SRRegion.categories.forEach((element: any) => {
                            this.SRRegion.dataQuantity.push(
                                this.sumQuantity(
                                    result.filter(
                                        (x: any) => x.region_code == element
                                    )
                                )
                            );
                            this.SRRegion.dataSale.push(
                                this.sumTotal(
                                    result.filter(
                                        (x: any) => x.region_code == element
                                    )
                                )
                            );

                            this.SRRegionQuantity.series.push({
                                name: element,
                                y: this.sumQuantity(
                                    result.filter(
                                        (x: any) => x.region_code == element
                                    )
                                ),
                            });
                            this.SRRegionSale.series.push({
                                name: element,
                                y: this.sumTotal(
                                    result.filter(
                                        (x: any) => x.region_code == element
                                    )
                                ),
                            });
                        });

                        // Tròn - Area - Quantity/Sale
                        this.SRAreaQuantity.titleText = `Báo Sản Lượng Theo Area`;
                        this.SRAreaSale.titleText = `Báo Doanh Số Theo Area`;

                        // Tròn - Region - Quantity/Sale
                        this.SRRegionQuantity.titleText = `Báo Sản Lượng Theo Region`;
                        this.SRRegionSale.titleText = `Báo Doanh Số Theo Region`;
                    }

                    this.SalesReportArea();
                    this.SalesReportRegion();
                } else {
                    this.clearSRRegionArea();
                }
            });
    }
    clearSRRegionArea() {
        this.SRArea.titleText = '';
        this.SRArea.titleY = '';
        this.SRArea.categories = [];
        this.SRArea.dataQuantity = [];
        this.SRArea.dataSale = [];
        this.SRArea.series = [];

        this.SRRegion.titleText = '';
        this.SRRegion.titleY = '';
        this.SRRegion.categories = [];
        this.SRRegion.dataQuantity = [];
        this.SRRegion.dataSale = [];
        this.SRRegion.series = [];

        this.SRAreaQuantity.titleText = '';
        this.SRAreaQuantity.series = [];
        this.SRAreaSale.titleText = '';
        this.SRAreaSale.series = [];

        this.SRRegionQuantity.titleText = '';
        this.SRRegionQuantity.series = [];
        this.SRRegionSale.titleText = '';
        this.SRRegionSale.series = [];
    }
    sumQuantity(list: any): any {
        let quantity = 0.0;
        list.forEach((element: any) => {
            quantity += element.quantity;
        });
        return quantity;
    }

    sumTotal(list: any): any {
        let amount = 0.0;
        list.forEach((element: any) => {
            amount += element.amount;
        });
        return amount;
    }

    selectEmployeeBR(event: any) {
        this.employee_BR_id = '';
        if (Helper.IsNull(event) != true) {
            event.forEach((element: any) => {
                this.employee_BR_id +=
                    element != null ? element.code + ',' : '';
            });
        } else {
            this.employee_BR_id = '';
        }
        this.dataSalesReportBR();
    }

    listEmployeeBR: any = [];
    selectedEmployeeBR: any = [];
    employee_BR_id: any = null;
    selectEmployeeBR_Filter(event: any) {
        this.employee_BR_id = '';
        if (Helper.IsNull(event.value) != true && event.value.length > 0) {
            event.value.forEach((element: any) => {
                this.employee_BR_id += element.employee_code + ',';
            });
        } else {
            this.employee_BR_id = '';
        }
        // this.dataSalesReportBR()
        this.dataSalesReportBR_filterEmployeeList(this.employee_BR_id);
    }

    clearSelectEmployeeBR() {
        this.employee_BR_id = '';
        // this.dataSalesReportBR()

        let result = this.dataBRFilter;
        this.congigSRBR(result);
    }

    SRBR: any = {
        titleText: '',
        titleY: '',
        categories: [],
        dataQuantity: [],
        dataSale: [],
        series: [],
    };

    dataBRFilter: any;
    dataSalesReportBR_filterEmployeeList(employee_list: string) {
        // 14729,
        const filterValues = employee_list.split(',');
        let result = this.dataBRFilter;

        if (
            employee_list != '' &&
            employee_list != null &&
            employee_list != undefined
        ) {
            result = this.dataBRFilter.filter((item: any) =>
                filterValues.includes(item.employee_code)
            );
        }
        this.congigSRBR(result);
    }

    dataSalesReportBR() {
        this.loading.SalesReportBR = true;
        this._service
            .ewo_chart_SellOut_SalesReport_BR(
                Helper.ProjectID(),
                this.startDate,
                this.endDate,
                Helper.IsNull(this.selectedArea) != true ? this.itemArea : null,
                Helper.IsNull(this.selectedRegion) != true
                    ? this.itemRegion
                    : null,
                Helper.IsNull(this.item_ShopType) != true
                    ? this.item_ShopType
                    : null,
                Helper.IsNull(this.manager_id) != true ? this.manager_id : null,
                Helper.IsNull(this.employee_BR_id) != true
                    ? this.employee_BR_id
                    : null,
                this.brand_name,
                Helper.IsNull(this.itemCategory) != true
                    ? this.itemCategory
                    : null,
                Helper.IsNull(this.itemProduct) != true
                    ? this.itemProduct
                    : null
            )
            .subscribe((data: any) => {
                if (data.result == EnumStatus.ok) {
                    this.loading.SalesReportBR = false;

                    const result = data.data;
                    this.listEmployeeSRBR(result);
                    this.dataBRFilter = data.data;
                    this.congigSRBR(result);
                } else {
                    this.clearSRBR();
                }
            });
    }

    listEmployeeSRBR(result: any) {
        if (Helper.IsNull(result) != true) {
            this.listEmployeeBR = [];
            result.forEach((element: any) => {
                this.listEmployeeBR.push({
                    name: `[${element.employee_id}] - ${element.employee_code} - ${element.employee_name}`,
                    employee_code: `${element.employee_code}`,
                });
            });
        }
    }

    congigSRBR(result: any) {
        this.clearSRBR();
        if (Helper.IsNull(result) != true) {
            result.forEach((element: any) => {
                this.SRBR.categories.push(element.employee_name);
                this.SRBR.dataQuantity.push(element.quantity);
                this.SRBR.dataSale.push(element.amount);
                // this.listEmployeeBR.push({
                //   name: `[${element.employee_id}] - ${element.employee_code} - ${element.employee_name}`,
                //   employee_code: `${element.employee_code}`
                // })
            });
            // Cột
            this.SRBR.titleText = 'Báo cáo số bán theo BR';
            this.SRBR.titleY = `Sum of Quantity & Sum of Value Sale (M - VNĐ)`;
        }

        this.SalesReportBR();
    }

    clearSRBR() {
        // this.listEmployeeBR = []

        this.SRBR.titleText = '';
        this.SRBR.titleY = '';
        this.SRBR.dataQuantity = [];
        this.SRBR.dataSale = [];
        this.SRBR.categories = [];
        this.SRBR.series = [];
    }

    selectOutlet(event: any) {
        this.shop_code = event != null ? event : '';
        this.dataSalesReportOutlet();
    }

    SROutlet: any = {
        titleText: '',
        titleY: '',
        dataQuantity: [],
        dataSale: [],
        categories: [],
        series: [],
    };

    listShopOutlet: any = [];
    selectedShopOutlet: any = [];
    // selectShopOutlet(event: any) {
    //   this.shop_code = '';
    //   if (Helper.IsNull(event.value) != true && event.value.length > 0) {
    //     event.value.forEach((element: any) => {
    //       this.shop_code += element.shop_code + ' '
    //     });
    //     console.log('shop_code : ', this.shop_code)
    //   } else {
    //     this.shop_code = ''
    //   }
    //   this.dataSalesReportOutlet()
    // }

    selectShopCodeOutlet(event: any) {
        this.shop_code = Helper.IsNull(event) != true ? event : '';
        // this.dataSalesReportOutlet()
        this.dataSalesReportOutlet_filterShopList(this.shop_code);
    }

    selectShopNameOutlet(event: any) {
        this.shop_name = Helper.IsNull(event) != true ? event : '';
        // this.dataSalesReportOutlet()
        this.dataSalesReportOutlet_filterShopName(this.shop_name);
    }

    clearSelectShopOutlet() {
        this.shop_code = '';
        // this.dataSalesReportOutlet()
        let result = this.dataOutletFilter;
        this.configOutlet(result);
    }

    dataOutletFilter: any;
    dataSalesReportOutlet_filterShopList(shop_list: string) {
        const filterValues = shop_list.split(' ');
        let result = this.dataOutletFilter;
        if (shop_list != '' && shop_list != null && shop_list != undefined) {
            result = this.dataOutletFilter.filter((item: any) =>
                filterValues.includes(item.shop_code)
            );
        }
        this.configOutlet(result);
    }

    dataSalesReportOutlet_filterShopName(shop_name: string) {
        let result = this.dataOutletFilter;
        if (shop_name != '' && shop_name != null && shop_name != undefined) {
            result = this.dataOutletFilter.filter((s: any) =>
                s.shop_name.toLowerCase().includes(shop_name.toLowerCase())
            );
        }
        this.configOutlet(result);
    }

    dataSalesReportOutlet() {
        this.loading.SalesReportOutlet = true;
        this._service
            .ewo_chart_SellOut_SalesReport_Outlet(
                Helper.ProjectID(),
                this.startDate,
                this.endDate,
                Helper.IsNull(this.selectedArea) != true ? this.itemArea : null,
                Helper.IsNull(this.selectedRegion) != true
                    ? this.itemRegion
                    : null,
                Helper.IsNull(this.item_ShopType) != true
                    ? this.item_ShopType
                    : null,
                Helper.IsNull(this.manager_id) != true ? this.manager_id : null,
                this.shop_code,
                this.shop_name,
                this.brand_name,
                Helper.IsNull(this.itemCategory) != true
                    ? this.itemCategory
                    : null,
                Helper.IsNull(this.itemProduct) != true
                    ? this.itemProduct
                    : null
            )
            .subscribe((data: any) => {
                if (data.result == EnumStatus.ok) {
                    this.loading.SalesReportOutlet = false;
                    const result = data.data;
                    this.dataOutletFilter = data.data;
                    this.configOutlet(result);
                } else {
                    this.clearSROutlet();
                }
            });
    }

    configOutlet(result: any) {
        this.clearSROutlet();
        if (Helper.IsNull(result) != true) {
            result.forEach((element: any) => {
                this.SROutlet.categories.push(element.shop_name);
                this.SROutlet.dataQuantity.push(element.quantity);
                this.SROutlet.dataSale.push(element.amount);
                this.listShopOutlet.push({
                    name: `[${element.shop_code}] - ${element.shop_name}`,
                    shop_code: `${element.shop_code}`,
                });
            });

            // Cột
            this.SROutlet.titleText = 'Báo cáo số bán theo Outlet';
            this.SROutlet.titleY = `Sum of Quantity & Sum of Value Sale (M - VNĐ)`;
        }
        this.SalesReportOutlet();
    }

    clearSROutlet() {
        this.listShopOutlet = [];

        this.SROutlet.titleText = '';
        this.SROutlet.titleY = '';
        this.SROutlet.dataQuantity = [];
        this.SROutlet.dataSale = [];
        this.SROutlet.categories = [];
        this.SROutlet.series = [];
    }

    SRDate: any = {
        titleText: '',
        titleY: '',
        dataQuantity: [],
        dataSale: [],
        categories: [],
        series: [],
    };
    changeReportDate(event: any) {
        this.dataSalesReportDate();
    }

    dataSalesReportDate() {
        this.loading.SalesReportDate = true;
        // this.itemDate = (Helper.IsNull(this.itemDate) != true) ? Helper.transformDateInt(new Date(this.itemDate)) : 0
        let date =
            Helper.IsNull(this.itemDate) != true
                ? Helper.transformDateInt(new Date(this.itemDate))
                : 0;

        this._service
            .ewo_chart_SellOut_SalesReport_Date(
                Helper.ProjectID(),
                this.startDate,
                this.endDate,
                date,
                Helper.IsNull(this.selectedArea) != true ? this.itemArea : null,
                Helper.IsNull(this.selectedRegion) != true
                    ? this.itemRegion
                    : null,
                Helper.IsNull(this.item_ShopType) != true
                    ? this.item_ShopType
                    : null,
                Helper.IsNull(this.manager_id) != true ? this.manager_id : null,
                // this.shop_code,
                '',
                this.brand_name,
                Helper.IsNull(this.itemCategory) != true
                    ? this.itemCategory
                    : null,
                Helper.IsNull(this.itemProduct) != true
                    ? this.itemProduct
                    : null
            )
            .subscribe((data: any) => {
                if (data.result == EnumStatus.ok) {
                    this.loading.SalesReportDate = false;
                    this.clearSRDate();
                    const result = data.data;

                    if (Helper.IsNull(result) != true) {
                        result.forEach((element: any) => {
                            this.SRDate.categories.push(
                                Helper.convertDateStr1(element.report_date)
                            );
                            this.SRDate.dataQuantity.push(element.quantity);
                            this.SRDate.dataSale.push(element.amount);
                        });

                        // Cột
                        this.SRDate.titleText = 'Báo cáo số bán theo ngày';
                        this.SRDate.titleY = `Sum of Quantity & Sum of Value Sale (M - VNĐ)`;
                    }
                    this.SalesReportDate();
                } else {
                    this.clearSRDate();
                }
            });
    }

    clearSRDate() {
        this.SRDate.titleText = '';
        this.SRDate.titleY = '';
        this.SRDate.dataQuantity = [];
        this.SRDate.dataSale = [];
        this.SRDate.categories = [];
        this.SRDate.series = [];
    }

    SRProduct: any = {
        titleTextQuantity: '',
        titleTextSale: '',
        categories: [],
        dataQuantity: [],
        dataSale: [],
        series: [],
    };
    dataSalesReportProduct() {
        // project_id, startDate, endDate, area_code, region_code, manager_id,
        //  shop_code, brand_name, category_id, product_id

        this.loading.SalesReportProduct = true;

        this._service
            .ewo_chart_SellOut_SalesReport_Product(
                Helper.ProjectID(),
                this.startDate,
                this.endDate,
                Helper.IsNull(this.selectedArea) != true ? this.itemArea : null,
                Helper.IsNull(this.selectedRegion) != true
                    ? this.itemRegion
                    : null,
                Helper.IsNull(this.item_ShopType) != true
                    ? this.item_ShopType
                    : null,
                Helper.IsNull(this.manager_id) != true ? this.manager_id : null,
                this.shop_code,
                this.brand_name,
                Helper.IsNull(this.itemCategory) != true
                    ? this.itemCategory
                    : null,
                Helper.IsNull(this.itemProduct) != true
                    ? this.itemProduct
                    : null
            )
            .subscribe((data: any) => {
                if (data.result == EnumStatus.ok) {
                    this.loading.SalesReportProduct = false;
                    this.clearSRProduct();
                    const result = data.data;

                    if (Helper.IsNull(result) != true) {
                        result.forEach((element: any) => {
                            this.SRProduct.categories.push(
                                element.product_name
                            );
                            this.SRProduct.dataQuantity.push({
                                name: element.product_name,
                                y: element.quantity,
                            });
                            this.SRProduct.dataSale.push({
                                name: element.product_name,
                                y: element.amount,
                            });
                        });

                        // Cột
                        this.SRProduct.titleTextQuantity =
                            'Báo Số Lượng Theo Sản Phẩm';
                        this.SRProduct.titleTextSale =
                            'Báo Doanh Số Theo Sản Phẩm';
                    }
                    this.SalesReportProduct();
                } else {
                    this.clearSRProduct();
                }
            });
    }

    clearSRProduct() {
        this.SRProduct.titleTextQuantity = '';
        this.SRProduct.titleTextSale = '';
        this.SRProduct.dataQuantity = [];
        this.SRProduct.dataSale = [];
        this.SRProduct.categories = [];
        this.SRProduct.series = [];
    }

    SRSKUEmployee: any = {
        titleText: '',
        titleY: '',
        dataSku: [],
        dataSale: [],
        categories: [],
        series: [],
    };

    employee_SKU_id: any = null;
    selectEmployeeSKU(event: any) {
        this.employee_SKU_id = '';
        if (Helper.IsNull(event) != true) {
            event.forEach((element: any) => {
                this.employee_SKU_id +=
                    element != null ? element.code + ',' : '';
            });
            this.dataSalesReportSKUEmployee();
        } else {
            this.employee_SKU_id = '';
        }
    }

    listEmployeeSKU: any = [];
    selectedEmployeeSKU: any = [];
    // employee_SKU_id: any = null
    // selectEmployeeSKU(event: any) {
    //   this.employee_SKU_id = '';
    //   if (Helper.IsNull(event.value) != true && event.value.length > 0) {
    //     event.value.forEach((element: any) => {
    //       this.employee_SKU_id += element.employee_id + ','
    //     });
    //     console.log('employee_SKU_id : ', this.employee_SKU_id)
    //   } else {
    //     this.employee_SKU_id = ''
    //   }
    //   this.dataSalesReportSKUEmployee()
    // }

    selectEmployeeSKU_Filter(event: any) {
        this.employee_SKU_id = '';
        if (Helper.IsNull(event.value) != true && event.value.length > 0) {
            event.value.forEach((element: any) => {
                this.employee_SKU_id += element.employee_code + ',';
            });
        } else {
            this.employee_SKU_id = '';
        }
        // this.dataSalesReportSKUEmployee()
        this.dataSalesReportSKUEmployee_filterEmployeeList(
            this.employee_SKU_id
        );
    }

    clearSelectEmployeeSKU() {
        this.employee_SKU_id = '';
        // this.dataSalesReportSKUEmployee()
        let result = this.dataEmployeeSKUFilter;
        this.congigSKUEmployee(result);
    }

    dataEmployeeSKUFilter: any;
    dataSalesReportSKUEmployee_filterEmployeeList(employee_list: string) {
        // 14729,
        const filterValues = employee_list.split(',');
        let result = this.dataEmployeeSKUFilter;

        if (
            employee_list != '' &&
            employee_list != null &&
            employee_list != undefined
        ) {
            result = this.dataEmployeeSKUFilter.filter((item: any) =>
                filterValues.includes(item.employee_code)
            );
        }
        this.congigSKUEmployee(result);
    }

    dataSalesReportSKUEmployee() {
        this.loading.SalesReportSKUEmployee = true;

        this._service
            .ewo_chart_SellOut_SalesReport_SKU_Employee(
                Helper.ProjectID(),
                this.startDate,
                this.endDate,
                Helper.IsNull(this.selectedArea) != true ? this.itemArea : null,
                Helper.IsNull(this.selectedRegion) != true
                    ? this.itemRegion
                    : null,
                Helper.IsNull(this.item_ShopType) != true
                    ? this.item_ShopType
                    : null,
                Helper.IsNull(this.manager_id) != true ? this.manager_id : null,
                Helper.IsNull(this.employee_SKU_id) != true
                    ? this.employee_SKU_id
                    : null,
                this.brand_name,
                Helper.IsNull(this.itemCategory) != true
                    ? this.itemCategory
                    : null,
                Helper.IsNull(this.itemProduct) != true
                    ? this.itemProduct
                    : null
            )
            .subscribe((data: any) => {
                if (data.result == EnumStatus.ok) {
                    this.loading.SalesReportSKUEmployee = false;
                    const result = data.data;
                    this.listEmployeeSREmployeeSKU(result);
                    this.dataEmployeeSKUFilter = data.data;
                    this.congigSKUEmployee(result);
                } else {
                    this.clearSRSKUEmployee();
                }
            });
    }
    listEmployeeSREmployeeSKU(result: any) {
        if (Helper.IsNull(result) != true) {
            this.listEmployeeSKU = [];
            result.forEach((element: any) => {
                this.listEmployeeSKU.push({
                    name: `[${element.employee_id}] - ${element.employee_code} - ${element.employee_name}`,
                    employee_code: `${element.employee_code}`,
                });
            });
        }
    }
    congigSKUEmployee(result: any) {
        this.clearSRSKUEmployee();
        if (Helper.IsNull(result) != true) {
            result.forEach((element: any) => {
                this.SRSKUEmployee.categories.push(element.employee_name);
                this.SRSKUEmployee.dataSku.push(element.sku);
                this.SRSKUEmployee.dataSale.push(element.amount);
            });
            // Cột
            this.SRSKUEmployee.titleText = 'Báo cáo số SKU Theo Employee';
            this.SRSKUEmployee.titleY = 'SKU & Value Sale (M - VNĐ)';
        }
        this.SalesReportSKUEmployee();
    }

    clearSRSKUEmployee() {
        // this.listEmployeeSKU = []

        this.SRSKUEmployee.titleText = '';
        this.SRSKUEmployee.titleY = '';
        this.SRSKUEmployee.dataSku = [];
        this.SRSKUEmployee.dataSale = [];
        this.SRSKUEmployee.categories = [];
        this.SRSKUEmployee.series = [];
    }

    ///////////////////// SKU Shop /////////////////////

    SRSKUShop: any = {
        titleText: '',
        titleY: '',
        dataSku: [],
        dataSale: [],
        categories: [],
        series: [],
    };

    listShopSKU: any = [];
    selectedShopSKU: any = [];
    // selectShopSKU(event: any) {
    //   this.shop_code_sku = '';
    //   if (Helper.IsNull(event.value) != true && event.value.length > 0) {
    //     event.value.forEach((element: any) => {
    //       this.shop_code_sku += element.shop_code + ' '
    //     });
    //     console.log('shop_code_sku : ', this.shop_code_sku)
    //   } else {
    //     this.shop_code_sku = ''
    //   }
    //   this.dataSalesReportSKUShop()
    // }

    selectShopCodeSKU(event: any) {
        this.shop_code_sku = Helper.IsNull(event) != true ? event : '';
        //this.dataSalesReportSKUShop()
        this.dataSalesReportSKUShop_filterShopList(this.shop_code_sku);
    }
    selectShopNameSKU(event: any) {
        this.shop_name_sku = Helper.IsNull(event) != true ? event : '';
        // this.dataSalesReportSKUShop()
        this.dataSalesReportSKUShop_filterShopName(this.shop_name_sku);
    }

    clearSelectShopSKU() {
        this.shop_code_sku = '';
        // this.dataSalesReportSKUShop()
        let result = this.dataSKUShopFilter;
        this.configSKUShop(result);
    }

    dataSKUShopFilter: any;
    dataSalesReportSKUShop_filterShopList(shop_list: string) {
        const filterValues = shop_list.split(' ');
        let result = this.dataSKUShopFilter;
        if (shop_list != '' && shop_list != null && shop_list != undefined) {
            result = this.dataSKUShopFilter.filter((item: any) =>
                filterValues.includes(item.shop_code)
            );
        }
        this.configSKUShop(result);
    }

    dataSalesReportSKUShop_filterShopName(shop_name: string) {
        let result = this.dataSKUShopFilter;
        if (shop_name != '' && shop_name != null && shop_name != undefined) {
            result = this.dataSKUShopFilter.filter((s: any) =>
                s.shop_name.toLowerCase().includes(shop_name.toLowerCase())
            );
        }
        this.configSKUShop(result);
    }

    dataSalesReportSKUShop() {
        this.loading.SalesReportSKUShop = true;

        this._service
            .ewo_chart_SellOut_SalesReport_SKU_Shop(
                Helper.ProjectID(),
                this.startDate,
                this.endDate,
                Helper.IsNull(this.selectedArea) != true ? this.itemArea : null,
                Helper.IsNull(this.selectedRegion) != true
                    ? this.itemRegion
                    : null,
                Helper.IsNull(this.item_ShopType) != true
                    ? this.item_ShopType
                    : null,
                Helper.IsNull(this.manager_id) != true ? this.manager_id : null,
                this.shop_code_sku,
                this.shop_name_sku,
                this.brand_name,
                Helper.IsNull(this.itemCategory) != true
                    ? this.itemCategory
                    : null,
                Helper.IsNull(this.itemProduct) != true
                    ? this.itemProduct
                    : null
            )
            .subscribe((data: any) => {
                if (data.result == EnumStatus.ok) {
                    this.loading.SalesReportSKUShop = false;

                    const result = data.data;
                    this.dataSKUShopFilter = data.data;
                    this.configSKUShop(result);
                } else {
                    this.clearSRSKUShop();
                }
            });
    }

    configSKUShop(result: any) {
        this.clearSRSKUShop();
        if (Helper.IsNull(result) != true) {
            result.forEach((element: any) => {
                this.SRSKUShop.categories.push(element.shop_name);
                this.SRSKUShop.dataSku.push(element.sku);
                this.SRSKUShop.dataSale.push(element.amount);

                this.listShopSKU.push({
                    name: `[${element.shop_code}] - ${element.shop_name}`,
                    shop_code: `${element.shop_code}`,
                });
            });
            // Cột
            this.SRSKUShop.titleText = 'Báo cáo số SKU Theo Outlet';
            this.SRSKUShop.titleY = 'SKU & Value Sale (M - VNĐ)';
        }
        this.SalesReportSKUShop();
    }

    selectSKUShop(event: any) {
        this.shop_code_sku = event != null ? event : '';
        this.dataSalesReportSKUShop();
    }

    clearSRSKUShop() {
        this.listShopSKU = [];

        this.SRSKUShop.titleText = '';
        this.SRSKUShop.titleY = '';
        this.SRSKUShop.dataSku = [];
        this.SRSKUShop.dataSale = [];
        this.SRSKUShop.categories = [];
        this.SRSKUShop.series = [];
    }

    startDate: any = null;
    endDate: any = null;
    dataTSAmount: any = {
        titleText: '',
        titleY: '',
        categories: [],
        series: [],
    };

    dataTotalSalesAmount() {
        this._service
            .ewo_chart_SellOut_TotalSalesAmount(
                Helper.ProjectID(),
                this.startDate,
                this.endDate,
                this.itemProduct
            )
            .subscribe((data: any) => {
                if (data.result == EnumStatus.ok) {
                    this.clearDataTSAmount();
                    const result = data.data;
                    const calendar: any = [];
                    result.calendar.forEach((c: any) => {
                        calendar.push(Helper.convertDate(c.TheDate));
                    });
                    result.product.forEach((p: any) => {
                        const dataResult: any = [];
                        const test = result.data.filter(
                            (x: any) => x.product_id == p.product_id
                        );
                        test.forEach((te: any) => {
                            dataResult.push(te.amount);
                        });

                        this.dataTSAmount.series.push({
                            name: p.product_name,
                            marker: {
                                symbol: 'square',
                            },
                            data: dataResult,
                        });
                    });
                    this.dataTSAmount.titleText =
                        'Thống kê số bán sản phẩm theo ngày';
                    this.dataTSAmount.titleY = 'Số bán';
                    this.dataTSAmount.categories = calendar;
                    this.TotalSalesAmount();
                } else {
                    this.clearDataTSAmount();
                }
            });
    }
    clearDataTSAmount() {
        this.dataTSAmount.titleText = '';
        this.dataTSAmount.titleY = '';
        this.dataTSAmount.categories = [];
        this.dataTSAmount.series = [];
    }

    dataTSQuantity: any = {
        titleText: '',
        titleY: '',
        series: [],
    };
    dataTotalSalesQuantity() {
        this._service
            .ewo_chart_SellOut_TotalSalesQuantity(
                Helper.ProjectID(),
                this.startDate,
                this.endDate,
                this.itemProduct
            )
            .subscribe((data: any) => {
                if (data.result == EnumStatus.ok) {
                    this.clearDataTSQuantity();
                    const result = data.data;

                    const dataResult: any = [];
                    result.data.forEach((p: any) => {
                        dataResult.push({
                            name: p.product_name,
                            y: p.quantity,
                            drilldown: null,
                        });
                    });

                    this.dataTSQuantity.series.push({
                        name: 'Total',
                        colorByPoint: true,
                        data: dataResult,
                    });
                    this.dataTSQuantity.titleText =
                        'Thống kê số lượng bán theo sản phẩm';
                    this.dataTSQuantity.titleY = 'Số lượng';
                    this.TotalSalesQuantity();
                } else {
                    this.clearDataTSQuantity();
                }
            });
    }
    clearDataTSQuantity() {
        this.dataTSQuantity.titleText = '';
        this.dataTSQuantity.titleY = '';
        this.dataTSQuantity.series = [];
    }

    dataTSArea: any = {
        titleText: '',
        series: [],
    };
    dataTotalSalesArea() {
        this._service
            .ewo_chart_SellOut_TotalSalesArea(
                Helper.ProjectID(),
                this.startDate,
                this.endDate,
                this.itemArea
            )
            .subscribe((data: any) => {
                if (data.result == EnumStatus.ok) {
                    this.clearDataTSArea();
                    const result = data.data;

                    const dataResult: any = [];
                    result.data.forEach((r: any) => {
                        dataResult.push({
                            name: r.area_code,
                            y: r.amount,
                        });
                    });

                    this.dataTSArea.series.push({
                        name: 'Amount',
                        colorByPoint: true,
                        data: dataResult,
                    });

                    this.dataTSArea.titleText = 'Thống kê số bán theo khu vực';
                    this.TotalSalesArea();
                    // return
                } else {
                    this.clearDataTSArea();
                }
            });
    }
    clearDataTSArea() {
        this.dataTSArea.titleText = '';
        this.dataTSArea.series = [];
    }

    dataTSProduct: any = {
        titleText: '',
        series: [],
    };
    dataTotalSalesProduct() {
        this._service
            .ewo_chart_SellOut_TotalSalesProduct(
                Helper.ProjectID(),
                this.startDate,
                this.endDate,
                this.itemProduct
            )
            .subscribe((data: any) => {
                if (data.result == EnumStatus.ok) {
                    this.clearDataTSProduct();
                    const result = data.data;

                    const dataResult: any = [];
                    result.data.forEach((r: any) => {
                        dataResult.push({
                            name: r.product_name,
                            y: r.amount,
                        });
                    });

                    this.dataTSProduct.series.push({
                        name: 'Amount',
                        colorByPoint: true,
                        data: dataResult,
                    });
                    this.dataTSProduct.titleText =
                        'Thống kê số bán theo sản phẩm';
                    this.TotalSalesProduct();
                    // return
                } else {
                    this.clearDataTSProduct();
                }
            });
    }
    clearDataTSProduct() {
        this.dataTSProduct.titleText = '';
        this.dataTSProduct.series = [];
    }

    // Fiter Top Shop
    searchTopShop() {
        this.dataTotalSalesTopShop();
    }

    icon_sort = 'pi pi-sort-numeric-down-alt';
    checked: any = null;
    Sort: any = null;

    searchTop(event: any) {
        this.top = event.value;
        this.searchTopShop();
    }

    searchKey(event: any) {
        this.selectedKey = event.value;
        this.searchTopShop();
    }
    handleSort() {
        if (this.checked === true) {
            this.Sort = 'DESC';
        } else {
            this.Sort = 'ASC';
        }
        this.searchTopShop();
    }

    dataTSTopShop: any = {
        titleText: '',
        titleY: '',
        checkKey: true,
        series: [],
    };
    dataTotalSalesTopShop() {
        this._service
            .ewo_chart_SellOut_TotalSalesTopShop(
                Helper.ProjectID(),
                this.startDate,
                this.endDate,
                Helper.IsNull(this.selectedKey) != true
                    ? this.selectedKey.code
                    : null,
                Helper.IsNull(this.top) != true ? this.top : null,
                Helper.IsNull(this.Sort) != true ? this.Sort : null
            )
            .subscribe((data: any) => {
                if (data.result == EnumStatus.ok) {
                    this.clearDataTSTopShop();
                    const result = data.data;

                    const dataResult: any = [];
                    result.data.forEach((r: any) => {
                        dataResult.push({
                            name: r.shop_name,
                            y: r.total,
                        });
                    });

                    this.dataTSTopShop.series.push({
                        name: 'Total',
                        colorByPoint: true,
                        data: dataResult,
                    });

                    // 'Top 10 cửa hàng có số bán nhiều nhất'

                    const textTop =
                        Helper.IsNull(this.top) != true ? this.top : 10;
                    const textKey =
                        Helper.IsNull(this.selectedKey) != true &&
                        this.selectedKey.code == 'quantity'
                            ? 'số lượng'
                            : 'số bán';
                    const textOrder =
                        Helper.IsNull(this.Sort) != true && this.Sort == 'ASC'
                            ? 'thấp nhất'
                            : 'cao nhất';
                    this.dataTSTopShop.titleY = textKey;
                    this.dataTSTopShop.titleText = `Top ${textTop} cửa hàng có ${textKey} ${textOrder}`;
                    this.dataTSTopShop.checkKey =
                        Helper.IsNull(this.selectedKey) != true &&
                        this.selectedKey.code == 'quantity'
                            ? false
                            : true;
                    this.TotalSalesTopShop();
                    // return
                } else {
                    this.clearDataTSTopShop();
                }
            });
    }
    clearDataTSTopShop() {
        this.dataTSTopShop.titleText = '';
        this.dataTSTopShop.titleY = '';
        this.dataTSTopShop.checkKey = true;
        this.dataTSTopShop.series = [];
    }

    keysEmployee: any = [];
    selectedKeyEmployee: any = { name: 'Số bán', code: 'amount' };
    ordersEmployee: any = [];
    topEmployee: any = 10;

    // Fiter Top Employee
    searchTopEmployee() {
        this.dataTotalSalesTopEmployee();
    }

    checkedEmployee: any = null;
    SortEmployee: any = null;

    searchTop2(event: any) {
        this.topEmployee = event.value;
        this.searchTopEmployee();
    }

    searchKey2(event: any) {
        this.selectedKeyEmployee = event.value;
        this.searchTopEmployee();
    }
    handleSort2() {
        if (this.checkedEmployee === true) {
            this.SortEmployee = 'DESC';
        } else {
            this.SortEmployee = 'ASC';
        }
        this.searchTopEmployee();
    }

    dataTSTopEmployee: any = {
        titleText: '',
        titleY: '',
        checkKey: true,
        series: [],
    };
    dataTotalSalesTopEmployee() {
        this._service
            .ewo_chart_SellOut_TotalSalesTopEmployee(
                Helper.ProjectID(),
                this.startDate,
                this.endDate,
                Helper.IsNull(this.selectedKeyEmployee) != true
                    ? this.selectedKeyEmployee.code
                    : null,
                Helper.IsNull(this.topEmployee) != true
                    ? this.topEmployee
                    : null,
                Helper.IsNull(this.SortEmployee) != true
                    ? this.SortEmployee
                    : null,
                Helper.IsNull(this.manager_id) != true ? this.manager_id : null
            )
            .subscribe((data: any) => {
                if (data.result == EnumStatus.ok) {
                    this.clearDataTSTopEmployee();
                    const result = data.data;

                    const dataResult: any = [];
                    result.data.forEach((r: any) => {
                        dataResult.push({
                            name: r.employee_name,
                            y: r.total,
                        });
                    });

                    this.dataTSTopEmployee.series.push({
                        name: 'Total',
                        colorByPoint: true,
                        data: dataResult,
                    });

                    // 'Top 10 nhân viên có số bán nhiều nhất'
                    const textTop =
                        Helper.IsNull(this.topEmployee) != true
                            ? this.topEmployee
                            : 10;
                    const textKey =
                        Helper.IsNull(this.selectedKeyEmployee) != true &&
                        this.selectedKeyEmployee.code == 'quantity'
                            ? 'số lượng'
                            : 'số bán';
                    const textOrder =
                        Helper.IsNull(this.SortEmployee) != true &&
                        this.SortEmployee == 'ASC'
                            ? 'thấp nhất'
                            : 'cao nhất';
                    this.dataTSTopEmployee.titleY = textKey;
                    this.dataTSTopEmployee.titleText = `Top ${textTop} nhân viên có ${textKey} ${textOrder}`;
                    this.dataTSTopEmployee.checkKey =
                        Helper.IsNull(this.selectedKeyEmployee) != true &&
                        this.selectedKeyEmployee.code == 'quantity'
                            ? false
                            : true;
                    this.TotalSalesTopEmployee();
                    // return
                } else {
                    this.clearDataTSTopEmployee();
                }
            });
    }
    clearDataTSTopEmployee() {
        this.dataTSTopEmployee.titleText = '';
        this.dataTSTopEmployee.titleY = '';
        this.dataTSTopEmployee.checkKey = true;
        this.dataTSTopEmployee.series = [];
    }

    employee_id: any = null;
    selectEmployee(event: any) {
        this.employee_id = '';
        if (Helper.IsNull(event) != true) {
            event.forEach((element: any) => {
                this.employee_id += element != null ? element.code + ' ' : '';
            });
        } else {
            this.employee_id = '';
        }
        this.dataTotalAmountEmployee();
    }

    clearEmployeeBR(event: any) {
        this.employee_BR_id = event == true ? '' : this.employee_BR_id;
        this.dataSalesReportBR();
    }

    clearEmployeeSKU(event: any) {
        this.employee_SKU_id = event == true ? '' : this.employee_SKU_id;
        this.dataSalesReportSKUEmployee();
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
        // this.dataTotalAmountEmployee();
        // this.TotalSalesTopEmployee();
    }

    itemCategory: any = '';
    selectedCategory(event: any) {
        this.itemCategory = '';
        if (Helper.IsNull(event) != true) {
            event.forEach((element: any) => {
                this.itemCategory += element.id + ',';
            });
        } else {
            this.itemCategory = '';
        }
    }

    // brand_name: any = ''
    selectedBrand(event: any) {
        this.brand_name = '';
        if (Helper.IsNull(event) != true) {
            event.forEach((element: any) => {
                this.brand_name += element.name + ',';
            });
        } else {
            this.brand_name = '';
        }
    }

    listEmployees: any = [];

    dataTAEmployee: any = {
        titleText: '',
        titleLeft: '',
        titleRight: '',
        nameTarget: '',
        nameTargetAchieved: '',
        namePercent: '',
        dataTarget: [],
        dataTargetAchieved: [],
        dataPercent: [],
        categories: [],
        employee_id: [],
        listItem: [],
        item: [],
        series: [],
    };

    actualEmployeeDialog: boolean = false;

    dataTotalAmountEmployee() {
        this._service
            .ewo_chart_SellOut_TotalAmountEmployee(
                Helper.ProjectID(),
                this.startDate,
                this.endDate,
                Helper.IsNull(this.employee_id) != true
                    ? this.employee_id
                    : null,
                Helper.IsNull(this.manager_id) != true ? this.manager_id : null
            )
            .subscribe((data: any) => {
                if (data.result == EnumStatus.ok) {
                    this.clearDataTAEmployee();

                    const result = data.data.data;
                    if (Helper.IsNull(data.data.item) != true) {
                        data.data.item = data.data.item.map((x: any) => ({
                            ...x,
                            _report_date: Helper.convertDateStr(x.report_date),
                        }));
                        this.dataTAEmployee.listItem = data.data.item;
                    }

                    if (Helper.IsNull(result) != true) {
                        result.forEach((element: any) => {
                            this.dataTAEmployee.categories.push(
                                element.employee_name
                            );
                            this.dataTAEmployee.employee_id.push(
                                element.employee_id
                            );
                            this.dataTAEmployee.dataTarget.push(element.value);
                            this.dataTAEmployee.dataTargetAchieved.push(
                                element.amount
                            );
                            this.dataTAEmployee.dataPercent.push(
                                element.percent
                            );

                            this.listEmployees.push({
                                employee_id: element.employee_id,
                                employee_code: element.employee_code,
                                employee_name: element.employee_name,
                                toolTip: `Target : ${element.value} M \n Actual : ${element.amount} M`,
                                overtargets:
                                    element.amount > element.value
                                        ? element.amount - element.value
                                        : null,
                                percent: element.percent,
                            });
                        });

                        this.dataTAEmployee.titleText = `Thống kê chỉ tiêu đạt được của nhân viên so với mục tiêu đặt ra`;
                        // this.dataTAEmployee.titleLeft = `Percent (%)`;
                        this.dataTAEmployee.titleRight = `Amount (Millions)`;
                        this.dataTAEmployee.nameTarget = `Target`;
                        this.dataTAEmployee.nameTargetAchieved = `Actual`;
                        this.dataTAEmployee.namePercent = `Percent`;
                    }
                    this.TotalAmountEmployee();
                } else {
                    this.clearDataTAEmployee();
                }
            });
    }
    clearDataTAEmployee() {
        this.dataTAEmployee = {
            titleText: '',
            titleLeft: '',
            titleRight: '',
            nameTarget: '',
            namePercent: '',
            nameTargetAchieved: '',
            dataTarget: [],
            dataTargetAchieved: [],
            dataPercent: [],
            categories: [],
            employee_id: [],
            listItem: [],
            item: [],
            series: [],
        };
        this.listEmployees = [];
    }
    dataGetItem(employee_id: any) {
        this.dataTAEmployee.item = this.dataTAEmployee.listItem.filter(
            (data: any) => data.employee_id == employee_id
        );
    }

    // DESIGN DASHBOAD
    TotalSalesAmount() {
        // @ts-ignore

        Highcharts.chart('TotalSalesAmount', {
            chart: {
                type: 'spline',
            },
            title: {
                text: this.dataTSAmount.titleText,
            },

            xAxis: {
                type: 'category',
                categories: this.dataTSAmount.categories,
                accessibility: {
                    description: 'Months of the year',
                    announceNewData: {
                        enabled: true,
                    },
                },
            },
            yAxis: {
                title: {
                    text: this.dataTSAmount.titleY,
                },
                labels: {
                    // format: '{value}°'
                    format: '{value}M',
                },
            },

            tooltip: {
                crosshairs: true,
                shared: true,
            },
            plotOptions: {
                spline: {
                    marker: {
                        radius: 5,
                        lineColor: '#666666',
                        lineWidth: 1,
                    },
                },
            },
            exporting: {
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
                        ],
                    },
                },
            },
            series: this.dataTSAmount.series,
            credits: {
                enabled: false,
            },
        });
    }
    TotalSalesArea() {
        // Build the chart
        // @ts-ignore
        Highcharts.chart('TotalSalesArea', {
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie',
            },
            title: {
                text: this.dataTSArea.titleText,
                align: 'center',
            },
            tooltip: {
                pointFormat:
                    // '<span style="color:{point.color}"><b>{point.name}<b></span><br/>' +
                    '{series.name}: <b>{point.y}</b> millions<br/>' +
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
                            '<span style="opacity: 0.6">{point.percentage:.1f} %</span>',
                        // format: '<span style="color:{point.color}"><b>{point.name}<b></span><br/>' +
                        //   '<span style="opacity: 0.6">{point.percentage:.1f} %</span>',
                        connectorColor: 'rgba(128,128,128,0.5)',
                    },
                    showInLegend: true,
                },
            },
            exporting: {
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
                        ],
                    },
                },
            },
            series: this.dataTSArea.series,
            credits: {
                enabled: false,
            },
        });
    }
    TotalSalesProduct() {
        // Build the chart
        // @ts-ignore
        Highcharts.chart('TotalSalesProduct', {
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie',
            },
            title: {
                // 'Thống kê số bán theo sản phẩm'
                text: this.dataTSProduct.titleText,
                align: 'center',
            },
            // legend: {
            //   maxHeight: '5%'
            // },
            tooltip: {
                pointFormat:
                    '{series.name}: <b>{point.y}</b> millions<br/>' +
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
                        // style="color:{point.color}"
                        format:
                            '<span><b>{point.name}</b></span><br/>' +
                            '<span style="opacity: 0.6">{point.percentage:.1f} %</span>',
                        connectorColor: 'rgba(128,128,128,0.5)',
                    },
                    showInLegend: false,
                },
            },
            exporting: {
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
                        ],
                    },
                },
            },
            series: this.dataTSProduct.series,
            credits: {
                enabled: false,
            },
        });
    }
    TotalSalesQuantity() {
        // @ts-ignore
        Highcharts.chart('TotalSalesQuantity', {
            chart: {
                type: 'column',
            },
            title: {
                align: 'center',
                text: this.dataTSQuantity.titleText,
            },
            accessibility: {
                announceNewData: {
                    enabled: true,
                },
            },
            xAxis: {
                type: 'category',
            },
            yAxis: {
                title: {
                    text: this.dataTSQuantity.titleY,
                },
                width: '20px',
            },
            legend: {
                enabled: false,
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
            tooltip: {
                headerFormat:
                    '<span style="color:{point.color}">{point.name}</span>',
                pointFormat:
                    '<span style="color:{point.color}">{point.name}</span><br/>' +
                    '{series.name}: <b>{point.y}</b><br/>',
                // + 'Percent: <b>{point.percentage:.1f}%</b> of total<br/>'
            },
            exporting: {
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
                        ],
                    },
                },
            },
            series: this.dataTSQuantity.series,
            credits: {
                enabled: false,
            },
        });
    }

    TotalSalesTopShop() {
        // @ts-ignore
        Highcharts.chart('TotalSalesTopShop', {
            chart: {
                type: 'column',
            },
            title: {
                align: 'center',
                text: this.dataTSTopShop.titleText,
            },
            accessibility: {
                announceNewData: {
                    enabled: true,
                },
            },
            xAxis: {
                type: 'category',
            },
            yAxis: {
                title: {
                    text: this.dataTSTopShop.titleY,
                },
                width: '20px',
                labels: {
                    format:
                        this.dataTSTopShop.checkKey == false ? '' : '{value} M',
                },
            },
            legend: {
                enabled: false,
            },
            plotOptions: {
                series: {
                    borderWidth: 0,
                    dataLabels: {
                        enabled: true,
                        // format: '{point.y:.1f}%'
                        format: '{point.y}',
                    },
                },
            },

            tooltip: {
                headerFormat:
                    '<span style="color:{point.color}">{point.name}</span>',
                pointFormat:
                    '<span style="color:{point.color}">{point.name}</span><br/>' +
                    '{series.name}: <b>{point.y}</b><br/>',
                // + 'Percent: <b>{point.y:.2f}%</b> of total<br/>'
            },
            exporting: {
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
                        ],
                    },
                },
            },
            series: this.dataTSTopShop.series,
            credits: {
                enabled: false,
            },
        });
    }

    TotalSalesTopEmployee() {
        // @ts-ignore
        Highcharts.chart('TotalSalesTopEmployee', {
            chart: {
                type: 'column',
            },
            title: {
                align: 'center',
                text: this.dataTSTopEmployee.titleText,
            },
            accessibility: {
                announceNewData: {
                    enabled: true,
                },
            },
            xAxis: {
                type: 'category',
            },
            yAxis: {
                title: {
                    text: this.dataTSTopEmployee.titleY,
                },
                width: '20px',
                labels: {
                    format:
                        this.dataTSTopEmployee.checkKey == false
                            ? ''
                            : '{value} M',
                },
            },
            legend: {
                enabled: false,
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

            tooltip: {
                headerFormat:
                    '<span style="color:{point.color}">{point.name}</span>',
                pointFormat:
                    '<span style="color:{point.color}">{point.name}</span><br/>' +
                    '{series.name}: <b>{point.y}</b><br/>',
                // + 'Percent: <b>{point.y:.2f}%</b> of total<br/>'
            },

            exporting: {
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
                        ],
                    },
                },
            },
            series: this.dataTSTopEmployee.series,
            credits: {
                enabled: false,
            },
        });
    }

    SalesReportRegion() {
        this.hightChart = Highcharts.getOptions();
        // @ts-ignore
        Highcharts.chart('SalesReportRegion', {
            chart: {
                type: 'column',
            },
            title: {
                text: this.SRRegion.titleText,
                align: 'center',
            },
            xAxis: {
                categories: this.SRRegion.categories,
                crosshair: true,
                accessibility: {
                    description: 'Countries',
                },
            },
            yAxis: {
                min: 0,
                title: {
                    text: this.SRRegion.titleY,
                },
                labels: {
                    format: '{value}',
                },
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
            series: [
                {
                    name: 'Sum of Quantity',
                    data: this.SRRegion.dataQuantity,
                },
                {
                    name: 'Sum of Value Sale (M - VNĐ)',
                    data: this.SRRegion.dataSale,
                    color: this.hightChart.colors[3],
                },
            ],
            credits: {
                enabled: false,
            },
        });

        // @ts-ignore
        Highcharts.chart('SalesReportRegionQuantity', {
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie',
            },
            title: {
                text: this.SRRegionQuantity.titleText,
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
                    data: this.SRRegionQuantity.series,
                },
            ],
            credits: {
                enabled: false,
            },
        });

        // @ts-ignore
        Highcharts.chart('SalesReportRegionSales', {
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie',
            },
            title: {
                text: this.SRRegionSale.titleText,
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
                            '<span style="opacity: 0.6"><b>Sale:</b> {point.y}</span><br/>' +
                            '<span style="opacity: 0.6">Percent: {point.percentage:.1f} %</span>',
                        connectorColor: 'rgba(128,128,128,0.5)',
                    },
                    showInLegend: true,
                },
            },

            // ['NORTH', 'CENTRE', 'SOUTH'],
            series: [
                {
                    name: 'Sum of Value Sale (M - VNĐ)',
                    colorByPoint: true,
                    data: this.SRRegionSale.series,
                },
            ],
            credits: {
                enabled: false,
            },
        });
    }

    SalesReportArea() {
        this.hightChart = Highcharts.getOptions();
        // @ts-ignore
        Highcharts.chart('SalesReportArea', {
            chart: {
                type: 'column',
            },
            title: {
                text: this.SRArea.titleText,
                align: 'center',
            },

            xAxis: {
                categories: this.SRArea.categories,
                crosshair: true,
            },
            yAxis: {
                min: 0,
                title: {
                    text: this.SRArea.titleY,
                },
                labels: {
                    format: '{value}',
                },
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
            series: [
                {
                    name: 'Sum of Quantity',
                    data: this.SRArea.dataQuantity,
                },
                {
                    name: 'Sum of Value Sale (M - VNĐ)',
                    data: this.SRArea.dataSale,
                    color: this.hightChart.colors[3],
                },
            ],
            credits: {
                enabled: false,
            },
        });

        // @ts-ignore
        Highcharts.chart('SalesReportAreaQuantity', {
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie',
            },
            title: {
                text: this.SRAreaQuantity.titleText,
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
                    data: this.SRAreaQuantity.series,
                },
            ],
            credits: {
                enabled: false,
            },
        });

        // @ts-ignore
        Highcharts.chart('SalesReportAreaSales', {
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie',
            },
            title: {
                text: this.SRAreaSale.titleText,
                align: 'center',
            },
            tooltip: {
                pointFormat:
                    '{series.name}: <b>{point.y}</b>M<br/>' +
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
                            '<span style="opacity: 0.6"><b>Sale:</b> {point.y}</span><br/>' +
                            '<span style="opacity: 0.6">Percent: {point.percentage:.1f} %</span>',

                        connectorColor: 'rgba(128,128,128,0.5)',
                    },
                    showInLegend: true,
                },
            },

            series: [
                {
                    name: 'Sum of Value Sale (M - VNĐ)',
                    colorByPoint: true,
                    data: this.SRAreaSale.series,
                },
            ],
            credits: {
                enabled: false,
            },
        });
    }

    SalesReportBR() {
        this.hightChart = Highcharts.getOptions();
        // @ts-ignore
        Highcharts.chart('SalesReportBR', {
            chart: {
                type: 'column',
            },
            title: {
                text: this.SRBR.titleText,
                align: 'center',
            },

            xAxis: {
                categories: this.SRBR.categories,
                crosshair: true,
            },
            yAxis: {
                min: 0,
                title: {
                    text: this.SRBR.titleY,
                },
                labels: {
                    format: '{value}',
                },
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
            series: [
                {
                    name: 'Sum of Quantity',
                    data: this.SRBR.dataQuantity,
                },
                {
                    name: 'Sum of Value Sale (M - VNĐ)',
                    data: this.SRBR.dataSale,
                    color: this.hightChart.colors[3],
                },
            ],
            credits: {
                enabled: false,
            },
        });
    }

    SalesReportOutlet() {
        this.hightChart = Highcharts.getOptions();
        // @ts-ignore
        Highcharts.chart('SalesReportOutlet', {
            chart: {
                type: 'column',
            },
            title: {
                text: this.SROutlet.titleText,
                align: 'center',
            },

            xAxis: {
                categories: this.SROutlet.categories,
                crosshair: true,
            },
            yAxis: {
                min: 0,
                title: {
                    text: this.SROutlet.titleY,
                },
                labels: {
                    format: '{value}',
                },
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
            series: [
                {
                    name: 'Sum of Quantity',
                    data: this.SROutlet.dataQuantity,
                },
                {
                    name: 'Sum of Value Sale (M - VNĐ)',
                    data: this.SROutlet.dataSale,
                    color: this.hightChart.colors[3],
                },
            ],
            credits: {
                enabled: false,
            },
        });
    }
    SalesReportDate() {
        this.hightChart = Highcharts.getOptions();
        // @ts-ignore
        Highcharts.chart('SalesReportDate', {
            chart: {
                type: 'spline',
            },
            title: {
                text: this.SRDate.titleText,
            },

            xAxis: {
                categories: this.SRDate.categories,
                accessibility: {
                    description: 'Months of the year',
                    announceNewData: {
                        enabled: true,
                    },
                },
            },
            yAxis: {
                title: {
                    text: this.SRDate.titleY,
                },
                labels: {
                    format: '',
                },
            },

            tooltip: {
                crosshairs: true,
                shared: true,
            },
            plotOptions: {
                spline: {
                    marker: {
                        radius: 5,
                        lineColor: '#666666',
                        lineWidth: 1,
                    },
                    dataLabels: {
                        enabled: true,
                        format: '{point.y}',
                    },
                },
            },
            series: [
                {
                    name: 'Sum of Quantity',
                    marker: {
                        symbol: 'square',
                    },
                    data: this.SRDate.dataQuantity,
                },
                {
                    name: 'Sum of Value Sale (M - VNĐ)',
                    marker: {
                        symbol: 'diamond',
                    },
                    data: this.SRDate.dataSale,
                    color: this.hightChart.colors[3],
                },
            ],
            credits: {
                enabled: false,
            },
        });
    }

    SalesReportProduct() {
        // @ts-ignore
        Highcharts.chart('SalesReportProductQuantity', {
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie',
            },
            title: {
                text: this.SRProduct.titleTextQuantity,
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
                    showInLegend: false,
                },
            },

            series: [
                {
                    name: 'Sum of Quantity',
                    colorByPoint: true,
                    data: this.SRProduct.dataQuantity,
                },
            ],
            credits: {
                enabled: false,
            },
        });

        // @ts-ignore
        Highcharts.chart('SalesReportProductSales', {
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie',
            },
            title: {
                text: this.SRProduct.titleTextSale,
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
                            '<span style="opacity: 0.6"><b>Sale:</b> {point.y}</span><br/>' +
                            '<span style="opacity: 0.6">Percent: {point.percentage:.1f} %</span>',
                        connectorColor: 'rgba(128,128,128,0.5)',
                    },
                    showInLegend: false,
                },
            },

            series: [
                {
                    name: 'Sum of Value Sale (M - VNĐ)',
                    colorByPoint: true,
                    data: this.SRProduct.dataSale,
                },
            ],
            credits: {
                enabled: false,
            },
        });
    }

    SalesReportSKUEmployee() {
        this.hightChart = Highcharts.getOptions();
        // @ts-ignore
        Highcharts.chart('SalesReportSKUEmployee', {
            chart: {
                type: 'column',
            },
            title: {
                text: this.SRSKUEmployee.titleText,
                align: 'center',
            },

            xAxis: {
                categories: this.SRSKUEmployee.categories,
                crosshair: true,
            },
            yAxis: {
                min: 0,
                title: {
                    text: this.SRSKUEmployee.titleY,
                },
                labels: {
                    format: '{value}',
                },
            },
            tooltip: {
                valueSuffix: '',
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
            series: [
                {
                    name: 'SKU',
                    data: this.SRSKUEmployee.dataSku,
                },
                {
                    name: 'Value Sale (M - VNĐ)',
                    data: this.SRSKUEmployee.dataSale,
                    color: this.hightChart.colors[3],
                },
            ],
            credits: {
                enabled: false,
            },
        });
    }

    SalesReportSKUShop1(shop_name: any) {
        this.hightChart = Highcharts.getOptions();
        // @ts-ignore
        Highcharts.chart('SalesReportSKUShop', {
            chart: {
                type: 'column',
            },
            title: {
                text: this.SRSKUShop.titleText,
                align: 'center',
            },

            xAxis: {
                categories: this.SRSKUShop.categories,
                crosshair: true,
            },
            yAxis: {
                min: 0,
                title: {
                    text: this.SRSKUShop.titleY,
                },
                labels: {
                    format: '{value}',
                },
            },
            tooltip: {
                valueSuffix: '',
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
            series: [
                {
                    name: 'SKU',
                    data: this.SRSKUShop.dataSku,
                },
                {
                    name: 'Value Sale (M - VNĐ)',
                    data: this.SRSKUShop.dataSale,
                    color: this.hightChart.colors[3],
                },
            ],
            credits: {
                enabled: false,
            },
        });
    }

    SalesReportSKUShop() {
        this.hightChart = Highcharts.getOptions();
        // @ts-ignore
        Highcharts.chart('SalesReportSKUShop', {
            chart: {
                type: 'column',
            },
            title: {
                text: this.SRSKUShop.titleText,
                align: 'center',
            },

            xAxis: {
                categories: this.SRSKUShop.categories,
                crosshair: true,
            },
            yAxis: {
                min: 0,
                title: {
                    text: this.SRSKUShop.titleY,
                },
                labels: {
                    format: '{value}',
                },
            },
            tooltip: {
                valueSuffix: '',
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
            series: [
                {
                    name: 'SKU',
                    data: this.SRSKUShop.dataSku,
                },
                {
                    name: 'Value Sale (M - VNĐ)',
                    data: this.SRSKUShop.dataSale,
                    color: this.hightChart.colors[3],
                },
            ],
            credits: {
                enabled: false,
            },
        });
    }

    hightChart: any = null;
    viewDataTableEmployee: boolean = false;
    TotalAmountEmployee() {
        this.hightChart = Highcharts.getOptions();
        // @ts-ignore
        Highcharts.chart('totalAmountEmployee', {
            chart: {
                zoomType: 'xy',
            },
            title: {
                text: this.dataTAEmployee.titleText,
            },

            xAxis: [
                {
                    categories: this.dataTAEmployee.categories,
                    crosshair: true,
                },
            ],
            yAxis: [
                {
                    // Secondary yAxis
                    labels: {
                        format: '{value}%',
                    },
                    title: {
                        text: this.dataTAEmployee.titleLeft,
                    },
                    opposite: true,
                },
                {
                    // Primary yAxis
                    title: {
                        text: this.dataTAEmployee.titleRight,
                    },
                    labels: {
                        format: '{value} M',
                    },
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
                    point: {
                        events: {
                            click: (event: any) => {
                                // this.op.toggle($event)
                                var employee_id =
                                    this.dataTAEmployee.employee_id[
                                        event.point.index
                                    ];
                                this.dataGetItem(employee_id);
                                this.actualEmployeeDialog = true;
                            },
                        },
                    },
                },
            },

            legend: {
                align: 'left',
                x: 80,
                verticalAlign: 'top',
                y: 60,
                floating: true,
                backgroundColor: 'rgba(255,255,255,0.25)',
            },
            series: [
                {
                    name: this.dataTAEmployee.nameTarget,
                    type: 'column',
                    yAxis: 1,
                    data: this.dataTAEmployee.dataTarget,
                    tooltip: {
                        valueSuffix: ' M',
                    },
                },
                {
                    name: this.dataTAEmployee.nameTargetAchieved,
                    type: 'column',
                    yAxis: 1,
                    data: this.dataTAEmployee.dataTargetAchieved,
                    color: this.hightChart.colors[3],
                    tooltip: {
                        valueSuffix: ' M',
                    },
                },
            ],
            credits: {
                enabled: false,
            },

            exporting: {
                menuItemDefinitions: {
                    // Custom definition
                    label: {
                        onclick: () => {
                            this.viewDataTableEmployee =
                                !this.viewDataTableEmployee;
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

    // END DESIGN DASHBOARD

    products: any = [];
    selectedProduct: any = [];

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

    listRegion: any = [];
    selectedRegion: any = [];
    itemRegion: any = '';
    selectRegion(event: any) {
        this.itemRegion = '';
        if (Helper.IsNull(event.value) != true && event.value.length > 0) {
            event.value.forEach((element: any) => {
                this.itemRegion += element.code + ',';
            });
            // this.itemRegion += 'No Region'
        } else {
            this.itemRegion = '';
        }
    }

    item_ShopType: any = '';
    selectShopType(event: any) {
        this.item_ShopType = '';
        if (Helper.IsNull(event) != true && event.length > 0) {
            event.forEach((element: any) => {
                this.item_ShopType += element.code + ',';
            });
            // this.itemRegion += 'No Region'
        } else {
            this.item_ShopType = '';
        }
    }

    getDistinctObjects(dataList: any, property: any) {
        const uniqueValues = new Set();
        return dataList.filter((obj: any) => {
            const value = obj[property];
            if (!uniqueValues.has(value)) {
                uniqueValues.add(value);
                return true;
            }
            return false;
        });
    }

    clearSelectArea() {
        // this.itemArea = (event == true) ? '' : this.itemArea
        this.selectedArea = [];
        this.itemArea = '';
    }
    clearSelectRegion() {
        this.selectedRegion = [];
        this.itemRegion = '';
    }

    itemProduct: any = '';
    selectProduct(event: any) {
        this.itemProduct = '';
        if (Helper.IsNull(event) != true && event.length > 0) {
            event.forEach((element: any) => {
                this.itemProduct += element.id + ' ';
            });
        } else {
            this.itemProduct = '';
        }
    }

    clearSelectShopType(event: any) {
        this.item_ShopType = event == true ? '' : this.item_ShopType;
    }
    clearSelectManager(event: any) {
        this.manager_id = event == true ? '' : this.manager_id;
    }
    clearSelectProduct(event: any) {
        this.itemProduct = event == true ? '' : this.itemProduct;
    }
    clearSelectCategory(event: any) {
        this.itemCategory = event == true ? '' : this.itemCategory;
    }
    clearSelectBrand(event: any) {
        this.brand_name = event == true ? '' : this.brand_name;
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

    convertDateStr(value: any): any {
        return Helper.convertDateStr(value);
    }
}
