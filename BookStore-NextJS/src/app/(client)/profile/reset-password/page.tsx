import ResetPassword from "@/components/layouts/client/profile/resetPassword/resetPassword";
import { auth } from "../../../../../auth";

export default async function ResetPasswordPage() {

    const session = await auth();
    const user = session?.user.user;

    return (<ResetPassword user={user} />);
}