import { Component } from '@angular/core';
import { ActivationService } from 'src/app/web/service/activation.service';
import { MastersService } from 'src/app/web/service/masters.service';
import { EncryptDecryptService } from 'src/app/Service/encrypt-decrypt.service';
import { EnumLocalStorage, EnumStatus, EnumSystem } from 'src/app/Core/_enum';
import { Helper } from 'src/app/Core/_helper';
import { DatePipe } from '@angular/common';
import { Pf } from 'src/app/_helpers/pf';
import { DashboardReportService } from '../service/dashboard-report.service';

@Component({
  selector: 'app-sellout-report',
  templateUrl: './sellout-report.component.html',
  styleUrls: ['./sellout-report.component.scss']
})
export class SelloutReportComponent {
  constructor(
    private _service: DashboardReportService,
    private _edCrypt: EncryptDecryptService,
    private masterService: MastersService,
    public acti_service: ActivationService,
  ) { }

  GetLanguage(key: string) {
    return Helper.GetLanguage(key)
  }
  getLanguage() {
    this.masterService.ewo_GetLanguage(this.project_id).subscribe((data: any) => {
      if (data.result == EnumStatus.ok) {
        localStorage.setItem('key_language', 'vn')
        localStorage.setItem('language', JSON.stringify(data.data))
      }
    })
  }

  start_time: any = null;
  currDate?: any;
  firstDateOfMonth: any;
  lastDateOfMonth: any;
  currentDate: any;
  dateStart: any | undefined;
  getFormatedDate(date: Date, format: string) {
    const datePipe = new DatePipe('en-US');
    return datePipe.transform(date, format);
  }
  month: any;
  getDate() {
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;

    if (month < 10) {
      let x = '0' + month.toString();
      month = +x;
      +month;
    }
    let day = date.getDate();

    this.currDate = `${year}${month > 9 ? month : "0" + month}${day > 9 ? day : "0" + day}`;
    if (this.month === null || this.month === undefined) {
      this.month = month;
      this.firstDateOfMonth = `${year}${month > 9 ? month : "0" + month}01`;
      this.lastDateOfMonth = `${year}${month > 9 ? month : "0" + month}${Pf.lastDayMonth('', month)}`;
    } else {
      this.firstDateOfMonth = `${year}${month > 9 ? month : "0" + month}01`;
      this.lastDateOfMonth = `${year}${month > 9 ? month : "0" + month}${Pf.lastDayMonth('', +this.month)}`;
    }

    this.currentDate = Helper.convertDateStr1(this.currDate);
  }

  selectMonth: any;
  ListMonth: any = [];
  getMonth(date: Date, format: string) {
    const today = new Date();
    const monthToday = today.getMonth() + 1;
    const year = today.getFullYear();

    const datePipe = new DatePipe('en-US');
    let monthNow = parseInt(datePipe.transform(date, format) as any) || 0;
    if (monthNow < 12) {
      monthNow++;
    }
    const dataMonth = Helper.getMonth();
    this.ListMonth = dataMonth.ListMonth;

    const monthString = monthToday.toString().padStart(2, '0');
    const currentDate = parseInt(year + monthString);
    if (Helper.IsNull(this.selectMonth) == true) {
      this.selectMonth = this.ListMonth?.find(
        (i: any) => i?.code == currentDate
      );
    }
  }

  listRawDataManager: any = []; // data cho manager
  listRawDataEmployee: any = []; // data cho employee
  listSellOutEmployee: any = []; // danh sách nhân viên sellout
  listTargetEmployee: any = []; // danh sách nhân viên target (chỉ tiêu)

