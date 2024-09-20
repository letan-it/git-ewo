import {
    Component,
    EventEmitter,
    Input,
    Output,
    SimpleChanges,
} from '@angular/core';
import { EnumStatus } from 'src/app/Core/_enum';
import { Helper } from 'src/app/Core/_helper';
import { ShopsService } from 'src/app/web/service/shops.service';

@Component({
    selector: 'app-control-shop-router',
    templateUrl: './control-shop-router.component.html',
    styleUrls: ['./control-shop-router.component.scss'],
})
export class ControlShopRouterComponent {
    constructor(private _service: ShopsService) { }
    isLoadForm = 1;
    selectedShopRouter: any;
    listShopRouter: any;
    @Output() outValue = new EventEmitter<string>();
    GetLanguage(key:string) {
        return Helper.GetLanguage(key)
     }
    // placeholder="Select a shop router"
    // [placeholder]="nameEmployeeType"
    @Input() inputStyle: any = { minWidth: '100%', maxWidth: '150px' };
    @Input() itemRouterId!: number;
    

    LoadData() {
        this.isLoadForm = 1;
        this._service.ewo_GetShopRouter().subscribe((data: any) => {
            this.isLoadForm = 0;
            if (data.result == EnumStatus.ok) {
                this.listShopRouter = [];
                data.data.forEach((element: any) => {
                    if (element.status == 1) {
                        this.listShopRouter.push({
                            name:
                                '[' +
                                element.router_id +
                                '] - ' +
                                element.router_code +
                                ' - ' +
                                element.router_name +
                                ' - ' +
                                element.router_type,

                            code: element.router_id,
                        });
                    }

                    if (this.itemRouterId > 0) {
                        this.selectedShopRouter = this.listShopRouter.filter(
                            (item: any) => item.code == this.itemRouterId
                        )[0];
                    } else {
                        this.selectedShopRouter = '';
                    }
                });
            }
        });
    }
    ngOnInit() {
        this.LoadData();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['itemRouterId']) {
            this.LoadData();
        }
    }

    returnValue(value: any) {
        this.outValue.emit(value);
    }
}
