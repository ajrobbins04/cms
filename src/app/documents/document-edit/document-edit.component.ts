import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Document } from '../document.model';

@Component({
  selector: 'cms-document-edit',
  templateUrl: './document-edit.component.html',
  styleUrl: './document-edit.component.css'
})

export class DocumentEditComponent implements OnInit {

  originalDocument: Document; // unedited document
  document: Document;         // edited 
  editMode: boolean = false;

  @ViewChild('f', { static: false }) slForm: NgForm;

  ngOnInit(): void {
      
  }
  onSubmit(form: NgForm) {}
  onCancel() {
    
  }
}
