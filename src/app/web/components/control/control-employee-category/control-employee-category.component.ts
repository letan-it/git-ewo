import {
    Component,
    SimpleChanges,
    EventEmitter,
    Input,
    Output,
} from '@angular/core';
import { Helper } from 'src/app/Core/_helper';
import { MastersService } from 'src/app/web/service/masters.service';
import { PositionService } from 'src/app/web/service/position.service';

@Component({
    selector: 'app-control-employee-category',
    templateUrl: './control-employee-category.component.html',
    styleUrls: ['./control-employee-category.component.scss'],
    providers: [PositionService],
})
export class ControlEmployeeCategoryComponent {
    constructor(
        private _service: PositionService,
        private masterService: MastersService
    ) { }

    @Output() outValue = new EventEmitter<string>();
    @Input() itemCategory: any = undefined;

    selectCategory: any;
    listCategory: any = [];
    listData: any;

    loadData() {
        this.masterService
            .ewo_GetMaster(Helper.ProjectID())
            .subscribe((data: any) => {
                //   {
                //     "ListCode": "Employee.Category",
                //     "Code": "DA",
                //     "project_id": 4,
                // }
                this.listCategory = [];

                data.data.forEach((element: any) => {
                    if (
                        element.project_id == Helper.ProjectID() &&
                        element.ListCode == 'Employee.Category' &&
                        element.Status == 1
                    ) {
                        this.listCategory.push({
                            code: element.Code,
                            name: element.Code,
                        });
                    }
                });

                if (this.itemCategory != undefined) {
                    this.selectCategory = this.listCategory.filter(
                        (item: any) => item.code == this.itemCategory
                    )[0];
                } else {
                    this.selectCategory = '';
                }
            });
    }

    ngOnInit(): void {
        //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
        //Add 'implements OnInit' to the class.

        this.loadData();
    }

    ngOnChanges(changes: SimpleChanges): void {
        //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
        //Add '${implements OnChanges}' to the class.
        if (changes['itemCategory']) {
            this.loadData();
        }
    }
    returnValue(value: any) {
        this.outValue.emit(value);
    }
}
