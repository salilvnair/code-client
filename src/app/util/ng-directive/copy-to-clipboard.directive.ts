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

  isIEOrEdge = /msie\s|trident\/|edge\//i.test(window.navigator.userAgent);

  @HostListener("click", ["$event"])
  public onClick(event: MouseEvent): void {
    event.preventDefault();
    if (!this.cbContent) return;
    if (this.haltAllEvents) {
      event.stopPropagation();
    }
    let listener = (e: ClipboardEvent) => {
      let clipboard = e.clipboardData || window["clipboardData"];
      clipboard.setData("Text", this.cbContent.toString());
      clipboard.setData("text", this.cbContent.toString());
      e.preventDefault();
      this.copied.emit(this.cbContent);
    };

    document.addEventListener("copy", listener, false);
    if(this.isIEOrEdge){
      ////console.log('ie')
      let placeholder = document.createElement("textarea");
		    placeholder.setAttribute(
		        "style", 
		        "position: absolute;overflow: hidden;width: 0;height: 0;top: 0;left: 0;"
		    );
		    placeholder.value = this.cbContent;
		    document.body.appendChild(placeholder);
        placeholder.select();
        document.execCommand("copy");
        document.body.removeChild(placeholder);
        document.removeEventListener("copy", listener, false);
    }
    else{
      document.execCommand("copy");
      document.removeEventListener("copy", listener, false);
    }
  }
}
