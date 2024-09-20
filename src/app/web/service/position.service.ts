import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Position } from '../models/position';

@Injectable()
export class PositionService {
    constructor(private http: HttpClient) {}

    getPosition(){
        return this.http 
        .get<any>('assets/demo/data/Position.json')
        .toPromise()
        .then((res) => res.data as Position[])
        .then((data) => data)
    }
}
