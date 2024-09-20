import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { EnumLocalStorage, EnumStatus, EnumSystem } from 'src/app/Core/_enum';
import { Helper } from 'src/app/Core/_helper';
import { EncryptDecryptService } from 'src/app/Service/encrypt-decrypt.service';
import { Pf } from 'src/app/_helpers/pf';
import { AppComponent } from 'src/app/app.component';
import { ExportService } from 'src/app/web/service/export.service';
import { FileService } from 'src/app/web/service/file.service';
import { ReportsService } from 'src/app/web/service/reports.service';
import { SurveyService } from 'src/app/web/service/survey.service';

@Component({
    selector: 'app-Works',
    templateUrl: './works.component.html',
    styleUrls: ['./works.component.scss'],
})
export class WorksComponent implements AfterViewInit {
    items_menu: any = [
        { label: ' REPORT' },
        {
            label: ' Kết quả cửa hàng ',
            icon: 'pi pi-list',
        },
    ];

    GetLanguage(key: string) {
        return Helper.GetLanguage(key);
    }

    home: any = { icon: 'pi pi-chart-bar', routerLink: '/dashboard' };
    menu_id = 12;
    PagesModule: any;
    projectId = Helper.ProjectID();

    selectShopNameOutlet(event: any) {
        this.shop_name = Helper.IsNull(event) != true ? event : '';
        this.filterShopName(this.shop_name);
    }
    filterShopName(shop_name: string) {
        let result = this.ListReport;
        if (shop_name != '' && shop_name != null && shop_name != undefined) {
            result = this.ListReport.filter((s: any) =>
                s.shop_name.toLowerCase().includes(shop_name.toLowerCase())
            );
        }
        this.ListReport = result;
    }

    check_permissions() {
        const menu = JSON.parse(localStorage.getItem('menu') + '').filter(
            (item: any) => item.menu_id == this.menu_id && item.check == 1
        );
        if (menu.length > 0) {
        } else {
            this.router.navigate(['/empty']);
        }
    }
    constructor(
        private router: Router,
        private _service: ReportsService,
        private _serviceSurvey: SurveyService,
        private serviceExport: ExportService,
        private edService: EncryptDecryptService,
        private messageService: MessageService,
        private _file: FileService
    ) {}
    writeValue(obj: any): void {
        throw new Error('Method not implemented.');
    }
    registerOnChange(fn: any): void {
        throw new Error('Method not implemented.');
    }
    registerOnTouched(fn: any): void {
        throw new Error('Method not implemented.');
    }
    setDisabledState?(isDisabled: boolean): void {
        throw new Error('Method not implemented.');
    }
    is_loadForm: number = 0;
    ListStatus: any = [
        { name: 'Active', code: '1' },
        { name: 'In-Active', code: '0' },
    ];
    is_test: string[] = [];
    display: boolean = false;
    display_model: boolean = false;
    message: string = '';

    dateStart: any | undefined;
    dateEnd: any | undefined;

    // const firstdate = moment().startOf('month').format('DD-MM-YYYY');
    // const lastdate = moment().endOf('month').format("DD-MM-YYYY");

    shop_code: string = '';
    shop_name: string = '';

    customer_shop_code: string = '';
    uuid: string = '';
    project_shop_code: string = '';
    // msgs: Message[] = [];
    getFormatedDate(date: Date, format: string) {
        const datePipe = new DatePipe('en-US');
        return datePipe.transform(date, format);
    }
    project_id: any = 0;
    itemsData: any;
    download_survey: any = 0;
    download_display: any = 0;
    download_sellout: any = 0;

    item_Survey: number = 0;
    item_SurveyReport: number = 0;
    selectSurvey(event: any) {
        this.item_Survey = event != null ? event.Id : 0;
    }
    selectSurveyReport(event: any) {
        this.item_SurveyReport = event != null ? event.Id : 0;
    }
    DefaultPPTDownload() {
        this.download_survey = 0;

        const intDateStart = parseInt(Pf.StringDateToInt(this.dateStart));
        const intDateEnd = parseInt(Pf.StringDateToInt(this.dateEnd));

        this.serviceExport.ewo_Report_GetRawData_PPT_bySurvey(
            this.totalRecords,
            1,
            Helper.ProjectID(),
            this.item_SS,
            this.item_reportStatus,
            intDateStart,
            intDateEnd,
            this.shop_code,
            this.customer_shop_code,
            this.project_shop_code,
            this.item_ShopType,
            this.item_Province == null ? 0 : this.item_Province.code,
            this.item_District == null ? 0 : this.item_District.code,
            this.item_Ward == null ? 0 : this.item_Ward.code,
            this.item_channel,
            this.item_ShopRouter,
            -1,
            this.item_ASM,
            this.item_Survey
        );
    }

