import {
    Component,
    Output,
    Input,
    EventEmitter,
    SimpleChanges,
} from '@angular/core';
import { EmployeesService } from 'src/app/web/service/employees.service';
import { EnumLocalStorage, EnumStatus, EnumSystem } from 'src/app/Core/_enum';
import { EncryptDecryptService } from 'src/app/Service/encrypt-decrypt.service';

@Component({
    selector: 'app-control-employee-type',
    templateUrl: './control-employee-type.component.html',
    styleUrls: ['./control-employee-type.component.scss'],
})
export class ControlEmployeeComponent {
    constructor(
        private _service: EmployeesService,
        private edService: EncryptDecryptService) { }
    isLoadForm = 1;
    selectedEmployeeType: any;
    listEmployeeType: any;

    @Output() outValue = new EventEmitter<string>();
    @Output() newItemParent = new EventEmitter<string>();

    @Input() placeholder: any = 'Select a Employee Type';

    @Input() itemEmployeeType!: number;
    @Input() displayControl: boolean = false;

    nameEmployeeType: string = 'Select a Employee Type';

    LoadData() {
        try {
            this.loadUser();

            this.isLoadForm = 1;
            this._service.ewo_GetEmployeeType().subscribe((data: any) => {
                this.listEmployeeType = [];
                this.isLoadForm = 0;
                if (data.result == EnumStatus.ok) {

                    if (this.userProfile.employee_type_id != 1) {
                        data.data = data.data.filter((item: any) => item.employee_type_id != 1);
                    }

                    data.data.forEach((element: any) => {

                        this.listEmployeeType.push({
                            Id: element.employee_type_id,
                            Name:
                                '[' +
                                element.employee_type_id +
                                '] - ' +
                                ' ' +
                                element.employee_type_code +
                                ' - ' +
                                element.employee_type_name +
                                ' - ' +
                                element.company +
                                ' - ' +
                                element.level,
                            role: element.role,
                            company: element.company,
                            level: element.level,
                            parent: element.parent,
                        });

                    });



                    if (this.itemEmployeeType > 0) {
                        this.selectedEmployeeType =
                            this.listEmployeeType.filter(
                                (item: any) => item.Id == this.itemEmployeeType
                            )[0];

                        this.newItemParent.emit(
                            this.selectedEmployeeType.parent
                        );
                    } else {
                        this.selectedEmployeeType = '';
                        this.newItemParent.emit('');
                    }
                }
            });
        } catch (error) { }
    }
    ngOnInit(): void {
        this.LoadData();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['itemEmployeeType']) {
            this.LoadData();
        }
    }

    onMouseMove(event: MouseEvent): void { }

    returnValue(value: any) {
        this.outValue.emit(value);
    }

    user_profile: string = 'current';
    currentUser: any
    userProfile: any
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

}
