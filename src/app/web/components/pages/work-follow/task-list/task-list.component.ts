import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { TasksService } from '../service/tasks.service';
import { Helper } from 'src/app/Core/_helper';
import { EnumStatus } from 'src/app/Core/_enum';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AppComponent } from 'src/app/app.component';
import { Pf } from 'src/app/_helpers/pf';

interface EmployeeInfo {
    image: string;
    employee_name: string;
    task_id: number[];
    count: number;
}

@Component({
    selector: 'app-task-list',
    templateUrl: './task-list.component.html',
    styleUrls: ['./task-list.component.scss'],
    providers: [MessageService],
})
export class TaskListComponent {
    showFilter: number = 1;
    selectMonth: any;
    month: any;
    ListMonth: any = [];
    work_list: any;
    info_modal: any = {
        visible: false,
        header: '',
        dataModel: {
            tag_name: undefined,
            tag: '',
            description: undefined,
            start_date: undefined,
            end_date: undefined,
            assignees: 0,
            team_follow: '',
        },
    };
    item_work: any = {
        visible: false,
        header: '',
        task_id: null,
    };
    danger: any;
    dataCheckLate: any;
    dataCheckBug: any;
    constructor(
        private messageService: MessageService,
        private _service: TasksService
    ) {}
    data: any = {
        task_Id: undefined,
        year_month: undefined,
        employee_id: 0,
        tag: '',
        status: '',
        testing_status: '',
    };

    currentDate: any;
    ngOnInit(): void {
        const date = new Date();

        this.currentDate = Helper.convertDate(date);
        this.selectMonth = Helper.getMonth().SelectMonth;

        this.ListMonth = Helper.getMonth().ListMonth;
        this.getSummary();
    }

    listStatus: any = {
        todo: null,
        develop: null,
        deploy: null,
        completed: null,
        reject: null,
        close: null,
    };

    dataWork!: any;
    getData() {
        const defaultDate = Pf.StringDateToInt(this.currentDate)
            .toString()
            .slice(0, 6);
        this._service
            .TaskList_GetAll(
                this.data.task_Id ? this.data.task_Id : 0,
                this.data.year_month ? this.data.year_month : defaultDate,
                this.data.employee_id,
                this.data.tag,
                this.data.status,
                this.data.testing_status
            )
            .subscribe((data: any) => {
                if (data.result == EnumStatus.ok) {
                    this.listStatus.todo = data.data.tasklist.filter(
                        (e: any) => e.status == 'ToDo'
                    );
                    this.listStatus.develop = data.data.tasklist.filter(
                        (e: any) => e.status == 'Develop'
                    );
                    this.listStatus.deploy = data.data.tasklist.filter(
                        (e: any) => e.status == 'Deploy'
                    );
                    this.listStatus.completed = data.data.tasklist.filter(
                        (e: any) => e.status == 'Completed'
                    );
                    this.listStatus.reject = data.data.tasklist.filter(
                        (e: any) => e.status == 'Reject'
                    );
                    this.listStatus.close = data.data.tasklist.filter(
                        (e: any) => e.status == 'Close'
                    );

                    this.dataWork = data.data.tasklist;
                }
                // check

                this.dataCheckLate = this.dataWork?.filter((item: any) =>
                    this.dataLate
                        ?.map((e: any) => e.task_id && e.task_id[0])
                        .includes(item.task_id)
                );
                this.dataCheckLate = this.dataCheckLate.map(
                    (e: any) => e.task_id
                );

                this.dataCheckBug = this.dataWork?.filter((item: any) =>
                    this.dataLate
                        ?.map((e: any) => e.task_id)
                        .includes(item.task_id)
                );
                this.dataCheckBug = this.dataCheckBug.map(
                    (e: any) => e.task_id
                );
            });
    }

    ShowHideFilter() {
        if (this.showFilter == 1) {
            this.showFilter = 0;
        } else {
            this.showFilter = 1;
        }
    }
    selectItem_Status(event: any) {
        this.data.status = event;
    }
    selectItem_TesingStatus(event: any) {
        this.data.testing_status = event;
    }
    selectItem_user(event: any) {
        this.data.employee_id = event;
    }

    showDialog(header: any) {
        this.info_modal = {
            visible: true,
            header: header,
        };
    }

    copyText(item: any, content: any) {
        let val = 'TaskID: ' + item + '\n - Task Name: ' + content;
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
        this.messageService.add({
            severity: 'success',
            summary: 'copy text successfully',
            detail: val,
        });
    }

