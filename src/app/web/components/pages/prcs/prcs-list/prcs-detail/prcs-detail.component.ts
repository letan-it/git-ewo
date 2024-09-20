import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { PrcsService } from '../../service/prcs.service';
import { MenuItem, MessageService } from 'primeng/api';
import { Helper } from 'src/app/Core/_helper';
import { EnumStatus } from 'src/app/Core/_enum';

@Component({
  selector: 'app-prcs-detail',
  templateUrl: './prcs-detail.component.html',
  styleUrls: ['./prcs-detail.component.scss']
})
export class PrcsDetailComponent {
  @Input() inValue: any;
  @Output() outValue = new EventEmitter<any>();
  @Input() action: any = 'view';

  items!: MenuItem[];
  activeIndex: number = 0;
  onActiveIndexChange(event: any) {
    this.activeIndex = event;
    this._service.PrcGetprocesbyProjectsDetail(
      Helper.ProjectID(),
      this.PrcId
    ).subscribe((data: any) => {
      if (data.result == EnumStatus.ok) {
        let itemSteps: MenuItem[] = [];
        data.data.process_project_detail.forEach((element: any) => {
          itemSteps.push({
            id: element.order,
            label: element.desc + ' - ' + element.action_name,
          })
          if (element.order == this.activeIndex + 1) {
            this.listProcessProjectDetail = []
            this.listProcessProjectDetail.push(element)
          }
        })

        this.items = itemSteps;
      }
    })
  }

  constructor(
    private _service: PrcsService,
    private messageService: MessageService,
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    if (changes['inValue']) {
      if (Helper.IsNull(this.inValue) != true) {
        //this.listinValue = this.inValue
      }
    }
  }

  listProcessProjectDetail: any = []

  loadItemSteps() {
    
  }

  PrcId!: number;
  ngOnInit(): void {
    this.PrcId = this.inValue.Prc_id;
    // this.loadData();
    this.onActiveIndexChange(0)
  }

  openEdit() { }
  openDelete() { }

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
