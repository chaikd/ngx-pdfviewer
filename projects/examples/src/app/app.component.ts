import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <div style="position:fixed;">
    </div>
    <lib-pdf-view [url]="'/assets/compressed.tracemonkey-pldi-09.pdf'">
      <div #fillTpl>
        <div>点击我展示pdf</div>
      </div>
    </lib-pdf-view>
    <!-- <lib-pdf-view [url]="'/assets/Vue-3-Cheat-Sheet.pdf'">
    </lib-pdf-view> -->
    <router-outlet></router-outlet>
  `,
  styles: []
})
export class AppComponent {
  title = 'examples';
  // http://www.ecma-international.org/publications/files/ECMA-ST/Ecma-262.pdf
  // http://blog.chaikd.com/Vue-3-Cheat-Sheet.pdf
}
