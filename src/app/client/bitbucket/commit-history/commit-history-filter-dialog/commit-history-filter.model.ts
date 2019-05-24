import { CommitHistoryData } from '../../model/commit-history.model';

export class CommitHistoryFilterModel {
    displayedColumns: string[];
    tableData: CommitHistoryData[];
    commitHistoryFilteredModel:CommitHistoryFilteredModel;
}

export class CommitHistoryFilteredModel {
    authors:string[];
    fromDate: string;
    toDate: string;
}