export class FileHistoryData {
    select: string;
    checked:boolean;
    author: string;
    commitId: string;
    commitMessage: string;
    date: string;
}

export class FileHistory {
    branchName: string;
    data: FileHistoryData[];
}

export class FileHistoryBean {
    commitId: string;
    filePath: string;
    branchName: string;
}