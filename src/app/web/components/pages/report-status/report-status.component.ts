import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

import { Helper } from 'src/app/Core/_helper';
import { EnumLocalStorage } from 'src/app/Core/_enum';

// Services
import { ReportsService } from 'src/app/web/service/reports.service';
import { ExportService } from 'src/app/web/service/export.service';
import { EncryptDecryptService } from 'src/app/Service/encrypt-decrypt.service';
import { ConfirmationService, Message, MessageService } from 'primeng/api';
import { EnumStatus } from 'src/app/Core/_enum';
import { Pf } from 'src/app/_helpers/pf';

@Component({
    selector: 'app-log-file',
    templateUrl: './report-status.component.html',
    providers: []
})
export class ReportStatusComponent implements OnInit {
    @Input() itemEmployeeProject!: number;

    messages: Message[] | undefined;

    OnlyNumberKeyFilter: RegExp = /^\d+$/;
    NotInCludeSpace: RegExp = /^\S+$/;
    IgnoreFirstWhiteSpace: RegExp = /\s+/;

    checkedSpaceName: boolean = false;
    checkedSpaceDesc: boolean = false;
    statusDialog: boolean = false;
    editStatusDialog: boolean = false;
    cloneDialog: boolean = false;

    submitted: boolean = false;
    editSubmitted: boolean = false;
    cloneSubmitted: boolean = false;
    statusCheckbox: any = document.getElementById("checkbox")?.style.display;

    action: any;
    constructor(
        private _service: ReportsService,
        private _exportService: ExportService,
        private edService: EncryptDecryptService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private router: Router,
    ) { }
    items_menu: any = [
        { label: ' MASTER' },
        {
            label: '  Report Status',
            icon: 'pi pi-list',
        },
    ];
    home: any = { icon: 'pi pi-chart-bar', routerLink: '/dashboard' };
    menu_id = 89;
    check_permissions() {
        const menu = JSON.parse(localStorage.getItem('menu') + '').filter(
            (item: any) => item.menu_id == this.menu_id && item.check == 1
        );
        if (menu.length > 0) {
        } else {
            this.router.navigate(['/empty']);
        }
    }

    // Clone Project
    isLoadForm = 1;
    currentUser: any;
    projectList: any;

    idStatusClone: any;
    codeStatusClone: any;
    nameStatusClone: any;
    fromProject!: any;
    toProject!: any;
    
    projectListId: any = [];
    filterProject: any = 0;
    filterProjects: any = [];
    editReportStatusProjectId: any;
    selectedFilterProject(e: any) {
        this.filterProject = e.value === null ? 0 : e.value;
    }
    
    fromProjects: any = [];
    toProjects: any = [];

    selectedFromProjects: any;
    selectedToProjects: any;

    // ID
    reportStatusId: number = 0;
    editReportStatusId: any;

    // Status Type
    statusType: any = '';
    filterStatusType: any = '';
    editReportStatusType: any = '';
    reportStatusTypes: any = [{ name: 'Thành công', code: 'TC' }, { name: 'Không thành công', code: 'KTC' }];
    filterStatusTypes: any = [{ name: 'Thành công', code: 'TC' }, { name: 'Không thành công', code: 'KTC' }];
    editReportStatusTypes: any = [{ name: 'Thành công', code: 'TC' }, { name: 'Không thành công', code: 'KTC' }];
    // Status Type Selected
    selectedReportStatusType(e: any) {
        this.statusType = e.value === null ? "" : e.value;
        this.focusStatusType = false;
    }
    selectedFilterReportStatusType(e: any) {
        this.filterStatusType = e.value === null ? "" : e.value;
    }
    selectedEditReportStatusType(e: any) {
        this.editReportStatusType = e.value === null ? "" : e.value;
    }
    
    // Name
    reportStatusName: any = '';
    filterStatusName: any = '';
    editReportStatusName: any = '';

    // Status
    status: any = "";
    filterStatus: any = -1;
    editReportStatus: any = -1;
    statuses: any = [{ name: 'Active', value: 1, icon: 'pi pi-check-circle' }, { name: 'Inactive', value: 0, icon: 'pi pi-times-circle' }];
    filterStatuses: any = [{ name: 'Active', value: 1, icon: 'pi pi-check-circle' }, { name: 'Inactive', value: 0, icon: 'pi pi-times-circle' }];;
    editReportStatuses: any = [{ name: 'Active', value: 1, icon: 'pi pi-check-circle' }, { name: 'Inactive', value: 0, icon: 'pi pi-times-circle' }];;
    // Status Selected
    selectedStatus(e: any) {
        this.status = e.value === null ? -1 : e.value;
        this.focusStatus = false;
    }
    selectedFilterStatus(e: any) {
        this.filterStatus = e.value === null ? -1 : e.value;
    }
    selectedEditStatus(e: any) {
        this.editReportStatus = e.value === null ? -1 : e.value;
    }

