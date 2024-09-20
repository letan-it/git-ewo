import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { EnumLocalStorage, EnumStatus, EnumSystem } from 'src/app/Core/_enum';
import { Helper } from 'src/app/Core/_helper';
import { EncryptDecryptService } from 'src/app/Service/encrypt-decrypt.service';
import { Pf } from 'src/app/_helpers/pf';
import { ExportService } from 'src/app/web/service/export.service';
import { FieldCoachingService } from 'src/app/web/service/field-coaching.service';
import { MastersService } from 'src/app/web/service/masters.service';
import { ReportsService } from 'src/app/web/service/reports.service';

@Component({
    selector: 'app-works-coaching',
    templateUrl: './works-coaching.component.html',
    styleUrls: ['./works-coaching.component.scss'],
})
export class WorksCoachingComponent {
    items_menu: any = [
        { label: ' REPORT' },
        {
            label: ' Works Coaching',
            icon: 'pi pi-table',
        },
    ];

    GetLanguage(key: string) {
        return Helper.GetLanguage(key);
    }

    home: any = { icon: 'pi pi-chart-bar', routerLink: '/dashboard' };
    menu_id = 130;
    PagesModule: any;
    projectId = Helper.ProjectID();
    check_permissions() {
        const menu = JSON.parse(localStorage.getItem('menu') + '').filter(
            (item: any) => item.menu_id == this.menu_id && item.check == 1
        );
        if (menu.length > 0) {
        } else {
            this.router.navigate(['/empty']);
        }
    }

