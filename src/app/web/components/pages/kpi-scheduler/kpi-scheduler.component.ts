import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { EnumStatus } from 'src/app/Core/_enum';
import { Helper } from 'src/app/Core/_helper';
import { Pf } from 'src/app/_helpers/pf';
import { AppComponent } from 'src/app/app.component';
import { KpiSchedulerService } from 'src/app/web/service/kpi-scheduler.service';
import { MastersService } from 'src/app/web/service/masters.service';

@Component({
  selector: 'app-kpi-scheduler',
  templateUrl: './kpi-scheduler.component.html',
  styleUrls: ['./kpi-scheduler.component.scss'],
  providers: [ConfirmationService]
})
export class KpiSchedulerComponent {


  constructor(
    private _service: KpiSchedulerService,
    private masterService: MastersService,
    private messageService: MessageService,
    private router: Router,
  ) { }
  items_menu: any = [
    { label: ' MASTER' },
    { label: ' KPI Scheduler', icon: 'pi pi-calendar' },
  ];
  home: any = { icon: 'pi pi-chart-bar', routerLink: '/dashboard' };
  menu_id = 63;
  check_permissions() {
    const menu = JSON.parse(localStorage.getItem('menu') + '').filter(
      (item: any) => item.menu_id == this.menu_id && item.check == 1
    );
    if (menu.length > 0) {
    } else {
      this.router.navigate(['/empty']);
    }
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.loadData()
    this.check_permissions()
  }
  loading: boolean = false;

  listKPIScheduler: any = []
  loadData() {
    this.masterService.ewo_GetMaster(Helper.ProjectID())
      .subscribe((data: any) => {
        if (data.result == EnumStatus.ok) {
          if (data.data.length > 0) {
            this.listKPIScheduler = data.data.filter((d: any) => d.ListCode == 'KPI' && d.Status == 1 && d.Id != 2 && d.Id != 4);
          }
        }
      })
  }
  type: any = []
  dayName: any = []
  calendar: any = []
  position: any = []
  category: any = []

  selectedType: any = null;
  selectedDayName: any[] = [];
  selectedCalendar: any[] = [];
  selectedPostion: any[] = [];
  selectedCategory: any[] = [];

  getItemKPI(kpi_id: any) {
    this._service.KPI_Scheduler_GetItem(kpi_id, Helper.ProjectID())
      .subscribe((data: any) => {
        if (data.result == EnumStatus.ok) {
          // this.type = data.data.type
          this.type = []
          this.dayName = []
          this.calendar = []
          this.position = []
          this.category = []

          if (Helper.IsNull(data.data.type) != true && data.data.type.length > 0) {
            data.data.type.forEach((t: any) => {
              this.type.push({
                name: t.code,
                key: t.code,
                check: t.check
              })
            });
            this.type.forEach((t2: any, index: any) => {
              if (t2.check == 1) {
                this.selectedType = this.type[index];
              }
            });
          }
          this.setUpKPI(data.data.dayName, this.dayName, this.selectedDayName);
          this.setUpKPI(data.data.calendar, this.calendar, this.selectedCalendar);

          const position = data.data.employee.filter((e: any) => e.ListCode == 'Employee.Position');
          const category = data.data.employee.filter((e: any) => e.ListCode == 'Employee.Category');
          // this.setUpKPIEmployee(position, this.position);
          // this.setUpKPIEmployee(category, this.category);

          this.setUpKPI(position, this.position, this.selectedPostion);
          this.setUpKPI(category, this.category, this.selectedCategory);

        }
      })
  }


  setUpKPI(data: any, value: any, selectValue: any) {
    if (Helper.IsNull(data) != true && data.length > 0) {
      data.forEach((dn: any) => {
        value.push({
          name: dn.code,
          key: dn.code,
          check: dn.check
        })
      });
      value.forEach((dn2: any, index: any) => {
        if (dn2.check == 1) {
          selectValue.push(value[index])
        }
      })
    }
  }
  setUpKPIEmployee(data: any, value: any) {
    if (Helper.IsNull(data) != true && data.length > 0) {
      data.forEach((t: any) => {
        value.push({
          name: t.code,
          key: t.code
        })
      });
    }
  }

  ingredient: any = null;
  week: string[] = [];
  pos_cat: string[] = [];
  selectedweek: string[] = [];
  selectedmonth: string[] = [];
  listmonth = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
  listmonth1 = ['11', '12', '13', '14', '15', '16', '17', '18', '19', '20'];
  listmonth2 = ['21', '22', '23', '24', '25', '26', '27', '28', '29', '30'];