  previousTotalSales: any;
  nowTotalSales: any;
  percentDifference: any = 0;
  loadData() {
    this._service.Mobile_SummarySellOut(this.project_id, this.selectMonth.code)
      .subscribe((data: any) => {
        if (data.result == EnumStatus.ok) {
          this.listSellOutEmployee = data.data.employee_list;
          if (this.userProfile.employee_type_id === 8) {
            for (let i = 0; i < data.data.employee_list.length; i++) {
              let temp = data.data.employee_list[i].employee_id;
              let emp = [];
              for (
                let j = 0;
                j < data.data.sellout_bydate.length;
                j++
              ) {
                if (
                  data.data.sellout_bydate[j].employee_id === temp
                ) {
                  if (data.data.monthly_target[j].employee_id === temp) {
                    if (+data.data.sellout_bydate[j].amount > +data.data.monthly_target[j].value) {
                      data.data.sellout_bydate[j].percent_kpi =
                        (((+data.data.sellout_bydate[j].amount - +data.data.monthly_target[j].value) / +data.data.monthly_target[j].value) * 100).toFixed(2);
                      console.log(+data.data.sellout_bydate[j].amount);
                      console.log(+data.data.monthly_target[j].value);
                      console.log(+data.data.sellout_bydate[j].amount - +data.data.monthly_target[j].value);
                        data.data.sellout_bydate[j].differenceTarget = 
                        Helper.formatCurrencyUnit(
                          +data.data.sellout_bydate[j].amount - +data.data.monthly_target[j].value
                        );
                      data.data.sellout_bydate[j].amount =
                        Helper.formatCurrencyUnit(
                          data.data.sellout_bydate[j].amount
                        );
                      data.data.sellout_bydate[j].target =
                        Helper.formatCurrencyUnit(
                          data.data.monthly_target[j].value
                        );
                      emp.push(data.data.sellout_bydate[j]);
                      console.log(this.listSellOutEmployee);
                    } else if (+data.data.sellout_bydate[j].amount < +data.data.monthly_target[j].value) {
                      data.data.sellout_bydate[j].percent_kpi =
                        (((+data.data.monthly_target[j].value - +data.data.sellout_bydate[j].amount) / +data.data.sellout_bydate[j].amount) * 100).toFixed(2);
                      data.data.sellout_bydate[j].amount =
                        Helper.formatCurrencyUnit(
                          data.data.sellout_bydate[j].amount
                        );
                      data.data.sellout_bydate[j].target =
                        Helper.formatCurrencyUnit(
                          data.data.monthly_target[j].value
                        );
                      emp.push(data.data.sellout_bydate[j]);
                    }
                  }
                }
              }
              data.data.employee_list[i].emp = emp;
              data.data.employee_list[i].money =
                Helper.formatCurrencyUnit(
                  data.data.employee_list[i].amount
                );
            }
            this.listSellOutEmployee = data.data.employee_list;
            this.listTargetEmployee = data.data.monthly_target;

            let totalSales = 0;
            data.data.employee_list.forEach((item: any) => {
              totalSales = totalSales + item.amount;
            });
            this.nowTotalSales = totalSales;

            this._service.Mobile_SummarySellOut(this.project_id, this.selectMonth.code - 1)
              .subscribe((data: any) => {
                if (data.result == EnumStatus.ok) {
                  let previousTotalSales = 0;
                  data.data.employee_list.forEach((item: any) => {
                    previousTotalSales = previousTotalSales + item.amount;
                  });
                  this.previousTotalSales = previousTotalSales;
                  if (this.nowTotalSales > this.previousTotalSales && this.previousTotalSales !== 0) {
                    this.percentDifference = ((this.nowTotalSales - this.previousTotalSales) / this.previousTotalSales * 100).toFixed();
                  } else if (this.nowTotalSales < this.previousTotalSales && this.previousTotalSales !== 0) {
                    this.percentDifference = ((this.previousTotalSales - this.nowTotalSales) / this.previousTotalSales * 100).toFixed();
                  } else if (this.previousTotalSales === 0) {
                    this.percentDifference = 100;
                  }

                  let temp = {
                    "_key": "admin",
                    "name_vn": "Doanh số bán của cả team",
                    "icon": "pi pi-money-bill",
                    "color": "black",
                    "background": "white",
                    "Values": `${Helper.formatAmount(this.nowTotalSales)}`
                  }
                  this.listRawDataManager.push(temp);
                }
              }
            )
          } else if (this.userProfile.employee_type_id === 7) {
            for (let i = 0; i < data.data.employee_list.length; i++) {
              let temp = data.data.employee_list[i].employee_id;
              let emp = [];
              for (
                let j = 0;
                j < data.data.sellout_bydate.length;
                j++
              ) {
                if (
                  data.data.sellout_bydate[j].employee_id === temp
                ) {
                  if (data.data.monthly_target[j].employee_id === temp) {
                    if (+data.data.sellout_bydate[j].amount > +data.data.monthly_target[j].value) {
                      data.data.sellout_bydate[j].percent_kpi =
                        (((+data.data.sellout_bydate[j].amount - +data.data.monthly_target[j].value) / +data.data.monthly_target[j].value) * 100).toFixed(2);
                      console.log(+data.data.sellout_bydate[j].amount);
                      console.log(+data.data.monthly_target[j].value);
                      console.log(+data.data.sellout_bydate[j].amount - +data.data.monthly_target[j].value);
                        data.data.sellout_bydate[j].differenceTarget = 
                        Helper.formatCurrencyUnit(
                          +data.data.sellout_bydate[j].amount - +data.data.monthly_target[j].value
                        );
                      data.data.sellout_bydate[j].amount =
                        Helper.formatCurrencyUnit(
                          data.data.sellout_bydate[j].amount
                        );
                      data.data.sellout_bydate[j].target =
                        Helper.formatCurrencyUnit(
                          data.data.monthly_target[j].value
                        );
                      emp.push(data.data.sellout_bydate[j]);
                    } else if (+data.data.sellout_bydate[j].amount < +data.data.monthly_target[j].value) {
                      data.data.sellout_bydate[j].percent_kpi =
                        (((+data.data.monthly_target[j].value - +data.data.sellout_bydate[j].amount) / +data.data.sellout_bydate[j].amount) * 100).toFixed(2);
                      data.data.sellout_bydate[j].differenceTarget = 
                        Helper.formatCurrencyUnit(
                          +data.data.monthly_target[j].value - +data.data.sellout_bydate[j].amount
                        );
                      data.data.sellout_bydate[j].amount =
                        Helper.formatCurrencyUnit(
                          data.data.sellout_bydate[j].amount
                        );
                      data.data.sellout_bydate[j].target =
                        Helper.formatCurrencyUnit(
                          data.data.monthly_target[j].value
                        );
                      emp.push(data.data.sellout_bydate[j]);
                    }
                  }
                }
              }
              data.data.employee_list[i].emp = emp;
              data.data.employee_list[i].money =
                Helper.formatCurrencyUnit(
                  data.data.employee_list[i].amount
                );
            }

            let totalSales = 0;
            data.data.employee_list.forEach((item: any) => {
              totalSales = totalSales + item.amount;
            });
            this.nowTotalSales = totalSales;

            this._service.Mobile_SummarySellOut(this.project_id, this.selectMonth.code - 1)
              .subscribe((data: any) => {
                if (data.result == EnumStatus.ok) {
                  let previousTotalSales = 0;
                  data.data.employee_list.forEach((item: any) => {
                    previousTotalSales = previousTotalSales + item.amount;
                  });
                  this.previousTotalSales = previousTotalSales;
                  if (this.nowTotalSales > this.previousTotalSales && this.previousTotalSales !== 0) {
                    this.percentDifference = ((this.nowTotalSales - this.previousTotalSales) / (this.previousTotalSales / 100)).toFixed();
                  } else if (this.nowTotalSales < this.previousTotalSales && this.previousTotalSales !== 0) {
                    this.percentDifference = ((this.previousTotalSales - this.nowTotalSales) / (this.previousTotalSales / 100)).toFixed();
                  } else if (this.previousTotalSales === 0) {
                    this.percentDifference = 100;
                  }

                  let temp = {
                    "_key": "admin",
                    "name_vn": "Doanh số bán trong tháng",
                    "icon": "pi pi-money-bill",
                    "color": "black",
                    "background": "white",
                    "Values": `${Helper.formatAmount(this.nowTotalSales)}`
                  }
                  this.listRawDataEmployee.push(temp);
                }
              }
            )
          }
        }
      }
    )
  }

