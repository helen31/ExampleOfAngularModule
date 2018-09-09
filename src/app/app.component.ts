import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer
  ) {
    this.registerIcons();

  }

  registerIcons() {
    this.iconRegistry.addSvgIcon(
      'ua',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/flags/ukraine.svg'));
    this.iconRegistry.addSvgIcon(
      'ru',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/flags/russia.svg'));
    this.iconRegistry.addSvgIcon(
      'en',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/flags/united-states.svg'));
  }
}
