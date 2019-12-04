import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { InfoWrapper } from '@app/shared/models/infoWrapper';
import { Participant } from '@app/shared/models/participant';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable()
export class ParticipantService {
  private url = environment.apiUrl + '/organisations/';
  private participantUrl = '/participants';
  private defaultSort = '?_sort=person.lastname&_order=asc';

  constructor(private http: HttpClient) {}

  public readFiltered(
    organisationId: number,
    adIds: Array<number>,
    status: Array<string>,
    page: number,
    pageSize: number
  ): Observable<InfoWrapper<Participant>> {
    const queryUrl = this.generateFilterUrl(
      organisationId,
      adIds,
      status,
      page,
      pageSize
    );
    return this.http.get<InfoWrapper<Participant>>(queryUrl);
  }

  public readById(
    participantId: number,
    organisationId: number
  ): Observable<Participant> {
    const queryUrl =
      this.url + organisationId + this.participantUrl + '/' + participantId;
    return this.http.get<Participant>(queryUrl);
  }

  public save(
    participant: Participant,
    notifyOrg: boolean = false
  ): Observable<Participant> {
    const postUrl =
      this.url +
      participant.organisationId +
      this.participantUrl +
      '?notifyOrg=' +
      notifyOrg;
    return this.http.post<Participant>(postUrl, participant);
  }

  public update(participant: Participant): Observable<Participant> {
    const putUrl =
      this.url +
      participant.organisationId +
      this.participantUrl +
      '/' +
      participant.id;
    return this.http.put<Participant>(putUrl, participant);
  }

  public delete(participant: Participant): Observable<Participant> {
    const deleteUrl =
      this.url +
      participant.organisationId +
      this.participantUrl +
      '/' +
      participant.id;
    return this.http.delete<Participant>(deleteUrl);
  }

  private generateFilterUrl(
    organisationId: number,
    adIds: Array<number>,
    status: Array<string>,
    page: number,
    pageSize: number
  ): string {
    let queryUrl =
      this.url + organisationId + this.participantUrl + this.defaultSort;

    if (adIds.length > 0) {
      for (const adId of adIds) {
        queryUrl += '&adId=' + adId;
      }
    }

    if (status.length > 0) {
      for (const oneStatus of status) {
        queryUrl += '&status=' + oneStatus;
      }
    }

    queryUrl += '&_page=' + page;
    queryUrl += '&_size=' + pageSize;

    return queryUrl;
  }
}
