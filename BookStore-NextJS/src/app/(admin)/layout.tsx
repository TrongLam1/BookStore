import '@/components/layouts/dashboard/dashboardComponent.scss';
import NavDashboard from "@/components/layouts/dashboard/navDashboard";
import SidebarDashboard from "@/components/layouts/dashboard/sidebarDashboard";
import { auth } from '../../../auth';

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {

    const session = await auth();
    const user = session?.user.user;

    if (!user || !user.role.includes("ADMIN")) {
        return (
            <div className="alert alert-danger" role="alert">
                <h4 className="alert-heading">Permission Denided</h4>
            </div>
        );
    };

    return (
        < div className="dashboard-container" >
            <div className="wrapper">
                <SidebarDashboard />
                <div id="main">
                    <NavDashboard />
                    <main className="content px-3 py-2">
                        {children}
                    </main>
                    <footer style={{ textAlign: 'center' }} className="footer">
                        <div className="copy-right">
                            <span>&copy;</span> Thành phố Hồ Chí Minh, 2024
                        </div>
                    </footer>
                </div>
            </div>
        </div>
    );
}