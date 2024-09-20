import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ShopsService } from 'src/app/web/service/shops.service';

@Component({
    selector: 'app-attendances',
    templateUrl: './attendances.component.html',
    styleUrls: ['./attendances.component.scss'],
})
export class attendancesComponent {

    constructor(private router: Router, 
        private _service: ShopsService) {}

    customer_code: string = '';

}
