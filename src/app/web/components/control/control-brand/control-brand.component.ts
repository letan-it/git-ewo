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
  selector: 'app-control-brand',
  templateUrl: './control-brand.component.html',
  styleUrls: ['./control-brand.component.scss']
})
export class ControlBrandComponent {
  constructor(private _service: CategoryService) { }
  isLoadForm = 1;
  selectedBrand: any;
  listBrand: any;

  @Input() selectMulti: any = false;
  @Input() placeholder: any = '-- Choose -- ';

  @Output() outValue = new EventEmitter<string>();
  @Output() outClear = new EventEmitter<boolean>();

  @Input() itemBrand!: number;
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
      this.listBrand = [];
      if (data.result == EnumStatus.ok) {

        data.data.forEach((element: any) => {
          this.listBrand.push({
            name: element.brand,
            id: element.category_id,
          });
        });

        // Sử dụng hàm removeDuplicates để loại bỏ các đối tượng trùng lặp 
        this.listBrand = Helper.removeDuplicates(this.listBrand)
      }

      if (this.itemBrand > 0) {
        this.selectedBrand = this.listBrand.filter(
          (item: any) => item.id == this.itemBrand
        )[0];
      } else {
        this.selectedBrand = '';
      }
    });
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.loadData();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['itemBrand']) {
      this.loadData();
    }
  }

  resetSelection() {
    this.selectedBrand = [];
    this.outClear.emit(true);
  }

}
