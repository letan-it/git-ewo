import {
    Component,
    EventEmitter,
    Input,
    Output,
    SimpleChanges,
} from '@angular/core';
import { MessageService } from 'primeng/api';
import { Helper } from 'src/app/Core/_helper';
import { ActivationService } from 'src/app/web/service/activation.service';
import { InventoryService } from '../../../inventory/service/inventory.service';
import { EnumStatus } from 'src/app/Core/_enum';

@Component({
    selector: 'app-works-inventory',
    templateUrl: './works-inventory.component.html',
    styleUrls: ['./works-inventory.component.scss'],
})
export class WorksInventoryComponent {
    @Input() inValue: any;
    @Output() outValue = new EventEmitter<any>();

    constructor(
        private _service: ActivationService,
        private messageService: MessageService,
        private InvenService: InventoryService
    ) {}

    //listinValue: any = []
    ngOnChanges(changes: SimpleChanges): void {
        //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
        //Add '${implements OnChanges}' to the class.
        if (changes['inValue']) {
            if (Helper.IsNull(this.inValue) != true) {
                //this.listinValue = this.inValue
            }
        }
    }

    // ngOnInit(): void {
    //     this.inValue.data_inventory.forEach((z: any) => {
    //         z.details.forEach((e: any) => {
    //             e.tooltip =
    //                 e.update_by != null
    //                     ? 'Updated by: ' +
    //                       e.updated_name +
    //                       '(' +
    //                       e.updated_code +
    //                       ')'
    //                     : 'Created by: ' +
    //                       e.created_name +
    //                       '(' +
    //                       e.created_code +
    //                       ')';
    //         });
    //     });
    // }

    openOnRowEdit: boolean = false;
    onRowEditInit(product: any) {
        // console.log("CHECK");
        // console.log("Product: ", product);
        this.InvenService.Reasons_inventory_GetList(
            Helper.ProjectID(),
            ''
        ).subscribe((data: any) => {
            if (data.result == EnumStatus.ok) {
                this.reasons = data.data.reason_list;
            }
        });
    }

    reason: any = null;
    reasons: any = [];
    onRowEditSave(product: any) {
        if (product.before_input > 0 && product.after_input > 0) {
            this.InvenService.Details_Action(
                Helper.ProjectID(),
                product.id,
                +product.before_input,
                +product.after_input,
                (product.reason_id = this.reason?.reason_id),
                product.note
            ).subscribe((data: any) => {
                if (data.result == EnumStatus.ok) {
                    product.reason_name = this.reason?.reason_name;
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: '',
                    });
                } else {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: '',
                    });
                }
            });
        } else {
            this.messageService.add({
                severity: 'warn',
                summary: 'Data transmitted must be greater than 0',
                detail: '',
            });
        }
    }

    onRowEditCancel(product: any, index: number) {}

    selectedProduct: any = [];
    product_code: any;
    selectProduct_Filter(event: any, result: any) {
        this.product_code = '';
        console.log('selectProduct_Filter : ', event);
        console.log(result);
        if (Helper.IsNull(event.value) != true && event.value.length > 0) {
            event.value.forEach((element: any) => {
                this.product_code += element.code + ',';
            });
        } else {
            this.product_code = '';
        }
        this.filterProduct(this.product_code, result);
    }

    filterProduct(product_code: string, result: any) {
        // 14729,
        console.log('filterProduct - product_code : ', product_code);

        const filterValues = product_code.split(',');

        console.log('filterValues :', filterValues);
        filterValues.forEach((fil: any) => {
            console.log('fil : ', fil);
        });

        if (
            product_code != '' &&
            product_code != null &&
            product_code != undefined
        ) {
            // details = details.filter((item: any) => filterValues.includes(item.product_code));

            //console.log('this.listinValue : ', this.listinValue)
            let details = [] as any;
            this.inValue.data_inventory.forEach((r: any) => {
                if (r.result_id == result.result_id) {
                    details = r.details.filter((item: any) =>
                        filterValues.includes(item.product_code)
                    );
                    console.log('details : ', details);
                }
            });

            this.inValue.data_inventory.forEach((r: any) => {
                if (r.result_id == result.result_id) {
                    r.details = details;
                }
            });
        }
    }

    clearSelectProduct(result: any) {
        let details = [] as any;
        this.inValue.data_inventory.forEach((r: any) => {
            if (r.result_id == result.result_id) {
                details = r.details;
            }
        });

        this.inValue.data_inventory.forEach((r: any) => {
            if (r.result_id == result.result_id) {
                r.details = details;
            }
        });
    }

    getSeverity(status: string): any {
        switch (status) {
            case 'OK':
                return 'success';
            default:
                return 'danger';
            /*
    case 'LOWSTOCK':
      return 'warning';
      */
        }
    }

    urlgallery: any;
    showImageProduct(url: any) {
        this.urlgallery = url;
        document.open(
            <string>this.urlgallery,
            'windowName',
            'height=700,width=900,top=100,left= 539.647'
        );
    }
}
