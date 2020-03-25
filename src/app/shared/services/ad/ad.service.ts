import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Ad } from '@app/shared/models/ad';
import { InfoWrapper } from '@app/shared/models/infoWrapper';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable()
export class AdService {
  private url = environment.apiUrl + '/jobads';
  private defaultSort = '?_sort=title&_order=asc';

  constructor(private http: HttpClient) {}

  public readFiltered(
    categoryIds: Array<number>,
    organisationIds: Array<number>,
    page: number,
    pageSize: number,
    onlyActive: boolean = false
  ): Observable<InfoWrapper<Ad>> {
    const queryUrl = this.generateFilterUrl(
      categoryIds,
      organisationIds,
      page,
      pageSize,
      onlyActive
    );
    return this.http.get<InfoWrapper<Ad>>(queryUrl);
  }

  public readById(adId: number): Observable<Ad> {
    const queryUrl = this.url + '/' + adId;
    return this.http.get<Ad>(queryUrl);
  }

  public save(ad: Ad): Observable<Ad> {
    return this.http.post<Ad>(this.url, ad);
  }

  public update(ad: Ad): Observable<Ad> {
    const putUrl = this.url + '/' + ad.id;
    return this.http.put<Ad>(putUrl, ad);
  }

  public delete(ad: Ad): Observable<Ad> {
    const deleteUrl = this.url + '/' + ad.id;
    return this.http.delete<Ad>(deleteUrl);
  }

  private generateFilterUrl(
    categoryIds: Array<Number>,
    organisationIds: Array<number>,
    page: number,
    pageSize: number,
    onlyActive: boolean
  ): string {
    let queryUrl = this.url + this.defaultSort;

    if (categoryIds.length > 0) {
      for (const categoryId of categoryIds) {
        queryUrl += '&offer.category.id=' + categoryId;
      }
    }

    if (organisationIds.length > 0) {
      for (const organisationId of organisationIds) {
        queryUrl += '&offer.organisation.id=' + organisationId;
      }
    }

    queryUrl += '&_page=' + page;
    queryUrl += '&_size=' + pageSize;
    queryUrl += '&active=' + onlyActive;

    return queryUrl;
  }
}
