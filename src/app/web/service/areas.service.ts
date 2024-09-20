import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Areas } from "../models/areas";

@Injectable()
export class AreasService {
    constructor(
        private http : HttpClient
    ){}

    getListAreas(){
        return this.http
        .get<any>('assets/demo/data/areas.json')
        .toPromise()
        .then((res) => res.data as Areas[])
        .then((data) => data)
    }
}