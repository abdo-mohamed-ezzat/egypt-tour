export interface IUser {
    success: boolean;
    message: string;
    isAuthenticated: boolean;
    isConfirmed: boolean;
    username: string;
    email: string;
    roles: string[];
    token: string;
    status: number;
}
