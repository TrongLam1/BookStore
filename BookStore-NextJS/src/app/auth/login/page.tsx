/* eslint-disable @next/next/no-img-element */

import LoginComponent from "@/components/layouts/client/auth/loginPage";

export const metadata = {
    title: 'Đăng nhập'
}

const LoginPage = ({ searchParams }: {
    searchParams: { [key: string]: string | string[] | undefined }
}) => {

    return (
        <LoginComponent userString={searchParams.response} />
    )
};

export default LoginPage;