'use server'

import { signIn } from "../../auth";

export default async function authenticate(email: string, password: string) {
    try {
        return await signIn("credentials", { email, password, redirect: false });
    } catch (err) {
        if ((err as any).name === "InvalidEmailPasswordError") {
            return {
                error: (err as any).type,
                code: 1
            }
        } else if ((err as any).name === "InactiveAccountError") {
            return {
                error: (err as any).type,
                code: 2
            }
        } else {
            return {
                error: "Internal Server Error",
                code: 0
            }
        }
    }
};