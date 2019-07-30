import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';


import { environment } from 'environments/environment';
import { Category } from '@app/shared/models/category';



@Injectable()
export class CategoryService {

  private url = environment.apiUrl + '/categories';
  private headers = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient) { }

  public readAll(): Observable<Array<Category>> {
    return this.http.get<Array<Category>>(this.url);
  }

}
