import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { EnumLocalStorage, EnumStatus, EnumSystem } from 'src/app/Core/_enum';
import { Helper } from 'src/app/Core/_helper';
import { EncryptDecryptService } from 'src/app/Service/encrypt-decrypt.service';
import { FileService } from 'src/app/web/service/file.service';
import { TransactionsService } from 'src/app/web/service/transactions.service';
import { EmployeesService } from 'src/app/web/service/employees.service';
import { Pf } from 'src/app/_helpers/pf';
import { DatePipe } from '@angular/common';
import { NodeService } from 'src/app/web/service/node.service';
import { AppComponent } from 'src/app/app.component';

interface PageEvent {
    first: number;
    rows: number;
    page: number;
    pageCount: number;
}

@Component({
    selector: 'app-summary-leader',
    templateUrl: './summary-leader.component.html',
    styleUrls: ['./summary-leader.component.scss'],
})
export class SummaryLeaderComponent {
    constructor(
        private router: Router,
        private edService: EncryptDecryptService,
        private messageService: MessageService,
        private fileService: FileService,
        private _service: TransactionsService,
        private _serviceEmp: EmployeesService,
        private nodeService: NodeService
    ) { }

    first: number = 0;
    rows: number = 5;

    onPageChange(event: PageEvent) {
        this.first = event.first;
        this.rows = event.rows;
    }


    items_menu: any = [
        { label: ' TRANSACTION' },
        { label: ' summary', icon: 'pi pi-users' },
    ];
    menu_id = 75;
    check_permissions() {
        const menu = JSON.parse(localStorage.getItem('menu') + '')?.filter(
            (item: any) => item.menu_id == this.menu_id && item.check == 1
        );
        if (menu.length > 0) {
        } else {
            this.router.navigate(['/empty']);
        }
    }
    GetLanguage(key: string) {
        return Helper.GetLanguage(key);
    }
    home: any = { icon: 'pi pi-chart-bar', routerLink: '/' };
    project_id: any;
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
    ListLeader: any;
    transaction_item: any = [];
    transaction_item_employee: any = [];
    loadLeader() {
        this._serviceEmp
            .ewo_Employee_EmployeeType_GetList(this.project_id, '8', '', '', 0)
            .subscribe((data: any) => {
                if (data.result == EnumStatus.ok) {
                    this.ListLeader = data.data;
                }
            });
    }
    sidebarVisible: boolean = false;
    div_section: number = 1;
    listBarcode: any;
    openDetailBarcode(item: any) {
        this.div_section = 2;
        this._service
            .GET_product_barcode(this.project_id, item.employee_id, 'filter')
            .subscribe((data: any) => {
                if (data.result == EnumStatus.ok) {
                    this.listBarcode = data.data.summary;
                }
            });
    }
    employeeList: any = [];

