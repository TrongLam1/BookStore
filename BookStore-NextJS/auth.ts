import { sendRequest } from "@/utils/api";
import { InactiveAccountError, InvalidEmailPasswordError } from "@/utils/error";
import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            credentials: {
                email: {},
                password: {},
            },
            authorize: async (credentials) => {
                if (credentials && !credentials.password) {
                    const userData = JSON.parse(credentials.email);
                    return {
                        user: {
                            id: userData.user.id,
                            email: userData.user.email,
                            username: userData.user.username,
                            role: userData.user.roles,
                        },
                        token: userData.access_token,
                        refresh_token: userData.refresh_token
                    }
                }

                const res = await sendRequest<IBackendRes<any>>({
                    method: 'POST',
                    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`,
                    body: {
                        email: credentials.email,
                        password: credentials.password
                    }
                });

                if (+res.statusCode === 201) {
                    return {
                        user: {
                            id: res.data.user.id,
                            email: res.data.user.email,
                            username: res.data.user.username,
                            phone: res.data.user.phone,
                            address: res.data.user.address,
                            role: res.data.user.roles,
                        },
                        token: res.data.access_token,
                        refresh_token: res.data.refresh_token
                    }
                }

                if (+res.statusCode === 401) throw new InvalidEmailPasswordError();

                if (+res.statusCode === 400) {
                    throw new InactiveAccountError();
                } else { throw new Error("Internal server error"); }
            },
        }),
    ],
    pages: {
        signIn: "/auth/login"
    },
    callbacks: {
        jwt({ token, user }) {
            if (user) token.user = user;
            return token;
        },
        session({ session, token }) {
            (session.user as any) = token.user;
            return session;
        },
        authorized: async ({ auth }) => {
            // Logged in users are authenticated, otherwise redirect to login page
            return !!auth
        },
    },
})