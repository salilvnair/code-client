export class CommitHistoryResponse {
    values: CommitHistoryValue[];
    size: number;
    isLastPage: boolean;
    start: number;
    limit: number;
    nextPageStart: number;
}


export class CommitHistoryValue {
    id: string;
    displayId: string;
    author: Author;
    authorTimestamp: number;
    committer: Author;
    committerTimestamp: number;
    message:string;
    parents:Parent[];
}

export class Author {
    name: string;
    emailAddress: string;
    id: number;
    displayName: string;
    active: boolean;
    slug: string;
    type: string;
    links: Links;
}

export class Links {
    self: Self;
}

export class Self {
    href: string;
}

export class Parent {
    id: string;
    displayId: string;
}