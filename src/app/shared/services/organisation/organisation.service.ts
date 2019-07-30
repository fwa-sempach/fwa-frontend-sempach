import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { InfoWrapper } from '@app/shared/models/infoWrapper';
import { Organisation } from '@app/shared/models/organisation';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable()
export class OrganisationService {

  private url = environment.apiUrl + '/organisations';
  private defaultSort = '?_sort=orgName&_order=asc';

  constructor(private http: HttpClient) { }

  public readAll(): Observable<InfoWrapper<Organisation>> {
    return this.http.get<InfoWrapper<Organisation>>(this.url + '?_size=1000000');
  }

  public readFiltered(
    page: number,
    pageSize: number,
    onlyVerified: boolean = true
  ): Observable<InfoWrapper<Organisation>> {
    const queryUrl = this.generateFilterUrl(page, pageSize, onlyVerified);
    return this.http.get<InfoWrapper<Organisation>>(queryUrl);
  }

  public readById(organisationId: number): Observable<Organisation> {
    const queryUrl = this.url + '/' + organisationId;
    return this.http.get<Organisation>(queryUrl);
  }

  public save(organisation: Organisation): Observable<Organisation> {
    return this.http.post<Organisation>(this.url, organisation);
  }

  public update(organisation: Organisation, notifyOrg: boolean = false): Observable<Organisation> {
    const putUrl = this.url + '/' + organisation.id + '?notifyOrg=' + notifyOrg;
    return this.http.put<Organisation>(putUrl, organisation);
  }

  private generateFilterUrl(page: number, pageSize: number, onlyVerified: boolean): string {
    let queryUrl = this.url + this.defaultSort;

    queryUrl += '&_page=' + page;
    queryUrl += '&_size=' + pageSize;
    queryUrl += '&verified=' + onlyVerified;

    return queryUrl;
  }
}
