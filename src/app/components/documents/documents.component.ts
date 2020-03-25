import { Component, OnInit } from '@angular/core';
import { Document } from '@app/shared/models/document';
import { DocumentService } from '@app/shared/services/document/document.service';
import 'rxjs/Rx';

@Component({
  selector: 'fwas-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss'],
})
export class DocumentsComponent implements OnInit {
  isLoading = true;
  documents: Array<Document>;
  currentDocument: Document;

  constructor(private documentService: DocumentService) {}

  ngOnInit() {
    this.documentService.readInfoDocuments().subscribe((data) => {
      this.documents = data;
    });
  }

  readDocumentContent(documentId: number) {
    this.documentService.readDocumentContents(documentId).subscribe((data) => {
      const url = 'data:' + data.dataType + ';base64,' + data.data;

      if (window.navigator.msSaveOrOpenBlob === undefined) {
        // for good browsers (and bad ones, but not as bad as IE)
        const downloadLink = document.createElement('a');
        downloadLink.href = url;
        downloadLink.download = data.filename;

        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      } else {
        // for stupid retarded IE

        // convert base64 to raw binary data held in a string
        // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
        const byteString = atob(data.data);
        // write the bytes of the string to an ArrayBuffer
        const ab = new ArrayBuffer(byteString.length);
        // create a view into the buffer
        const ia = new Uint8Array(ab);
        // set the bytes of the buffer to the correct values
        for (let i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }
        const blob = new Blob([ab], { type: data.dataType });
        window.navigator.msSaveOrOpenBlob(blob, data.filename);
      }

      /*
        // TODO: das esch noni sone gueti lösig -\(..)/-
        const downloadLink = document.createElement('a');
        downloadLink.href = url;
        downloadLink.download = data.filename;

        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        */
    });
  }
}
