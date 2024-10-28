import { EventEmitter } from '@angular/core';
import { Document } from './document.model';

import { MOCKDOCUMENTS } from './MOCKDOCUMENTS'; 

export class DocumentService {
    documents: Document[] = [];
    documentSelectedEvent = new EventEmitter<Document>();

    constructor() {
        this.documents = MOCKDOCUMENTS;
    }

    getDocuments() {
        return this.documents.slice();
    }

    getDocument(id: string) {
        for (let document of this.documents) {
            if (document.id === id) {
                return document;
            }
        }
        return null;
    }


}