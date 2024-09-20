import {
    AfterViewInit,
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output,
    SimpleChanges,
} from '@angular/core';
import { MessageService } from 'primeng/api';

import { Helper } from 'src/app/Core/_helper';
import { EnumStatus, EnumSystem } from 'src/app/Core/_enum';

import { Representative } from 'src/app/web/models/customer';
import { Table } from 'primeng/table';
import { ChartService } from 'src/app/web/service/chart.service';

@Component({
    selector: 'app-dashboard-empByDate',
    templateUrl: './empByDate.component.html',
    styleUrls: ['./empByDate.component.scss'],
})
export class EmpByDateComponent {
    @Input() inValue: any;
    @Output() outValue = new EventEmitter<any>();

    constructor(
        private messageService: MessageService,
        private _service: ChartService
    ) {}
    representatives!: Representative[];

    statuses!: any[];

    loading: boolean = true;

    responsiveOptions!: any[];

    activityValues: number[] = [0, 100];
    empName: string = '';
    searchValue: string | undefined;
    data: any = [];
    num: any = 0;
    ngOnChanges(changes: SimpleChanges): void {
        if (changes['inValue']) {
            if (!Helper.IsNull(this.inValue)) {
                this._service
                    .ChartATD_EmployeeByDay_Detail(
                        Helper.ProjectID(),
                        this.inValue.plan_date,
                        Helper.IsNull(this.inValue.itemArea) != true
                            ? this.inValue.itemArea
                            : null,
                        Helper.IsNull(this.inValue.manager_id) != true
                            ? this.inValue.manager_id
                            : null,
                        Helper.IsNull(this.inValue.employee_id) != true
                            ? this.inValue.employee_id
                            : null,
                        this.inValue.shop_code
                    )
                    .subscribe((data: any) => {
                        if (data.result == EnumStatus.ok) {
                            this.data = data.data;
                            if (this.data.length > 0) {
                                this.data.forEach((e: any) => {
                                    e.empCode = e.working_plan;
                                    e.result = e.result != 0 ? true : false;
                                    e._emp = `[${e.employee_id}] - ${e.working_plan} - ${e.emp_name}`;
                                });
                            }

                            this.loading = false;
                        }
                    });
            }
        }
    }
    clear(table: Table) {
        table.clear();
        this.searchValue = '';
    }

    urlgallery: any;
    showImage(url: any) {
      this.urlgallery = url;
      document.open(
        <string>this.urlgallery,
        'windowName',
        'height=700,width=900,top=100,left= 539.647'
      );
    } 
    // onImageError(event: any, item: any) { 
    //     this.urlgallery = url;
    //     document.open(
    //         <string>this.urlgallery,
    //         'windowName',
    //         'height=700,width=900,top=100,left= 539.647'
    //     );
    // }
    onImageError(event: any, item: any) {
        const link_err = EnumSystem.imageError;
        item.employee_image = link_err;
    }
}
