import '@/components/layouts/client/profile/historyOrderPage.scss';
import SidebarProfileComponent from '@/components/layouts/client/profile/sidebarProfile';
import { auth } from '../../../../auth';

export default async function ProfileLayout({
    children,
}: {
    children: React.ReactNode
}) {

    const session = await auth();
    const user = session?.user.user;

    return (
        <div className="profile-user-container row d-flex justify-content-evenly">
            <SidebarProfileComponent user={user} />
            <div className="profile-content-wrap col-lg-9">
                {children}
            </div>
        </div>
    )
}