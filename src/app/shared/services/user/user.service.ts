import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Credentials } from '@app/shared/models/credentials';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private url = environment.apiUrl + '/users';

  constructor(private http: HttpClient) {}

  public register(credentials: Credentials): Observable<object> {
    return this.http.post<object>(this.url, credentials);
  }

  public changePassword(credentials: Credentials): Observable<object> {
    const patchUrl = this.url + '/' + credentials.username;
    return this.http.put<object>(patchUrl, credentials);
  }
}