    // Description
    reportStatusDesc: any = '';
    filterStatusDesc: any = '';
    editReportStatusDesc: any = '';

    // Order
    reportStatusOrder: any;
    editReportStatusOrder: any;

    // Color
    color: any = '';
    editReportStatusColor: any;

    // Clear
    clearFilterType() {
        this.filterStatusType = "";
    }
    clearType() {
        this.statusType = "";
    }
    clearFilterStatus() {
        this.filterStatus = -1;
    }
    clearStatus() {
        this.status = "";
    }

    // Handle Date
    date: any = null;
    created_date_int: any = null;
    getDate() {
        let today = new Date();
        this.date = new Date(today);
        this.setDate(this.date);
    }
    setDate(date: any) {
        if (Helper.IsNull(date) != true) {
            this.created_date_int = Helper.convertDate(new Date(date))
            this.created_date_int = Helper.transformDateInt(new Date(this.created_date_int))
        } else {
            this.created_date_int = null;
        }
    }

    products: any;

    ngOnInit() {
        this.products = Array.from({ length: 20 }).map((_, i) => `Item #${i}`);
        this.check_permissions();
        this.messages = [
            { severity: 'error', summary: 'Error', detail: 'Error!!!' },
        ];
        this.LoadProjects();
        this.GetStatusForEachProject();
        this.loadData(1);
    }

    openNew() {
        this.statusDialog = true;
    }
    openEdit(editStatusId: any, editProjectId: any, editStatus: any, editStatusType: any, editStatusName: any, editStatusDesc: any, editStatusOrder: number, editStatusColor: any) {
        this.editStatusDialog = true;
        this.editReportStatusId = editStatusId;
        this.editReportStatusProjectId = editProjectId;
        this.editReportStatus = editStatus;
        this.editReportStatusType = editStatusType;
        this.editReportStatusName = editStatusName;
        this.editReportStatusDesc = editStatusDesc;
        this.editReportStatusOrder = editStatusOrder;
        this.editReportStatusColor = editStatusColor;
    }

    resetInput() {
        this.statusType = "";
        this.status = "";
        this.reportStatusName = "";
        this.reportStatusDesc = "";
        this.reportStatusOrder = "";
        this.color = "";
    }
    resetEditInput() {
        this.editReportStatusDesc = "";
        this.editReportStatusOrder = "";
        this.editReportStatusColor = "";
    }

    resetCloneInput() {
        this.toProject = "";
    }

    hideEditDialog() {
        this.editStatusDialog = false;
        this.editSubmitted = false;
    }

    is_loadForm: number = 0;

    first: number = 0;
    totalRecords: number = 0;
    rows: number = 20;
    _pageNumber: number = 1;

    onPageChange(event: any) {
        this.first = event.first;
        this.rows = event.rows;
    }

    isLoading_Filter: any = false;
    listReportStatus: any = [];
    selectedReportStatus: any = [];

    selectedReportStatusId: any = "";
    selectReportStatusIds: any = [];
    selectReportStatusId(event: any) {}

    onChangeInputName(event: any) {
       this.editReportStatusName = event;
    }

    focusStatus = false;
    focusStatusType = false;

    loadData(pageNumber: number) {
        this.first = 0;
        if (pageNumber == 1) {
            this.first = 0;
            this.totalRecords = 0;
            this._pageNumber = 1;
        }
        this.isLoading_Filter = true;

        this._service.ewo_Report_Status_GetList(
            this.filterProject.Id === undefined ? 0 : this.filterProject.Id,
            this.filterStatusType.code === undefined ? "" : this.filterStatusType.code,
            this.filterStatusName,
            this.filterStatusDesc,
            this.filterStatus.value === undefined ? -1 : this.filterStatus.value
        ).subscribe((data: any) => {
            if (data.result == EnumStatus.ok) {
                this.listReportStatus = data.data;
                this.totalRecords = Helper.IsNull(this.listReportStatus) !== true ? this.listReportStatus.length : 0;
                this.isLoading_Filter = false;
            } else {
                this.listReportStatus = [];
                this.isLoading_Filter = false;
            }
        }
        )
    }

