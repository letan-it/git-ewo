import { Component } from '@angular/core';
import { SupervisionService } from '../../ReportATD/supervision/service/supervision.service';
import { Helper } from 'src/app/Core/_helper';
import { DatePipe } from '@angular/common';
import { EnumLocalStorage, EnumStatus, EnumSystem } from 'src/app/Core/_enum';
import { EncryptDecryptService } from 'src/app/Service/encrypt-decrypt.service';
import { MastersService } from 'src/app/web/service/masters.service';
import { EmployeesService } from 'src/app/web/service/employees.service';
import { DashboardReportService } from '../service/dashboard-report.service';

@Component({
  selector: 'app-employees-report',
  templateUrl: './employees-report.component.html',
  styleUrls: ['./employees-report.component.scss']
})
export class EmployeesReportComponent {
  constructor(
    private _service: SupervisionService,
    private _edCrypt: EncryptDecryptService,
    private masterService: MastersService,
    private employeesService: EmployeesService,
    private dashboardReportService: DashboardReportService
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
  currentDate: any;
  getFormatedDate(date: Date, format: string) {
    const datePipe = new DatePipe('en-US');
    return datePipe.transform(date, format);
  }
  getDate() {
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();

    this.currDate = `${year}${month > 9 ? month : "0" + month}${day > 9 ? day : "0" + day}`;
    this.firstDateOfMonth = `${year}${month > 9 ? month : "0" + month}01`;
    this.currentDate = Helper.convertDateStr1(this.currDate);
  }

  project_id: any;
  project: any;
  date: any;
  loadData() {
    this._service.MOBILE_web_Timekeeping_ListEmployee_JSE(
      this.project_id,
      // 20240821,
      // 20240821
      Helper.transformDateInt(this.start_time) === 19700101 ? this.firstDateOfMonth : Helper.transformDateInt(this.start_time),
      Helper.transformDateInt(this.start_time) === 19700101 ? this.currDate : Helper.transformDateInt(this.start_time)
    ).subscribe((data: any) => {
      if (data.result == EnumStatus.ok) {
        // console.log(data.data);
      }
    });
  }

  company: any = '';
  level: any = '';
  role: number = 0;
  employeeList: any;
  loadDataEmployee() {
    this.employeesService.ewo_Employee_EmployeeType_GetList(
      this.project_id,
      '7',
      this.company,
      this.level,
      this.role
    ).subscribe((data: any) => {
      if (data.result == EnumStatus.ok) {
        this.employeeList = data.data;
        console.log(this.employeeList);
      }
    })
  }

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

  menuItem: any = undefined;
  loadMenu() {
    this.dashboardReportService.WebApp_EmployeeGetFunction(this.project_id)
      .subscribe((data: any) => {
        if (data.result == EnumStatus.ok) {
          this.menuItem = data.data.functions;
          console.log(this.menuItem);
        }
      })
  }

  ngOnInit() {
    this.project_id = Helper.ProjectID();
    this.getDate();
    this.loadUser();
    this.loadData();
    this.loadDataEmployee();
    this.loadMenu();
  }

  openStatus: any = false;
  handleOpenStatus() {
    if (this.openStatus === false) {
      this.openStatus = true;
    } else if (this.openStatus === true) {
      this.openStatus = false;
    }
  }

  dialogEmployee: any = false;
  dialogAttendanceReport: any = false;
  dialogSelloutReport: any = false;
  showDialog(rawData: any) {
    console.log(rawData);
    if (rawData === 'Employees') {
      this.dialogEmployee = true;
    } else if (rawData === 'Attendance') {
      this.dialogAttendanceReport = true;
    } else if (rawData === 'Sell Out') {
      this.dialogSelloutReport = true;
    } else if (rawData === 'POSM') {
      
    } else if (rawData === 'Process') {
      
    } else if (rawData === 'Contact') {
      
    } else if (rawData === 'Document') {
      
    }
  }
  closeDialogEmployee() {
    this.dialogEmployee = false;
  }
  closeDialogAttendanceReport() {
    this.dialogAttendanceReport = false;
  }
  closeDialogSellOutReport() {
    this.dialogSelloutReport = false;
  }
}
