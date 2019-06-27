export interface Schema {
    name: string;
    project?: string;
    path?: string;
    flat?: boolean;
    spec?: boolean;
    lintFix?: boolean;
    // skipTests?: boolean;
}
