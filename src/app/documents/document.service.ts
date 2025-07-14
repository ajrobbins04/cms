import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Document } from './document.model';

@Injectable({
  providedIn: 'root',
})
export class DocumentService {
  documents: Document[] = [];

  documentListChangedEvent = new Subject<Document[]>();
  documentSelectedEvent = new EventEmitter<Document>();

  constructor(private http: HttpClient) {
    this.getDocuments();
  }

  getDocuments() {
    this.http.get<{message: String; documents: Document[] }>('http://localhost:3000/documents')
    .subscribe({
      next: (responseData) => {

        this.documents = responseData.documents || [];
  
        this.documents.sort((a, b) => {
          if (a.name < b.name) return -1;
          if (a.name > b.name) return 1;
          return 0;
        });
  
        this.documentListChangedEvent.next(this.documents.slice());
      },
      error: (error: any) => {
        console.error('Error fetching documents:', error);
      }
    });
  }
  

  getDocument(id: string): Document {
    for (let document of this.documents) {
      if (document.id === id) {
        return document; // Return the document with the matching ID
      }
    }
    return null; // Return null if no document with the given ID is found
  }

  addDocument(document: Document) {
    if (!document) {
      return;
    }
    document.id = '';
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http
      .post<{ message: string; document: Document }>(
        'http://localhost:3000/documents',
        document,
        { headers: headers }
      )
      .subscribe({
        next: (responseData) => {
          // Add new document to local array
          this.documents.push(responseData.document);
          this.documentListChangedEvent.next(this.documents.slice());
        },
        error: (error) => {
          console.error('Failed to add document:', error);
        },
      });
  }

  updateDocument(originalDocument: Document, newDocument: Document) {
    if (!originalDocument || !newDocument) return;

    const pos = this.documents.indexOf(originalDocument);

    if (pos < 0) {
      return;
    }

    // Ensure newDocument retains original identifiers
    newDocument.id = originalDocument.id;
    newDocument['_id'] = originalDocument['_id'];

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http
      .put<{ message: string }>(
        'http://localhost:3000/documents/' + originalDocument.id,
        newDocument,
        { headers: headers }
      )
      .subscribe({
        next: (response) => {
          this.documents[pos] = newDocument;
          this.documentListChangedEvent.next(this.documents.slice());

        },
        error: (error) => {
          console.error('Error updating document:', error);
        },
      });
  }

  deleteDocument(document: Document) {
    if (!document) {
      return;
    }
    const pos = this.documents.indexOf(document);
    if (pos < 0) {
      return;
    }
    this.http
      .delete<{ message: string }>(
        `http://localhost:3000/documents/${document.id}`
      )
      .subscribe({
        next: (response) => {
          this.documents.splice(pos, 1);
          this.documentListChangedEvent.next(this.documents.slice());
        },
        error: (error) => {
          console.error('Error deleting document:', error);
        },
      });
  }
}
