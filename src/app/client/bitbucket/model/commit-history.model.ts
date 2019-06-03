export class CommitHistoryData {
    select: string;
    checked:boolean;
    author: string;
    commitId: string;
    commitMessage: string;
    date: string;
    parentCommitId:string;
}

export class CommitHistory {
    branchName: string;
    data: CommitHistoryData[];
}