    display: boolean = false;
    display_model: boolean = false;
    message: string = '';
    OK(model: any) {
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
    getFormatedDate(date: Date, format: string) {
        const datePipe = new DatePipe('en-US');
        return datePipe.transform(date, format);
    }

    constructor(
        private router: Router,
        private _service: ReportsService,
        private serviceExport: ExportService,
        private edService: EncryptDecryptService,
        private messageService: MessageService,
        private fieldCoachingService: FieldCoachingService,
        private masterService: MastersService
    ) {}

    project_id: any = 0;
    itemsData: any;
    dateStart: any | undefined;
    dateEnd: any | undefined;

    customer_code: string = '';
    customer_name: string = '';

    shop_code: string = '';
    shop_name: string = '';

    item_SurveyReport: number = 0;
    selectSurveyReport(event: any) {
        this.item_SurveyReport = event != null ? event.Id : 0;
    }

    customer_shop_code: string = '';
    uuid: string = '';
    project_shop_code: string = '';

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
    item_field_type: any;
    selectFieldType(event: any) {
        this.item_field_type = event != null ? event : 0;
    }

    is_loadForm: number = 0;

    selectFieldTypeResult: any;
    selectFieldTypeConfirm: any;
    FieldTypeResult: any = [];
    FieldTypeConfirm: any = [];

    user_profile: string = 'current';
    currentUser: any;
    userProfile: any;

    loadFieldType(project_id: any) {
        this.masterService.ewo_GetMaster(project_id).subscribe((data: any) => {
            if (data.result == EnumStatus.ok) {
                data.data.forEach((item: any) => {
                    if (item.ListCode === 'CoachingResult') {
                        this.FieldTypeResult.push({
                            ListCode: item.ListCode,
                            Code: item.Code,
                            NameVN: item.NameVN,
                            NameEN: item.NameEN,
                        });
                    } else if (item.ListCode === 'CoachingConfirm') {
                        this.FieldTypeConfirm.push({
                            ListCode: item.ListCode,
                            Code: item.Code,
                            NameVN: item.NameVN,
                            NameEN: item.NameEN,
                        });
                    }
                });
            }
        });
    }

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

    dataFieldCoachingWork: any;
    loadDataCoaching(project_id: any, report_id: number) {
        this.fieldCoachingService
            .GetFieldCoachingReport(project_id, report_id)
            .subscribe((data: any) => {
                if (data.result == EnumStatus.ok) {
                    this.is_loadForm = 0;
                    this.dataFieldCoachingWork = data.data.work;
                }
            });
    }

    checkUserCUS(): any {
        return this.userProfile.level == 'CUS' ? true : false;
    }

    products: any;
    project: any;
    projectName() {
        let _u = localStorage.getItem(EnumLocalStorage.user);
        this.project = JSON.parse(
            this.edService.decryptUsingAES256(_u)
        ).projects.filter((d: any) => d.project_id == Helper.ProjectID())[0];
    }
    responsiveOptions: any;
    ngOnInit() {
        this.project_id = Helper.ProjectID();
        this.products = Array.from({ length: 20 }).map((_, i) => `Item #${i}`);
        this.projectName();
        this.loadFieldType(this.project_id);
        this.loadUser();
        this.loadDataCoaching(this.project_id, 826823);

        this.check_permissions();

        let newDate = new Date();
        this.dateEnd = this.getFormatedDate(newDate, 'YYYY-MM-dd');

        var dateObj = new Date();
        var month = dateObj.getUTCMonth(); //months from 1-12
        var year = dateObj.getUTCFullYear();
        newDate = new Date(year, month, 1);
        this.dateStart = this.getFormatedDate(newDate, 'YYYY-MM-dd');

        this.GetPerDownloadExcel();
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
    ListReportWork: any = [];
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

    download_survey: any = 0;
    is_coaching_survey = 0;
    loadSurveyCoaching() {
        this.is_coaching_survey = 1;
    }
    survey_id = 0;
    selectCoachingSurvey(event: any) {
        this.survey_id = event != null ? event.Id : 0;
    }
    item_Survey: number = 0;
    selectSurvey(event: any) {
        this.item_Survey = event != null ? event.Id : 0;
    }

    filter(pageNumber: number) {
        this.GetPerDownloadExcel();

        this.is_loadForm = 1;
        if (pageNumber == 1) {
            this.first = 0;
            this.totalRecords = 0;
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

        this.ListReport = [];
        this.isLoading_Filter = true;

        const intDateStart = parseInt(Pf.StringDateToInt(this.dateStart));
        const intDateEnd = parseInt(Pf.StringDateToInt(this.dateEnd));

        this.fieldCoachingService
            .Works_Coaching_Getlist(
                Helper.ProjectID(),
                this.uuid,
                intDateStart,
                intDateEnd,
                this.item_SurveyReport || 0,
                this.shop_code || '',
                this.item_Province === undefined ? 0 : this.item_Province?.code,
                this.selectFieldTypeResult === undefined
                    ? 0
                    : this.selectFieldTypeResult?.Code === 'Success'
                    ? 1
                    : 2,
                this.selectFieldTypeConfirm === undefined
                    ? 0
                    : this.selectFieldTypeConfirm?.Code === 'OK'
                    ? 1
                    : 2,
                this.item_ASM || 0,
                this.item_SS || 0,
                this.rows,
                pageNumber
            )
            .subscribe((data: any) => {
                this.is_loadForm = 0;
                if (data.result == EnumStatus.ok) {
                    this.isLoading_Filter = false;
                    this.ListReportWork = data.data.data;
                    this.totalRecords = this.ListReportWork[0]?.TotalRows;
                    // this.ListReportWork.forEach((item: any) => {
                    //   this.fieldCoachingService
                    //     .Works_Coaching_GetDetail(
                    //       Helper.ProjectID(),
                    //       item.id
                    //     ).subscribe((data: any) => {
                    //       if (data.result == EnumStatus.ok) {
                    //         if (data.data.detail.length > 0) {
                    //           item.expanded = true;
                    //         } else {
                    //           item.expanded = false;
                    //         }
                    //       }
                    //     })
                    // })
                }
            });
    }

    listRawData: any[] = [];
    loadDataReportList() {
        this._service
            .Report_list_GetList(Helper.ProjectID())
            .subscribe((res: any) => {
                if (res.result == EnumStatus.ok) {
                    if (res.data.length > 0) {
                        // console.log(res.data);
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
        if (Helper.ProjectID() == 19) {
            this.itemsData.push({
                label: 'Raw Data COACHING',
                icon: 'pi pi-file-excel',
                command: () => {
                    //this.export_COACHING();
                    this.loadSurveyCoaching();
                },
            });
        }
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

    clearFieldType() {
        this.selectFieldTypeResult = undefined;
    }

    clearConfirmResult() {
        this.selectFieldTypeConfirm = undefined;
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

    getStatusReport(status: string) {
        switch (status.toLocaleLowerCase()) {
            case 'thành công':
                return 'success';
            case 'không thành công':
                return 'danger';
        }
        return '';
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
}