    ewo_ATD_results_PP() {
        const intDateStart = parseInt(Pf.StringDateToInt(this.dateStart));
        const intDateEnd = parseInt(Pf.StringDateToInt(this.dateEnd));

        this.serviceExport.ewo_ATD_results_PP(
            Helper.ProjectID(),
            intDateStart,
            intDateEnd,
            this.uuid,
            this.item_ASM == 0 ? '' : this.item_ASM + '',
            this.item_SS == 0 ? '' : this.item_SS + '',
            this.shop_code,
            this.item_Province == null || this.item_Province == undefined
                ? ''
                : this.item_Province.code + ''
        );
    }

    onImageErrorImage(index: any, type: string) {
        if (type == 'mid') {
            this.ListReport[index - 1].employee_image = EnumSystem.imageError;
        } else if (type == 'left') {
            this.ListReport[index - 1].image_face_left = EnumSystem.imageError;
        } else if (type == 'right') {
            this.ListReport[index - 1].image_face_right = EnumSystem.imageError;
        }
    }
    DisplayDownload() {
        this.download_display = 0;

        const intDateStart = parseInt(Pf.StringDateToInt(this.dateStart));
        const intDateEnd = parseInt(Pf.StringDateToInt(this.dateEnd));

        if (this.item_Display == null) {
            this.item_Display = 0;
        }
        //if (this.NofiIsNull(this.item_Display, 'promotion') == 1)
        if (false) {
            return;
        } else {
            this.serviceExport.ewo_ReportDisplay_GetRawData(
                this.totalRecords,
                1,
                Helper.ProjectID(),
                this.item_SS,
                this.item_reportStatus,
                intDateStart,
                intDateEnd,
                this.shop_code,
                this.customer_shop_code,
                this.project_shop_code,
                this.item_ShopType,
                this.item_Province == null ? 0 : this.item_Province.code,
                this.item_District == null ? 0 : this.item_District.code,
                this.item_Ward == null ? 0 : this.item_Ward.code,
                this.item_channel,
                this.item_ShopRouter,
                -1,
                this.item_ASM,
                this.item_Display
            );

            this.item_Display = null;
        }
    }

    SellOutDownload() {
        // this.download_sellout = 0;

        const intDateStart = parseInt(Pf.StringDateToInt(this.dateStart));
        const intDateEnd = parseInt(Pf.StringDateToInt(this.dateEnd));

        this.serviceExport.ewo_ReportSellOut_GetRawData(
            this.totalRecords,
            1,
            Helper.ProjectID(),
            this.item_SS,
            this.item_reportStatus,
            intDateStart,
            intDateEnd,
            this.shop_code,
            this.shop_name,
            this.customer_shop_code,
            this.project_shop_code,
            this.item_ShopType,
            this.item_Province == null ? 0 : this.item_Province.code,
            this.item_District == null ? 0 : this.item_District.code,
            this.item_Ward == null ? 0 : this.item_Ward.code,
            this.item_channel,
            this.item_ShopRouter,
            -1,
            this.item_ASM
        );
    }

    SellInDownload() {
        const intDateStart = parseInt(Pf.StringDateToInt(this.dateStart));
        const intDateEnd = parseInt(Pf.StringDateToInt(this.dateEnd));

        this.serviceExport.ewo_ReportSellIn_GetRawData(
            this.totalRecords,
            1,
            Helper.ProjectID(),
            this.item_SS,
            this.item_reportStatus,
            intDateStart,
            intDateEnd,
            this.shop_code,
            this.customer_shop_code,
            this.project_shop_code,
            this.item_ShopType,
            this.item_Province == null ? 0 : this.item_Province.code,
            this.item_District == null ? 0 : this.item_District.code,
            this.item_Ward == null ? 0 : this.item_Ward.code,
            this.item_channel,
            this.item_ShopRouter,
            -1,
            this.item_ASM
        );
    }

