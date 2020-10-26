import { AfterContentInit, AfterViewInit, Component, ContentChild, ContentChildren, ElementRef, Input, OnInit, QueryList, TemplateRef, ViewChild } from '@angular/core';
import { PDFSource } from 'pdfjs-dist';
import { fromEvent, Observable } from 'rxjs';
import { PdfViewerComponent } from './pdf-viewer/pdf-viewer.component';

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
  @Input() showViewer: boolean;
  // @ViewChild('pdfViewer', {static: true}) pdfViewer: PdfViewerComponent;

  @ContentChild('fillTpl', {static: true}) fillTpl: ElementRef;

  constructor() {}

  ngOnInit() {
  }

  ngAfterViewInit() {
    console.log(this.fillTpl);
    if (this.fillTpl) {
      this.childEvent = fromEvent(this.fillTpl.nativeElement, 'click');
      this.childEvent.subscribe(res => {
        this.showViewer = true;
      });
    } else {
      this.showViewer = true;
    }
  }

  ngAfterContentInit() {
  }


  showPdfviewer() {}
}
