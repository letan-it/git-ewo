import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { saveAs } from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class SellOutService {

  constructor(private httpClient: HttpClient) { }
  private apiUrl = environment.api_EWO_SELL + 'SellOuts/';


  // TopProduct
  TopProduct_GetList(project_id: number, year_month: number, shop_code: string, product_id: string,
    rowPerPage: number, pageNumber: number) {
    return this.httpClient.post(this.apiUrl + 'TopProduct_GetList', {
      project_id, year_month, shop_code, product_id, rowPerPage, pageNumber
    })
  }

  TopProduct_Action(project_id: number, year_month: number, shop_code: string, product_id: string, orders: number) {
    return this.httpClient.post(this.apiUrl + 'TopProduct_Action', {
      project_id, year_month, shop_code, product_id, orders
    })
  }

  TopProduct_GetTemplate(project_id: number) {
    const body = new FormData();
    body.append('project_id', project_id.toString());
    const url = this.apiUrl + 'TopProduct_GetTemplate';
    const options = {
      responseType: 'blob' as 'json'
    };

    return this.httpClient.post(url, body, options)
      .subscribe((response) => {
        this.saveFile(response, 'TopProduct_GetTemplate')
      })

  }

  TopProduct_ImportData(formDataUpload: FormData, project_id: number, year_month: number) {
    formDataUpload.append('project_id', project_id.toString());
    formDataUpload.append('year_month', year_month.toString());
    return this.httpClient.post(this.apiUrl + 'TopProduct_ImportData', formDataUpload)
  }

  TopProduct_RawData(project_id: number, year_month: number, shop_code: string) {
    const url = this.apiUrl + 'TopProduct_RawData';
    const options = {
      responseType: 'blob' as 'json'
    }
    const request = {
      project_id, year_month, shop_code
    }
    return this.httpClient.post(url, request, options)
      .subscribe((response) => {
        this.saveFile(response, 'TopProduct_RawData')
      })
  }


  //SellOut_Target
  SellOut_Target_GetList(project_id: number, year_month: number, shop_code: string, rowPerPage: number, pageNumber: number) {
    return this.httpClient.post(this.apiUrl + 'SellOut_Target_GetList', {
      project_id, year_month, shop_code, rowPerPage, pageNumber
    })
  }

  SellOut_Target_Action(project_id: number, year_month: number, shop_code: string, target: number) {
    return this.httpClient.post(this.apiUrl + 'SellOut_Target_Action', {
      project_id, year_month, shop_code, target
    })
  }

  SellOut_Target_GetTemplate(project_id: number) {
    const body = new FormData();
    body.append('project_id', project_id.toString())

    const url = this.apiUrl + 'SellOut_Target_GetTemplate'
    const options = {
      responseType: 'blob' as 'json'
    }
    return this.httpClient.post(url, body, options)
      .subscribe((response) => {
        this.saveFile(response, 'SellOut_Target_GetTemplate')
      })
  }

  SellOut_Target_ImportData(formDataUpload: FormData, project_id: number, year_month: number) {
    formDataUpload.append('project_id', project_id.toString())
    formDataUpload.append('year_month', year_month.toString())
    return this.httpClient.post(this.apiUrl + 'SellOut_Target_ImportData', formDataUpload)
  }

  SellOut_Target_RawData(project_id: number, year_month: number, shop_code: string, rowPerPage: number, pageNumber: number) {
    const url = this.apiUrl + 'SellOut_Target_RawData'
    const options = {
      responseType: 'blob' as 'json'
    }
    const request = {
      project_id, year_month, shop_code, rowPerPage, pageNumber
    }
    return this.httpClient.post(url, request, options)
      .subscribe((response) => {
        this.saveFile(response, 'SellOut_Target_RawData')
      })
  }

  // SellOut_Employee
  SellOut_Employee_GetList(project_id: number, year_month: number, employee_id: string, rowPerPage: number, pageNumber: number) {
    return this.httpClient.post(this.apiUrl + 'SellOut_Employee_GetList', {
      project_id, year_month, employee_id, rowPerPage, pageNumber
    })
  }

  SellOut_Employee_Action(project_id: number, year_month: number, employee_id: string, value: number
  ) {
    return this.httpClient.post(this.apiUrl + 'SellOut_Employee_Action', {
      project_id, year_month, employee_id, value
    })
  }

  SellOut_Employee_GetTemplate(project_id: number) {
    const body = new FormData();
    body.append('project_id', project_id.toString())

    const url = this.apiUrl + 'SellOut_Employee_GetTemplate'
    const options = {
      responseType: 'blob' as 'json'
    }
    return this.httpClient.post(url, body, options)
      .subscribe((response) => {
        this.saveFile(response, 'SellOut_Employee_GetTemplate')
      })
  }

  SellOut_Employee_ImportData(formDataUpload: FormData, project_id: number, year_month: number) {
    formDataUpload.append('project_id', project_id.toString())
    formDataUpload.append('year_month', year_month.toString())
    return this.httpClient.post(this.apiUrl + 'SellOut_Employee_ImportData', formDataUpload)
  }

  SellOut_Employee_RawData(project_id: number, year_month: number, employee_id: string, RowPerPage: number, PageNumber: number) {
    const url = this.apiUrl + 'SellOut_Employee_RawData'
    const options = {
      responseType: 'blob' as 'json'
    }
    const request = {
      project_id, year_month, employee_id, RowPerPage, PageNumber
    }
    return this.httpClient.post(url, request, options)
      .subscribe((response) => {
        this.saveFile(response, 'SellOut_Employee_RawData')
      })
  }



  // SellOut_Result

  SellOut_Result_GetList(project_id: number, report_id: number) {
    const body = new FormData();
    body.append('project_id', project_id.toString());
    body.append('report_id', report_id.toString());
    return this.httpClient.post(this.apiUrl + 'SellOut_Result_GetList', body)
  }
  SellOut_Result_Action(project_id: number, sellout_id: number, comfirm_status: number, comfirm_note: string) {
    return this.httpClient.post(this.apiUrl + 'SellOut_Result_Action', {
      project_id, sellout_id, comfirm_status, comfirm_note
    })
  }
  SellOut_Detail_Action(project_id: number, id: number, quantity: number, price: number
  ) {
    return this.httpClient.post(this.apiUrl + 'SellOut_Detail_Action', {
      project_id, id, quantity, price
    })
  }
  SellOut_Image_Action(project_id: number, idDetails: number, id: number, url: string, action: string
  ) {
    return this.httpClient.post(this.apiUrl + 'SellOut_Image_Action', {
      project_id, idDetails, id, url, action
    })
  }

  // SellOut Config
  Config_sellout_GetList(project_id: number, fromdate: number, todate: number) {
    return this.httpClient.post(this.apiUrl + 'Config_sellout_GetList', {
      project_id, fromdate, todate
  })
  }

  Config_sellout_Action(config_id: number, project_id: number, active_date: number, input_quantity: number, input_price: number, add_product: number, sellout_result: number, photo_item: number, system_price: number, info_customer: string, action: string) {
    return this.httpClient.post(
      this.apiUrl + 'Config_sellout_Action', {
        config_id, project_id, active_date, input_quantity, input_price, add_product, sellout_result, photo_item, system_price, info_customer, action
      }
    )
  }

  saveFile(response: any, file_name: string = '') {
    const currentTime = new Date();
    const filename = 'download_' + file_name + '_' +
      currentTime.getFullYear().toString() +
      (currentTime.getMonth() + 1) +
      currentTime.getDate() +
      currentTime
        .toLocaleTimeString()
        .replace(/[ ]|[,]|[:]/g, '')
        .trim() +
      '.xlsx';

    saveAs(response, filename);
  }

}
 