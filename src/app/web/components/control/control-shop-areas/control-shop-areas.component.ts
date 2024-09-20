import {
    Component,
    Output,
    Input,
    EventEmitter,
    SimpleChanges,
} from '@angular/core';
import { Areas } from 'src/app/web/models/areas';
import { AreasService } from 'src/app/web/service/areas.service';
import { MastersService } from 'src/app/web/service/masters.service';
import { Helper } from 'src/app/Core/_helper';
@Component({
    selector: 'app-control-shop-areas',
    templateUrl: './control-shop-areas.component.html',
    styleUrls: ['./control-shop-areas.component.scss'],
    providers: [AreasService],
})
export class ControlShopAreasComponent {
    constructor(
        private _service: AreasService,
        private masterService: MastersService
    ) { }
    isLoadForm = 1;
    @Output() outValue = new EventEmitter<string>();
    @Input() itemAreas: any = undefined;

    selectAreas: any;
    listAreas: any = [];
    listData: any;

    loadData() {
        this.isLoadForm = 1;
        this.masterService
            .ewo_GetMaster(Helper.ProjectID())
            .subscribe((data: any) => {
                //   {
                //     "ListCode": "Employee.Position",
                //     "Code": "DA",
                //     "project_id": 4,
                // }
                this.isLoadForm = 0;
                this.listAreas = [];

                data.data.forEach((element: any) => {
                    if (
                        element.project_id == Helper.ProjectID() &&
                        element.ListCode == 'Shop.Areas' &&
                        element.Status == 1
                    ) {
                        this.listAreas.push({
                            code: element.Code,
                            name: element.Code,
                        });
                    }
                });
                console.log("🚀 ~ file: control-shop-areas.component.ts:43 ~ ControlShopAreasComponent ~ .subscribe ~ this.listAreas:", this.listAreas)

                // this.itemAreas != undefined 
                if (Helper.IsNull(this.itemAreas) != true) {
                    this.selectAreas = this.listAreas.filter(
                        (item: any) => item.code == this.itemAreas
                    )[0];
                } else {
                    this.selectAreas = '';
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
        if (changes['itemAreas']) {
            this.loadData();
        }
    }
    returnValue(value: any) {
        this.outValue.emit(value);
    }
}
