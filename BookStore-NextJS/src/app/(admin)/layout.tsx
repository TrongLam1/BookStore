import NavDashboard from "@/components/layouts/dashboard/navDashboard";
import SidebarDashboard from "@/components/layouts/dashboard/sidebarDashboard";
import '@/components/layouts/dashboard/dashboardComponent.scss';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {

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