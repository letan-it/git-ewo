import { Component } from '@angular/core';
import {
    ConfirmEventType,
    ConfirmationService,
    MessageService,
} from 'primeng/api';
import { EnumStatus } from 'src/app/Core/_enum';
import { Helper } from 'src/app/Core/_helper';
import { Pf } from 'src/app/_helpers/pf';
import { AppComponent } from 'src/app/app.component';
import { ProductService } from 'src/app/web/service/product.service';
import { ShiftsService } from 'src/app/web/service/shifts.service';

@Component({
    selector: 'app-shift',
    templateUrl: './shift.component.html',
    styleUrls: ['./shift.component.scss'],
    providers: [ConfirmationService],
})
export class ShiftComponent {
    shiftDialog: boolean = false;

    shifts!: any[];

    shift!: any;

    selectedShifts!: any[] | null;

    submitted: boolean = false;

    statuses!: any[];
    action: any = 'create';

    constructor(
        private _service: ShiftsService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {}

    items_menu: any = [
        { label: ' MASTER' },
        { label: ' Shifts', icon: 'pi pi-calendar-minus' },
    ];
    home: any = { icon: 'pi pi-chart-bar', routerLink: '/dashboard' };

    ngOnInit() {
        this.type = [{ name: 'audit', code: 'audit' }];

        this.loadData();
    }

    showFiter: number = 1;
    ShowHideFiter() {
        if (this.showFiter == 1) {
            this.showFiter = 0;
        } else {
            this.showFiter = 1;
        }
    }

    shift_code: any = '';
    note: any = '';
    type: any = [];
    selectedType: any = '';
    isLoading_Filter: any = false;
    from_time: any = null;
    to_time: any = null;
    loadData() {
        console.log(
            '🚀 ~ file: shift.component.ts:66 ~ ShiftComponent ~ loadData ~ this.selectedType:',
            this.selectedType
        );

        this.isLoading_Filter = true;
        this._service
            .ewo_ATD_shifts_GetList(
                Helper.ProjectID(),
                this.shift_code,
                this.note,
                Helper.IsNull(this.selectedType) != true
                    ? this.selectedType.code
                    : null
            )
            .subscribe((data: any) => {
                if (data.result == EnumStatus.ok) {
                    this.shifts = data.data;
                    this.isLoading_Filter = false;
                } else {
                    this.shifts = [];
                    this.isLoading_Filter = false;
                }
            });
    }

    openNew() {
        this.shift = {};
        this.action = 'create';
        this.submitted = false;
        this.shiftDialog = true;
    }

    editShift(shift: any) {
        if (shift.from_time === null) {
            this.from_time = null;
            if (shift.to_time === null) {
                this.to_time = null;
            } else {
                this.to_time = new Date(shift.to_time);
            }
        } else if (shift.from_time !== null) {
            this.from_time = new Date(shift.from_time);
            if (shift.to_time === null) {
                this.to_time = null;
            } else {
                this.to_time = new Date(shift.to_time);
            }
        } 

        this.type.forEach((element: any) => {
            shift._type = shift.type == element.code ? element : null;
        });
        this.shift = { ...shift };
        this.action = 'update';
        this.shiftDialog = true;
    }

    deleteShift(shift: any) {
        this.confirmationService.confirm({
            message:
                'Are you sure you want to delete ' + shift.shift_code + '?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this._service
                    .ewo_ATD_shifts_Action(
                        Helper.ProjectID(),
                        shift.shift_id,
                        shift.shift_code,
                        shift.note,
                        shift.type,
                        'delete',
                        this.from_time,
                        this.to_time
                    )
                    .subscribe((data: any) => {
                        if (data.result == EnumStatus.ok) {
                            if (data.data.length > 0) {
                                this.NofiResult(
                                    `Page Shift`,
                                    `Delete work shifts`,
                                    `Successfully deleted work shift with code ${shift.shift_code}`,
                                    `success`,
                                    `Successfull`
                                );
                                this.clear(data.data);
                            } else {
                                this.clear([]);
                            }
                        }
                    });
            },
            reject: (type: any) => {
                switch (type) {
                    case ConfirmEventType.REJECT:
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Rejected',
                            detail: 'You have rejected',
                        });
                        break;
                    case ConfirmEventType.CANCEL:
                        this.messageService.add({
                            severity: 'warn',
                            summary: 'Cancelled',
                            detail: 'You have cancelled',
                        });
                        break;
                }
            },
        });
    }

    hideDialog() {
        this.shiftDialog = false;
        this.submitted = false;
        this.from_time = null;
        this.to_time = null;
    }

    saveShift() {
        this.submitted = true;
        let fromTime = new Date();
        let toTime = new Date();

        if (this.from_time != '') {
            fromTime = new Date(this.from_time);
        }
        if (this.to_time != '') {
            toTime = new Date(this.to_time);
        }
        if (
            this.action == 'create' &&
            this.NofiIsNull(this.shift.shift_code, 'shift code') == true
        ) {
            return;
        } else {
            this._service
                .ewo_ATD_shifts_Action(
                    Helper.ProjectID(),
                    this.action == 'create' ? 0 : this.shift.shift_id,
                    this.shift.shift_code,
                    Pf.checkSpace(this.shift.note) != true
                        ? null
                        : this.shift.note,
                    Helper.IsNull(this.shift._type) != true
                        ? this.shift._type.code
                        : null,
                    this.action,
                    this.from_time,
                    this.to_time
                )
                .subscribe((data: any) => {
                    if (data.result == EnumStatus.ok) {
                        this.NofiResult(
                            `Page Shift`,
                            this.action == `create`
                                ? `Create Shift`
                                : `Update Shift`,
                            this.action == `create`
                                ? `Successful shift work with information ( Shift Code : ${
                                      this.shift.shift_code
                                  }, Note : ${this.shift.note}, Type Shift : ${
                                      Helper.IsNull(this.shift._type) != true
                                          ? this.shift._type.code
                                          : null
                                  })`
                                : `Success update the information ( Note : ${
                                      this.shift.note
                                  }, Type Shift : ${
                                      Helper.IsNull(this.shift._type) != true
                                          ? this.shift._type.code
                                          : null
                                  } ) working shift with code is ${
                                      this.shift.shift_code
                                  }`,
                            'success',
                            'Successfull'
                        );

                        this.clear(data.data);
                    } else {
                        // this.NofiResult('Page Shift', '', '', 'error', 'Error');
                        this.clear(data.data);
                    }
                });
        }
    }

    clear(data: any) {
        // this.shifts = [...this.shifts];
        this.shifts = data;
        this.shiftDialog = false;
        this.shift = {};
        this.from_time = null;
        this.to_time = null;
    }

    NofiIsNull(value: any, name: any): any {
        if (
            Helper.IsNull(value) == true ||
            Pf.checkUnsignedCode(value) == true ||
            Pf.checkSpaceCode(value) == true ||
            Pf.CheckAccentedCharacters(value) == true
        ) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: 'Please enter a ' + name,
            });
            return 1;
        }
        return 0;
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
