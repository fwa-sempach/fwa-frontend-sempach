import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Config } from '@app/shared/models/config';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable()
export class ConfigService {
  private apiUrl = environment.apiUrl + '/config';

  constructor(private http: HttpClient) {}

  public readConfig(): Observable<Config> {
    return this.http.get<Config>(this.apiUrl);
  }
}
