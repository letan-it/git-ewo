import { Component, EventEmitter, Input, Output } from '@angular/core';
import { EnumAction, EnumStatus } from 'src/app/Core/_enum';
import { Helper } from 'src/app/Core/_helper';
import { OolService } from 'src/app/web/service/ool.service';

@Component({
  selector: 'app-control-ool-list',
  templateUrl: './control-ool-list.component.html',
  styleUrls: ['./control-ool-list.component.scss']
})
export class ControlOolListComponent {

  constructor(
    private _service: OolService
  ) { }
  @Input() itemOOl: any;
  @Output() outValue = new EventEmitter<string>();
  @Output() outClear = new EventEmitter<boolean>();


  returnValue(value: any) {
    this.outValue.emit(value)
  }
  ngOnInit() {

    this.loadData()
  }
  isLoadForm = 1;
  listOOl: any = []
  selectedListOOL!: any[];
  loadData() {
    this.isLoadForm = 1;
    this._service.OOL_List_GetList(Helper.ProjectID())
      .subscribe((data: any) => {
        this.isLoadForm = 0;
        if (data.result == EnumStatus.ok) {
          data.data.forEach((element: any) => {
            if (element.status == 1) {
              this.listOOl.push({
                id: element.ool_id,
                name: `[${element.ool_id}] - ${element.ool_code} - ${element.ool_name}`
              })
            }
          });
        }
      })

  }

  resetSelection() {
    this.selectedListOOL = [];
    this.outClear.emit(true);
  }

}