    DefaultDownload() {
        this.download_survey = 0;
        let is_test = 0;

        const intDateStart = parseInt(Pf.StringDateToInt(this.dateStart));
        const intDateEnd = parseInt(Pf.StringDateToInt(this.dateEnd));

        this.serviceExport.ewo_ReportSurvey_GetRawData(
            this.totalRecords,
            1,
            Helper.ProjectID(),
            this.item_SS,
            this.item_reportStatus,
            intDateStart,
            intDateEnd,
            this.shop_code,
            this.shop_name,
            this.customer_shop_code,
            this.project_shop_code,
            this.item_ShopType,
            this.item_Province == null ? 0 : this.item_Province.code,
            this.item_District == null ? 0 : this.item_District.code,
            this.item_Ward == null ? 0 : this.item_Ward.code,
            this.item_channel,
            this.item_ShopRouter,
            -1,
            this.item_ASM,
            this.item_Survey
        );
    }
    DownloadModelSamSung() {
        this.download_survey = 0;
        let is_test = 0;

        const intDateStart = parseInt(Pf.StringDateToInt(this.dateStart));
        const intDateEnd = parseInt(Pf.StringDateToInt(this.dateEnd));

        this.serviceExport.ewo_ReportSurvey_GetRawData_model(
            this.totalRecords,
            1,
            Helper.ProjectID(),
            this.item_SS,
            this.item_reportStatus,
            intDateStart,
            intDateEnd,
            this.shop_code,
            this.customer_shop_code,
            this.project_shop_code,
            this.item_ShopType,
            this.item_Province == null ? 0 : this.item_Province.code,
            this.item_District == null ? 0 : this.item_District.code,
            this.item_Ward == null ? 0 : this.item_Ward.code,
            this.item_channel,
            this.item_ShopRouter,
            -1,
            this.item_ASM,
            72
        );
    }
    fileTemplete: any = undefined;
    upload_model(event: any) {
        this.fileTemplete = event.target.files[0];
    }
    import_model() {
        const formDataUpload = new FormData();

        formDataUpload.append('files', this.fileTemplete);
        this._serviceSurvey
            .ewo_Model_SurveyData_Fixture_Import(formDataUpload)
            .subscribe((data: any) => {
                this.clearFileInput();
                if (data.result == EnumStatus.ok) {
                    this.NofiResult(
                        'Page Works',
                        'Import Model Edit',
                        'Import successful model edit',
                        'success',
                        'Successfull'
                    );
                } else {
                    this.messageService.add({
                        severity: 'warn',
                        summary: 'Warning',
                        detail: data.message,
                    });
                }
            });
    }

    @ViewChild('myInputFile') myInputFile: any;
    clearFileInput() {
        this.myInputFile.nativeElement.value = null;
        this.fileTemplete = undefined;
    }

    item_Display: any;
    selectPromotion(event: any) {
        this.item_Display = event != null ? event.code : null;
    }
    selectMonth: any;
    products: any;

    selectedListRaw: any = null;
    listRawData: any[] = [];

    loadDataReportList() {
        this._service
            .Report_list_GetList(Helper.ProjectID())
            .subscribe((res: any) => {
                if (res.result == EnumStatus.ok) {
                    if (res.data.length > 0) {
                        this.listRawData = res.data.filter(
                            (x: any) => x.check == 1
                        );
                    }
                }
            });
    }

    GetPerDownloadExcel() {
        if (Helper.IsNull(this.listRawData) == true) {
            this.loadDataReportList();
        }

        this.itemsData = [];
        this.listRawData.forEach((element: any) => {
            // console.log(element.report_id);
            this.itemsData.push(
                {
                    label: element.report_name,
                    icon: element.icon,
                    command: () => {
                        if (element.report_id == 1) {
                            return this.export();
                        } else if (element.report_id == 2) {
                            this.download_survey = 1;
                            this.download_display = 0;
                            this.download_sellout = 0;
                        } else if (element.report_id == 3) {
                            this.export_Attendance();
                        } else if (element.report_id == 4) {
                            this.download_display = 1;
                            this.download_survey = 0;
                            this.download_sellout = 0;
                        } else if (element.report_id == 5) {
                            this.SellOutDownload();
                        } else if (element.report_id == 6) {
                            this.SellInDownload();
                        } else if (element.report_id == 7) {
                            this.export_OOL();
                        } else if (element.report_id == 8) {
                            this.export_INVENTORY();
                        } else if (element.report_id == 9) {
                            this.export_SOS();
                        } else if (element.report_id == 10) {
                            this.export_ACTIVATION();
                        } else if (element.report_id == 12) {
                            this.Report_Attendance_JTI();
                        } else if (element.report_id == 13) {
                            this.export_POSM();
                        } else if (element.report_id == 14) {
                            this.export_MRD();
                        } else if (element.report_id == 15) {
                            this.ewo_ATD_results_PP();
                        } else if (element.report_id == 16) {
                            // this.export_COACHING();
                            this.loadSurveyCoaching();
                        } else if (element.report_id == 17) {
                            this.ReportSummaryTheWeekly_Manager_JSE();
                        } else {
                            this.download_survey = 2;
                        }
                    },
                },
                { separator: true }
            );
        });

        if (Helper.ProjectID() == 19) {
            this.itemsData.push({
                label: 'Raw Data COACHING',
                icon: 'pi pi-file-excel',
                command: () => {
                    // this.export_COACHING();
                    this.loadSurveyCoaching();
                },
            });
        }
    }

