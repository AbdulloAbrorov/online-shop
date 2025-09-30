import { AppRole } from '../../types';
export declare class AuthResponseDto {
    access_token: string;
    refresh_token?: string;
    user: {
        id: number;
        email: string;
        name: string;
        role: AppRole;
    };
}
