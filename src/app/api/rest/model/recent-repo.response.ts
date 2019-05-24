export class RecentRepoResponse {
    values: RecentRepoValue[];
    size: number;
    isLastPage: boolean;
    start: number;
    limit: number;
    nextPageStart: number;
}

export class RecentRepoValue {
    id: number;
    slug: string;
    name: string;
    scmId: string;
    state: string;
    statusMessage: string;
    forkable: string;
    public: boolean;
    project: Project;
}

export class Project {
    key: string;
    name: string;
    public: boolean;
    type: string;
    id: number;
    links: Links;
}

export class Links {
    self: Self[];
}

export class Self {
    href: string;
}