  project_id: any;
  project: any;
  token: any;
  user_profile: string = 'current';
  currentUser: any;
  userProfile: any;
  loadUser() {
    if (this.user_profile == EnumSystem.current) {
      let _u = localStorage.getItem(EnumLocalStorage.user);

      this.currentUser = JSON.parse(
        this._edCrypt.decryptUsingAES256(_u)
      );
      this.currentUser.employee[0]._status =
        this.currentUser.employee[0].status == 1 ? true : false;
      this.userProfile = this.currentUser.employee[0];

      const project = this.currentUser.projects.filter(
        (p: any) => p.project_id == Helper.ProjectID()
      );
      this.project = project[0];
    }
  }

  ngOnInit() {
    this.project_id = Helper.ProjectID();
    this.getDate();
    let newDate = new Date();
    this.getMonth(newDate, 'MM');
    this.loadUser();
    this.listRawDataManager = [];
    this.listRawDataEmployee = [];
    this.percentDifference = 0;
    this.loadData();
  }

  chooseMonthYear() {
    this.month = this.selectMonth?.code.toString().slice(4, 6);
    this.getDate();
    this.listRawDataManager = [];
    this.listRawDataEmployee = [];
    this.percentDifference = 0;
    this.loadData();
  }

  empValue: any;
  openDetail(event: any, rawData: any) {
    this.empValue = rawData;
    // console.log(this.empValue);
  }
}
