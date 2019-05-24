import { CommitHistoryFileData } from '../../model/commit-history-file-data.model';

export class CommitHistoryFileChangesModel {
    commitHistoryFileChanges: CommitHistoryFileData[];
    selectedBranch: string;
    selectedRepo: string;
}

export class CommitHistoryFileChangesDataSource {
    position: number;
    name: string;
    path: string;
    type: string;
    color: string;
}