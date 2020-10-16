import { AfterViewInit, Component, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';
import { PDFDocumentProxy, PDFSource } from 'pdfjs-dist';
import * as PDFJS from 'pdfjs-dist';
import {
  EventBus,
  PDFLinkService,
  NullL10n,
  PDFDocument,
  PDFLoadingTask,
  PDFViewer,
  PDFHistory
} from 'pdfjs-dist/web/pdf_viewer';

@Component({
  selector: 'lib-pdf-viewer',
  templateUrl: './pdf-viewer.component.html',
  styleUrls: ['./pdf-viewer.component.scss']
})
export class PdfViewerComponent implements OnInit, AfterViewInit {

  @Input() url: string | PDFSource | ArrayBuffer;
  @Input() fileName: string;
  @Input() isFullScreen: boolean;

  viewContainer: ElementRef;
  pdf: PDFDocumentProxy;
  pdfLoadingTask: PDFLoadingTask;
  pdfDocument: PDFDocument;
  pdfViewer: PDFViewer;
  pdfHistory: PDFHistory;
  pdfLinkService: PDFLinkService;
  eventBus: EventBus;
  l10n: NullL10n;

  USE_ONLY_CSS_ZOOM = true;
  TEXT_LAYER_MODE = 0; // DISABLE
  MAX_IMAGE_SIZE = 1024 * 1024;
  CMAP_PACKED = true;

  DEFAULT_URL = '//raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/examples/learning/helloworld.pdf';
  DEFAULT_SCALE_DELTA = 1.1;
  MIN_SCALE = 0.25;
  MAX_SCALE = 10.0;
  DEFAULT_SCALE_VALUE = 'auto';

  currentPage = 1;
  scale = 1;
  hasNext;
  hasPre;

  animationStartedPromise = new Promise((resolve) => {
    requestAnimationFrame(resolve);
  });

  get pagesCount() {
    return this.pdf.numPages;
  }

  set page(val) {
    this.currentPage = val;
    this.pdfViewer.currentPageNumber = val;
  }

  get page() {
    return this.pdfViewer.currentPageNumber;
  }

  constructor(
    private element: ElementRef,
    private render: Renderer2
  ) { }

  ngOnInit() {
    console.log(this.url);
    PDFJS.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${(PDFJS as any).version}/build/pdf.worker.js`;
    // const loadingTask = PDFJS.getDocument('//raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/examples/learning/helloworld.pdf');
    // loadingTask.promise.then((pdf) => {
    //   console.log(pdf);
    // });
    this.animationStartedPromise.then(() => {
      this.open(this.url);
    });
  }
  ngAfterViewInit() {
    this.viewContainer = this.element.nativeElement.querySelector('#viewerContainer');
    this.initUi();
  }

  // 初始化viewer
  initUi() {
    const self = this;
    this.eventBus = new EventBus();
    this.pdfLinkService = new PDFLinkService({
      eventBus: this.eventBus,
    });
    this.l10n = NullL10n;
    this.pdfViewer = new PDFViewer({
      container: this.viewContainer,
      eventBus: this.eventBus,
      linkService: this.pdfLinkService,
      l10n: this.l10n,
      useOnlyCssZoom: this.USE_ONLY_CSS_ZOOM,
      textLayerMode: this.TEXT_LAYER_MODE,
    });
    this.pdfLinkService.setViewer(this.pdfViewer);
    this.pdfHistory = new PDFHistory({
      eventBus: this.eventBus,
      linkService: this.pdfLinkService,
    });
    // this.pdfHistory.setHistory(this.pdfHistory);
    this.eventBus.on('pagesinit', () => {
      // We can use pdfViewer now, e.g. let's change default scale.
      this.pdfViewer.currentScaleValue = this.DEFAULT_SCALE_VALUE;
    });

    this.eventBus.on(
      'pagechanging',
      (evt) => {
        const page = evt.pageNumber;
        const numPages = self.pagesCount;

        self.currentPage = evt.pageNumber;
        self.hasNext = page <= 1;
        self.hasNext = page >= numPages;
      },
      true
    );
  }

  // 加载文件并渲染
  open(url) {
    // if (this.pdfLoadingTask) {
    //   // We need to destroy already opened document
    //   return this.close().then(
    //     function () {
    //       // ... and repeat the open() call.
    //       return this.open(params);
    //     }.bind(this)
    //   );
    // }

    const self = this;
    // this.pdfViewSetTitleUsingUrl(url);
    this.pdfLoadingTask = PDFJS.getDocument(url as any);

    this.pdfLoadingTask.onProgress = (progressData) => {
      if (progressData.loaded === progressData.total) {
        // self.isSpinning = false;
        console.log('加载完毕。。。');
      }
    };

    return this.pdfLoadingTask.promise.then(
      (pdfDocument) => {
        // Document loaded, specifying document for the viewer.
        self.pdf = pdfDocument;
        self.pdfViewer.setDocument(pdfDocument);
        self.pdfLinkService.setDocument(pdfDocument);
        self.pdfHistory.initialize({ fingerprint: pdfDocument.fingerprint });
        // self.render.setStyle(self.element.nativeElement.querySelector('.pdfapp'), 'max-width', self.pdfViewer.viewer.offsetWidth + 'px');
        // console.log(self._pdfViewer)
        // self.loadingBar.hide();
        self.setTitleUsingMetadata(pdfDocument);
        // self.isOpening = false;
      },
      (exception) => {
        const message = exception && exception.message;
        const l10n = self.l10n;
        let loadingErrorMessage;

        if (exception as any instanceof PDFJS['InvalidPDFException']) {
          // change error message also for other builds
          loadingErrorMessage = l10n.get(
            'invalid_file_error',
            null,
            'Invalid or corrupted PDF file.'
          );
        } else if (exception as any instanceof PDFJS['MissingPDFException']) {
          // special message for missing PDFs
          loadingErrorMessage = l10n.get(
            'missing_file_error',
            null,
            'Missing PDF file.'
          );
        } else if (exception as any instanceof PDFJS['UnexpectedResponseException']) {
          loadingErrorMessage = l10n.get(
            'unexpected_response_error',
            null,
            'Unexpected server response.'
          );
        } else {
          loadingErrorMessage = l10n.get(
            'loading_error',
            null,
            'An error occurred while loading the PDF.'
          );
        }

        loadingErrorMessage.then( (msg) => {
          self.pdfViewError(msg, { message });
        });
        // self.isOpening = false;

        // self.loadingBar.hide();
      }
    );
  }

  pdfViewError(message, moreInfo) {
    const l10n = this.l10n;
    const moreInfoText = [
      l10n.get(
        'error_version_info',
        { version: PDFJS.version || '?', build: PDFJS['build'] || '?' },
        'PDF.js v{{version}} (build: {{build}})'
      ),
    ];

    if (moreInfo) {
      moreInfoText.push(
        l10n.get(
          'error_message',
          { message: moreInfo.message },
          'Message: {{message}}'
        )
      );
      if (moreInfo.stack) {
        moreInfoText.push(
          l10n.get('error_stack', { stack: moreInfo.stack }, 'Stack: {{stack}}')
        );
      } else {
        if (moreInfo.filename) {
          moreInfoText.push(
            l10n.get(
              'error_file',
              { file: moreInfo.filename },
              'File: {{file}}'
            )
          );
        }
        if (moreInfo.lineNumber) {
          moreInfoText.push(
            l10n.get(
              'error_line',
              { line: moreInfo.lineNumber },
              'Line: {{line}}'
            )
          );
        }
      }
    }
    // console.log(moreInfoText)
  }

  close() {
    // const errorWrapper = document.getElementById('errorWrapper');
    // errorWrapper.setAttribute('hidden', 'true');
    // this.isShowScreen = false;
    // this.closed.emit(false);

    if (!this.pdfLoadingTask) {
      return Promise.resolve();
    }

    const promise = this.pdfLoadingTask.destroy();
    this.pdfLoadingTask = null;

    if (this.pdf) {
      this.pdf = null;

      this.pdfViewer.setDocument(null);
      this.pdfLinkService.setDocument(null, null);

      if (this.pdfHistory) {
        this.pdfHistory = undefined;
      }
    }

    return promise;
  }

  setTitleUsingMetadata(pdfDocument) {
    const self = this;
    pdfDocument.getMetadata().then( (data) => {
      const info = data.info,
      metadata = data.metadata;
      self['documentInfo'] = info;
      self['metadata'] = metadata;

      // Provides some basic debug information
      // console.log(
      //   'PDF ' +
      //   pdfDocument.fingerprint +
      //   ' [' +
      //   info.PDFFormatVersion +
      //   ' ' +
      //   (info.Producer || '-').trim() +
      //   ' / ' +
      //   (info.Creator || '-').trim() +
      //   ']' +
      //   ' (PDF.js: ' +
      //   (PDFJS.version || '-') +
      //   ')'
      // );

      let pdfTitle;
      if (metadata && metadata.has('dc:title')) {
        const title = metadata.get('dc:title');
        // Ghostscript sometimes returns 'Untitled', so prevent setting the
        // title to 'Untitled.
        if (title !== 'Untitled') {
          pdfTitle = title;
        }
      }

      if (!pdfTitle && info && info['Title']) {
        pdfTitle = info['Title'];
      }

      if (pdfTitle) {
        // self.setTitle(pdfTitle + ' - ' + document.title);
        self.fileName = pdfTitle;
      }
    });
  }

  // 下一页
  next() {
    this.page = Math.min(this.page + 1, this.pdfViewer.pagesCount);
  }
  // 上一页
  previous() {
    this.page = Math.max(this.page - 1, 1);
  }

  // 放大 
  zoomIn() {
    let newScale = this.pdfViewer.currentScale;
    newScale = (newScale * this.DEFAULT_SCALE_DELTA).toFixed(2);
    newScale = Math.ceil(newScale * 10) / 10;
    newScale = Math.min(this.MAX_SCALE, newScale);
    this.scale = newScale;
    this.pdfViewer.currentScaleValue = newScale;
  }

  // 缩小
  zoomOut() {
    let newScale = this.pdfViewer.currentScale;
    newScale = (newScale / this.DEFAULT_SCALE_DELTA).toFixed(2);
    newScale = Math.floor(newScale * 10) / 10;
    newScale = Math.max(this.MIN_SCALE, newScale);
    this.scale = newScale;
    this.pdfViewer.currentScaleValue = newScale;
  }

  // 输入page
  pageChange() {
    this.page = Number(this.currentPage) || 0;
    if (this.currentPage !== this.page.toString()) {
      this.currentPage = this.page;
    }
  }

}
