import { Component, Input } from '@angular/core';
import { Document } from '../document.model';
@Component({
  selector: 'cms-document-detail',
  templateUrl: './document-detail.component.html',
  styleUrls: [
    '../../app.component.css',
    './document-detail.component.css']
})
export class DocumentDetailComponent {
  @Input() document: Document;
}
