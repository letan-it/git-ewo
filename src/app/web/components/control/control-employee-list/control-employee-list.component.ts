import {
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output,
    SimpleChanges,
} from '@angular/core';
import { log } from 'console';
import { EnumLocalStorage, EnumStatus } from 'src/app/Core/_enum';
import { Helper } from 'src/app/Core/_helper';
import { EncryptDecryptService } from 'src/app/Service/encrypt-decrypt.service';
import { EmployeesService } from 'src/app/web/service/employees.service';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-control-employee-list',
    templateUrl: './control-employee-list.component.html',
    styleUrls: ['./control-employee-list.component.scss'],
})
export class ControlEmployeeListComponent implements OnInit {
    constructor(
        private _service: EmployeesService,
        private edService: EncryptDecryptService
    ) {}
    selectEmployee: any;
    isLoadForm = 1;
    employeeList: any;
    @Input() placeholder: any = 'Select a Manager';
    @Input() employee_type_id: string = '2 3 4 5 8 9';
    @Input() company: any = '';
    @Input() level: any = '';
    @Input() role: number = 0;
    @Input() project_id: number = Helper.ProjectID();
    @Input() employee_id: number = 0;
    @Input() disabled: boolean = false;
    @Input() inputStyle: any = { minWidth: '100%', maxWidth: '150px' };
    @Input() multiSelect: boolean = false;
    @Input() filterStatus!: boolean;
    @Input() userLogin: any = {};

    @Output() outValue = new EventEmitter<string>();
    @Output() outClear = new EventEmitter<boolean>();

    @Input() itemManagerCode!: number;

    returnValue(value: any) {
        this.outValue.emit(value);
    }

    loadData() {
        this.isLoadForm = 1;
        try {
            try {
                if (
                    this.employee_type_id == '' ||
                    this.employee_type_id == null
                ) {
                    this.employee_type_id = '2 3 4 5 8 9';
                } 
            } catch (error) {}

            if (this.project_id == 0) {
                this.project_id = Helper.ProjectID();
            }
            this._service
                .ewo_Employee_EmployeeType_GetList(
                    this.project_id,
                    this.employee_type_id,
                    this.company,
                    this.level,
                    this.role
                )
                .subscribe((data: any) => {
                    this.isLoadForm = 0;
                    if (data.result == EnumStatus.ok) {
                        this.employeeList = [];

                        const result = data.data;
                        if (this.userLogin && this.userLogin?.employee_id > 0) {
                            this.employeeList.push({
                                name:
                                    '[' +
                                    this.userLogin.employee_id +
                                    '] - ' +
                                    this.userLogin.employee_code +
                                    ' - ' +
                                    this.userLogin.employee_name,

                                code: this.userLogin.employee_id,
                            });
                        }
                        for (let i = 0; i < result.length; i++) {
                            if (
                                this.employee_id != 0 &&
                                result[i].employee_id == this.employee_id
                            ) {
                                // i++;
                            } else {
                                this.employeeList.push({
                                    name:
                                        '[' +
                                        result[i].employee_id +
                                        '] - ' +
                                        result[i].employee_code +
                                        ' - ' +
                                        result[i].employee_name,

                                    code: result[i].employee_id,
                                });
                            }
                        } 
                        if (this.itemManagerCode > 0) {
                            this.selectEmployee = this.employeeList.filter(
                                (item: any) => item.code == this.itemManagerCode
                            )[0];
                            this.outValue.emit(this.selectEmployee);
                        } else {
                            this.selectEmployee = '';
                        }
                    }
                });
        } catch (error) {}
    }
    ngOnInit(): void {
        //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
        //Add 'implements OnInit' to the class.
        this.loadData();
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.loadData();
    }

    resetSelection() {
        this.selectEmployee = [];
        this.outClear.emit(true);
    }
}