    GetPerDownloadExcel1() {
        const projectIds = [21, 2, 3, 15];

        if (Helper.ProjectID() == 20) {
            this.itemsData = [
                {
                    label: 'Raw data excel',
                    icon: 'pi pi-file-excel',
                    command: () => {
                        this.export();
                    },
                },
                { separator: true },
                {
                    label: 'Raw data SURVEY',
                    icon: 'pi pi-file-excel',
                    command: () => {
                        this.download_survey = 1;
                        this.download_display = 0;
                        this.download_sellout = 0;
                    },
                },
                { separator: true },
                {
                    label: 'Raw data SELLOUT',
                    icon: 'pi pi-file-excel',
                    command: () => {
                        this.SellOutDownload();
                    },
                },
            ];
        } else if (projectIds.includes(Helper.ProjectID())) {
            this.itemsData = [
                {
                    label: 'Raw data excel',
                    icon: 'pi pi-file-excel',
                    command: () => {
                        this.export();
                    },
                },
                { separator: true },
                {
                    label: 'Raw data SURVEY',
                    icon: 'pi pi-file-excel',
                    command: () => {
                        this.download_survey = 1;
                        this.download_display = 0;
                        this.download_sellout = 0;
                    },
                },
                { separator: true },
                {
                    label: 'Raw data ACTIVATION',
                    icon: 'pi pi-file-excel',
                    command: () => {
                        this.export_ACTIVATION();
                    },
                },
            ];
        } else {
            this.itemsData = [
                {
                    label: 'Raw data excel',
                    icon: 'pi pi-file-excel',
                    command: () => {
                        this.export();
                    },
                },
                { separator: true },
                {
                    label: 'Raw data SURVEY',
                    icon: 'pi pi-file-excel',
                    command: () => {
                        this.download_survey = 1;
                        this.download_display = 0;
                        this.download_sellout = 0;
                    },
                },
                { separator: true },
                {
                    label: 'Raw data DISPLAY',
                    icon: 'pi pi-file-excel',
                    command: () => {
                        this.download_display = 1;
                        this.download_survey = 0;
                        this.download_sellout = 0;
                    },
                },
                { separator: true },
                {
                    label: 'Raw data SELLOUT',
                    icon: 'pi pi-file-excel',
                    command: () => {
                        this.SellOutDownload();
                    },
                },
                { separator: true },
                {
                    label: 'Raw data SELLIN',
                    icon: 'pi pi-file-excel',
                    command: () => {
                        this.SellInDownload();
                    },
                },
                { separator: true },
                {
                    label: 'Raw data OOL',
                    icon: 'pi pi-file-excel',
                    command: () => {
                        this.export_OOL();
                    },
                },
                { separator: true },
                {
                    label: 'Raw data INVENTORY',
                    icon: 'pi pi-file-excel',
                    command: () => {
                        this.export_INVENTORY();
                    },
                },
                { separator: true },
                {
                    label: 'Raw data SOS',
                    icon: 'pi pi-file-excel',
                    command: () => {
                        this.export_SOS();
                    },
                },
                { separator: true },
                {
                    label: 'Raw data ACTIVATION',
                    icon: 'pi pi-file-excel',
                    command: () => {
                        this.export_ACTIVATION();
                    },
                },
                { separator: true },
                {
                    label: 'Raw data POSM',
                    icon: 'pi pi-file-excel',
                    command: () => {
                        this.export_POSM();
                    },
                },
                { separator: true },
                {
                    label: 'Raw data ATTENDANCE',
                    icon: 'pi pi-file-excel',
                    command: () => {
                        this.export_Attendance();
                    },
                },
            ];
        }

        if (
            Helper.ProjectID() == 4 ||
            Helper.ProjectID() == 41 ||
            Helper.ProjectID() == 42
        ) {
            this.itemsData.push(
                { separator: true },
                {
                    label: 'File Power Point (pptx)',
                    icon: 'pi pi-file',
                    command: () => {
                        this.download_survey = 2;
                        // this.exportPP();
                    },
                }
            );
        }
        this.itemsData.push(
            { separator: true },
            {
                label: 'Raw data ATTENDANCE',
                icon: 'pi pi-file-excel',
                command: () => {
                    this.export_Attendance();
                },
            }
        );
    }
    responsiveOptions: any;
    SetOnitDate() {
        try {
            let newDate = new Date();
            this.dateEnd = this.getFormatedDate(newDate, 'YYYY-MM-dd');

            var dateObj = new Date();
            var month = dateObj.getUTCMonth(); //months from 1-12
            var year = dateObj.getUTCFullYear();
            newDate = new Date(year, month, 1);
            this.dateStart = this.getFormatedDate(newDate, 'YYYY-MM-dd');
        } catch (error) {}
    }
    ngAfterViewInit(): void {
        this.SetOnitDate();
    }
    project: any;
    projectName() {
        let _u = localStorage.getItem(EnumLocalStorage.user);
        this.project = JSON.parse(
            this.edService.decryptUsingAES256(_u)
        ).projects.filter((d: any) => d.project_id == Helper.ProjectID())[0];
    }

