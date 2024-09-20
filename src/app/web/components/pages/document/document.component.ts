import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ConfirmationService, MessageService } from 'primeng/api';
import { EnumStatus } from 'src/app/Core/_enum';
import { Helper } from 'src/app/Core/_helper';
import { DocumentService } from 'src/app/web/service/document.service';
import { Pf } from 'src/app/_helpers/pf';
import { AppComponent } from 'src/app/app.component';

@Component({
    selector: 'app-document',
    templateUrl: './document.component.html',
    styleUrls: ['./document.component.scss'],
    providers: [ConfirmationService, MessageService],
})
export class DocumentComponent {
    constructor(
        private _service: DocumentService,
        private router: Router,
        private http: HttpClient,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {}

    items_menu: any = [
        { label: ' MASTER' },
        { label: ' Documents ', icon: 'pi pi-book' },
    ];
    home: any = { icon: 'pi pi-chart-bar', routerLink: '/dashboard' };
    menu_id = 133;

    check_permissions() {
        const menu = JSON.parse(localStorage.getItem('menu') + '').filter(
            (item: any) => item.menu_id == this.menu_id && item.check == 1
        );
        if (menu.length > 0) {
        } else {
            this.router.navigate(['/empty']);
        }
    }

    group_code: any = null;
    file_group: any = null;
    file_name: any = null;

    showFilter: number = 1;
    ShowHideFilter() {
        if (this.showFilter == 1) {
            this.showFilter = 0;
        } else {
            this.showFilter = 1;
        }
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

    project_id: any = Helper.ProjectID();
    ngOnInit(): void {
        this.check_permissions();
        this.loadData(1);
    }
    first: number = 0;
    totalRecords: number = 0;
    rows: number = 20;
    _pageNumber: number = 1;

    onPageChange(event: any) {
        this.first = event.first;
        this.rows = event.rows;
        this._pageNumber = (this.first + this.rows) / this.rows;
        this.loadData(this._pageNumber);
    }

    isLoading_Filter: any = false;
    listDocuments: any = [];

    loadData(pageNumber: number) {
        if (pageNumber == 1) {
            this.first = 0;
            this.totalRecords = 0;
            this._pageNumber = 1;
        }
        this.isLoading_Filter = true;
        this._service
            .Documents_GetList(
                this.rows,
                pageNumber,
                Helper.ProjectID(),
                this.group_code,
                this.file_group,
                this.file_name,
                Helper.IsNull(this.employee_id) != true
                    ? this.employee_id
                    : null,
                this.status
                //    (Helper.IsNullTypeNumber(this.status)) != true ? this.status : -1 )
            )
            .subscribe((data: any) => {
                if (data.result == EnumStatus.ok) {
                    this.listDocuments = data.data;
                    this.listDocuments = this.listDocuments.map(
                        (item: any) => ({
                            ...item,
                            create: `[${item.created_by}] - ${item.created_code} - ${item.created_name}`,
                            _group: `[${this.checkNull(
                                item.group_code
                            )}] ${this.fillText(
                                item.file_group
                            )} ${this.checkNull(item.file_group)}`,
                            _status: item.status == 1 ? true : false,
                        })
                    );
                    this.totalRecords =
                        Helper.IsNull(this.listDocuments) != true
                            ? this.listDocuments[0].TotalRows
                            : 0;
                    this.isLoading_Filter = false;
                } else {
                    this.listDocuments = [];
                    this.isLoading_Filter = false;
                }
            });
    }

    create() {}
    readData(event: any) {
        if (event.check == true) {
            this.config_model_details = false;
            this.NofiResult(
                'Page Document',
                event.action + ' document',
                event.action + ' document successfull',
                'success',
                'Successfull'
            );
            this.loadData(1);
        }
    }

    from_date: any = null;
    to_date: any = null;
    employeeListFile: any = [];
    config_model_File: boolean = false;
    config_model_details: boolean = false;
    employee_list: any = '';

    date: any = null;
    rangeDates: any = [];
    minDate: any = null;
    maxDate: any = null;
    start: any = null;
    startDate: any = null;
    endDate: any = null;
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
        // this.itemDate = null;

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
            }
        }
    }

    file: any = [];
    showEmpFileModal(item: any, isNoti?: number) {
        this.clearDataEmpFile();
        this.file = item;
        this.content = '';
        if (isNoti == 1) {
            this.content = `Bạn có 1 tài liệu mới ${this.file.file_name}`;
        }
        isNoti ? this.processEmpFile(item, 1) : this.processEmpFile(item);
    }
    notiModal = false;
    notiList = [];
    content = '';
    employeeIdList = '';
    pushNoti(event: any) {
        const today = new Date();
        const formattedDate =
            today.getFullYear().toString() +
            (today.getMonth() + 1).toString().padStart(2, '0') +
            today.getDate().toString().padStart(2, '0');

        if (this.notiList.length > 0) {
            this.notiList.forEach((e: any) => {
                let tmp = 0;
                if (
                    e.from_date <= formattedDate &&
                    (!e.to_date || formattedDate <= e.to_date)
                ) {
                    tmp = e.employee_id;
                    if (tmp && tmp > 0) {
                        if (this.employeeIdList == '') {
                            this.employeeIdList = tmp.toString();
                        } else {
                            this.employeeIdList += ' ' + tmp;
                        }
                    }
                }
            });
            this.confirmationService.confirm({
                target: event.target as EventTarget,
                message: `Bạn có muốn gửi thông báo ?`,
                icon: 'pi pi-exclamation-triangle',
                accept: () => {
                    this._service
                        .Document_pushNotification(
                            Helper.ProjectID(),
                            this.employeeIdList,
                            'document',
                            'Thông báo document',
                            this.content
                                ? this.content
                                : `Bạn có 1 tài liệu mới ${this.file.file_name} `,
                            '',
                            'WEB'
                        )
                        .subscribe((data: any) => {
                            if (data.result == EnumStatus.ok) {
                                this.NofiResult(
                                    'Page Document',
                                    ' document',
                                    ' document successfull',
                                    'success',
                                    'Successfull'
                                );
                                this.notiList = [];
                                this.notiModal = false;
                            }
                        });
                },
                reject: () => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Rejected',
                        detail: 'You have rejected',
                        life: 3000,
                    });
                },
            });
        } else {
            this.messageService.add({
                severity: 'error',
                summary: 'Empty',
                detail: 'You have not selected an employee yet',
                life: 3000,
            });
        }
    }
    processEmpFile(item: any, isNoti?: number) {
        this.processDate();
        this._service
            .Document_employees_GetList(
                10000000,
                1,
                Helper.ProjectID(),
                item.file_id,
                this.employee_list,
                this.startDate,
                this.endDate
            )
            .subscribe((data: any) => {
                if (data.result == EnumStatus.ok) {
                    this.employeeListFile = data.data;
                    this.employeeListFile = this.employeeListFile.map(
                        (item: any) => ({
                            ...item,
                            _date: `${Helper.convertDateStr1(
                                item.from_date
                            )} ${this.fillText(
                                item.to_date
                            )} ${this.checkNullDate(item.to_date)}`,
                        })
                    );
                    const today = new Date();
                    const formattedDate =
                        today.getFullYear().toString() +
                        (today.getMonth() + 1).toString().padStart(2, '0') +
                        today.getDate().toString().padStart(2, '0');
                    this.employeeListFile.forEach((e: any) => {
                        if (
                            e.from_date <= formattedDate &&
                            (!e.to_date || formattedDate <= e.to_date)
                        ) {
                            e.isNotifi = true;
                        } else {
                            e.isNotifi = false;
                        }
                    });
                    if (isNoti == 1) this.notiModal = true;
                    else this.config_model_File = true;
                }
            });
    }
    details: any = [];
    action: any = 'create';
    showDetailsModal(item: any, action: any) {
        this.action = action;
        this.details = action == 'update' ? item : [];
        this.config_model_details = true;
    }

    fillText(value: any): any {
        return Helper.IsNull(value) != true ? '-' : '';
    }
    checkNullDate(value: any): any {
        return Helper.IsNull(value) != true
            ? Helper.convertDateStr1(value)
            : '';
    }
    processDate() {
        if (Helper.IsNull(this.rangeDates) != true) {
            if (Helper.IsNull(this.rangeDates[0]) != true) {
                this.startDate = Helper.transformDateInt(
                    new Date(this.rangeDates[0])
                );
            } else {
                this.startDate = null;
            }
            if (Helper.IsNull(this.rangeDates[1]) != true) {
                this.endDate = Helper.transformDateInt(
                    new Date(this.rangeDates[1])
                );
            } else {
                this.endDate = null;
            }
        }
    }
    checkNull(value: any): any {
        return Helper.IsNull(value) != true ? value : '';
    }

    confirm(event: Event, item: any) {
        this.confirmationService.confirm({
            target: event.target as EventTarget,
            message: 'Are you sure that you want to proceed?',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.Ondelete(item);
            },
            reject: () => {
                this.NofiMessage('error', 'Rejected', 'You have rejected');
            },
        });
    }

    Ondelete(item: any) {
        // console.log(
        //     'Ondelete DOCUMENT : ',
        //     Helper.ProjectID(),
        //     item.file_id,
        //     item.group_code,
        //     item.file_group,
        //     item.file_name,
        //     item.file_url,
        //     item.html_content,
        //     item.status,
        //     'delete'
        // );
        // return;
        this._service
            .Documents_Action(
                Helper.ProjectID(),
                item.file_id,
                item.group_code,
                item.file_group,
                item.file_name,
                item.file_url,
                item.html_content,
                item.status,
                'delete'
            )
            .subscribe((data: any) => {
                if (data.result == EnumStatus.ok) {
                    if (data.data == 1) {
                        this.NofiResult(
                            'Page Document',
                            'Delete document',
                            'Delete document successfull',
                            'success',
                            'Successfull'
                        );
                        this.loadData(this._pageNumber);
                    } else {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'Delete document error',
                        });
                        return;
                    }
                }
            });
    }

    confirmEmpFile(event: Event, item: any) {
        this.confirmationService.confirm({
            target: event.target as EventTarget,
            message: 'Are you sure that you want to proceed?',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.OndeleteEmpFile(item);
            },
            reject: () => {
                this.NofiMessage('error', 'Rejected', 'You have rejected');
            },
        });
    }
    NofiMessage(severity: any, summary: any, detail: any) {
        this.messageService.add({
            severity: severity,
            summary: summary,
            detail: detail,
            life: 3000,
        });
    }
    OndeleteEmpFile(item: any) {
        this._service
            .Document_employees_Action(
                Helper.ProjectID(),
                item.file_id,
                item.employee_code,
                item.from_date,
                item.to_date,
                'delete'
            )
            .subscribe((data: any) => {
                if (data.result == EnumStatus.ok) {
                    // this.employeeListFile = data.data
                    if (data.data == 1) {
                        this.NofiResult(
                            'Page Document',
                            'Remove employee to file',
                            'Remove employee to file successfull',
                            'success',
                            'Successfull'
                        );
                        // this.clearDataEmpFile();
                        this.showEmpFileModal(this.file);
                    }
                }
            });
    }

    confirmListEmp(event: Event) {
        this.confirmationService.confirm({
            target: event.target as EventTarget,
            message: 'Are you sure that you want to proceed?',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.OndeleteListEmp();
            },
            reject: () => {
                this.NofiMessage('error', 'Rejected', 'You have rejected');
            },
        });
    }

    OndeleteListEmp() {
        this.processDate();
        if (Helper.IsNull(this.startDate) == true) {
            this.startDate = 0;
        }
        if (this.NofiIsNull(this.employee_list, 'employee code list') == 1) {
            return;
        } else {
            this._service
                .Document_employees_Action(
                    Helper.ProjectID(),
                    this.file.file_id,
                    this.employee_list,
                    this.startDate,
                    this.to_date,
                    'delete'
                )
                .subscribe((data: any) => {
                    if (data.result == EnumStatus.ok) {
                        // this.employeeListFile = data.data
                        if (data.data == 1) {
                            this.NofiResult(
                                'Page Document',
                                'Remove employee to file',
                                'Remove employee to file successfull',
                                'success',
                                'Successfull'
                            );
                            // this.clearDataEmpFile();
                            this.showEmpFileModal(this.file);
                        }
                    }
                });
        }
    }

    FilterEmployeeFile() {
        this.processEmpFile(this.file);
    }

    UpdateEmployeeFile() {
        if (
            this.NofiIsNull(this.employee_list, 'employee code list') == 1 ||
            this.NofiIsNull(this.rangeDates, 'date') == 1 ||
            this.NofiIsNull(this.rangeDates[0], 'start date') == 1
        ) {
            return;
        } else {
            this.startDate = Helper.transformDateInt(
                new Date(this.rangeDates[0])
            );
            if (Helper.IsNull(this.rangeDates[1]) != true) {
                this.endDate = Helper.transformDateInt(
                    new Date(this.rangeDates[1])
                );
            }

            if (this.NofiIsNull(this.startDate, 'start date') == 1) {
                return;
            } else {
                this._service
                    .Document_employees_Action(
                        Helper.ProjectID(),
                        Helper.IsNull(this.file) != true
                            ? this.file.file_id
                            : 0,
                        this.employee_list,
                        this.startDate,
                        this.endDate,
                        'update'
                    )
                    .subscribe((data: any) => {
                        if (data.result == EnumStatus.ok) {
                            // this.employeeListFile = data.data
                            this.NofiResult(
                                'Page Document',
                                'Add employee list to file',
                                'Add employee list to file successfull',
                                'success',
                                'Successfull'
                            );
                            this.clearDataEmpFile();
                            this.showEmpFileModal(this.file);
                        }
                    });
            }
        }
    }
    clearDataEmpFile() {
        this.rangeDates = [];
        this.startDate = null;
        this.endDate = null;
        this.employee_list = '';
    }

    calculateFileTotal(name: string) {
        let total = 0;

        if (this.listDocuments) {
            for (let data of this.listDocuments) {
                if (data.file_group === name) {
                    total++;
                }
            }
        }

        return total;
    }

    status: any = -1;
    statuses: any = [
        {
            title: 'Active',
            value: 1,
        },
        {
            title: 'In Active',
            value: 0,
        },
    ];

    selectStatus(e: any) {
        this.status = e.value === null ? -1 : e.value;
    }
    getSeverity(value: any): any {
        switch (value) {
            case 0:
                return 'danger';
            case 1:
                return 'success';
            default:
                return 'warning';
        }
    }

    export() {
        this._service.Documents_RawData(
            100000000,
            1,
            Helper.ProjectID(),
            this.group_code,
            this.file_group,
            this.file_name,
            Helper.IsNull(this.employee_id) != true ? this.employee_id : null,
            this.status
        );
    }

    downloadFile(url: string, fileName: string) {
        this.http.get(url, { responseType: 'blob' }).subscribe((blob) => {
            const downloadURL = window.URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = downloadURL;
            link.download = fileName || this.getFileNameFromUrl(url);

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            window.URL.revokeObjectURL(downloadURL);
        });
    }

    private getFileNameFromUrl(url: string): string {
        return url.split('/').pop() || 'downloaded-file';
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

    convertDateStr(value: any): any {
        return Helper.convertDateStr(value);
    }
}
