import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Document } from '../document.model';

@Component({
  selector: 'cms-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: [
    '../../app.component.css',
    './document-list.component.css'
  ]
})
export class DocumentListComponent implements OnInit{
  @Output() selectedDocumentEvent = new EventEmitter<Document>();

  documents: Document[] = [
    new Document('1', 'Angular Guide', 'Comprehensive guide to Angular framework', 'https://angular.io/docs', null),
    new Document('2', 'TypeScript Handbook', 'Official TypeScript documentation', 'https://www.typescriptlang.org/docs/', null),
    new Document('3', 'JavaScript Basics', 'Introduction to JavaScript programming language', 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide', null),
    new Document('4', 'Bootstrap 3 Documentation', 'Detailed documentation on Bootstrap 3', 'https://getbootstrap.com/docs/3.3/', null),
    new Document('5', 'RxJS Guide', 'Guide to Reactive Extensions for JavaScript (RxJS)', 'https://rxjs.dev/guide/overview', null)
  ];

  constructor() { }

  ngOnInit(): void { }

  onSelectedDocument(document: Document) {
    this.selectedDocumentEvent.emit(document);
  }

}
