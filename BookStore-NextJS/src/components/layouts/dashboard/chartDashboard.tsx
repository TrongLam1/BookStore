'use client'

import { GetAmountByYear, GetAmountDateRange } from "@/app/api/orderApi";
import { useEffect, useState } from "react";
import { Chart, registerables } from "chart.js";

export default function ChartDashboard(props: any) {

    const [loadingApi, setLoadingApi] = useState(false);
    const [showGetYear, setShowGetYear] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);

    const [year, setYear] = useState(2020);
    const [startDate, setStartDate] = useState<Date>();
    const [endDate, setEndDate] = useState<Date>();
    const [dataChart, setDataChart] = useState<any>('');

    useEffect(() => { }, [dataChart]);

    const renderChartByYear = async (year: number) => {
        const arrayMonth = [];
        const result = [];

        const res = await GetAmountByYear(year);
        const data = res?.data;

        for (let i = 1; i <= 12; i++) {
            arrayMonth.push(`Tháng ${i}`);
            const matchingMonth = data.find(item => item.month === i);
            result.push(matchingMonth ? matchingMonth.total : 0);
        }

        Chart.register(...registerables);
        const existingChart = Chart.getChart("myChart");
        if (existingChart) {
            existingChart.destroy();
        }

        const ctx = document.getElementById('myChart').getContext('2d');
        const myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: arrayMonth,
                datasets: [{
                    label: `# doanh thu năm ${year}`,
                    data: result,
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    };

    const renderChartDateRange = async (startDate: Date, endDate: Date) => {
        const arrayDate = createDateRangeArray(startDate, endDate);
        let result = [];

        for (let i = 0; i < arrayDate.length; i++) {
            result[i] = 0;
        };

        const res = await GetAmountDateRange(startDate, endDate);
        const data = res?.data;

        data.forEach(item => {
            const dateIndex = arrayDate.indexOf(item.date);
            if (dateIndex !== -1) {
                result[dateIndex] += item.total;
            }
        });

        Chart.register(...registerables);

        const existingChart = Chart.getChart("myChart");
        if (existingChart) {
            existingChart.destroy();
        }

        const ctx = document.getElementById('myChart').getContext('2d');
        const myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: arrayDate,
                datasets: [{
                    label: `# doanh thu từ ${startDate} đến ${endDate}`,
                    data: result,
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    };

    const createDateRangeArray = (startDate: Date, endDate: Date) => {
        const currentDate = new Date(startDate);
        const arrayDate = [];

        while (currentDate <= new Date(endDate)) {
            arrayDate.push(currentDate.toISOString().split('T')[0]);
            currentDate.setDate(currentDate.getDate() + 1);
        }

        return arrayDate;
    };

    const handleRenderChartInYear = () => { renderChartByYear(year) };

    const handleRenderChartByRange = () => { renderChartDateRange(startDate, endDate) };

    return (
        <div className="chart-container">
            <div className="tabsChart">
                <button
                    type="button" className="btnGetYear"
                    onClick={() => {
                        setShowGetYear(!showGetYear);
                        setShowDatePicker(false);
                    }}
                >
                    Theo năm
                </button>
                <button
                    type="button" className="btnDatePicker"
                    onClick={() => {
                        setShowDatePicker(!showDatePicker);
                        setShowGetYear(false);
                    }}
                >
                    Theo ngày
                </button>
            </div>

            {showGetYear &&
                <div className="getYear">
                    <input maxLength={4} type="text" placeholder="Năm"
                        onChange={(e) => setYear(+e.target.value)}
                    />
                    <button className="btnChartYear" type="button"
                        onClick={handleRenderChartInYear}
                    >
                        Lọc
                    </button>
                    <div className="error-mess"></div>
                </div>}

            {showDatePicker &&
                <div className="datePicker">
                    <div className="startDate">
                        <span>Từ ngày:</span>
                        <input
                            type="date" className="form-control" placeholder="Select DateTime"
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                    </div>
                    <div className="endDate">
                        <span>Đến ngày:</span>
                        <input
                            type="date" className="form-control" placeholder="Select DateTime"
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                    </div>
                    <div className="error-mess"></div>
                    <button className="btnChartDate"
                        type="button"
                        onClick={handleRenderChartByRange}
                    >Lọc</button>
                </div>}
            {loadingApi === true ? <div className='loader-container'><div className="loader"></div></div> : ''}
            <div className="w-[1100px] h-screen flex mx-auto my-auto">
                <div className='border border-gray-400 pt-0 rounded-xl  w-full h-fit my-auto  shadow-xl'>
                    <canvas id='myChart'></canvas>
                </div>
            </div>
        </div>
    );
};