  kpiDialog: boolean = false;
  kpi: any = null
  visible: boolean = false;

  updateKPI(item: any) {
    this.kpi = { ...item };
    this.getItemKPI(item.Id);
    this.clear();
    this.kpiDialog = true;
  }

  hideDialog() {
    this.kpiDialog = false;
    this.clear();
  }

  weekStr: any = null
  monthStr: any = null
  positionStr: any = null
  categoryStr: any = null
  chooseKPI(list: any): any {
    let value = ''
    if (Helper.IsNull(list) != true && list.length > 0) {
      list.forEach((dn: any, index: any) => {
        if (index < list.length - 1) {
          value += dn.name + ','
        } else {
          value += dn.name
        }
        // value += dn.name + ','
      });
    }
    return value
  }
  saveKPI() {

    // && this.selectedType.name == 'weekly'
    this.weekStr = Helper.IsNull(this.chooseKPI(this.selectedDayName)) != true ? this.chooseKPI(this.selectedDayName) : null;
    // && this.selectedType.name == 'monthly'
    this.monthStr = Helper.IsNull(this.chooseKPI(this.selectedCalendar)) != true ? this.chooseKPI(this.selectedCalendar) : null;
    this.positionStr = Helper.IsNull(this.chooseKPI(this.selectedPostion)) != true ? this.chooseKPI(this.selectedPostion) : null;
    this.categoryStr = Helper.IsNull(this.chooseKPI(this.selectedCategory)) != true ? this.chooseKPI(this.selectedCategory) : null;


    this._service.KPI_Scheduler_Update(this.kpi.Id, Helper.ProjectID(), this.selectedType.name, this.weekStr,
      this.monthStr, this.positionStr, this.categoryStr)
      .subscribe((data: any) => {
        if (data.result == EnumStatus.ok) {
          this.NofiResult('Page KPI Scheduler', 'KPI Scheduler Update', 'KPI Scheduler Update Success', 'success', 'SuccessFull');
        } else {
          this.NofiResult('Page KPI Scheduler', 'KPI Scheduler Update', 'KPI Scheduler Update Error', 'error', 'Error');
        }
        this.clearActionSave()
      })

  }
  changeValue(type: any) {

    if (type.value.name == 'daily') {
      this.selectedDayName = [];
      this.selectedCalendar = [];
    } else if (type.value.name == 'weekly') {
      this.selectedCalendar = [];
    } else {
      this.selectedDayName = [];
    }
  }
  clear() {
    this.selectedDayName = [];
    this.selectedCalendar = [];
    this.selectedPostion = [];
    this.selectedCategory = [];
    this.weekStr = null;
    this.monthStr = null;
    this.positionStr = null;
    this.categoryStr = null;

  }
  clearActionSave() {
    this.kpiDialog = false;
    this.kpi = {};
    this.clear();
    this.loadData();
  }

  Nofi(severity: any, summary: any, name: any) {
    this.messageService.add({
      severity: severity,
      summary: summary,
      detail: name,
    });
  }

  NofiImage(value: any, name: any): any {
    let check = 0;
    if (value != 'png' && value != 'jpg' && value != 'jpeg') {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: name + ' wrong format',
      });
      check = 1;
    }
    return check;
  }

  NofiDecimal(value: any, name: any): any {
    let check = 0;
    if (Pf.checkDecimal(value) != true) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: name + ' wrong format',
      });
      check = 1;
    }
    return check;
  }

  checkNumber(value: any, name: any): any {
    if (Helper.number(value) != true) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: name + ' wrong format',
      });
      return 1;
    }
    return 0;
  }

  NofiDecimal1(value: any, name: any): any {
    let check = 0;
    if (Pf.checkDecimal(value) != true) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: name + ' wrong format',
      });
      check = 1;
    }
    return check;
  }


  NofiIsNull(value: any, name: any): any {
    let check = 0;
    if (value == 0) {
      value += '';
    }
    if (Helper.IsNull(value) == true || Pf.checkSpace(value) != true) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Please enter a ' + name,
      });
      check = 1;
    }
    return check;
  }
  IsNull(value: any): any {
    return Helper.IsNull(value)
  }

  NofiResult(page: any, action: any, name: any, severity: any, summary: any) {
    this.messageService.add({
      severity: severity,
      summary: summary,
      detail: name,
      life: 3000,
    });

    AppComponent.pushMsg(
      page,
      action,
      name,
      severity == 'success' ? EnumStatus.ok : EnumStatus.error,
      0
    );

  }



}
