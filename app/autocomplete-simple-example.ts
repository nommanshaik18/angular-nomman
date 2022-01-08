import { Component, Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Observable, of, Subscription } from 'rxjs';
import {
  tap,
  startWith,
  debounceTime,
  switchMap,
  map,
  filter,
} from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class Service {
  httpclient: any;
  constructor(private http: HttpClient) {}

  opts = [];

  getData() {
    return this.opts.length
      ? of(this.opts)
      : this.http
          .get<any>(
            'https://raw.githubusercontent.com/nshntarora/Indian-Cities-JSON/master/cities.json'
          )
          .pipe(tap((data) => (this.opts = data)));
  }
}

/**
 * @title Simple autocomplete
 */
@Component({
  selector: 'autocomplete-simple-example',
  templateUrl: 'autocomplete-simple-example.html',
  styleUrls: ['autocomplete-simple-example.css'],
})
export class AutocompleteSimpleExample {
  myControl = new FormControl();

  filteredOptions: Observable<any>;

  constructor(private service: Service) {}
  citi_id: any;
  ngOnInit() {
    // this.service.getData().subscribe((data) => this.onGetTaxList(data));
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      switchMap((value) => this._filter(value))
    );
  }

  private _filter(value: string) {
    const filterValue = value.toLowerCase();
    return this.service.getData().pipe(
      filter((data) => !!data),
      map((data) => {
        // console.log('data', data[0].id);
        for (var i = 0; i < data.length; i++) {
          if (data[i].name === value) {
            this.citi_id = data[i].id;
          }
        }
        // console.log('this.citi_id', this.citi_id);
        return data.filter((option) =>
          option.name.toLowerCase().includes(value)
        );
      })
    );
  }

  getcities() {
    this.service.getData().subscribe((res: any) => {
      console.log('reult', res[0]);
    });
  }
}

/**  Copyright 2019 Google Inc. All Rights Reserved.
    Use of this source code is governed by an MIT-style license that
    can be found in the LICENSE file at http://angular.io/license */
