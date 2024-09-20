import {
    Component,
    Input,
    Output,
    SimpleChanges,
    EventEmitter,
} from '@angular/core';
import { EnumStatus } from 'src/app/Core/_enum';
import { Helper } from 'src/app/Core/_helper';
import { ProductService } from 'src/app/web/service/product.service';

@Component({
    selector: 'app-control-osa-product',
    templateUrl: './control-osa-product.component.html',
    styleUrls: ['./control-osa-product.component.scss'],
})
export class ControlOsaProductComponent {
    constructor(private _service: ProductService) {}
    isLoadForm = 1;
    selectedProduct: any;
    listProduct: any;

    functionToClear(multiselect: any): void {
        multiselect.value = [];
    }
    test(event: any) {
        console.log('🚀 ~ ControlOsaProductComponent ~ test ~ event:', event);
    }
    @Input() placeholder: any = '-- Choose -- ';

    @Output() outValue = new EventEmitter<string>();
    @Output() outClear = new EventEmitter<boolean>();

    @Input() itemProduct!: number;
    @Input() inputStyle: any = { minWidth: '100%', maxWidth: '150px' };
    @Input() selectMulti: any = false;
    @Input() status: number = -1;

    returnValue(value: any) {
        this.outValue.emit(value);
    }

    loadData() {
        this.isLoadForm = 1;

        this._service
            .ewo_Products_GetList(Helper.ProjectID(), '', '', 0, '', 100000, 1)
            .subscribe((data: any) => {
                this.isLoadForm = 0;
                this.listProduct = [];

                if (data.result == EnumStatus.ok) {
                    if (this.status > -1) {
                        let tmp = data.data.filter((e: any) => {
                            return e.status == this.status;
                        });

                        tmp.forEach((element: any) => {
                            this.listProduct.push({
                                name: `[${element.product_id}] - ${element.product_code} - ${element.product_name}`,
                                id: element.product_id,
                                product_code: element.product_code,
                                item_code: element.product_code,
                                item_name: element.product_name,
                                item_image: element.image,
                            });
                        });
                    } else {
                        data.data.forEach((element: any) => {
                            this.listProduct.push({
                                name: `[${element.product_id}] - ${element.product_code} - ${element.product_name}`,
                                id: element.product_id,
                                product_code: element.product_code,
                                item_code: element.product_code,
                                item_name: element.product_name,
                                item_image: element.image,
                            });
                        });
                    }
                }

                if (this.itemProduct > 0) {
                    this.selectedProduct = this.listProduct.filter(
                        (item: any) => item.id == this.itemProduct
                    )[0];
                } else {
                    this.selectedProduct = '';
                }
            });
    }
    ngOnInit(): void {
        //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
        //Add 'implements OnInit' to the class.
        this.loadData();
    }
    ngOnChanges(changes: SimpleChanges): void {
        if (changes['itemProduct']) {
            this.loadData();
        }
    }
    resetSelection() {
        this.selectedProduct = [];
        this.outClear.emit(true);
    }
}
