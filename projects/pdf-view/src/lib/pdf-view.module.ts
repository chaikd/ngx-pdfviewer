import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PdfViewComponent } from './pdf-view.component';
import { PdfViewerComponent } from './pdf-viewer/pdf-viewer.component';



@NgModule({
  declarations: [PdfViewComponent, PdfViewerComponent],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [PdfViewComponent, PdfViewerComponent]
})
export class PdfViewModule { }
