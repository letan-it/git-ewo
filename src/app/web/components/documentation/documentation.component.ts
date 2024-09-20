import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Helper } from './../../../Core/_helper';

 
@Component({
    templateUrl: './documentation.component.html',
    styleUrls: ['./documentation.component.scss'],
})
export class DocumentationComponent implements OnInit {
 
    constructor() {
       
    }
    project_id: number =0
  ngOnInit() {
    this.project_id = Helper.ProjectID();
    
        const jsonResult = [
            {
              "projectId": 1,
              "productId": 3674,
              "price": 2,
              "categoryId": 4,
              "company": "Unilever",
              "package": null,
              "brandCode": "320611389",
              "divisionCode": "3",
              "marketCode": "320611",
              "target": 5,
              "reasonId": null,
              "quantityValue": 4,
              "priceValue": 50000,
              "oosValue": 0,
              "oocValue": 1
            },
            {
              "projectId": 1,
              "productId": 3675,
              "price": 340000,
              "categoryId": 4,
              "company": "Unilever",
              "package": null,
              "brandCode": "320611389",
              "divisionCode": "3",
              "marketCode": "320611",
              "target": 3,
              "reasonId": null,
              "quantityValue": 4,
              "priceValue": 30000,
              "oosValue": 0,
              "oocValue": 1
            }
          ] as any
          

    }
}
