import {
    Component,
    Output,
    EventEmitter,
    Input,
    SimpleChanges,
} from '@angular/core';
import { EnumStatus } from 'src/app/Core/_enum';
import { Helper } from 'src/app/Core/_helper';
import { CategoryService } from 'src/app/web/service/category.service';
@Component({
    selector: 'app-control-osa-category',
    templateUrl: './control-osa-category.component.html',
    styleUrls: ['./control-osa-category.component.scss'],
})
export class ControlOsaCategoryComponent {
    constructor(private _service: CategoryService) { }
    isLoadForm = 1;
    selectedCategory: any;
    listCategory: any;

    @Input() selectMulti: any = false;
    @Input() placeholder: any = '-- Choose -- ';

    @Output() outValue = new EventEmitter<string>();
    @Output() outClear = new EventEmitter<boolean>();

    @Input() itemCategory!: number;
    @Input() inputStyle: any = { minWidth: '100%', maxWidth: '150px' };

    returnValue(value: any) {
        this.outValue.emit(value);
    }
    loadData() {
        this.isLoadForm = 1;
        this._service.Get_Categories(
            Helper.ProjectID(), '',
            '', '', '', '',
            '', '',
        ).subscribe((data: any) => {
            this.isLoadForm = 0;
            this.listCategory = [];
            if (data.result == EnumStatus.ok) {
                data.data.forEach((element: any) => {
                    this.listCategory.push({
                        name: '[' + element.category_id + '] - ' + element.category_name + ' - ' + element.category_name_vi,
                        id: element.category_id,
                    });
                });
            }

            if (this.itemCategory > 0) {
                this.selectedCategory = this.listCategory.filter(
                    (item: any) => item.id == this.itemCategory
                )[0];
            } else {
                this.selectedCategory = '';
            }
        });
    }
    ngOnInit(): void {
        //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
        //Add 'implements OnInit' to the class.
        this.loadData();
    }
    ngOnChanges(changes: SimpleChanges): void {
        if (changes['itemCategory']) {
            this.loadData();
        }
    }

    resetSelection() {
        this.selectedCategory = [];
        this.outClear.emit(true);
    }

}
