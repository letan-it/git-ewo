import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ProductService } from 'src/app/web/service/product.service';
import { ScriptLoaderService } from './ScriptLoaderService.service';

@Component({
    selector: 'app-view',
    templateUrl: './view.component.html',

    styleUrls: ['./view.component.scss'],
})
export class ViewComponent {
    someObject(item: any) {
        try {
            return JSON.parse(item);
        } catch (e) {
            return item;
        }
    }

    returnStringJson(item: any): string {
      try {
          return JSON.stringify(item, null, 4);
      } catch (error) {
          return item
      }
    }
  format() {
     this.jsonResult =  this.returnStringJson(this.someObject(this.jsonResult))
    }

    constructor(private scriptLoaderService: ScriptLoaderService) {}

    ngOnInit() {}

    callCalculatorFunction(): void {
         
        var data = (window as any).calculator(this.jsonResult);
        this.return_data_formular = data;
    }

  return_data_formular: any;
  jsonResult:any
    scriptUrl = 'https://it.acacy.vn/assets/js/formular-test.js';

    callFuntion() {
        this.scriptLoaderService
            .loadScript(this.scriptUrl)
            .then(() => {
                // Script has been loaded, you can now call the calculator function
                this.callCalculatorFunction();
            })
            .catch((error) => {
                // Handle any errors that occurred during script loading
                console.error('Error loading script:', error);
            });
    }
}
