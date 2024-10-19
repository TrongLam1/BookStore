'use client'

import { faCalendar, faDollarSign } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ChartDashboard from "./chartDashboard";

export default function StatisticComponent(props: any) {

    const { statistic } = props;

    return (
        <>
            <div className="statistic row">
                <div className="col-xl-3 col-md-6 mb-4">
                    <div className="card border-left-primary shadow h-100 py-2">
                        <div className="card-body">
                            <div className="row no-gutters align-items-center">
                                <div className="col mr-2">
                                    <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                                        Tổng doanh thu:</div>
                                    <div id="totalEarn" className="h5 mb-0 font-weight-bold text-gray-800">
                                        {statistic?.revenue?.toLocaleString()}đ</div>
                                </div>
                                <div className="col-auto">
                                    <FontAwesomeIcon icon={faDollarSign} className="fa-2x text-gray-300" />
                                    <i className="fas fa-dollar-sign fa-2x text-gray-300"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-xl-3 col-md-6 mb-4">
                    <div className="card border-left-primary shadow h-100 py-2">
                        <div className="card-body">
                            <div className="row no-gutters align-items-center">
                                <div className="col mr-2">
                                    <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                                        Đơn hàng đang xử lí:</div>
                                    <div id="pendingOrder" className="h5 mb-0 font-weight-bold text-gray-800">{statistic?.pendingOrders}</div>
                                </div>
                                <div className="col-auto">
                                    <FontAwesomeIcon icon={faCalendar} className="fa-2x text-gray-300" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-xl-3 col-md-6 mb-4">
                    <div className="card border-left-success shadow h-100 py-2">
                        <div className="card-body">
                            <div className="row no-gutters align-items-center">
                                <div className="col mr-2">
                                    <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                                        Đơn hàng đã hoàn thành:</div>
                                    <div id="deliveredOrder" className="h5 mb-0 font-weight-bold text-gray-800">
                                        {statistic?.completedOrders}
                                    </div>
                                </div>
                                <div className="col-auto">
                                    <FontAwesomeIcon icon={faCalendar} className="fa-2x text-gray-300" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-xl-3 col-md-6 mb-4">
                    <div className="card border-left-danger shadow h-100 py-2">
                        <div className="card-body">
                            <div className="row no-gutters align-items-center">
                                <div className="col mr-2">
                                    <div className="text-xs font-weight-bold text-danger text-uppercase mb-1">
                                        Đơn hàng đã bị hủy:</div>
                                    <div id="canceledOrder" className="h5 mb-0 font-weight-bold text-gray-800">{statistic?.cancelOrders}</div>
                                </div>
                                <div className="col-auto">
                                    <FontAwesomeIcon icon={faCalendar} className="fa-2x text-gray-300" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ChartDashboard />
        </>
    )
}