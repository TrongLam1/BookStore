import ProfileInfoComponent from "@/components/layouts/client/profile/profileInfo";
import { auth } from "../../../../auth";

export default async function ProfilePage() {

    const session = await auth();
    const user = session?.user.user;

    return (
        <ProfileInfoComponent user={user} />
    );
};