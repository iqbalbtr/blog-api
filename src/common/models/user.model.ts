export class RegisterUserRequest {
    name: string;
    username: string;
    password: string;
}
export class RegisterUserResponse {
    username: string;
}

export class LoginUserRequest {
    username: string;
    password: string;
}

export class LoginUserResponse {
    token: string;
}

export class UpdateUserRequest {
    name: string;
}

export class UpdateUserResponse {
    id: number;
    name: string;
    username: string;
}