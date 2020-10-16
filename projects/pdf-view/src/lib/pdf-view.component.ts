import { AfterContentInit, AfterViewInit, Component, ContentChild, ContentChildren, ElementRef, Input, OnInit, QueryList, TemplateRef, ViewChild } from '@angular/core';
import { PDFSource } from 'pdfjs-dist';
import { fromEvent, Observable } from 'rxjs';

@Component({
  selector: 'lib-pdf-view',
  templateUrl: './pdf-view.component.html',
  styles: [
    './pdf-view.component.scss'
  ]
})
export class PdfViewComponent implements OnInit, AfterContentInit, AfterViewInit {

  childEvent: Observable<any>;

  @Input() url: string | PDFSource | ArrayBuffer;
  @Input() showViewer = false;

  @ContentChild('fillTpl', {static: true}) fillTpl: ElementRef;

  constructor() {}

  ngOnInit() {
  }

  ngAfterViewInit() {
    console.log(this.fillTpl);
    this.childEvent = fromEvent(this.fillTpl.nativeElement, 'click');
    this.childEvent.subscribe(res => {
      this.showViewer = true;
      console.log(111);
    });
  }

  ngAfterContentInit() {
  }


  showPdfviewer() {

  }
}
