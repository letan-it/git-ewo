import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

import { Helper } from 'src/app/Core/_helper';
import { EnumLocalStorage } from 'src/app/Core/_enum';

// Services
import { MastersService } from 'src/app/web/service/masters.service';
import { ExportService } from 'src/app/web/service/export.service';
import { EncryptDecryptService } from 'src/app/Service/encrypt-decrypt.service';
import { ConfirmationService, Message, MessageService } from 'primeng/api';
import { EnumStatus } from 'src/app/Core/_enum';
import { Pf } from 'src/app/_helpers/pf';

@Component({
    selector: 'app-log-file',
    templateUrl: './master-status.component.html',
    providers: []
})
export class MasterStatusComponent implements OnInit {
    @Input() itemEmployeeProject!: number;

    messages: Message[] | undefined;

    checkedIdNotNegative: boolean = false;
    checkedSpaceListCode: boolean = false;
    checkedSpaceCode: boolean = false;
    checkedOrdersNotNegative: boolean = false;
    checkedNumber: boolean = false;
    checkSpaceTable: boolean = false;

    newStatusDialog: boolean = false;
    editStatusDialog: boolean = false;
    cloneDialog: boolean = false;

    submitted: boolean = false;
    editSubmitted: boolean = false;
    statusCheckbox: any = document.getElementById("checkbox")?.style.display;
    action: any;

    constructor(
        private _service: MastersService,
        private _exportService: ExportService,
        private edService: EncryptDecryptService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private router: Router,
    ) { }

    items_menu: any = [
        { label: ' MASTER' },
        {
            label: '  Master Status',
            icon: 'pi pi-list',
        }
    ];
    home: any = { icon: 'pi pi-chart-bar', routerLink: '/dashboard' };
    menu_id = 90;
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

    filterProject: any;
    filterProjects: any = [];
    editProjectId: any;
    editProjectCode: any;
    editProjectName: any;
    editInfoProject: any;
    selectedFilterProject(e: any) {
        console.log(e);
        this.filterProject = e.value === null ? 0 : e.value.Id;
    }

    fromProjects: any = [];
    toProjects: any = [];
    selectedFromProjects: any;
    selectedToProjects: any;

    // List Code
    reportListCode: any;
    filterListCode: any = '';
    editListCode: any;
    deleteListCode: any;

    // Table
    reportTable: any = '';
    filterTable: any = '';
    editTable: any = '';
    deleteTable: any = '';

    // ID
    reportId: any;
    editId: any;
    deleteId: any;

    // ParentId
    reportParentId: any;
    editParentId: any = 0;
    deleteParentId: any = 0;

    // Code
    reportCode: any;
    filterCode: any = '';
    editCode: any = '';
    deleteCode: any = '';

    // nameVN
    reportNameVN: any = '';
    editNameVN: any = '';
    deleteNameVN: any = '';

    // nameEN
    reportNameEN: any = '';
    editNameEN: any = '';
    deleteNameEN: any = '';

    // Status
    reportStatus: any;
    filterStatus: any = -1;
    editStatus: any = -1;
    deleteStatus: any = -1;
    reportStatuses: any = [{ name: 'Active', value: 1, icon: 'pi pi-check-circle' }, { name: 'Inactive', value: 0, icon: 'pi pi-times-circle' }];
    filterStatuses: any = [{ name: 'Active', value: 1, icon: 'pi pi-check-circle' }, { name: 'Inactive', value: 0, icon: 'pi pi-times-circle' }];;
    editReportStatuses: any = [{ name: 'Active', value: 1, icon: 'pi pi-check-circle' }, { name: 'Inactive', value: 0, icon: 'pi pi-times-circle' }];;
    // Status Selected
    selectedStatus(e: any) {
        this.reportStatus = e.value === null ? -1 : e.value;
    }
    selectedFilterStatus(e: any) {
        this.filterStatus = e.value === null ? -1 : e.value;
    }
    selectedEditStatus(e: any) {
        this.editStatus = e.value === null ? -1 : e.value;
    }

    // Orders
    reportOrders: any;
    editOrders: any = 0;
    deleteOrders: any = 0;

    // Values
    reportValues: any = '';
    editValues: any = '';
    deleteValues: any = '';

