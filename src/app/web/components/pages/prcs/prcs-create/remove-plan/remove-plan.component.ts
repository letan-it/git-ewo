import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { PrcsService } from '../../service/prcs.service';
import { WorkingPlansService } from 'src/app/web/service/working-plans.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { EncryptDecryptService } from 'src/app/Service/encrypt-decrypt.service';
import { EnumLocalStorage, EnumStatus } from 'src/app/Core/_enum';
import { AppComponent } from 'src/app/app.component';
import { Helper } from 'src/app/Core/_helper';
import { Pf } from 'src/app/_helpers/pf';
import { AtdPrcsService } from 'src/app/web/service/atd_prcs.service';

@Component({
    selector: 'app-remove-plan',
    templateUrl: './remove-plan.component.html',
    styleUrls: ['./remove-plan.component.scss'],
    providers: [DatePipe],
})
export class RemovePlanComponent {
    project_id: number = 0;
    employee_type_id: string = '2 3 4 5 7 8 9';

    menu_id = 112; // FOCUS TABLE MENU IN DATABASE
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

    items_menu: any = [
        { label: 'REQUEST ' },
        { label: ' Remove Plan ', icon: 'pi pi-file-export' },
    ];
    home: any = { icon: 'pi pi-chart-bar', routerLink: '/dashboard' };
    constructor(
        private router: Router,
        private _service: PrcsService,
        private prcService: AtdPrcsService,
        private workingPlansService: WorkingPlansService,
        private messageService: MessageService,
        private edService: EncryptDecryptService,
        private confirmationService: ConfirmationService
    ) {}

    currLanguage: any = localStorage.getItem('key_language');
    GetLanguage(key: string) {
        return Helper.GetLanguage(key);
    }

    screenWidth = window.innerWidth;
    openDialogDetailATDResult: boolean = false;

    selectMonth: any;
    item_ShopType: number = 0;
    selectStatus: any;
    shop_code: string = '';
    customer_shop_code: string = '';
    project_shop_code: string = '';

    // item_SS!: number;
    select_employee: any;
    listEmp: any = [];
    selectEmployee(event: any) {
        if (this.listEmp.length === 0) {
            this.listEmp.push(event.value.employee_id);
        } else if (this.listEmp.length === 2) {
            if (this.listEmp[0] === this.listEmp[1]) {
                this.listEmp.shift();
            } else if (this.listEmp[1] === event.value.employee_id) {
                return;
            } else {
                this.listEmp.shift();
                this.listEmp.push(event.value.employee_id);
            }
        } else {
            this.listEmp.push(event.value.employee_id);
        }

        this.select_employee = event.value != null ? event.value : 0;
    }
    // item_Province: any;
    // selectProvince(event: any) {
    //   this.item_Province = event != null ? event : 0;
    // }
    // item_District: any;
    // selectDistrict(event: any) {
    //   this.item_District = event != null ? event : 0;
    // }
    // item_Ward: any = 0;
    // selectWard(event: any) {
    //   this.item_Ward = event != null ? event : 0;
    // }
    // item_channel: number = 0;
    // selectedChannel(event: any) {
    //   this.item_channel = event != null ? event.code : 0;
    // }
    // item_ShopRouter: number = 0;
    // selectShopRouter(event: any) {
    //   this.item_ShopRouter = event != null ? event.code : 0;
    // }
    // item_ASM: number = 0;
    // selectASM(event: any) {
    //   this.item_ASM = event != null ? event.code : 0;
    // }
    // selectAddShift(event: any) {
    //   this.plan.shift = Helper.IsNull(event) != true ? event.code : null;
    // }

    currentUser: any;
    transaction_uuid = '';
    ngOnInit(): void {
        this.transaction_uuid = AppComponent.generateGuid();
        let newDate = new Date();
        this.PlanDate = this.getFormatedDate(newDate, 'YYYY-MM-dd');
        this.getMonth(newDate, 'MM');
        this.project_id = Helper.ProjectID();
        this.check_permissions();
        let _u = localStorage.getItem(EnumLocalStorage.user);
        this.currentUser = JSON.parse(
            this.edService.decryptUsingAES256(_u)
        ).employee[0];
        console.log(this.currentUser);
        this.setData();
        this.getDate();
        this.GetProcess();
        this.GetEmployeeList();

        this.screenWidth = window.innerWidth;
    }

    filter(page: number, event: any) {
        let old = this.listEmp[0];
        let current = this.select_employee.employee_id;

        if (this.registerRemovePlan.length > 0 && current !== old) {
            this.confirmationService.confirm({
                target: event.target as EventTarget,
                message:
                    'Nếu tiếp tục sẽ xóa hết thao tác trước đó,\nbạn vẫn muốn tiếp tục?',
                icon: 'pi pi-exclamation-triangle',
                accept: () => {
                    this.registerRemovePlan = [];
                    this.tempRegisterRemovePlan = [];
                    this.registerRemovePlanCount = 0;

                    this.transactionUuid = AppComponent.generateGuid();
                    this.filterTable(page);
                },
                reject: () => {
                    this.Config.employee_list.forEach((item: any) => {
                        if (item.employee_id === old) {
                            this.select_employee = item;
                        }
                    });
                },
            });
        } else {
            this.transactionUuid = AppComponent.generateGuid();
            this.filterTable(page);
        }
    }

