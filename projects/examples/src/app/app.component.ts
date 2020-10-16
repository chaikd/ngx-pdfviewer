import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <div style="position:fixed;">
    </div>
    <lib-pdf-view [url]="'/assets/Vue-3-Cheat-Sheet.pdf'">
      <div #fillTpl>
        <div>点击我展示pdf</div>
      </div>
    </lib-pdf-view>
    <router-outlet></router-outlet>
  `,
  styles: []
})
export class AppComponent {
  title = 'examples';
}
