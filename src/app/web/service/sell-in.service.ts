import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { saveAs } from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class SellInService {

  constructor(private httpClient: HttpClient) { }
  private apiUrl = environment.api_EWO_SELL + 'SellIns/';


  // SellIn_Product
  SellIn_Product_GetList(project_id: number, year_month: number, shop_code: string, product_id: string,
    rowPerPage: number, pageNumber: number) {
    return this.httpClient.post(this.apiUrl + 'SellIn_Product_GetList', {
      project_id, year_month, shop_code, product_id, rowPerPage, pageNumber
    })
  }

  SellIn_Product_Action(project_id: number, year_month: number, shop_code: string, product_id: string, orders: number) {
    return this.httpClient.post(this.apiUrl + 'SellIn_Product_Action', {
      project_id, year_month, shop_code, product_id, orders
    })
  }

  SellIn_Product_GetTemplate(project_id: number) {
    const body = new FormData();
    body.append('project_id', project_id.toString());
    const url = this.apiUrl + 'SellIn_Product_GetTemplate';
    const options = {
      responseType: 'blob' as 'json'
    };

    return this.httpClient.post(url, body, options)
      .subscribe((response) => {
        this.saveFile(response, 'SellIn_Product_GetTemplate')
      })

  }

  SellIn_Product_ImportData(formDataUpload: FormData, project_id: number, year_month: number) {
    formDataUpload.append('project_id', project_id.toString());
    formDataUpload.append('year_month', year_month.toString());
    return this.httpClient.post(this.apiUrl + 'SellIn_Product_ImportData', formDataUpload)
  }

  SellIn_Product_RawData(project_id: number, year_month: number, shop_code: string) {
    const url = this.apiUrl + 'SellIn_Product_RawData';
    const options = {
      responseType: 'blob' as 'json'
    }
    const request = {
      project_id, year_month, shop_code
    }
    return this.httpClient.post(url, request, options)
      .subscribe((response) => {
        this.saveFile(response, 'SellIn_Product_RawData')
      })
  }


  //SellIn_Target
  SellIn_Target_GetList(project_id: number, year_month: number, shop_code: string, rowPerPage: number, pageNumber: number) {
    return this.httpClient.post(this.apiUrl + 'SellIn_Target_GetList', {
      project_id, year_month, shop_code, rowPerPage, pageNumber
    })
  }

  SellIn_Target_Action(project_id: number, year_month: number, shop_code: string, target: number) {
    return this.httpClient.post(this.apiUrl + 'SellIn_Target_Action', {
      project_id, year_month, shop_code, target
    })
  }

  SellIn_Target_GetTemplate(project_id: number) {
    const body = new FormData();
    body.append('project_id', project_id.toString())

    const url = this.apiUrl + 'SellIn_Target_GetTemplate'
    const options = {
      responseType: 'blob' as 'json'
    }
    return this.httpClient.post(url, body, options)
      .subscribe((response) => {
        this.saveFile(response, 'SellIn_Target_GetTemplate')
      })
  }

  SellIn_Target_ImportData(formDataUpload: FormData, project_id: number, year_month: number) {
    formDataUpload.append('project_id', project_id.toString())
    formDataUpload.append('year_month', year_month.toString())
    return this.httpClient.post(this.apiUrl + 'SellIn_Target_ImportData', formDataUpload)
  }

  SellIn_Target_RawData(project_id: number, year_month: number, shop_code: string, rowPerPage: number, pageNumber: number) {
    const url = this.apiUrl + 'SellIn_Target_RawData'
    const options = {
      responseType: 'blob' as 'json'
    }
    const request = {
      project_id, year_month, shop_code, rowPerPage, pageNumber
    }
    return this.httpClient.post(url, request, options)
      .subscribe((response) => {
        this.saveFile(response, 'SellIn_Target_RawData')
      })
  }

  // SellIn_Employee
  SellIn_Employee_GetList(project_id: number, year_month: number, employee_id: string, rowPerPage: number, pageNumber: number) {
    return this.httpClient.post(this.apiUrl + 'SellIn_Employee_GetList', {
      project_id, year_month, employee_id, rowPerPage, pageNumber
    })
  }

  SellIn_Employee_Action(project_id: number, year_month: number, employee_id: string, value: number
  ) {
    return this.httpClient.post(this.apiUrl + 'SellIn_Employee_Action', {
      project_id, year_month, employee_id, value
    })
  }

  SellIn_Employee_GetTemplate(project_id: number) {
    const body = new FormData();
    body.append('project_id', project_id.toString())

    const url = this.apiUrl + 'SellIn_Employee_GetTemplate'
    const options = {
      responseType: 'blob' as 'json'
    }
    return this.httpClient.post(url, body, options)
      .subscribe((response) => {
        this.saveFile(response, 'SellIn_Employee_GetTemplate')
      })
  }

  SellIn_Employee_ImportData(formDataUpload: FormData, project_id: number, year_month: number) {
    formDataUpload.append('project_id', project_id.toString())
    formDataUpload.append('year_month', year_month.toString())
    return this.httpClient.post(this.apiUrl + 'SellIn_Employee_ImportData', formDataUpload)
  }

  SellIn_Employee_RawData(project_id: number, year_month: number, employee_id: string, RowPerPage: number, PageNumber: number) {
    const url = this.apiUrl + 'SellIn_Employee_RawData'
    const options = {
      responseType: 'blob' as 'json'
    }
    const request = {
      project_id, year_month, employee_id, RowPerPage, PageNumber
    }
    return this.httpClient.post(url, request, options)
      .subscribe((response) => {
        this.saveFile(response, 'SellIn_Employee_RawData')
      })
  }



  // SellIn_Result

  SellIn_Result_GetList(project_id: number, report_id: number) {
    const body = new FormData();
    body.append('project_id', project_id.toString());
    body.append('report_id', report_id.toString());
    return this.httpClient.post(this.apiUrl + 'SellIn_Result_GetList', body)
  }
  SellIn_Result_Action(project_id: number, sellin_id: number, comfirm_status: number, comfirm_note: string) {
    return this.httpClient.post(this.apiUrl + 'SellIn_Result_Action', {
      project_id, sellin_id, comfirm_status, comfirm_note
    })
  }
  SellIn_Detail_Action(project_id: number, id: number, quantity: number, price: number
  ) {
    return this.httpClient.post(this.apiUrl + 'SellIn_Detail_Action', {
      project_id, id, quantity, price
    })
  }
  SellIn_Image_Action(project_id: number, sellin_id: number, idDetails: number, id: number, image_type: string, url: string, action: string
  ) {
    return this.httpClient.post(this.apiUrl + 'SellIn_Image_Action', {
      project_id, sellin_id, idDetails, id, image_type, url, action
    })
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