    ngOnInit() {
        this.SetOnitDate();
        this.products = Array.from({ length: 20 }).map((_, i) => `Item #${i}`);
        this.projectName();
        this.loadUser();

        this.check_permissions();

        this.project_id = Helper.ProjectID();
        // this.showFiter = 0;

        this.GetPerDownloadExcel();
        // this.GetPerDownloadExcel1();
        // this.filter(1);
        this.responsiveOptions = [
            {
                breakpoint: '1024px',
                numVisible: 5,
            },
            {
                breakpoint: '768px',
                numVisible: 3,
            },
            {
                breakpoint: '560px',
                numVisible: 1,
            },
        ];
    }
    ListReport: any = [];
    isLoading_Filter: any = false;

    first: number = 0;
    totalRecords: number = 0;
    rows: number = 20;
    _pageNumber: number = 1;

    onPageChange(event: any) {
        this.first = event.first;
        this.rows = event.rows;
        this._pageNumber = (this.first + this.rows) / this.rows;

        this.filter(this._pageNumber);
    }

    filter(pageNumber: number) {
        this.GetPerDownloadExcel();
        // this.GetPerDownloadExcel1();

        this.is_loadForm = 1;
        if (pageNumber == 1) {
            this.first = 0;
            this.totalRecords = 0;
            // this.rows  = 20;
            this._pageNumber = 1;
        }

        if (Helper.IsNull(this.dateStart) == true) {
            this.NofiIsNull(this.dateStart, 'date start');
            return;
        }

        if (Helper.IsNull(this.dateEnd) == true) {
            this.NofiIsNull(this.dateEnd, 'date end');
            return;
        }

        // this.is_test.length == 0 ? 0 : 1,

        this.ListReport = [];
        this.isLoading_Filter = true;

        const intDateStart = parseInt(Pf.StringDateToInt(this.dateStart));
        const intDateEnd = parseInt(Pf.StringDateToInt(this.dateEnd));

        this._service
            .ewo_ReportGetList(
                this.rows,
                pageNumber,
                Helper.ProjectID(),
                this.item_SS,
                this.item_reportStatus,
                // Pf.StringDateToInt(this.dateStart),
                // Pf.StringDateToInt(this.dateEnd),
                intDateStart,
                intDateEnd,
                this.shop_code,
                this.shop_name,
                this.customer_shop_code,
                this.project_shop_code,
                this.item_ShopType,
                this.item_Province == null ? 0 : this.item_Province.code,
                this.item_District == null ? 0 : this.item_District.code,
                this.item_Ward == null ? 0 : this.item_Ward.code,
                this.item_channel,
                this.item_ShopRouter,
                -1,
                this.item_ASM,
                this.uuid,
                this.item_SurveyReport + ''
            )
            .subscribe((data: any) => {
                this.is_loadForm = 0;
                if (data.result == EnumStatus.ok) {
                    if (data.data.length > 0) {
                        this.ListReport = data.data;
                        this.totalRecords = this.ListReport[0].TotalRows;
                        this.ListReport.forEach((element: any) => {
                            try {
                                element.audio = JSON.parse(element.audio);
                            } catch (error) {}
                        });
                        this.isLoading_Filter = false;
                    } else {
                        this.isLoading_Filter = false;
                        this.message = 'No data';
                        this.display = true;
                    }
                }
            });
    }

    OK(model: any) {
        // this.ShopEdit = false;
        if (model == 'display') {
            this.display = false;
        } else if (model == 'display_model') {
            this.display_model = true;
        }
    }

    showFilter: number = 1;
    ShowHideFilter() {
        if (this.showFilter == 1) {
            this.showFilter = 0;
        } else {
            this.showFilter = 1;
        }
    }

    selectStatus: any;

    customer_code: string = '';
    customer_name: string = '';

    item_ShopType: number = 0;
    selectShopType(event: any) {
        this.item_ShopType = event != null ? event.code : 0;
    }
    item_ShopRouter: number = 0;
    selectShopRouter(event: any) {
        this.item_ShopRouter = event != null ? event.code : 0;
    }
    item_channel: number = 0;
    selectedChannel(event: any) {
        this.item_channel = event != null ? event.code : 0;
    }
    item_ASM: number = 0;
    selectASM(event: any) {
        this.item_ASM = event != null ? event.code : 0;
    }
    item_SS: number = 0;
    selectSS(event: any) {
        this.item_SS = event != null ? event.code : 0;
    }
    item_reportStatus: number = 0;
    selectReportStatus(event: any) {
        this.item_reportStatus = event != null ? event.code : 0;
    }
    item_Province: any;
    selectProvince(event: any) {
        this.item_Province = event != null ? event : 0;
    }
    item_District: any;
    selectDistrict(event: any) {
        this.item_District = event != null ? event : 0;
    }
    item_Ward: any;
    selectWard(event: any) {
        this.item_Ward = event != null ? event : 0;
    }

