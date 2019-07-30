import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { InfoWrapper } from '@app/shared/models/infoWrapper';
import { Offer } from '@app/shared/models/offer';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';


@Injectable()
export class OfferService {

  private url = environment.apiUrl + '/offers';
  private defaultSort = '?_sort=title&_order=asc';

  constructor(private http: HttpClient) { }

  public readFiltered(
    categoryIds: Array<number>,
    organisationIds: Array<number>,
    page: number,
    pageSize: number,
    onlyActive: boolean = false
  ): Observable<InfoWrapper<Offer>> {
    const queryUrl = this.generateFilterUrl(categoryIds, organisationIds, page, pageSize, onlyActive);
    return this.http.get<InfoWrapper<Offer>>(queryUrl);
  }

  public readById(offerId: number): Observable<Offer> {
    const queryUrl = this.url + '/' + offerId;
    return this.http.get<Offer>(queryUrl);
  }

  public save(offer: Offer): Observable<Offer> {
    return this.http.post<Offer>(this.url, offer);
  }

  public update(offer: Offer): Observable<Offer> {
    const putUrl = this.url + '/' + offer.id;
    return this.http.put<Offer>(putUrl, offer);
  }

  public delete(offer: Offer): Observable<Offer> {
    const deleteUrl = this.url + '/' + offer.id;
    return this.http.delete<Offer>(deleteUrl);
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
        queryUrl += '&category.id=' + categoryId;
      }
    }

    if (organisationIds.length > 0) {
      for (const organisationId of organisationIds) {
        queryUrl += '&organisation.id=' + organisationId;
      }
    }

    queryUrl += '&_page=' + page;
    queryUrl += '&_size=' + pageSize;
    queryUrl += '&active=' + onlyActive;

    return queryUrl;
  }
}