    getFormatedDate(date: Date, format: string) {
        const datePipe = new DatePipe('en-US');
        return datePipe.transform(date, format);
    }

    PlanDate: any;
    PlanMonth: any = null;
    LastDayMonth: any;

    form_add_plan = 0;
    minDate: any = null;
    maxDate: any = null;
    startDate: any = null;
    endDate: any = null;
    getDate() {
        let today = new Date();
        let month = today.getMonth();
        let year = today.getFullYear();
        let prevMonth = month === 0 ? 11 : month - 1;
        let prevYear = prevMonth === 11 ? year - 1 : year;
        let nextMonth = month === 11 ? 0 : month + 1;
        let nextYear = nextMonth === 0 ? year + 1 : year;
        this.minDate = new Date();
        this.minDate.setDate(1);
        // this.minDate.setMonth(prevMonth);
        // this.minDate.setFullYear(prevYear);
        this.maxDate = new Date();
        this.maxDate.setDate(31);
        this.maxDate.setMonth(nextMonth);
        // this.maxDate.setMonth(nextMonth);
        // this.maxDate.setFullYear(nextYear);

        this.startDate = new Date();
        this.endDate = new Date();
        // this.plan.date[0] = new Date(this.startDate)
        // this.plan.date[1] = new Date(this.endDate)
    }

    date_plan_day: Date[] | undefined;
    date_plan_month!: Date;

    Config: any = {
        process: [],
        employee_list: [],
        shift_list: [],
        store_list: [],
        data_request: [],
    };

    // PrcGetprocess
    select_shop: any;
    selectedShop(event: any) {
        if (this.form_add_plan === 0) {
            // console.log("form_add_plan == 0");
            this.messageService.add({
                severity: 'error',
                summary: 'error',
                detail: 'Vui lòng chọn ngày tháng',
            });
        }
    }
    select_shift: any;
    check_time: boolean = false;
    from_time: any;
    to_time: any;
    GetProcess() {
        this._service.PrcGetprocess(this.project_id).subscribe((r: any) => {
            if (r.result == EnumStatus.ok) {
                this.Config.process = r.data.process_list.filter(
                    (i: any) => i.process_id == 3
                );
                this.Config.process.forEach((element: any) => {
                    try {
                        element.config = JSON.parse(element.config);
                        element.note_list = JSON.parse(element.note_list);
                    } catch (error) {}
                });
                this.Config.shift_list = r.data.shift_list;
                this.Config.process.forEach((element: any) => {
                    element.step = r.data.prc_process_by_step.filter(
                        (i: any) => i.Prc_id == element.Prc_id
                    );
                });
                // console.log('config', this.Config.process);
            }
        });
    }

    // PrcGetEmployeeList
    // select_employee: any;
    GetEmployeeList() {
        this._service
            .PrcGetEmployeeList(this.project_id)
            .subscribe((r: any) => {
                if (r.result == EnumStatus.ok) {
                    r.data.employee_list.forEach((item: any) => {
                        if (item.employee_id !== null) {
                            this.Config.employee_list.push({
                                ...item,
                            });
                        }
                    });
                    if (this.Config.employee_list.length == 1) {
                        this.select_employee = this.Config.employee_list[0];
                    }
                }
            });
    }

    clearSelect() {
        this.select_shop = null;
        this.select_shift = null;
        this.from_time = '';
        this.to_time = '';
    }
    data_request_table: any = [];
    index_edit: number = -1;
    btnAdd = 'Thêm vào request';

    // ewo_GetPlanSetup_Table
    listEmployee: any;
    listCalendar: any;
    listwp: any;
    listResult: any = [];
    // Prc_ATD_Result
    listCountPlan: any;
    listPlan: any;
    listATDResult: any = [];

    addPlanModal: boolean = false;
    cols!: any[];
    colsEmployee!: any[];
    setupTable() {
        this.cols = [
            {
                field: 'employee_code',
                header: 'Mã',
                color: 'black',
                backgroup_color: '',
                type: 0,
            },
            {
                field: 'employee_name',
                header: 'Nhân viên',
                color: 'black',
                backgroup_color: '',
                type: 0,
            },
        ];
        this.listCalendar.forEach((element: any) => {
            this.cols.push({
                field: 'DateInt',
                header:
                    element.TheDayName +
                    ', ' +
                    element.TheDay +
                    element.TheDaySuffix,
                color: element.color,
                backgroup_color: element.backgroup_color,
                type: element.DateInt,
            });
        });

        this.colsEmployee = [
            {
                field: 'employee_code',
                header: 'Mã',
                color: 'black',
                backgroup_color: '',
                type: 0,
            },
            {
                field: 'employee_name',
                header: 'Nhân viên',
                color: 'black',
                backgroup_color: '',
                type: 0,
            },
        ];
    }