    getStatusReport(status: string) {
        switch (status.toLocaleLowerCase()) {
            case 'thành công':
                return 'success';
            case 'không thành công':
                return 'danger';
        }
        return '';
    }

    export() {
        let is_test = 0;

        const intDateStart = parseInt(Pf.StringDateToInt(this.dateStart));
        const intDateEnd = parseInt(Pf.StringDateToInt(this.dateEnd));

        this.serviceExport.ewo_Report_GetRawData(
            this.totalRecords,
            1,
            Helper.ProjectID(),
            this.item_SS,
            this.item_reportStatus,
            intDateStart,
            intDateEnd,
            this.shop_code,
            this.shop_name,
            this.customer_shop_code,
            this.project_shop_code,
            this.item_ShopType,
            this.item_Province == null ? 0 : this.item_Province.code,
            this.item_District == null ? 0 : this.item_District.code,
            this.item_Ward == null ? 0 : this.item_Ward.code,
            this.item_channel,
            this.item_ShopRouter,
            -1,
            this.item_ASM
        );
    }

    export_OOL() {
        let is_test = 0;

        const intDateStart = parseInt(Pf.StringDateToInt(this.dateStart));
        const intDateEnd = parseInt(Pf.StringDateToInt(this.dateEnd));

        this.serviceExport.ewo_Report_GetRawData_OOL(
            this.totalRecords,
            1,
            Helper.ProjectID(),
            this.item_SS,
            this.item_reportStatus,
            intDateStart,
            intDateEnd,
            this.shop_code,
            this.customer_shop_code,
            this.project_shop_code,
            this.item_ShopType,
            this.item_Province == null ? 0 : this.item_Province.code,
            this.item_District == null ? 0 : this.item_District.code,
            this.item_Ward == null ? 0 : this.item_Ward.code,
            this.item_channel,
            this.item_ShopRouter,
            -1,
            this.item_ASM
        );
    }

    export_INVENTORY() {
        let is_test = 0;

        const intDateStart = parseInt(Pf.StringDateToInt(this.dateStart));
        const intDateEnd = parseInt(Pf.StringDateToInt(this.dateEnd));

        this.serviceExport.ewo_Report_GetRawData_INVENTORY(
            this.totalRecords,
            1,
            Helper.ProjectID(),
            this.item_SS,
            this.item_reportStatus,
            intDateStart,
            intDateEnd,
            this.shop_code,
            this.customer_shop_code,
            this.project_shop_code,
            this.item_ShopType,
            this.item_Province == null ? 0 : this.item_Province.code,
            this.item_District == null ? 0 : this.item_District.code,
            this.item_Ward == null ? 0 : this.item_Ward.code,
            this.item_channel,
            this.item_ShopRouter,
            -1,
            this.item_ASM
        );
    }

    export_SOS() {
        let is_test = 0;

        const intDateStart = parseInt(Pf.StringDateToInt(this.dateStart));
        const intDateEnd = parseInt(Pf.StringDateToInt(this.dateEnd));

        this.serviceExport.ewo_Report_GetRawData_SOS(
            this.totalRecords,
            1,
            Helper.ProjectID(),
            this.item_SS,
            this.item_reportStatus,
            intDateStart,
            intDateEnd,
            this.shop_code,
            this.customer_shop_code,
            this.project_shop_code,
            this.item_ShopType,
            this.item_Province == null ? 0 : this.item_Province.code,
            this.item_District == null ? 0 : this.item_District.code,
            this.item_Ward == null ? 0 : this.item_Ward.code,
            this.item_channel,
            this.item_ShopRouter,
            -1,
            this.item_ASM
        );
    }

    is_coaching_survey = 0;
    loadSurveyCoaching() {
        this.is_coaching_survey = 1;
    }

    survey_id = 0;
    selectCoachingSurvey(event: any) {
        this.survey_id = event != null ? event.Id : 0;
    }

