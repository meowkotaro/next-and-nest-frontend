// プロジェクトで使用する型を定義するファイル
export type AuthForm = {
    email: string;
    password: string;
}

export type EditedTask = {
    id: number;
    title: string;
    description: string;
}