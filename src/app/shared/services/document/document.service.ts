import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Document } from '@app/shared/models/document';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable()
export class DocumentService {
  private url = environment.apiUrl + '/documents';

  constructor(private http: HttpClient) {}

  public readInfoDocuments(): Observable<Array<Document>> {
    return this.http.get<Array<Document>>(this.url);
  }

  public readDocumentContents(idDocument: number): Observable<Document> {
    const url = this.url + '/' + idDocument;
    return this.http.get<Document>(url);
  }
}
