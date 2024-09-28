import { SessionProvider } from "next-auth/react";
import React from "react";

export default function NextAuthWrapper({
    children
}) {
    return (
        <SessionProvider>
            {children}
        </SessionProvider>
    )
}