    export_COACHING() {
        const intDateStart = parseInt(Pf.StringDateToInt(this.dateStart));
        const intDateEnd = parseInt(Pf.StringDateToInt(this.dateEnd));

        this.serviceExport.ewo_Report_GetRawData_COACHING(
            this.totalRecords,
            1,
            Helper.ProjectID(),
            this.item_SS,
            this.item_reportStatus,
            intDateStart,
            intDateEnd,
            this.shop_code,
            this.customer_shop_code,
            this.project_shop_code,
            this.item_ShopType,
            this.item_Province == null ? 0 : this.item_Province.code,
            this.item_District == null ? 0 : this.item_District.code,
            this.item_Ward == null ? 0 : this.item_Ward.code,
            this.item_channel,
            this.item_ShopRouter,
            -1,
            this.item_ASM,
            this.survey_id
        );
    }

    export_ACTIVATION() {
        let is_test = 0;

        const intDateStart = parseInt(Pf.StringDateToInt(this.dateStart));
        const intDateEnd = parseInt(Pf.StringDateToInt(this.dateEnd));

        this.serviceExport.ewo_Report_GetRawData_JSE(
            this.totalRecords,
            1,
            Helper.ProjectID(),
            this.item_SS,
            this.item_reportStatus,
            intDateStart,
            intDateEnd,
            this.shop_code,
            this.customer_shop_code,
            this.project_shop_code,
            this.item_ShopType,
            this.item_Province == null ? 0 : this.item_Province.code,
            this.item_District == null ? 0 : this.item_District.code,
            this.item_Ward == null ? 0 : this.item_Ward.code,
            this.item_channel,
            this.item_ShopRouter,
            -1,
            this.item_ASM,
            0,
            0,
            ''
        );
    }

    export_POSM() {
        let is_test = 0;

        const intDateStart = parseInt(Pf.StringDateToInt(this.dateStart));
        const intDateEnd = parseInt(Pf.StringDateToInt(this.dateEnd));

        this.serviceExport.ewo_Report_GetRawData_POSM(
            this.totalRecords,
            1,
            Helper.ProjectID(),
            this.item_SS,
            this.item_reportStatus,
            intDateStart,
            intDateEnd,
            this.shop_code,
            this.customer_shop_code,
            this.project_shop_code,
            this.item_ShopType,
            this.item_Province == null ? 0 : this.item_Province.code,
            this.item_District == null ? 0 : this.item_District.code,
            this.item_Ward == null ? 0 : this.item_Ward.code,
            this.item_channel,
            this.item_ShopRouter,
            -1,
            this.item_ASM
            // 0,
            // 0,
            // ""
        );
    }

    export_MRD() {
        let is_test = 0;

        const intDateStart = parseInt(Pf.StringDateToInt(this.dateStart));
        const intDateEnd = parseInt(Pf.StringDateToInt(this.dateEnd));

        this.serviceExport.ewo_Report_GetRawData_Mirinda(
            this.totalRecords,
            1,
            Helper.ProjectID(),
            this.item_SS,
            this.item_reportStatus,
            intDateStart,
            intDateEnd,
            this.shop_code,
            this.customer_shop_code,
            this.project_shop_code,
            this.item_ShopType,
            this.item_Province == null ? 0 : this.item_Province.code,
            this.item_District == null ? 0 : this.item_District.code,
            this.item_Ward == null ? 0 : this.item_Ward.code,
            this.item_channel,
            this.item_ShopRouter,
            -1,
            this.item_ASM
            // 0,
            // 0,
            // ""
        );
    }

    ReportSummaryTheWeekly_Manager_JSE() {
        let is_test = 0;

        const intDateStart = parseInt(Pf.StringDateToInt(this.dateStart));
        const intDateEnd = parseInt(Pf.StringDateToInt(this.dateEnd));

        this.serviceExport.ReportSummaryTheWeekly_Manager_JSE(
            Helper.ProjectID(),
            this.item_SS,
            this.item_reportStatus,
            intDateStart,
            intDateEnd,
            this.shop_code,
            this.customer_shop_code,
            this.project_shop_code,
            this.item_ShopType,
            this.item_Province == null ? 0 : this.item_Province.code,
            this.item_District == null ? 0 : this.item_District.code,
            this.item_Ward == null ? 0 : this.item_Ward.code,
            this.item_channel,
            this.item_ShopRouter,
            -1,
            this.item_ASM
        );
    }

    export_Attendance() {
        let is_test = 0;

        const intDateStart = parseInt(Pf.StringDateToInt(this.dateStart));
        const intDateEnd = parseInt(Pf.StringDateToInt(this.dateEnd));

        this.serviceExport.ewo_Report_GetRawData_Attendance(
            Helper.ProjectID(),
            intDateStart,
            intDateEnd
        );
    }

    Report_Attendance_JTI() {
        let is_test = 0;

        const intDateStart = parseInt(Pf.StringDateToInt(this.dateStart));
        const intDateEnd = parseInt(Pf.StringDateToInt(this.dateEnd));

        this.serviceExport.Report_Attendance_JTI(
            Helper.ProjectID(),
            intDateStart,
            intDateEnd
        );
    }

