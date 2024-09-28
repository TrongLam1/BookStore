import { AuthError } from "next-auth";

export class CustomAuthError extends AuthError {
    static type: string;

    constructor(message?: any) {
        super();
        this.type = message;
    }
}

export class InvalidEmailPasswordError extends AuthError {
    static type: string = "Invalid email or password";
}

export class InactiveAccountError extends AuthError {
    static type: string = "Inactive account";
}