import { DatePipe } from '@angular/common';
import { Component, Input, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, Message, MessageService } from 'primeng/api';
import { Helper } from 'src/app/Core/_helper';
import { Pf } from 'src/app/_helpers/pf';
import { EnumStatus } from 'src/app/Core/_enum';
import { EmployeesService } from 'src/app/web/service/employees.service';
import * as FileSaver from 'file-saver';
import { AppComponent } from 'src/app/app.component';
import { EmpFaceService } from './empFace.service';

interface Column {
    field: string;
    header: string;
    customExportHeader?: string;
}

interface ExportColumn {
    title: string;
    dataKey: string;
}

@Component({
    selector: 'app-empFace',
    templateUrl: './empFace.component.html',
    styleUrls: ['./empFace.component.scss'],
    providers: [DatePipe],
})
export class empFaceComponent {
    messages: Message[] | undefined;
    constructor(
        private router: Router,
        private datePipe: DatePipe,
        private messageService: MessageService,
        private _service: EmpFaceService,
        private confirmationService: ConfirmationService,
        private _serviceEmp: EmployeesService
    ) {}

    items_menu: any = [
        { label: ' EMPLOYEE FACE' },
        { label: ' Emp Face', icon: 'fa fa-picture-o' },
    ];

    home: any = { icon: 'pi pi-chart-bar', routerLink: '/dashboard' };
    menu_id = 122;
    first: number = 0;
    totalRecords: number = 0;
    rows: number = 20;
    _pageNumber: number = 1;
    showFilter: number = 1;
    item_Project: any = null;

    //#region filter
    source_app: string = '';
    system_source: string = '';
    employee_code: string = '';
    employee_id: any = null;
    //#endregion
    ShowHideFilter() {
        if (this.showFilter == 1) {
            this.showFilter = 0;
        } else {
            this.showFilter = 1;
        }
    }
    onPageChange(event: any) {
        this.first = event.first;
        this.rows = event.rows;
        this._pageNumber = (this.first + this.rows) / this.rows;
        this.loadData(this._pageNumber);
    }

    isLoading_Filter: any = false;
    is_LoadForm: number = 0;

    empFaceLists: any;
    check_permissions() {
        const menu = JSON.parse(localStorage.getItem('menu') + '').filter(
            (item: any) => item.menu_id == this.menu_id && item.check == 1
        );
        if (menu.length > 0) {
        } else {
            this.router.navigate(['/empty']);
        }
    }
    cols!: Column[];
    exportColumns!: ExportColumn[];
    ngOnInit() {
        this.loadData(1);
    }

    loadData(pageNumber: number) {
        // this.item_Project = Helper.ProjectID();

        this.is_LoadForm = 1;
        this.first = 0;
        this.totalRecords = 0;
        this.isLoading_Filter = true;
        let emp_id = 0;
        let prj_id = 0;
        if (!Helper.IsNull(this.item_Project)) {
            prj_id = this.item_Project;
        }
        if (!Helper.IsNull(this.employee_id)) {
            emp_id = this.employee_id;
        }
        this._service
            .getList(
                this.source_app,
                this.system_source,
                prj_id,
                this.employee_code,
                emp_id
            )
            .subscribe((data: any) => {
                if (data.result == EnumStatus.ok) {
                    this.empFaceLists = data.data;
                    this.totalRecords = this.empFaceLists.length || 0;
                    this.isLoading_Filter = false;
                } else {
                    this.empFaceLists = [];
                    this.isLoading_Filter = false;
                }
            });
    }
}
