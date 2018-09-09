import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[appCopyToClipboardDirective]'
})
export class CopyToClipboardDirective {
  table: HTMLElement;

  constructor(elTable: ElementRef) {
    this.table = elTable.nativeElement;
  }

  copyToClipboard() {
    let node = this.table;
    /**if (document.body.hasOwnProperty.createTextRange !== 'undefined') {
      const range = document.body.createTextRange();
      range.moveToElementText(node);
      let select = range.select();
      select.copy();
    } else **/if (window.getSelection) {
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(node);
      selection.removeAllRanges();
      selection.addRange(range);
      document.execCommand('copy');
      //delete selection
      selection.removeAllRanges();
    } else {
      console.warn("Could not select text in node: Unsupported browser.");
    }
  }
}
