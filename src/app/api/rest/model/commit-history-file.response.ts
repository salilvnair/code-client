export class CommitHistoryFileResponse {
    fromHash: string;
    toHash: string;
    values: CommitHistoryFileValue[];
    size: number;
    isLastPage: boolean;
    start: number;
    limit: number;
    nextPageStart: number;
}

export class CommitHistoryFileValue {
    contentId: string;
    fromContentId: string;
    path: FilePath;
    executable: boolean;
    percentUnchanged: number;
    type: string;
    nodeType: string;
}

export class FilePath {
    components: string[];
    parent: string;
    name: string;
    extension: string;
    toString: string;
}