    exportPDF() {
        let is_test = 0;

        const intDateStart = parseInt(Pf.StringDateToInt(this.dateStart));
        const intDateEnd = parseInt(Pf.StringDateToInt(this.dateEnd));

        this.serviceExport.ewo_Report_GetRawData_PDF(
            this.totalRecords,
            1,
            Helper.ProjectID(),
            this.item_SS,
            this.item_reportStatus,
            intDateStart,
            intDateEnd,
            this.shop_code,
            this.customer_shop_code,
            this.project_shop_code,
            this.item_ShopType,
            this.item_Province == null ? 0 : this.item_Province.code,
            this.item_District == null ? 0 : this.item_District.code,
            this.item_Ward == null ? 0 : this.item_Ward.code,
            this.item_channel,
            this.item_ShopRouter,
            -1,
            this.item_ASM
        );
    }

    exportPP() {
        let is_test = 0;

        const intDateStart = parseInt(Pf.StringDateToInt(this.dateStart));
        const intDateEnd = parseInt(Pf.StringDateToInt(this.dateEnd));

        this.serviceExport.ewo_Report_GetRawData_PPT(
            this.totalRecords,
            1,
            Helper.ProjectID(),
            this.item_SS,
            this.item_reportStatus,
            intDateStart,
            intDateEnd,
            this.shop_code,
            this.customer_shop_code,
            this.project_shop_code,
            this.item_ShopType,
            this.item_Province == null ? 0 : this.item_Province.code,
            this.item_District == null ? 0 : this.item_District.code,
            this.item_Ward == null ? 0 : this.item_Ward.code,
            this.item_channel,
            this.item_ShopRouter,
            -1,
            this.item_ASM
        );
    }

    @ViewChild('myInputFileUrl') myInputFileUrl: any;
    clearFileInputUrl() {
        this.myInputFileUrl.nativeElement.value = null;
        this.fileUrl = undefined;
    }

    fileUrl: any = undefined;
    linkUrl: any = '';
    typeFile: any = '';

    upload_file_url(event: any) {
        this.linkUrl = '';
        this.fileUrl = event.target.files[0];

        this.currentUser.projects = this.currentUser.projects.filter(
            (data: any) => data.project_id == Helper.ProjectID()
        );
        const formDataUpload = new FormData();
        formDataUpload.append('files', this.fileUrl);
        formDataUpload.append(
            'ImageType',
            this.currentUser.projects[0].project_code
        );

        // this._file.UploadFile(formDataUpload).subscribe((data: any) => {
        //     if (data.result == EnumStatus.ok) {
        //         this.clearFileInputUrl();
        //         this.linkUrl = EnumSystem.fileLocal + data.data;

        //         const url = this.linkUrl;
        //         const fileType = url.split('.');
        //         this.typeFile = fileType[fileType.length - 1];
        //     }
        // });

        const fileName = AppComponent.generateGuid();
        const newFile = new File(
            [this.fileUrl],
            fileName +
                this.fileUrl.name.substring(this.fileUrl.name.lastIndexOf('.')),
            { type: this.fileUrl.type }
        );
        const modun = 'IMAGE-FILE';
        const drawText = this.currentUser.projects[0].project_code;
        this._file
            .FileUpload(newFile, this.project.project_code, modun, drawText)
            .subscribe(
                (response: any) => {
                    this.clearFileInputUrl();
                    this.linkUrl = response.url;

                    const url = this.linkUrl;
                    const fileType = url.split('.');
                    this.typeFile = fileType[fileType.length - 1];
                },
                (error: any) => {}
            );
    }

    copyInputMessage(inputElement: any) {
        inputElement.select();
        document.execCommand('copy');
        inputElement.setSelectionRange(0, 0);
    }

    /* To copy any Text */

    copyText(val: string) {
        if (this.NofiIsNull(this.linkUrl, 'file') == 1) {
            return;
        } else {
            let selBox = document.createElement('textarea');
            selBox.style.position = 'fixed';
            selBox.style.left = '0';
            selBox.style.top = '0';
            selBox.style.opacity = '0';
            selBox.value = val;
            document.body.appendChild(selBox);
            selBox.focus();
            selBox.select();
            document.execCommand('copy');
            document.body.removeChild(selBox);
        }
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
        return this.userProfile.level == 'CUS' ? true : false;
    }

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

    NofiResult(page: any, action: any, name: any, severity: any, summary: any) {
        this.messageService.add({
            severity: severity,
            summary: summary,
            detail: name,
            life: 3000,
        });

        AppComponent.pushMsg(
            page,
            action,
            name,
            severity == 'success' ? EnumStatus.ok : EnumStatus.error,
            0
        );
    }
}
