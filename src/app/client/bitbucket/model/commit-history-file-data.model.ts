export class CommitHistoryFileData {
    commitId: string;
    commitedFiles: CommitHistoryFile[];
}

export class CommitHistoryFile {
    fileName: string;
    fileStatus: string;
    shortStatus: string;
    color: string;
  }
  