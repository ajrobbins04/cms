import { Injectable, EventEmitter} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Document } from './document.model';
import { MOCKDOCUMENTS } from './MOCKDOCUMENTS';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  documents: Document[] = [];
  maxDocumentId: number;

  documentListChangedEvent = new Subject<Document[]>();
  documentSelectedEvent = new EventEmitter<Document>();

  constructor(private http: HttpClient) { 
    this.getDocuments();
  }

  getMaxId(): number {
    let maxId = 0;
    for (let document of this.documents) {
        const currentId = parseInt(document.id);
        if (currentId > maxId) {
            maxId = currentId;
        }
    }

    return maxId;
  }

  getDocuments() {
    this.http.get<Document[]>('https://wdd430-cms-ajrobbins-default-rtdb.firebaseio.com/documents.json')
      .subscribe(
        // success callback
        (documents: Document[]) => {
          this.documents = documents;
          this.maxDocumentId = this.getMaxId();
          this.documents.sort((a, b) => {
            if (a.name < b.name) return -1;             
            if (a.name > b.name) return 1;
            return 0;
          });
  

          this.documentListChangedEvent.next(this.documents.slice());
        },
        // error callback
        (error: any) => {
          console.error('Error fetching documents:', error);
        }
      );
  }
  

  getDocument(id: string): Document {
    for (let document of this.documents) {
      if (document.id === id) {
        return document; // Return the document with the matching ID
      }
    }
    return null; // Return null if no document with the given ID is found
  }

  addDocument(newDocument: Document) {
    if (!newDocument) {
        return;
    }
    this.maxDocumentId += 1;
    newDocument.id = this.maxDocumentId.toString();

    this.documents.push(newDocument);

    const documentsListClone = this.documents.slice();
    this.documentListChangedEvent.next(documentsListClone);
  }

  updateDocument(originalDocument: Document, newDocument: Document) {
    if (!originalDocument || !newDocument) {
        return;
    }
    const pos = this.documents.indexOf(originalDocument)
    if (pos < 0) {
        return;
    }
    newDocument.id = originalDocument.id;
    this.documents[pos] = newDocument;

    const documentsListClone = this.documents.slice();
    this.documentListChangedEvent.next(documentsListClone);
  }

  deleteDocument(document: Document) {
    if (!document) {
      return;
    }
    const pos = this.documents.indexOf(document);
    if (pos < 0) {
      return;
    }
    this.documents.splice(pos, 1);

    const documentsListClone = this.documents.slice();
    this.documentListChangedEvent.next(documentsListClone);
  }
}
