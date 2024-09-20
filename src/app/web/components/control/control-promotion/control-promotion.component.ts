import { Component, Input, Output, OnInit, OnChanges, SimpleChanges, EventEmitter } from '@angular/core';
import { EnumStatus } from 'src/app/Core/_enum';
import { Helper } from 'src/app/Core/_helper';
import { PromotionService } from 'src/app/web/service/promotion.service';

@Component({
  selector: 'app-control-promotion',
  templateUrl: './control-promotion.component.html',
  styleUrls: ['./control-promotion.component.scss']
})
export class ControlPromotionComponent implements OnChanges {

  @Input() inputStyle: any = { minWidth: '100%', maxWidth: '150px' };
  @Input() dateCode!: any
  @Output() outValue = new EventEmitter<any>


  constructor(private _service: PromotionService) { }


  promotion_id!: any
  selectedProduct: any
  listPromotion: any[] = []
  isLoadForm: number = 0
  rowPerPage: number = 10000
  pageNumber: number = 1

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['dateCode']) {
      this.getData()
    }
  }


  getData() {
    this._service.Promotion_GetList(Helper.ProjectID(), '', '', '', -1, 1, -1, this.rowPerPage, this.pageNumber).subscribe((res: any) => {
      if (res.result = EnumStatus.ok) {
        res.data?.forEach((i: any) => {
          this.listPromotion.push({
            code: i.promotion_id,
            name: i.promotion_code + "-" + i.promotion_name,
            promotion_code: i.promotion_code
          })
        })
      }
    })
  }

  returnValue(e: any) {
    if (e == null) {
      this.outValue.emit(null)
    } else { this.outValue.emit(e) }
  }
}