    detailWork(header: any, task_id: any) {
        this.item_work = {
            visible: true,
            header: header,
            task_id: task_id,
        };
    }

    handleRefresh() {
        const dataMonth = this.selectMonth?.map((e: any) => e.code);

        this.data.year_month = dataMonth?.toString();
        // this.getData();
        this.getSummary();
    }

    handleModel(e: any) {
        // this.getData();
        this.getSummary();
    }

    // Summary
    dataSummary: any = {
        bug: null,
        employee: null,
        late: null,
        task: null,
        task_inprocess: null,
    };

    // Late
    resultDataLate: any;
    dataLate: any;
    employeeLate: any = [];

    // Bug
    dataBug: any;
    bug: any = [];

    // Task inprocess
    dataTaskInprocess: any;
    taskInprocess: any = [];
    getSummary() {
        this._service.Summary_TaskList().subscribe((data: any) => {
            if (data.result == EnumStatus.ok) {
                data.data.summary.forEach((item: any) => {
                    this.dataSummary.bug = item.count_bug;
                    this.dataSummary.employee = item.count_employee_inprocess;
                    this.dataSummary.late = item.count_late;
                    this.dataSummary.task = item.count_task;
                    this.dataSummary.task_inprocess = item.count_task_inprocess;
                });

                // Task Late
                this.dataLate = [];
                data.data.late.forEach((item: any) => {
                    this.dataLate.push({
                        image: item.image,
                        employee_name: item.employee_name,
                        task_id: [item?.task_id],
                        count: 1,
                    });
                });
                const aggregatedData: { [key: string]: EmployeeInfo } = {};
                for (const item of this.dataLate) {
                    const name = item.employee_name;
                    if (!aggregatedData[name]) {
                        aggregatedData[name] = {
                            image: item.image,
                            employee_name: name,
                            task_id: [],
                            count: 0,
                        };
                    }
                    aggregatedData[name].task_id.push(...item.task_id);
                    aggregatedData[name].count += item.count;
                }
                const result = Object.values(aggregatedData);
                this.resultDataLate = result;

                // Bug
                let bugInfo: any = [];
                data.data.bug.forEach((item: any) => {
                    bugInfo.push({
                        image: item.image,
                        name: item.employee_name,
                        task_id: [item.task_id],
                        count: 1,
                    });
                });
                this.bug = bugInfo;
                for (let i = 0; i < this.bug.length; i++) {
                    let temp = this.bug[i];
                    for (let j = i + 1; j <= this.bug.length + 1; j++) {
                        if (this.bug[j]?.name === temp.name) {
                            this.bug[i].task_id = this.bug[i]?.task_id.concat(
                                this.bug[j]?.task_id
                            );
                            this.bug[i]!.count++;
                            this.bug.splice(j, 1); // xóa phần tử
                        }
                    }
                }
                this.dataBug = data.data.bug;

                // Task_inprocess
                let taskInprocessInfo: any = [];
                let taskInprocessDetail: any = [];
                data.data.task.filter((item: any) => {
                    if (item.status === 'Develop') {
                        taskInprocessInfo.push(item);
                    }
                });
                taskInprocessInfo.forEach((item: any) => {
                    taskInprocessDetail.push({
                        image: item.image,
                        name: item.employee_name,
                        task_id: [item.task_id],
                        count: 1,
                    });
                });
                this.taskInprocess = taskInprocessDetail;
                for (let i = 0; i < this.taskInprocess.length; i++) {
                    let temp = this.taskInprocess[i];
                    for (
                        let j = i + 1;
                        j <= this.taskInprocess.length + 1;
                        j++
                    ) {
                        if (this.taskInprocess[j]?.name === temp.name) {
                            this.taskInprocess[i].task_id = this.taskInprocess[
                                i
                            ]?.task_id.concat(this.taskInprocess[j]?.task_id);
                            this.taskInprocess[i]!.count++;
                            this.taskInprocess.splice(j, 1); // xóa phần tử
                        }
                    }
                }
                this.getData();
            }
        });
    }
    openDetailLateTask(event: any) {}

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

    rawData() {
        const defaultDate = Pf.StringDateToInt(this.currentDate)
            .toString()
            .slice(0, 6);
        this._service.TaskList_RawData(
            Helper.ProjectID(),
            this.data.year_month ? this.data.year_month : defaultDate
        );
    }
}