    listdetailplan: any;
    planModal: boolean = false;
    plan: any = {
        employee_id: null,
        employee_code: null,
        employee_name: null,
        date: [],
        shops: null,
        shift: null,
        key: null,
    };

    ListWeek: any = [];
    ListMonth: any = [];
    getMonth(date: Date, format: string) {
        const today = new Date();
        const monthToday = today.getMonth() + 1;
        const year = today.getFullYear();

        const datePipe = new DatePipe('en-US');
        let monthNow = parseInt(datePipe.transform(date, format) as any) || 0;
        if (monthNow < 12) {
            monthNow++;
        }
        const dataMonth = Helper.getMonth();
        this.ListMonth = dataMonth.ListMonth;

        const monthString = monthToday.toString().padStart(2, '0');
        const currentDate = parseInt(year + monthString);
        if (Helper.IsNull(this.selectMonth) == true) {
            this.selectMonth = this.ListMonth?.find(
                (i: any) => i?.code == currentDate
            );
        }
    }

    TotalRowNumber: number = 0;
    filterTable(page: number) {
        this.listEmployee = undefined;
        this.listCalendar = undefined;
        this.listwp = undefined;
        this.listResult = [];

        if (!this.selectMonth && !this.select_employee) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Vui lòng chọn tháng & nhân viên',
                detail: '',
            });
        } else if (!this.selectMonth) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Vui lòng chọn tháng',
                detail: '',
            });
        } else if (!this.select_employee) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Vui lòng chọn nhân viên',
                detail: '',
            });
        } else {
            this.workingPlansService
                .ewo_GetPlanSetup_Table(
                    10,
                    page,
                    this.selectMonth.code,
                    this.select_employee.employee_id,
                    Helper.ProjectID(),
                    this.shop_code,
                    this.customer_shop_code,
                    this.project_shop_code,
                    this.item_ShopType,
                    // this.item_Province == null ? 0 : this.item_Province.code,
                    // this.item_District == null ? 0 : this.item_District.code,
                    // this.item_Ward == null ? 0 : this.item_Ward.code,
                    0,
                    0,
                    0,
                    // this.item_channel,
                    // this.item_ShopRouter,
                    0,
                    0,
                    this.selectStatus == null ? -1 : this.selectStatus.code,
                    -1,
                    // this.item_ASM
                    0
                )
                .subscribe((data: any) => {
                    if (data.result == EnumStatus.ok) {
                        this.ListWeek = [
                            {
                                name: 'Monday',
                                sub: 'Mo',
                                name_vn: 'Thứ hai',
                                sub_vn: 'T2',
                            },
                            {
                                name: 'Tuesday',
                                sub: 'Tu',
                                name_vn: 'Thứ ba',
                                sub_vn: 'T3',
                            },
                            {
                                name: 'Wednesday',
                                sub: 'We',
                                name_vn: 'Thứ tư',
                                sub_vn: 'T4',
                            },
                            {
                                name: 'Thursday',
                                sub: 'Th',
                                name_vn: 'Thứ năm',
                                sub_vn: 'T5',
                            },
                            {
                                name: 'Friday',
                                sub: 'Fr',
                                name_vn: 'Thứ sáu',
                                sub_vn: 'T6',
                            },
                            {
                                name: 'Saturday',
                                sub: 'Sa',
                                name_vn: 'Thứ bảy',
                                sub_vn: 'T7',
                            },
                            {
                                name: 'Sunday',
                                sub: 'Su',
                                name_vn: 'Chủ Nhật',
                                sub_vn: 'CN',
                            },
                        ];
                        if (data.data.calendar[0].TheDayOfWeek >= 2) {
                            let j = data.data.calendar[0].TheDayOfWeek - 2;
                            for (let i = 0; i < j; i++) {
                                data.data.calendar.unshift({
                                    DateInt: i,
                                    TheDate: '0',
                                    TheDay: 0,
                                    TheDaySuffix: '',
                                    TheDayOfWeek: 0,
                                    TheDayName: '',
                                    color: '',
                                    backgroup_color: null,
                                });
                            }
                        } else {
                            let j = data.data.calendar[0].TheDayOfWeek + 5;
                            for (let i = 0; i < j; i++) {
                                data.data.calendar.unshift({
                                    DateInt: i,
                                    TheDate: '0',
                                    TheDay: 0,
                                    TheDaySuffix: '',
                                    TheDayOfWeek: 0,
                                    TheDayName: '',
                                    color: '',
                                    backgroup_color: null,
                                });
                            }
                        }
                        // console.log(data.data.calendar);

                        this.listCalendar = data.data.calendar;
                        this.listwp = data.data.plan;
                        this.listEmployee = data.data.employee;
                        this.listResult = data.data.result;
                        this.listResult = this.listResult.map(
                            (lr: any, i: any) => ({
                                ...lr,
                                index: i + 1,
                            })
                        );

                        // this.listphoto = [];
                        // if (Helper.IsNull(this.listResult) != true) {
                        //   for (let i = 0; i < this.listResult.length; i++) {
                        //     this.listphoto.push({
                        //       id: i + 1,
                        //       src: this.listResult[i].atd_photo,
                        //       title:
                        //         this.listResult[i].atd_type +
                        //         ': ' +
                        //         this.listResult[i].atd_time,
                        //       image_time: this.listResult[i].atd_time,
                        //       _index: i + 1,
                        //     });
                        //   }
                        // }

                        this.setupTable();
                        this.listEmployee.forEach((emp: any) => {
                            emp.data = this.listwp.filter(
                                (p: any) => p.employee_id == emp.employee_id
                            );
                            emp.result = this.listResult.filter(
                                (p: any) => p.employee_id == emp.employee_id
                            );
                        });

                        this.TotalRowNumber =
                            Helper.IsNull(this.listEmployee) != true
                                ? this.listEmployee[0].TotalRows
                                : 0;
                        // console.log('this.listEmployee', this.listEmployee);
                    }
                });

            this._service
                .Prc_ATD_Result(
                    Helper.ProjectID(),
                    this.select_employee.employee_id,
                    +(this.selectMonth.code.toString() + '01'),
                    +(
                        this.selectMonth.code.toString() +
                        Pf.lastDayCurrMonth(this.LastDayMonth)
                    )
                )
                .subscribe((data: any) => {
                    if (data.result == EnumStatus.ok) {
                        this.listCountPlan = data.data.count_plan;
                        this.listPlan = data.data.plan;
                        this.listATDResult = data.data.result;

                        // console.log(this.listATDResult);
                        for (let i = 0; i < this.listCalendar?.length; i++) {
                            let temp = this.listCalendar[i].DateInt;
                            for (
                                let j = 0;
                                j < this.listCountPlan.length;
                                j++
                            ) {
                                if (this.listCountPlan[j].plan_date === temp) {
                                    this.listCalendar[i].count_plan =
                                        this.listCountPlan[j].count_plan;
                                }
                            }
                        }
                        // console.log('ListCalendar: ', this.listCalendar);
                    }
                });
        }
    }

    NofiIsNull(value: any, name: any): any {
        let check = 0;
        if (Helper.IsNull(value) == true || Pf.checkSpace(value) != true) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warn Message',
                detail: `Please choose a ${name}`,
            });
            check = 1;
        }
        return check;
    }
    checkDuplicates(value: any, name: any): any {
        let check = 0;
        if (Helper.checkDuplicates(value) != null) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: `${name} : ${Helper.checkDuplicates(value)}`,
            });
            check = 1;
        } else {
            check = 0;
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

    //
    note: any = '';
    listDetailATDResult: any = [];
    transactionUuid: any;
    openDetailATDResult(dateInt: any, event: any) {
        event.stopPropagation();

        let currMonth = +Helper.getCurrentDateWithoutSlash()
            .split('')
            .slice(2, 4)
            .join('');
        let currDay = +Helper.getCurrentDateWithoutSlash()
            .split('')
            .slice(0, 2)
            .join('');
        let chosenMonth = +Helper.convertDateStr1WithoutSlash(dateInt)
            .split('')
            .slice(2, 4)
            .join('');
        let chosenDay = +Helper.convertDateStr1WithoutSlash(dateInt)
            .split('')
            .slice(0, 2)
            .join('');

        let currDate = new Date();
        let year = currDate.getFullYear();
        let lastDay = 0;
        if (chosenMonth === 2 && year % 4 === 0) {
            lastDay = 29;
        } else if (chosenMonth === 2) {
            lastDay = 28;
        } else if (
            chosenMonth === 1 ||
            chosenMonth === 3 ||
            chosenMonth === 5 ||
            chosenMonth === 7 ||
            chosenMonth === 8 ||
            chosenMonth === 10 ||
            chosenMonth === 12
        ) {
            lastDay = 31;
        } else {
            lastDay = 30;
        }

        if (this.Config.process[0].config === '') {
            this.loadReasons();
            this.openDialogDetailATDResult = true;
        } else if (
            this.Config.process[0].config.remove_plan_past?.isActive === 1
        ) {
            if (chosenMonth < currMonth) {
                if (
                    lastDay + currDay - chosenDay <=
                    this.Config.process[0].config.remove_plan_past.limit_day
                ) {
                    this.loadReasons();
                    this.openDialogDetailATDResult = true;
                }
            } else if (chosenMonth === currMonth) {
                if (chosenDay - currDay >= 0) {
                    this.loadReasons();
                    this.openDialogDetailATDResult = true;
                } else {
                    if (
                        currDay - chosenDay <=
                        this.Config.process[0].config.remove_plan_past.limit_day
                    ) {
                        this.loadReasons();
                        this.openDialogDetailATDResult = true;
                    }
                }
            }
        } else if (
            this.Config.process[0].config.remove_plan_past?.isActive === 0
        ) {
            if (chosenMonth === currMonth) {
                if (chosenDay - currDay >= 0) {
                    this.loadReasons();
                    this.openDialogDetailATDResult = true;
                }
            }
        }

        const tempListDetailATDResult: any[] = [];

        this.listPlan.forEach((item: any) => {
            if (item.plan_date === dateInt) {
                const existingItem = this.registerRemovePlan.find(
                    (detail: any) => {
                        return detail.id === item.id;
                    }
                );
                // console.log('existingItem', existingItem);
                tempListDetailATDResult.push({
                    ...item,
                    _check: existingItem ? existingItem._check : false,
                    reason: existingItem ? existingItem.reason : '',
                    note: existingItem ? existingItem.note : '',
                    the_day: Helper.convertDateStr1(item.plan_date),
                });
            }
        });
        this.listDetailATDResult = tempListDetailATDResult;
        // console.log(this.listDetailATDResult);
    }

    selectedATDResult!: any;
    selectedDays: number[] = [];
    toggleDaySelection(dateInt: number): void {
        const index = this.selectedDays.indexOf(dateInt);
        if (index === -1) {
            this.selectedDays.push(dateInt);
        } else {
            this.selectedDays.splice(index, 1);
        }
    }

    isSelected(dateInt: number): boolean {
        return this.selectedDays.includes(dateInt);
    }

    openReason: boolean = false;
    registerRemovePlan: any = [];
    tempRegisterRemovePlan: any = [];
    registerRemovePlanCount: any;
    listRegisterRemovePlan: any = [];
    showATDResultDetail() {
        if (this.tempRegisterRemovePlan.length === 0) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Vui lòng chọn ca muốn rút lịch',
                detail: '',
            });
        } else {
            this.messageService.add({
                severity: 'success',
                summary: 'Đã thêm vào Danh sách rút lịch',
                detail: '',
            });
            this.openDialogDetailATDResult = false;
            this.tempRegisterRemovePlan.forEach((item: any) => {
                const index = this.registerRemovePlan.findIndex(
                    (plan: any) => plan.id === item.id
                );
                if (index !== -1) {
                    this.registerRemovePlan[index] = { ...item };
                } else {
                    this.registerRemovePlan.push({ ...item });
                }
            });

            this.registerRemovePlanCount = this.registerRemovePlan.length;
            this.tempRegisterRemovePlan = [];
            this.listDetailATDResult.forEach((item: any) => {
                const registerItem = this.registerRemovePlan.find(
                    (plan: any) => plan.id === item.id
                );
                if (registerItem) {
                    item._check = true;
                }
            });
            // console.log('Result: ', this.registerRemovePlan);
        }
    }

    type_code = '';
    dataNoti: any;
    requestExplanation = false;
    loading_save = false;
    setData() {
        this.dataNoti = {
            title: 'Yêu cầu rút lịch',
            description:
                this.currentUser.employee_name +
                ' yêu cầu rút lịch ngày ' +
                Helper.convertDateStr1(Helper.convertDateInt(new Date())),
            content:
                this.currentUser.employee_name +
                ' yêu cầu rút lịch ngày ' +
                Helper.convertDateStr1(Helper.convertDateInt(new Date())),
        };
    }

    reasonNote: any;
    days: { DateInt: number; backgroup_color: string }[] = [];
    confirmRemovePlan(tab: any, prc_id: number, step: any, event: Event) {
        this.confirmationService.confirm({
            target: event.target as EventTarget,
            message: 'Bạn chắc chắn xác nhận rút lịch?',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                const step_id = step.find((e: any) => e.action_id == 1).step_id;
                let token = '';
                let check = true;

                if (this.currentUser.manager_id !== null) {
                    this.prcService
                        .GetTokenByEmpId(this.currentUser.manager_id || 0)
                        .subscribe((data: any) => {
                            if (data.result == EnumStatus.ok) {
                                token = data.data.data_token[0].fcm_token || '';
                                if (!Helper.IsNull(data) && token != '') {
                                    this.prcService
                                        .PushNoti(
                                            token,
                                            'remove_plan',
                                            '',
                                            this.dataNoti.title,
                                            this.dataNoti.content,
                                            'WEB',
                                            Helper.ProjectID()
                                        )
                                        .subscribe((data: any) => {
                                            if (data.result == EnumStatus.ok) {
                                                this._service
                                                    .PrcRegisterRemove_plan(
                                                        Helper.ProjectID(),
                                                        this.transactionUuid,
                                                        prc_id,
                                                        step_id,
                                                        1,
                                                        this.note === ''
                                                            ? ''
                                                            : this.note,
                                                        this.registerRemovePlan
                                                    )
                                                    .subscribe((data: any) => {
                                                        if (
                                                            data.result ==
                                                            EnumStatus.ok
                                                        ) {
                                                            this.note = '';

                                                            this.registerRemovePlan.forEach(
                                                                (plan: any) => {
                                                                    const day =
                                                                        this.days.find(
                                                                            (d: {
                                                                                DateInt: any;
                                                                            }) =>
                                                                                d.DateInt ===
                                                                                plan.plan_date
                                                                        );
                                                                    if (day) {
                                                                        day.backgroup_color =
                                                                            '';
                                                                    }
                                                                }
                                                            );

                                                            this.registerRemovePlan =
                                                                [];
                                                            this.tempRegisterRemovePlan =
                                                                [];
                                                            this.registerRemovePlanCount = 0;
                                                            this.openViewList =
                                                                false;
                                                            this.messageService.add(
                                                                {
                                                                    severity:
                                                                        'success',
                                                                    summary:
                                                                        'Yêu cầu rút lịch thành công',
                                                                    detail: '',
                                                                }
                                                            );
                                                        } else {
                                                            this.messageService.add(
                                                                {
                                                                    severity:
                                                                        'warn',
                                                                    summary:
                                                                        'Error',
                                                                    detail: '',
                                                                }
                                                            );
                                                        }
                                                    });

                                                // this.prcService
                                                //     .Web_Notification_Save(
                                                //         this.currentUser
                                                //             .manager_id,
                                                //         Helper.ProjectID(),
                                                //         this.dataNoti.title,
                                                //         this.dataNoti
                                                //             .description,
                                                //         this.dataNoti.content,
                                                //         'remove_plan',
                                                //         'WEB'
                                                //     )
                                                //     .subscribe((data: any) => {
                                                //         if (
                                                //             data.result ==
                                                //             EnumStatus.ok
                                                //         ) {
                                                //             check = false;
                                                //             this.setData();
                                                //         }
                                                //     });
                                                this.requestExplanation = false;
                                                this.loading_save = false;
                                            } else {
                                                check = false;
                                                this.requestExplanation = false;
                                                this.loading_save = false;
                                            }

                                            if (check == false) {
                                                this.messageService.add({
                                                    severity: 'error',
                                                    summary: 'Lỗi',
                                                    detail: 'Yêu cầu không thành công!',
                                                });
                                            }
                                        });
                                }
                            }
                        });
                }
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

    isEditReason: boolean = false;
    isEditNote: boolean = false;
    dataOnRow: any;
    previousRowId: any = null;
    onRowSelect(data: any) {
        this.dataOnRow = data;

        this.listATDResult.forEach((item: any) => {
            if (item.UUID === this.dataOnRow.UUID) {
                this.dataOnRow.status = true;
            }
        });

        if (this.Config.process[0].config === '') {
            this.itemNote = this.dataOnRow.reason;
            this.openReason = true;

            if (
                this.Config.process[0].config.remove_plan_reason.isActive === 1
            ) {
                this.isEditReason = true;
            }

            this.Config.process[0].note_list?.forEach((item: any) => {
                if (item.is_edit === 1) {
                    this.isEditNote = true;
                }
            });

            if (this.dataOnRow.note === '') {
                this.reason =
                    this.reasons.find(
                        (reason: any) => reason.note === data.note
                    ) || '';
            } else if (this.dataOnRow.note !== '') {
                this.reasons.forEach((item: any) => {
                    if (item.note === this.dataOnRow.note) {
                        this.reason = item;
                    }
                });
            }
        } else if (
            this.dataOnRow.status === true &&
            this.Config.process[0].config.remove_plan_when_attendance
                .isActive === 0
        ) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Không thể rút lịch cho ca đã chấm công',
                detail: '',
            });
        } else if (
            this.dataOnRow.status === true &&
            this.Config.process[0].config.remove_plan_when_attendance
                .isActive === 1
        ) {
            this.itemNote = this.dataOnRow.reason;
            this.openReason = true;

            if (
                this.Config.process[0].config.remove_plan_reason.isActive === 1
            ) {
                this.isEditReason = true;
            }

            this.Config.process[0].note_list?.forEach((item: any) => {
                if (item.is_edit === 1) {
                    this.isEditNote = true;
                }
            });

            if (this.dataOnRow.note === '') {
                this.reason =
                    this.reasons.find(
                        (reason: any) => reason.note === data.note
                    ) || '';
            } else if (this.dataOnRow.note !== '') {
                this.reasons.forEach((item: any) => {
                    if (item.note === this.dataOnRow.note) {
                        this.reason = item;
                    }
                });
            }
        } else if (
            this.dataOnRow.status === false &&
            this.Config.process[0].config.remove_plan_when_attendance
                .isActive === 0
        ) {
            this.itemNote = this.dataOnRow.reason;
            this.openReason = true;

            if (
                this.Config.process[0].config.remove_plan_reason.isActive === 1
            ) {
                this.isEditReason = true;
            }

            this.Config.process[0].note_list?.forEach((item: any) => {
                if (item.is_edit === 1) {
                    this.isEditNote = true;
                }
            });

            if (this.dataOnRow.note === '') {
                this.reason =
                    this.reasons.find(
                        (reason: any) => reason.note === data.note
                    ) || '';
            } else if (this.dataOnRow.note !== '') {
                this.reasons.forEach((item: any) => {
                    if (item.note === this.dataOnRow.note) {
                        this.reason = item;
                    }
                });
            }
        } else {
            this.itemNote = this.dataOnRow.reason;
            this.openReason = true;

            if (
                this.Config.process[0].config.remove_plan_reason.isActive === 1
            ) {
                this.isEditReason = true;
            }

            this.Config.process[0].note_list?.forEach((item: any) => {
                if (item.is_edit === 1) {
                    this.isEditNote = true;
                }
            });

            if (this.dataOnRow.note === '') {
                this.reason =
                    this.reasons.find(
                        (reason: any) => reason.note === data.note
                    ) || '';
            } else if (this.dataOnRow.note !== '') {
                this.reasons.forEach((item: any) => {
                    if (item.note === this.dataOnRow.note) {
                        this.reason = item;
                    }
                });
            }
        }
    }
    onRowUnselect(data: any, event: any) {
        event.stopPropagation();
        data.reason = '';
        data.note = '';
        data._check = false;

        if (this.tempRegisterRemovePlan.length === 0) {
            const index1 = this.registerRemovePlan.findIndex(
                (plan: any) => plan.id === data.id
            );
            if (index1 !== -1) {
                this.registerRemovePlan.splice(index1, 1);
                this.registerRemovePlanCount = this.registerRemovePlan.length;
            }
            const index2 = this.tempRegisterRemovePlan.findIndex(
                (plan: any) => plan.id === data.id
            );
            if (index2 !== -1) {
                this.tempRegisterRemovePlan.splice(index2, 1);
                this.registerRemovePlanCount = this.registerRemovePlan.length;
            }
        } else {
            const index = this.tempRegisterRemovePlan.findIndex(
                (plan: any) => plan.id === data.id
            );
            if (index !== -1) {
                this.tempRegisterRemovePlan.splice(index, 1);
                this.registerRemovePlanCount = this.registerRemovePlan.length;
            }
        }
        //console.log(this.tempRegisterRemovePlan);
        this.reason = null;
    }
    onRowUnselectFinal(data: any, event: any) {
        if (this.registerRemovePlan.length > 1) {
            event.stopPropagation();
            data.reason = '';
            data._check = false;

            const index = this.registerRemovePlan.findIndex(
                (plan: any) => plan.id === data.id
            );
            if (index !== -1) {
                this.registerRemovePlan.splice(index, 1);
            }
            this.registerRemovePlanCount = this.registerRemovePlan.length;
            this.reason = null;
        } else if (this.registerRemovePlan.length === 1) {
            this.registerRemovePlan.length = 0;
            this.registerRemovePlanCount = this.registerRemovePlan.length;
            this.openViewList = false;
        }
    }

    reason: any;
    reasons: any = [];
    itemNote: any = null;
    selectedReasons(e: any) {
        this.reason = e.value;
    }

    confirm() {
        if (this.isEditReason === true && this.reason !== '') {
            const itemToUpdate = this.listDetailATDResult.find(
                (item: any) => item.id === this.dataOnRow.id
            );
            if (this.itemNote !== null) {
                itemToUpdate.note = this.reason?.note;
                itemToUpdate.reason = this.itemNote;
                itemToUpdate._check = true;

                const existingRegisterIndex =
                    this.tempRegisterRemovePlan.findIndex(
                        (plan: any) => plan.id === itemToUpdate.id
                    );

                if (existingRegisterIndex !== -1) {
                    this.tempRegisterRemovePlan[existingRegisterIndex].note =
                        itemToUpdate.note;
                } else {
                    this.tempRegisterRemovePlan.push({
                        id: itemToUpdate.id,
                        shop_code: itemToUpdate.shop_code,
                        shop_name: itemToUpdate.shop_name,
                        shop_address: itemToUpdate.shop_address,
                        shift_code: itemToUpdate.shift_code,
                        shift_note: itemToUpdate.shift_note,
                        the_day: itemToUpdate.the_day,
                        transaction_uuid: this.transactionUuid,
                        employee_id: itemToUpdate.employee_id,
                        shop_id: itemToUpdate.shop_id,
                        plan_date: itemToUpdate.plan_date,
                        shift_id: itemToUpdate.shift_id,
                        from_time: itemToUpdate.from_time,
                        to_time: itemToUpdate.to_time,
                        note: itemToUpdate.note + ' ' + itemToUpdate.reason,
                        _check: itemToUpdate._check,
                    });
                }

                this.openReason = false;
                this.dataOnRow = null;
                this.reason = null;
                // this.itemNote = null;
                this.note = '';
            } else {
                itemToUpdate.note = this.reason?.note;
                itemToUpdate.reason = this.itemNote;
                itemToUpdate._check = true;

                const existingRegisterIndex =
                    this.tempRegisterRemovePlan.findIndex(
                        (plan: any) => plan.id === itemToUpdate.id
                    );

                if (existingRegisterIndex !== -1) {
                    this.tempRegisterRemovePlan[existingRegisterIndex].note =
                        itemToUpdate.note;
                } else {
                    this.tempRegisterRemovePlan.push({
                        id: itemToUpdate.id,
                        shop_code: itemToUpdate.shop_code,
                        shop_name: itemToUpdate.shop_name,
                        shop_address: itemToUpdate.shop_address,
                        shift_code: itemToUpdate.shift_code,
                        shift_note: itemToUpdate.shift_note,
                        the_day: itemToUpdate.the_day,
                        transaction_uuid: this.transactionUuid,
                        employee_id: itemToUpdate.employee_id,
                        shop_id: itemToUpdate.shop_id,
                        plan_date: itemToUpdate.plan_date,
                        shift_id: itemToUpdate.shift_id,
                        from_time: itemToUpdate.from_time,
                        to_time: itemToUpdate.to_time,
                        note: itemToUpdate.note,
                        _check: itemToUpdate._check,
                    });
                }

                this.openReason = false;
                this.dataOnRow = null;
                this.reason = null;
                // this.itemNote = null;
                this.note = '';
            }
        } else if (this.isEditReason === true && this.reason === '') {
            this.messageService.add({
                severity: 'warn',
                summary: 'Vui lòng chọn lý do rút lịch',
                detail: '',
            });
        } else if (this.isEditReason === false) {
            const itemToUpdate = this.listDetailATDResult.find(
                (item: any) => item.id === this.dataOnRow.id
            );
            if (this.itemNote !== null) {
                itemToUpdate.note = this.reason?.note;
                itemToUpdate.reason = this.itemNote;
                itemToUpdate._check = true;

                const existingRegisterIndex =
                    this.tempRegisterRemovePlan.findIndex(
                        (plan: any) => plan.id === itemToUpdate.id
                    );

                if (existingRegisterIndex !== -1) {
                    this.tempRegisterRemovePlan[existingRegisterIndex].note =
                        itemToUpdate.note;
                } else {
                    this.tempRegisterRemovePlan.push({
                        id: itemToUpdate.id,
                        shop_code: itemToUpdate.shop_code,
                        shop_name: itemToUpdate.shop_name,
                        shop_address: itemToUpdate.shop_address,
                        shift_code: itemToUpdate.shift_code,
                        shift_note: itemToUpdate.shift_note,
                        the_day: itemToUpdate.the_day,
                        transaction_uuid: this.transactionUuid,
                        employee_id: itemToUpdate.employee_id,
                        shop_id: itemToUpdate.shop_id,
                        plan_date: itemToUpdate.plan_date,
                        shift_id: itemToUpdate.shift_id,
                        from_time: itemToUpdate.from_time,
                        to_time: itemToUpdate.to_time,
                        note:
                            itemToUpdate.note === undefined
                                ? ''
                                : itemToUpdate.note + ' ' + itemToUpdate.reason,
                        _check: itemToUpdate._check,
                    });
                }

                this.openReason = false;
                this.dataOnRow = null;
                this.reason = null;
                // this.itemNote = null;
                this.note = '';
            } else {
                itemToUpdate.note = this.reason?.note;
                itemToUpdate.reason = this.itemNote;
                itemToUpdate._check = true;

                const existingRegisterIndex =
                    this.tempRegisterRemovePlan.findIndex(
                        (plan: any) => plan.id === itemToUpdate.id
                    );

                if (existingRegisterIndex !== -1) {
                    this.tempRegisterRemovePlan[existingRegisterIndex].note =
                        itemToUpdate.note;
                } else {
                    this.tempRegisterRemovePlan.push({
                        id: itemToUpdate.id,
                        shop_code: itemToUpdate.shop_code,
                        shop_name: itemToUpdate.shop_name,
                        shop_address: itemToUpdate.shop_address,
                        shift_code: itemToUpdate.shift_code,
                        shift_note: itemToUpdate.shift_note,
                        the_day: itemToUpdate.the_day,
                        transaction_uuid: this.transactionUuid,
                        employee_id: itemToUpdate.employee_id,
                        shop_id: itemToUpdate.shop_id,
                        plan_date: itemToUpdate.plan_date,
                        shift_id: itemToUpdate.shift_id,
                        from_time: itemToUpdate.from_time,
                        to_time: itemToUpdate.to_time,
                        note:
                            itemToUpdate.note === undefined
                                ? ''
                                : itemToUpdate.note,
                        _check: itemToUpdate._check,
                    });
                }

                this.openReason = false;
                this.dataOnRow = null;
                this.reason = null;
                // this.itemNote = null;
                this.note = '';
            }
        }
    }

    hideDialogDetailATDResult() {
        this.tempRegisterRemovePlan = [];
    }

    hideDialogReason() {
        this.reason = null;
        this.itemNote = null;
        this.dataOnRow = null;
        this.previousRowId = null;
    }

    isEdit: any;
    loadReasons() {
        this._service
            .PrcGetNoteList(Helper.ProjectID(), 3, '', -1)
            .subscribe((data: any) => {
                if (data.result == EnumStatus.ok) {
                    data.data.note_list.forEach((element: any) => {
                        const exists = this.reasons.some(
                            (reason: any) => reason.note === element.note
                        );
                        if (!exists) {
                            this.reasons.push({
                                process_id: element.process_id,
                                note: element.note,
                                is_edit: element.is_edit,
                            });
                        }
                        this.isEdit = element.is_edit;
                    });
                }
            });
    }

    openViewList: boolean = false;
    viewListRemovePlan() {
        if (this.registerRemovePlan.length === 0) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Chưa chọn ca để rút lịch',
                detail: '',
            });
        } else {
            this.openViewList = true;
        }
    }

    isDayInRegisterRemovePlan(dateInt: number): boolean {
        return this.registerRemovePlan.some(
            (plan: any) => plan.plan_date === dateInt
        );
    }
}
