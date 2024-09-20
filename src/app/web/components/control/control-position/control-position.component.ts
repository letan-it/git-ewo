import {
    Component,
    Output,
    EventEmitter,
    Input,
    SimpleChanges,
} from '@angular/core';
import { Element } from 'chart.js';
import { log } from 'console';
import { Position } from 'src/app/web/models/position';
import { MastersService } from 'src/app/web/service/masters.service';
import { PositionService } from 'src/app/web/service/position.service';
import { ProductService } from 'src/app/web/service/product.service';
import { environment } from 'src/environments/environment';
import { Helper } from 'src/app/Core/_helper';
@Component({
    selector: 'app-control-position',
    templateUrl: './control-position.component.html',
    styleUrls: ['./control-position.component.scss'],
    providers: [PositionService],
})
export class ControlPositionComponent {
    constructor(
        private _service: PositionService,
        private masterService: MastersService
    ) {}
    isLoadForm = 1;
    @Output() outValue = new EventEmitter<string>();
    @Output() outList = new EventEmitter<any>();
    @Input() itemPosition: any = undefined;
    @Input() multiSelect: boolean = false;
    @Output() outClear = new EventEmitter<boolean>();

    selectPosition: any;
    listPosition: any = [];
    listData: any;

    loadData() {
        this.isLoadForm = 1;
        this.masterService
            .ewo_GetMaster(Helper.ProjectID())
            .subscribe((data: any) => {
                this.isLoadForm = 0;
                this.listPosition = [];
                data.data.forEach((element: any) => {
                    if (
                        element.project_id == Helper.ProjectID() &&
                        element.ListCode == 'Employee.Position' &&
                        element.Status == 1
                    ) {
                        this.listPosition.push({
                            code: element.Code,
                            name: element.Code,
                        });
                    }
                });

                if (this.itemPosition != undefined) {
                    this.selectPosition = this.listPosition.filter(
                        (item: any) => item.code == this.itemPosition
                    )[0];
                } else {
                    this.selectPosition = '';
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
        if (changes['itemPosition']) {
            this.loadData();
        }
    }
    returnValue(value: any) {
        this.outValue.emit(value);
    }
    resetSelection() {
        this.selectPosition = [];
        this.outClear.emit(true);
    }
}
