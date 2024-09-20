import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { EnumStatus } from 'src/app/Core/_enum';
import { Helper } from 'src/app/Core/_helper';
import { Pf } from 'src/app/_helpers/pf';
import { AppComponent } from 'src/app/app.component';
import { KpiSchedulerService } from 'src/app/web/service/kpi-scheduler.service';
import { LogsService } from 'src/app/web/service/logs.service';
import { MastersService } from 'src/app/web/service/masters.service';


@Component({
  selector: 'app-log-device',
  templateUrl: './log-device.component.html',
  styleUrls: ['./log-device.component.scss'],
  providers: [ConfirmationService]
})
export class LogDeviceComponent {

  constructor(
    private _service: LogsService,
    private masterService: MastersService,
    private messageService: MessageService,
    private router: Router,
  ) { }
  items_menu: any = [
    { label: ' MASTER' },
    { label: ' Log Device ', icon: 'pi pi-calculator' },
  ];
  home: any = { icon: 'pi pi-chart-bar', routerLink: '/dashboard' };
  menu_id = 86;
  check_permissions() {
    const menu = JSON.parse(localStorage.getItem('menu') + '').filter(
      (item: any) => item.menu_id == this.menu_id && item.check == 1
    );
    if (menu.length > 0) {
    } else {
      this.router.navigate(['/empty']);
    }
  }
  login_name: any = null;
  employee_code: any = null;

  currentDate: any = null
  listMonth: any = []
  year_month: any = null
  date: any = null;
  created_date_int: any = null;
  orders: any = null
  getMonth() {
    const date = new Date()
    const year = date.getFullYear();
    const monthToday = date.getMonth() + 1;
    const monthString = monthToday.toString().padStart(2, '0');
    this.currentDate = parseInt(year + monthString)

    for (let i = 1; i <= 12; i++) {
      const month = i.toString().padStart(2, '0')
      // const dateString = `${year} - Tháng ${month}`

      const dataMonth = Helper.getMonth()
      this.listMonth = dataMonth.ListMonth
      // Ko đăng kí tháng cũ
      // this.listMonth = this.listMonth?.filter((i: any) => i?.code >= this.currentDate)

    }
    this.year_month = this.listMonth?.find((i: any) => (i?.code == this.currentDate))

  }
  getDate() {
    let today = new Date();
    this.date = new Date(today);
    this.setDate(this.date);
  }
  changeDate(event: any) {
    console.log(event);
  }
  setDate(date: any) {
    if (Helper.IsNull(date) != true) {
      this.created_date_int = Helper.convertDate(new Date(date))
      this.created_date_int = Helper.transformDateInt(new Date(this.created_date_int))
    } else {
      this.created_date_int = null;
    }

  }

  items: any;

  cols: any = [];
  selectedColumns: any = [];

  ngOnInit(): void {
    this.check_permissions();
    this.items = [
      {
        label: 'Raw data',
        icon: 'pi pi-file-excel',
        command: () => {
          this.export();
        },
      },
      {
        label: 'Raw register the device',
        icon: 'pi pi-file-excel',
        command: () => {
          this.exportRawRegisterTheDevice();
        },
      }
    ];
    this.getMonth();
    // this.getDate();
    console.log(this.date);
    this.loadData(1);
  }

  first: number = 0;
  totalRecords: number = 0;
  rows: number = 20;
  _pageNumber: number = 1;

  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
    this._pageNumber = (this.first + this.rows) / this.rows;
    this.loadData(this._pageNumber);
  }

  isLoading_Filter: any = false;
  listLogDevice: any = [];
  loadData(pageNumber: number) {
    if (pageNumber == 1) {
      this.first = 0;
      this.totalRecords = 0;
      this._pageNumber = 1;
    }
    this.setDate(this.date);
    this.isLoading_Filter = true;

    this._service.ewo_LogDevice_GetList(Helper.ProjectID(), this.login_name, this.employee_code,
      Helper.IsNull(this.year_month) != true ? this.year_month.code : 0,
      this.created_date_int, this.rows, pageNumber)
      .subscribe((data: any) => {
        if (data.result == EnumStatus.ok) {
          this.listLogDevice = data.data
          this.listLogDevice = this.listLogDevice.map((item: any) => ({
            ...item,
            _login_name: `[${item.user_id}] - ${item.login_name}`,
            _employee_code: `[${item.employee_id}] - ${item.employee_code} - ${item.employee_name}`,
            _year_month: Helper.transformYearMonth(item.year_month + '')
          }));
          this.totalRecords = Helper.IsNull(this.listLogDevice) != true ? this.listLogDevice[0].TotalRows : 0;
          this.isLoading_Filter = false
        } else {
          this.listLogDevice = [];
          this.isLoading_Filter = false;

        }
      })
  }
  export() {
    this._service.ewo_LogDevice_RawData(Helper.ProjectID(), this.login_name, this.employee_code,
      Helper.IsNull(this.year_month) != true ? this.year_month.code : 0, this.created_date_int, 1000000000, 1)
  }
  exportRawRegisterTheDevice() {
    this._service.Raw_register_the_device(Helper.ProjectID())
  }

  showFilter: number = 1;
  ShowHideFilter() {
    if (this.showFilter == 1) {
      this.showFilter = 0;
    } else {
      this.showFilter = 1;
    }
  }

}
