import {
  Directive,
  Input,
  Output,
  EventEmitter,
  HostListener
} from "@angular/core";

@Directive({ selector: "[copy-to-clipboard]" })
export class CopyToClipboard {
  @Input("copy-to-clipboard")
  public cbContent: string;

  @Input("haltOtherEvents")
  public haltAllEvents: boolean = false;

  @Output("onCopy")
  public copied: EventEmitter<string> = new EventEmitter<string>();

  @HostListener("click", ["$event"])
  public onClick(event: MouseEvent): void {
    event.preventDefault();
    if (!this.cbContent) return;
    if (this.haltAllEvents) {
      event.stopPropagation();
    }
    let listener = (e: ClipboardEvent) => {
      let clipboard = e.clipboardData || window["clipboardData"];
      clipboard.setData("text", this.cbContent.toString());
      e.preventDefault();
      this.copied.emit(this.cbContent);
    };

    document.addEventListener("copy", listener, false);
    document.execCommand("copy");
    document.removeEventListener("copy", listener, false);
  }
}
