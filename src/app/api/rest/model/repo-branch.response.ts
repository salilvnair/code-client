export class RepoBranchResponse {
    values: RepoBranchValue[];
    size: number;
    isLastPage: boolean;
    start: number;
    limit: number;
    nextPageStart: number;
}

export class RepoBranchValue {
    id: string;
    displayId: string;
    type: string;
    latestCommit: string;
    latestChangeset: string;
    isDefault: boolean;
}