    selectEmployee!: any;
    onSelectEmployee() {
        console.log(this.selectEmployee);
        this.openDetail_employee(this.selectEmployee.code);
    }
    openDetail_employee(item: any) {
        console.log(item);

        this.transaction_item_employee = undefined;

        this._service
            .Summary_InventoryByLeader(item, this.project_id)
            .subscribe((data: any) => {
                if (data.result == EnumStatus.ok) {
                    this.transaction_item_employee = data.data.summary;
                }
            });
    }
    openDetailEmployee(item: any) {
        this.div_section = 4;
        this._serviceEmp
            .ewo_GetEmployeeList(
                1000000,
                1,
                '',
                '', '',
                '',
                '',
                '',
                7,
                this.model_info.employee_id,
                this.project_id,
                -1,
                '',
                ''
            )
            .subscribe((data: any) => {
                if (data.result == EnumStatus.ok) {
                    this.employeeList = [];
                    console.log(data);
                    data.data.forEach((element: any) => {
                        this.employeeList.push({
                            name: `${element.employee_code} - ${element.employee_name}`,
                            code: element.employee_id,
                        });
                    });
                }
            });
    }
    dateStart: any | undefined;
    dateEnd: any | undefined;
    UUID: any;
    transaction_id: any;
    getFormatedDate(date: Date, format: string) {
        const datePipe = new DatePipe('en-US');
        return datePipe.transform(date, format);
    }
    list_nhan: any;
    list_gui: any;
    getSeverityStatus(value: any): any {
        switch (value) {
            case 'close':
                return 'warning';
            case 'draft':
                return 'help';
            case 'Done':
                return 'primary';
            case 'OK':
                return 'success';
            default:
                return 'danger';
        }
    }
    copyText(val: string) {
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
    div_transaction = 1;
    temp_rowData: any;
    ViewDetailTransaction(row: any, type: string) {
        this.temp_rowData = row;
        this.temp_rowData.type = type;
        this.div_transaction = 2;
        console.log(row);
        this._service
            .GET_Tractionsaction_detail(this.project_id, row.transaction_id)
            .subscribe((data: any) => {
                console.log(data);
                if (data.result == EnumStatus.ok) {
                    this.temp_rowData.file = data.data.transaction_file;
                    this.temp_rowData.history = data.data.transaction_history;
                    this.temp_rowData.product =
                        data.data.transaction_detail.filter(
                            (p: any) => p.item_type == 'PRODUCT'
                        );
                    this.temp_rowData.gift =
                        data.data.transaction_detail.filter(
                            (p: any) => p.item_type == 'GIFT'
                        );
                }
            });
    }
    backTransaction() {
        this.div_transaction = 1;
    }
    filterTransaction(item: any) {
        this.div_transaction = 1;
        var intDateStart = parseInt(Pf.StringDateToInt(this.dateStart));
        var intDateEnd = parseInt(Pf.StringDateToInt(this.dateEnd));
        if (isNaN(intDateStart)) {
            intDateStart = 0;
        }
        if (isNaN(intDateEnd)) {
            intDateEnd = 0;
        }

        this._service
            .GET_transactions(
                this.transaction_id ?? 0,
                this.UUID,
                0,
                item.employee_id,
                'EMPLOYEE',
                0,
                intDateStart,
                intDateEnd,
                -1,
                this.project_id,
                ''
            )
            .subscribe((nhan: any) => {
                if (nhan.result == EnumStatus.ok) {
                    this.list_nhan = undefined;
                    this.list_nhan = nhan.data.transaction.filter(
                        (i: any) => i.transaction_status > 1
                    );
                }
            });
        this._service
            .GET_transactions(
                this.transaction_id ?? 0,
                this.UUID,
                item.employee_id,
                0,
                'EMPLOYEE',
                0,
                intDateStart,
                intDateEnd,
                -1,
                this.project_id,
                ''
            )
            .subscribe((gui: any) => {
                if (gui.result == EnumStatus.ok) {
                    this.list_gui = undefined;

                    this.list_gui = gui.data.transaction.filter(
                        (i: any) => i.transaction_status > 1
                    );
                    console.log(this.list_gui);
                }
            });
    }
    checkTransaction(item: any) {
        this.div_section = 3;
        let newDate = new Date();
        this.dateEnd = this.getFormatedDate(newDate, 'YYYY-MM-dd');
        var dateObj = new Date();
        var month = dateObj.getUTCMonth(); //months from 1-12
        var year = dateObj.getUTCFullYear();
        newDate = new Date(year, month, 1);
        this.dateStart = this.getFormatedDate(newDate, 'YYYY-MM-dd');

        this.filterTransaction(item);
        // this._service.GET_transactions()
    }
    create_transaction(item: any) {
        localStorage.setItem('temp_leader', item.employee_id);
        console.log(this.userProfile.employee_type_id);

        if (this.userProfile.employee_type_id == 8) {
            this.router.navigate(['/transaction/transfer-sa']);
        }
        else {
            this.router.navigate(['/transaction/create']);
        }

    }
    //

    opensummary(item: any) {
        this.div_section = 1;
    }
    model_info: any;
    openDetail(item: any) {
        this.managerId = item.employee_id;
        this.transaction_item_employee = undefined;

        this.div_section = 1;
        this.sidebarVisible = true;

        this.model_info = item;
        this._service
            .Summary_InventoryByLeader(item.employee_id, this.project_id)
            .subscribe((data: any) => {
                if (data.result == EnumStatus.ok) {
                    this.transaction_item = data.data.summary;
                }
            });
    }
    id_page: any
    ngOnInit(): void {
        this.id_page = AppComponent.generateGuid()
        //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
        //Add 'implements OnInit' to the class.
        this.check_permissions();
        this.project_id = Helper.ProjectID();
        this.loadUser();
        this.loadLeader();
    }

    managerId: any;
    exportRawData() {
        this._service.transactions_Rawdata(
            Helper.ProjectID(),
            this.managerId
        )
    }
}
