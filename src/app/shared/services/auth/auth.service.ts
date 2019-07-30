import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { EventEmitter, Injectable, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Credentials } from '@app/shared/models/credentials';
import { Session } from '@app/shared/models/session';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';


@Injectable()
export class AuthService {

  private jwt: JwtHelperService;

  private url = environment.apiUrl + '/auth';
  private headers = new HttpHeaders({ 'Content-Type': 'application/json' });

  private cachedRequests: Array<HttpRequest<any>>;

  private session: Session;

  @Output()
  sessionEmitter: EventEmitter<any> = new EventEmitter();

  constructor(private http: HttpClient, private router: Router) {
    this.jwt = new JwtHelperService;
  }

  private getTokenProperty(key: string) {
    const token = this.getToken();
    if (token !== null) {
      const decodedToken = this.jwt.decodeToken(token);
      return decodedToken[key];
    }
  }

  private getSession(): Session {
    this.session = {
      username: this.getTokenProperty('sub'),
      organisationId: this.getTokenProperty('orgId'),
      roleCodes: this.getTokenProperty('roleCodes')
    };

    return this.session;
  }

  public emitSession() {
    this.sessionEmitter.emit(this.getSession());
  }

  public getUsername() {
    return this.session.username;
  }

  public getToken(): string {
    return localStorage.getItem('auth-token');
  }

  public isAuthenticated(): boolean {
    return !this.jwt.isTokenExpired(this.getToken());
  }

  public hasRole(roleCode: string): boolean {
    return this.session.roleCodes.includes(roleCode);
  }

  public isOfOrganisation(organisationId: number) {
    return this.session.organisationId === organisationId;
  }

  public authenticate(credentials: Credentials): Observable<object> {
    // credentials = { username: credentials.username, password: credentials.password, email: null };
    delete credentials['recaptcha'];
    return this.http.post<object>(this.url, credentials);
  }

  public renew(): Observable<any> {
    const token = this.getToken();
    const user = { 'token': token };
    const postUrl = this.url + '/renew';
    return this.http.post<object>(postUrl, user);
  }

  public sendResetPasswordEmail(credentials: Credentials): Observable<any> {
    const postUrl = this.url + '/reset';
    return this.http.post<object>(postUrl, credentials);
  }

  public logout() {
    localStorage.removeItem('auth-token');
    this.emitSession();
    this.router.navigate(['']);
  }

  public collectFailedRequest(request) {
    this.cachedRequests.push(request);
  }

  public retryFailedRequests() {
    // retry the requests. this method can
    // be called after the token is refreshed
  }

  public verifyEmail(token: String): Observable<Object> {
    const url = environment.apiUrl + '/verify';

    return this.http.post<object>(url, token);
  }
}