    saveNewStatus(event: Event) {
        this.submitted = true;
        if (this.statusType === "" && this.status === "" && this.reportStatusName === "") {
            this.confirmationService.confirm({
                target: event.target as EventTarget,
                message: 'Please complete all information!',
                header: 'Error',
                icon: 'pi pi-exclamation-triangle',
                rejectButtonStyleClass: "p-button-text",
                accept: () => {
                    // this.focusStatus = true;
                    document.getElementById("status")?.focus()
                    close();
                },
                reject: () => {
                    this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
                    this.statusDialog = false;
                }
            });
        } else if (this.statusType === "") {
            this.confirmationService.confirm({
                target: event.target as EventTarget,
                message: 'Please select Status Type',
                header: 'Error',
                icon: 'pi pi-exclamation-triangle',
                rejectButtonStyleClass: "p-button-text",
                accept: () => {
                    document.getElementById("reportStatusType")?.focus()
                    close();
                },
                reject: () => {
                    this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
                    this.statusDialog = false;
                }
            });
        } else if (this.status === "") {
            this.confirmationService.confirm({
                target: event.target as EventTarget,
                message: 'Please select Status',
                header: 'Error',
                icon: 'pi pi-exclamation-triangle',
                rejectButtonStyleClass: "p-button-text",
                accept: () => {
                    document.getElementById("status")?.focus()
                    close();
                },
                reject: () => {                    
                    this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
                    this.statusDialog = false;
                }
            });
        } else if (this.reportStatusName === "") {
            this.confirmationService.confirm({
                target: event.target as EventTarget,
                message: 'Please enter Report Status Name',
                header: 'Error',
                icon: 'pi pi-exclamation-triangle',
                rejectButtonStyleClass: "p-button-text",
                accept: () => {
                    document.getElementById("report_status_name")?.focus()
                    close();
                },
                reject: () => {
                    this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
                    this.statusDialog = false;
                }
            });
        } else {
            this._service.ewo_Report_Status_Action(
                this.filterProject.Id === undefined ? 12 : this.filterProject.Id,
                this.reportStatusId = this.action === 'create' ? 0 : this.reportStatusId,
                this.statusType.code,
                this.reportStatusName,
                this.reportStatusDesc === '' ? "" : this.reportStatusDesc,
                this.status.value,
                this.reportStatusOrder === '' ? "" : this.reportStatusOrder,
                this.color === '' ? "" : this.color,
                this.action = 'create')
                .subscribe((data: any) => {
                    if (data.result == EnumStatus.ok) {
                        this.statusDialog = false;
                        this.submitted = false;
                        this.loadData(1);

                        // this.statusType = "";
                        this.reportStatusName = "";
                        this.reportStatusDesc = "";
                        // this.status = -1;
                        this.reportStatusOrder = "";
                        this.color = "";

                        this.messageService.add({
                            severity: 'success',
                            summary: 'Add new Status successfully',
                            detail: '',
                        })
                    } else {
                        this.messageService.add({
                            severity: 'danger',
                            summary: 'Error',
                            detail: '',
                        });
                    }
                }
            )
        }
    }
    
    saveEditStatus(event: Event) {
        this.editSubmitted = true;
        if (this.editReportStatusName === "") {
            this.confirmationService.confirm({
                target: event.target as EventTarget,
                message: 'Please enter Report Status Name',
                header: 'Error',
                icon: 'pi pi-exclamation-triangle',
                rejectButtonStyleClass: "p-button-text",
                accept: () => {
                    document.getElementById("report_status_name")?.focus()
                    close();
                },
                reject: () => {
                    close();
                }
            });
        } else {
            this._service.ewo_Report_Status_Action(
                this.editReportStatusProjectId,
                this.editReportStatusId,
                this.editReportStatusType === "TC" || this.editReportStatusType === "KTC" ? this.editReportStatusType : this.editReportStatusType.code,
                this.editReportStatusName,
                this.editReportStatusDesc === "" ? "" : this.editReportStatusDesc,
                this.editReportStatus === 0 || this.editReportStatus === 1 ? this.editReportStatus : this.editReportStatus.value,
                this.editReportStatusOrder === null ? 0 : this.editReportStatusOrder,
                this.editReportStatusColor === "" ? "" : this.editReportStatusColor,
                this.action = 'update')
                .subscribe((data: any) => {
                    if (data.result == EnumStatus.ok) {
                        this.editStatusDialog = false;
                        this.editSubmitted = false;
                        this.loadData(1);

                        this.messageService.add({
                            severity: 'success',
                            summary: 'Edit Status successfully',
                            detail: '',
                        })
                    } else {
                        this.messageService.add({
                            severity: 'warn',
                            summary: 'Error! An error occurred. Please try again',
                            detail: '',
                        });
                    }
                }
            )
        }
    }

