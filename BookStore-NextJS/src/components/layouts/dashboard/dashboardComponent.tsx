'use client'

import { useRouter } from "next/navigation";
import './dashboardComponent.scss';
import StatisticComponent from "./statisticComponent";

export default function DashboardComponent(props: any) {

    const router = useRouter();
    const { user, statistic } = props;

    if (!user || !user.role.includes("ADMIN")) {
        return (
            <div className="alert alert-danger" role="alert">
                <h4 className="alert-heading">Permission Denided</h4>
            </div>
        );
    };

    return (
        <div className="container-fluid">
            <div className="mb-3">
                <h4>Admin Dashboard</h4>
            </div>
            <div className="row">
                <StatisticComponent statistic={statistic} />
            </div>
        </div>
    )
}