import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { MatIconRegistry } from "@angular/material";

@Component({
  selector: "mat-svg-icon",
  templateUrl: "./mat-svg-icon.component.html",
  styleUrls: ["./mat-svg-icon.component.css"]
})
export class MatSvgIconComponent implements OnInit {
  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
  ) {
    this.matIconRegistry.addSvgIcon(
      "add",
      this.domSanitizer.bypassSecurityTrustResourceUrl("assets/icon/added.svg")
    );
    this.matIconRegistry.addSvgIcon(
      "delete",
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        "assets/icon/deleted.svg"
      )
    );
    this.matIconRegistry.addSvgIcon(
      "modify",
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        "assets/icon/modified.svg"
      )
    );
    this.matIconRegistry.addSvgIcon(
      "rename",
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        "assets/icon/rename.svg"
      )
    );

    this.matIconRegistry.addSvgIcon(
      "move",
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        "assets/icon/move.svg"
      )
    );

    this.matIconRegistry.addSvgIcon(
      "clipboard",
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        "assets/icon/clipboard.svg"
      )
    );
    this.matIconRegistry.addSvgIcon(
      "history",
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        "assets/icon/history.svg"
      )
    );
    this.matIconRegistry.addSvgIcon(
      "history_blue",
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        "assets/icon/history_blue.svg"
      )
    );
    this.matIconRegistry.addSvgIcon(
      "cherry-pick",
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        "assets/icon/cherry-pick.svg"
      )
    );
    this.matIconRegistry.addSvgIcon(
      "search",
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        "assets/icon/search.svg"
      )
    );
    this.matIconRegistry.addSvgIcon(
      "xls",
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        "assets/icon/xls_blue.svg"
      )
    );
    this.matIconRegistry.addSvgIcon(
      "xls_glossy",
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        "assets/icon/xls_glossy.svg"
      )
    );
    this.matIconRegistry.addSvgIcon(
      "edit_column",
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        "assets/icon/edit_column.svg"
      )
    );
    this.matIconRegistry.addSvgIcon(
      "filter",
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        "assets/icon/filter_list.svg"
      )
    );

    this.matIconRegistry.addSvgIcon(
      "match_case",
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        "assets/icon/match_case.svg"
      )
    );

    this.matIconRegistry.addSvgIcon(
      "view_all",
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        "assets/icon/view_all.svg"
      )
    );

    this.matIconRegistry.addSvgIcon(
      "codecloud_public_repo",
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        "assets/icon/public_repo.svg"
      )
    );

    this.matIconRegistry.addSvgIcon(
      "codecloud_private_repo",
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        "assets/icon/private_repo.svg"
      )
    );

    this.matIconRegistry.addSvgIcon(
      "branch",
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        "assets/icon/branch.svg"
      )
    );

    this.matIconRegistry.addSvgIcon(
      "merge",
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        "assets/icon/merge.svg"
      )
    );

    this.matIconRegistry.addSvgIcon(
      "key",
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        "assets/icon/key.svg"
      )
    );

    this.matIconRegistry.addSvgIcon(
      "repository",
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        "assets/icon/repository.svg"
      )
    );

    this.matIconRegistry.addSvgIcon(
      "close",
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        "assets/icon/close.svg"
      )
    );

    this.matIconRegistry.addSvgIcon(
      "file_code",
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        "assets/icon/file_code.svg"
      )
    );

    this.matIconRegistry.addSvgIcon(
      "author",
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        "assets/icon/author.svg"
      )
    );

    this.matIconRegistry.addSvgIcon(
      "authors",
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        "assets/icon/authors.svg"
      )
    );

    this.matIconRegistry.addSvgIcon(
      "table_view",
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        "assets/icon/table_view.svg"
      )
    );

    this.matIconRegistry.addSvgIcon(
      "folder_view",
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        "assets/icon/folder_view.svg"
      )
    );

    this.matIconRegistry.addSvgIcon(
      "folder_open",
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        "assets/icon/folder_open.svg"
      )
    );

    this.matIconRegistry.addSvgIcon(
      "folder_close",
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        "assets/icon/folder_close.svg"
      )
    );

    this.matIconRegistry.addSvgIcon(
      "bitbucket",
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        "assets/icon/bitbucket.svg"
      )
    );

    this.matIconRegistry.addSvgIcon(
      "github",
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        "assets/icon/github.svg"
      )
    );

    this.matIconRegistry.addSvgIcon(
      "gitlab",
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        "assets/icon/gitlab.svg"
      )
    );

    this.matIconRegistry.addSvgIcon(
      "api",
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        "assets/icon/api.svg"
      )
    );

    this.matIconRegistry.addSvgIcon(
      "access_key",
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        "assets/icon/access_key.svg"
      )
    );

    this.matIconRegistry.addSvgIcon(
      "config",
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        "assets/icon/config.svg"
      )
    );

    this.matIconRegistry.addSvgIcon(
      "gear",
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        "assets/icon/gear.svg"
      )
    );

    this.matIconRegistry.addSvgIcon(
      "commit",
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        "assets/icon/commit.svg"
      )
    );

    this.matIconRegistry.addSvgIcon(
      "raw_file",
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        "assets/icon/raw_file.svg"
      )
    );

    this.matIconRegistry.addSvgIcon(
      "compare",
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        "assets/icon/compare.svg"
      )
    );

    this.matIconRegistry.addSvgIcon(
      "changes",
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        "assets/icon/changes.svg"
      )
    );

    this.matIconRegistry.addSvgIcon(
      "change",
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        "assets/icon/change.svg"
      )
    );

    this.matIconRegistry.addSvgIcon(
      "file_changes",
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        "assets/icon/file_changes.svg"
      )
    );

    this.matIconRegistry.addSvgIcon(
      "return",
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        "assets/icon/return.svg"
      )
    );

  }
  @Input("icon") icon: string;
  @Input("transform") transform: string;
  @Input("title") title: string;
  @Input("color") color: string = "primary";
  @Input("button") button: false;
  @Input("badge") badge: boolean = false;
  @Input("badgePosition") badgePosition:string='after';
  @Input("badgeCount") badgeCount: number;
  @Input("badgeColor") badgeColor: string = 'primary';
  @Input("disabled") disabled: boolean = false;
  @Output() onClickEvent = new EventEmitter<any>();
  ngOnInit() {}
  onClick(event:any) {
    this.onClickEvent.emit(event);
  }
}