    cloneStatus(event: Event) {
        if(this.selectedReportStatus.length == 0){
            return;
        }
        var clone_id = "";
        this.selectedReportStatus.forEach((element:any) => {
            clone_id += element.report_status_id + " "
        });
        clone_id = clone_id.trim()
        if(this.toProject == undefined){
            this.messageService.add({
                severity: 'warn',
                summary: 'Please choose the project',
                detail: '',
            });
            return
        }

        let project_id_clone = this.toProject.Id;
        
        this._service.ewo_Report_Status_Clone_Audit(0,project_id_clone,clone_id).subscribe((data:any)=>{
            if (data.result == EnumStatus.ok) {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Clone Report Status Successfully',
                    detail: '',
                })
                this.selectedReportStatus = undefined
                this.toProject = undefined
                this.cloneDialog = false
            }
        })
    }

    export() {
        this._exportService.ewo_Report_Status_RawData(
            this.filterProject.Id === undefined ? 0 : this.filterProject.Id,
            this.filterStatusType,
            this.filterStatusName,
            this.filterStatusDesc,
            this.filterStatus
        )
    }

    OpenModalClone() {
        if(this.selectedReportStatus.length == 0){
           this.messageService.add({
                severity: 'warn',
                summary: 'Please select the report status you want to clone!',
                detail: '',
            })
        } 
        else
        {
            this.cloneDialog = true;     
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

    NofiIsNull(value: any, name: any): any {
        if (
            Helper.IsNull(value) == true ||
            Pf.checkUnsignedCode(value) == true ||
            Pf.checkSpaceCode(value) == true ||
            Pf.CheckAccentedCharacters(value) == true) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: 'Please enter a ' + name,
            });
            return 1;
        }
        return 0;
    }

    handleCopy(text: string) {
        let input = document.createElement('input');
        document.body.appendChild(input);
        input.value = text;
        input.select();
        document.execCommand('copy');
        input.remove();

        this.messageService.add({
            severity: 'success',
            summary: 'Copy success'
        })
    }

    LoadProjects() {
        try {
            this.isLoadForm = 1;
            let _u = localStorage.getItem(EnumLocalStorage.user);

            this.currentUser = JSON.parse(
                this.edService.decryptUsingAES256(_u)
            );
            this.projectList = this.currentUser.projects;
            this.projectList = this.projectList.map((item: any) => ({
                ...item,
                checked: false,
            }));

            this.projectListId = [];
            this.filterProjects = [];
            this.fromProjects = [];
            this.toProjects = [];

            this.projectList.forEach((element: any) => {
                this.projectListId.push({
                    project_id: element.project_id
                });
                this.filterProjects.push({
                    Id: element.project_id,
                    Image: element.image,
                    Name:
                        '[' +
                        element.project_id +
                        '] - ' +
                        ' ' +
                        element.project_code +
                        ' - ' +
                        element.project_name,
                });
                this.fromProjects.push({
                    Id: element.project_id,
                    Image: element.image,
                    Name:
                        '[' +
                        element.project_id +
                        '] - ' +
                        ' ' +
                        element.project_code +
                        ' - ' +
                        element.project_name,
                });
                this.toProjects.push({
                    Id: element.project_id,
                    Image: element.image,
                    Name:
                        '[' +
                        element.project_id +
                        '] - ' +
                        ' ' +
                        element.project_code +
                        ' - ' +
                        element.project_name,
                });

                if (this.itemEmployeeProject > 0) {
                    this.selectedFilterProject = this.filterProjects.filter((item: any) => item.Id == this.itemEmployeeProject)[0];
                    this.selectedFromProjects = this.filterProjects.filter((item: any) => item.Id == this.itemEmployeeProject)[0];
                    this.selectedToProjects = this.filterProjects.filter((item: any) => item.Id == this.itemEmployeeProject)[0];
                } else {
                    this.selectedFromProjects = '';
                    this.selectedToProjects = '';
                }
            });
            this.isLoadForm = 0;
        } catch (error) {}
    }

    idProjectSelected: any[] = [];

    GetStatusForEachProject() {
        this.projectListId.map((item: any) => {
            this._service.ewo_Report_Status_GetList(item.project_id, "", "", "", -1).subscribe((data: any) => {
                this.idProjectSelected.push(...data.data);
            }, () => {
                console.log('Fail');
            }, () => {
                this.idProjectSelected;
            }) 
        })
    }
} ;