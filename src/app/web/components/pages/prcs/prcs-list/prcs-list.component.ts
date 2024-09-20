import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PrcsService } from '../service/prcs.service';
import { ConfirmationService, Message, MessageService } from 'primeng/api';
import { Helper } from 'src/app/Core/_helper';
import { EnumStatus } from 'src/app/Core/_enum';

@Component({
    selector: 'app-prcs-list',
    templateUrl: './prcs-list.component.html',
    styleUrls: ['./prcs-list.component.scss'],
})
export class PrcsListComponent {
    messages: Message[] | undefined;
    newPrcsDialog: boolean = false;

    constructor(
        private router: Router,
        private _service: PrcsService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {}

    newConfigSOSDialog: boolean = false;
    editConfigSOSDialog: boolean = false;
    currentDate: any;

    menu_id = 100;
    items_menu: any = [
        { label: 'LIST ' },
        { label: ' Config', icon: 'pi pi-cog' },
    ];
    home: any = { icon: 'pi pi-chart-bar', routerLink: '/dashboard' };
    check_permissions() {
        if (JSON.parse(localStorage.getItem('menu') + '') != null) {
            const menu = JSON.parse(localStorage.getItem('menu') + '').filter(
                (item: any) => item.menu_id == this.menu_id && item.check == 1
            );
            if (menu.length > 0) {
            } else {
                this.router.navigate(['/empty']);
            }
        }
    }

    filterProcess: any;
    filterProcesses: any = [];
    selectedFilterProcess(e: any) {
        this.filterProcess = e.value === null ? 0 : e.value.process_id;
    }

    filterStatus: any = -1;
    filterStatuses: any = [
        { name: 'Active', value: 1, icon: 'pi pi-check-circle' },
        { name: 'Inactive', value: 0, icon: 'pi pi-times-circle' },
    ];
    selectedFilterStatus(e: any) {
        this.filterStatus = e.value === null ? -1 : e.value;
    }
    clearFilterStatus() {
        this.filterStatus = -1;
    }

    ngOnInit() {
        // this.check_permissions();
        this.messages = [
            { severity: 'error', summary: 'Error', detail: 'Error!!!' },
        ];
        this.loadProcess();
        this.loadData(1);
    }

    loadProcess() {
        this._service
            .PrcGetMaster(Helper.ProjectID())
            .subscribe((data: any) => {
                if (data.result == EnumStatus.ok) {
                    data.data.process_list.forEach((element: any) => {
                        this.filterProcesses.push({
                            process_id: element.process_id,
                            process_name: element.process_name,
                            type_process: element.type_process,
                        });
                    });
                }
            });
    }

    loadDataPrcsDetail(event: any) {
        console.log(event);
    }

    isLoading_Filter: any = false;
    is_loadForm: number = 0;
    first: number = 0;
    totalRecords: number = 0;
    rows: number = 20;
    _pageNumber: number = 1;

    onPageChange(event: any) {
        this.first = event.first;
        this.rows = event.rows;
    }
    listProcessProject: any = [];
    loadData(pageNumber: number) {
        this.is_loadForm = 1;
        if (pageNumber == 1) {
            this.first = 0;
            this.totalRecords = 0;
            this._pageNumber = 1;
        }
        this.isLoading_Filter = true;
        this._service
            .PrcGetprocesbyProjects(
                Helper.ProjectID(),
                this.filterProcess,
                this.filterStatus.value === undefined
                    ? -1
                    : this.filterStatus.value
            )
            .subscribe((data: any) => {
                if (data.result == EnumStatus.ok) {
                    this.listProcessProject = data.data.process_list;
                    this.totalRecords =
                        Helper.IsNull(this.listProcessProject) !== true
                            ? this.listProcessProject.length
                            : 0;
                    this.isLoading_Filter = false;
                } else {
                    this.listProcessProject = [];
                    this.isLoading_Filter = false;
                }
            });
    }

    openNew() {
        this.newPrcsDialog = true;
    }
    openEdit() {}
    openDelete() {
        {
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

    GetLanguage(key: string) {
        return Helper.GetLanguage(key);
    }
}
