'use client'

import { useRouter } from "next/navigation"
import { useEffect } from "react";

export default function RedirectHomePage() {
    const router = useRouter();

    useEffect(() => {
        router.push('/home');
    }, [router]);

    return null;
};