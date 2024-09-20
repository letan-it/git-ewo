import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { saveAs } from 'file-saver';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TransactionsService {

  constructor(private httpClient: HttpClient) { }
  private apiUrl = environment.api_EWO_Logistics + 'Transactions/';

  GET_transaction_setup(project_id: number) {
    return this.httpClient.post(this.apiUrl + 'GET_transaction_setup', {
      project_id
    })
  }
  transactions_Action(transaction_id: number, transaction_from: number, transaction_to: number, transaction_type: string,
    status: number, note: string, project_id: number, bill_type: string, action: string) {
    return this.httpClient.post(this.apiUrl + 'transactions_Action', {
      transaction_id, transaction_from, transaction_to, transaction_type, status, note, project_id, bill_type, action
    })
  }
  transaction_detail_Action(transaction_id: number, uuid: string, item_id: number, item_type: string,
    quantity: number, barcode: string, project_id: number, action: string) {
    return this.httpClient.post(this.apiUrl + 'transaction_detail_Action', {
      transaction_id, uuid, item_id, item_type, quantity, barcode, project_id, action
    })
  }
  transaction_file_Action(transaction_id: number, uuid: string, file_url: string, file_name: string,
    file_type: string, transaction_status: number, project_id: number, transaction_history_id: number, action: string) {
    return this.httpClient.post(this.apiUrl + 'transaction_file_Action', {
      transaction_id, uuid, file_url, file_name, file_type, transaction_status, project_id, transaction_history_id, action
    })
  }

  GET_transactions(transaction_id: number, uuid: string, transaction_from: number, transaction_to: number,
    transaction_type: string, created_by: number, created_date_from: number, created_date_to: number, transaction_status: number,
    project_id: number, bill_type: string) {
    return this.httpClient.post(this.apiUrl + 'GET_transactions', {
      transaction_id, uuid, transaction_from, transaction_to, transaction_type, created_by,
      created_date_from, created_date_to, transaction_status, project_id, bill_type
    })
  }

  GET_Tractionsaction_detail(project_id: number, transaction_id: number) {
    return this.httpClient.post(this.apiUrl + 'GET_Tractionsaction_detail', {
      project_id, transaction_id
    })
  }
  CREATE_Transaction(model: any) {
    return this.httpClient.post(this.apiUrl + 'CREATE_Transaction', model)
  }
  CREATE_Transaction_scan(model: any) {
    return this.httpClient.post(this.apiUrl + 'CREATE_Transaction_scan', model)
  }
  Summary_InventoryByLeader(employee_id: number, project_id: number) {
    return this.httpClient.post(this.apiUrl + 'Summary_InventoryByLeader', { employee_id, project_id })
  }
  GET_product_barcode(project_id: number, leader: number, action: string) {
    return this.httpClient.post(this.apiUrl + 'GET_product_barcode', { project_id, leader, action })
  }

  transactions_Rawdata(project_id: number, manager_id: number) {
    const body = new FormData();
    body.append('project_id', project_id.toString());
    body.append('manager_id', manager_id.toString());

    const url = this.apiUrl + 'transactions_Rawdata';
    const options = {
        responseType: 'blob' as 'json',
    };

    return this.httpClient
        .post(url, body, options)
        .subscribe((response) => {
            this.saveFile(response, '.xlsx', 'survey');
        });
  }

  saveFile(response: any, title: any = '.xlsx', file_name: string = '') {
    const currentTime = new Date();
    const filename =
        'download_' +
        file_name +
        '_' +
        currentTime.getFullYear().toString() +
        (currentTime.getMonth() + 1) +
        currentTime.getDate() +
        currentTime
            .toLocaleTimeString()
            .replace(/[ ]|[,]|[:]/g, '')
            .trim() +
        title;

    saveAs(response, filename);
}
}