    // TypeValues
    reportTypeValues: any = '';
    editTypeValues: any = '';
    deleteTypeValues: any = '';

    // Clear
    filterStatusType: any = "";
    statusType: any = ""
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
        this.reportStatus = -1;
    }

    products: any;

    ngOnInit() {
        this.products = Array.from({ length: 20 }).map((_, i) => `Item #${i}`);
        this.check_permissions();
        this.messages = [
            { severity: 'error', summary: 'Error', detail: 'Error!!!' },
        ];
        this.LoadProjects();
        this.loadData(1);
        this.GetStatusForEachProject();
    }

    openNew() {
        this.newStatusDialog = true;
    }
    openEdit(
        ProjectId: any,
        ProjectCode: any,
        ProjectName: any,
        ListCode: any,
        Table: any,
        Id: any,
        ParentId: any,
        Code: any,
        NameVN: any,
        NameEN: any,
        Status: any,
        Orders: any,
        Values: any,
        TypeValues: any
    ) {
        this.editStatusDialog = true;

        this.editProjectId = ProjectId
        this.editProjectCode = ProjectCode
        this.editProjectName = ProjectName
        this.editInfoProject = `[${ProjectId}] - ${ProjectCode} - ${ProjectName}`

        this.editListCode = ListCode
        this.editTable = Table
        this.editId = Id
        this.editParentId = ParentId
        this.editCode = Code
        this.editNameVN = NameVN
        this.editNameEN = NameEN
        this.editStatus = Status
        this.editOrders = Orders
        this.editValues = Values
        this.editTypeValues = TypeValues
    }

    openDelete(
        ProjectId: any,
        ListCode: any,
        Table: any,
        Id: any,
        ParentId: any,
        Code: any,
        NameVN: any,
        NameEN: any,
        Status: any,
        Orders: any,
        Values: any,
        TypeValues: any,
        event: any
    ) {
        this.confirmationService.confirm({
            target: event.target as EventTarget,
            message: 'Are you sure you want to delete it?',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this._service.ewo_Masters_Action(
                    ProjectId,
                    ListCode,
                    Table,
                    Id,
                    ParentId,
                    Code,
                    NameVN,
                    NameEN,
                    Status,
                    Orders,
                    Values,
                    TypeValues,
                    this.action = 'delete')
                    .subscribe((data: any) => {
                        if (data.result == EnumStatus.ok) {
                            this.editStatusDialog = false;
                            this.editSubmitted = false;
                            this.loadData(1);

                            this.messageService.add({
                                severity: 'success',
                                summary: 'Delete Master Status successfully',
                                detail: '',
                            })
                        } else {
                            this.messageService.add({
                                severity: 'danger',
                                summary: 'Error! An error occurred. Please try again',
                                detail: '',
                            });
                        }
                    }
                    )
            },
            reject: () => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Rejected',
                    detail: 'You have rejected',
                });
            },
        });
    }

    resetNewInput() {
        this.reportStatus = "";
    }
    resetEditInput() {
        this.editTable = "";
        this.editParentId = "";
        this.editNameVN = "";
        this.editNameEN = "";
        this.editOrders = "";
        this.editValues = "";
        this.editTypeValues = "";
    }

    resetCloneInput() {
        this.toProject = "";
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
    listMasterStatus: any = [];
    selectedMasterStatus: any = [];

    selectedMasterStatusId: any = "";
    selectMasterStatusIds: any = [];

    checkVNAccent(value: any) {
        var format = /^[^\u00C0-\u1EF9]+$/i;
        return format.test(value);
    }
    checkSpace(value: any) {
        var format = /\s+/;
        return format.test(value);
    }

    onChangeInputListCode(event: any) {
        if (this.checkSpace(event) == true) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Please remove the first space in the List Code inputs!',
            });
        } else if (this.checkVNAccent(event) == false) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Please do not type accented Vietnamese'
            })
        } else if (this.checkSpace(event) == false && this.checkVNAccent(event) == true) {
            this.checkedSpaceListCode = true;
        }
    }

    loadData(pageNumber: number) {
        this.is_loadForm = 1;
        if (pageNumber == 1) {
            this.first = 0;
            this.totalRecords = 0;
            this._pageNumber = 1;
        }
        this.isLoading_Filter = true;
        this._service.ewo_Masters_GetList(
            this.filterProject === "" ? 12 : this.filterProject,
            this.filterListCode,
            this.filterTable,
            this.filterCode,
            this.filterStatus.value === undefined ? -1 : this.filterStatus.value
        ).subscribe((data: any) => {
            if (data.result == EnumStatus.ok) {
                this.listMasterStatus = data.data;
                this.totalRecords = Helper.IsNull(this.listMasterStatus) !== true ? this.listMasterStatus.length : 0;
                this.isLoading_Filter = false;
            } else {
                this.listMasterStatus = [];
                this.isLoading_Filter = false;
            }
        }
        )
    }

    saveNewStatus(event: Event) {
        this.submitted = true;

        if (this.filterProject === 0 && this.reportListCode === undefined && this.reportId === undefined && this.reportCode === undefined && this.reportStatus === undefined) {
            this.confirmationService.confirm({
                target: event.target as EventTarget,
                message: 'Please complete all information!',
                header: 'Error',
                icon: 'pi pi-exclamation-triangle',
                rejectButtonStyleClass: "p-button-text",
                accept: () => {
                    document.getElementById("projectId")?.focus()
                    close();
                },
                reject: () => {
                    close();
                }
            });
        } else if (this.filterProject === 0) {
            this.confirmationService.confirm({
                target: event.target as EventTarget,
                message: 'Please select Project',
                header: 'Error',
                icon: 'pi pi-exclamation-triangle',
                rejectButtonStyleClass: "p-button-text",
                accept: () => {
                    document.getElementById("reportStatusType")?.focus()
                    this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'You have accepted' });
                },
                reject: () => {
                    this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
                    close();
                }
            });
        } else if (this.reportListCode === undefined) {
            this.confirmationService.confirm({
                target: event.target as EventTarget,
                message: 'Please fill in List Code',
                header: 'Error',
                icon: 'pi pi-exclamation-triangle',
                rejectButtonStyleClass: "p-button-text",
                accept: () => {
                    document.getElementById("listCode")?.focus()
                    close();
                },
                reject: () => {
                    close();
                }
            });
        } else if (this.reportId === undefined) {
            this.confirmationService.confirm({
                target: event.target as EventTarget,
                message: 'Please fill in Id',
                header: 'Error',
                icon: 'pi pi-exclamation-triangle',
                rejectButtonStyleClass: "p-button-text",
                accept: () => {
                    document.getElementById("Id")?.focus()
                    close();
                },
                reject: () => {
                    close();
                }
            });
        } else if (this.reportCode === undefined) {
            this.confirmationService.confirm({
                target: event.target as EventTarget,
                message: 'Please fill in Code',
                header: 'Error',
                icon: 'pi pi-exclamation-triangle',
                rejectButtonStyleClass: "p-button-text",
                accept: () => {
                    document.getElementById("Code")?.focus()
                    close();
                },
                reject: () => {
                    close();
                }
            });
        } else if (this.reportStatus === undefined) {
            this.confirmationService.confirm({
                target: event.target as EventTarget,
                message: 'Please select Status',
                header: 'Error',
                icon: 'pi pi-exclamation-triangle',
                rejectButtonStyleClass: "p-button-text",
                accept: () => {
                    document.getElementById("Status")?.focus()
                    close();
                },
                reject: () => {
                    close();
                }
            });
        } else {
            this._service.ewo_Masters_Action(
                this.filterProject === undefined ? 12 : this.filterProject, // required
                this.reportListCode, // required // kh cách kh dấu
                this.reportTable === undefined ? null : this.reportTable,
                parseInt(this.reportId), // required // lớn hơn hoặc bằng 0
                this.reportParentId === undefined ? null : this.reportParentId,
                this.reportCode, // required
                this.reportNameVN === undefined ? null : this.reportNameVN,
                this.reportNameEN === undefined ? null : this.reportNameEN,
                this.reportStatus.value, // required
                parseInt(this.reportOrders),
                this.reportValues === undefined ? null : this.reportValues,
                this.reportTypeValues === undefined ? null : this.reportTypeValues,
                this.action = 'create')
                .subscribe((data: any) => {
                    if (data.result == EnumStatus.ok) {
                        this.newStatusDialog = false;
                        this.submitted = false;
                        this.loadData(1);

                        // clear value
                        this.filterProject = 0;
                        this.reportListCode = undefined;
                        this.reportTable = undefined;
                        this.reportId = undefined;
                        this.reportParentId = undefined;
                        this.reportCode = undefined;
                        this.reportNameVN = undefined;
                        this.reportNameEN = undefined;
                        this.reportStatus = undefined;
                        this.reportOrders = undefined;
                        this.reportValues = undefined;
                        this.reportTypeValues = undefined;

                        this.messageService.add({
                            severity: 'success',
                            summary: 'Add new Master Status successfully',
                            detail: '',
                        })
                    } else {
                        this.newStatusDialog = false;
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
        this._service.ewo_Masters_Action(
            this.editProjectId,
            this.editListCode,
            this.editTable === "" ? null : this.editTable,
            this.editId,
            this.editParentId === "" ? null : this.editParentId,
            this.editCode,
            this.editNameVN === "" ? null : this.editNameVN,
            this.editNameEN === "" ? null : this.editNameEN,
            this.editStatus === 0 || this.editStatus === 1 ? this.editStatus : this.editStatus.value,
            this.editOrders === "" ? null : this.editOrders,
            this.editValues === "" ? null : this.editValues,
            this.editTypeValues === "" ? null : this.editTypeValues,
            this.action = 'update')
            .subscribe((data: any) => {
                if (data.result == EnumStatus.ok) {
                    this.editStatusDialog = false;
                    this.editSubmitted = false;
                    this.loadData(1);

                    this.messageService.add({
                        severity: 'success',
                        summary: 'Edit Master Status successfully',
                        detail: '',
                    })
                } else {
                    this.messageService.add({
                        severity: 'danger',
                        summary: 'Error! An error occurred. Please try again',
                        detail: '',
                    });
                }
            }
            )
    }

    cloneStatus(event: Event) {
        console.log(event);
        if (this.selectedMasterStatus.length == 0) {
            return;
        }
        var clone_id = "";
        this.selectedMasterStatus.forEach((element: any) => {
            clone_id += element.RawId + " "
        });
        clone_id = clone_id.trim()
        if (this.toProject == undefined) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Please choose the project',
                detail: '',
            });
            return
        }

        let project_id_clone = this.toProject.Id;
        this._service.ewo_Masters_Clone_Audit(0, project_id_clone, clone_id).subscribe((data: any) => {
            if (data.result == EnumStatus.ok) {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Clone Report Status Successfully',
                    detail: '',
                })
                this.selectedMasterStatus = undefined
                this.toProject = undefined
                this.cloneDialog = false
            }
        })
    }

    export() {
        this._exportService.ewo_Master_RawData(
            Helper.ProjectID(),
            this.filterListCode,
            this.filterTable,
            this.filterCode,
            this.filterStatus
        )
    }

    clone() {
        if (this.selectedMasterStatus.length == 0) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Please select the report status you want to clone!',
                detail: '',
            })
        } else {
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
            console.log(this.currentUser);
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
                // this.fromProjects.push({
                //     Id: element.project_id,
                //     Image: element.image,
                //     Name:
                //         '[' +
                //         element.project_id +
                //         '] - ' +
                //         ' ' +
                //         element.project_code +
                //         ' - ' +
                //         element.project_name,
                // });
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
                    // this.selectedFromProjects = this.filterProjects.filter((item: any) => item.Id == this.itemEmployeeProject)[0];
                    this.selectedToProjects = this.filterProjects.filter((item: any) => item.Id == this.itemEmployeeProject)[0];
                } else {
                    this.selectedFromProjects = '';
                    this.selectedToProjects = '';
                }
            });
            this.isLoadForm = 0;

        } catch (error) { }
    }

    idProjectSelected: any[] = [];

    GetStatusForEachProject() {
        this.projectListId.map((item: any) => {
            this._service.ewo_Masters_GetList(item.project_id, "", "", "", -1).subscribe((data: any) => {
                this.idProjectSelected.push(...data.data);
            }, () => {
                console.log('Fail');
            }, () => {
                this.idProjectSelected;

            })
        })
    }
} 
