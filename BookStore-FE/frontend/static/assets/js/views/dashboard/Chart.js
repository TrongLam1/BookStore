import Admin from '../../entities/Admin.js'

const admin = new Admin();

export default class ChartView {
    renderChart() {
        return `
        <div class="tabsChart">
            <button type="button" class="btnGetYear">
                Theo năm
            </button>
            <button type="button" class="btnDatePicker">
                Theo ngày
            </button>
        </div>

        <div class="getYear">
            <input maxlength="4" type="text" placeholder="Năm">
            <button class="btnChartYear" type="button">Lọc</button>
            <div class="error-mess"></div>
        </div>

        <div class="datePicker">
            <div class="startDate">
                <span>Từ ngày:</span>
                <input type="date" class="form-control" placeholder="Select DateTime">
            </div>
            <div class="endDate">
                <span>Đến ngày:</span>
                <input type="date" class="form-control" placeholder="Select DateTime">
            </div>
            <div class="error-mess"></div>
            <button class="btnChartDate" type="button">Lọc</button>
        </div>
        <div><canvas id="myChart" width="600" height="400"></canvas></div>
        `;
    }

    tabGetYear(item) {
        let getYear = document.querySelector(".getYear");
        let datePicker = document.querySelector(".datePicker");
        let btnDatePicker = document.querySelector(".btnDatePicker");
        let btnFilter = document.querySelector(".btnChartYear");

        getYear.style.display = "block";
        datePicker.style.display = "none";

        item.classList.add("active");
        btnDatePicker.classList.remove("active");

        btnFilter.addEventListener("click", async (e) => {
            e.preventDefault();
            this.getValueYear();
        })
    }

    tabDatePicker(item) {
        let getYear = document.querySelector(".getYear");
        let datePicker = document.querySelector(".datePicker");
        let btnGetYear = document.querySelector(".btnGetYear");
        let btnFilter = document.querySelector(".btnChartDate");

        getYear.style.display = "none";
        datePicker.style.display = "flex";

        item.classList.add("active");
        btnGetYear.classList.remove("active");

        btnFilter.addEventListener("click", async (e) => {
            e.preventDefault();
            this.getDateRange();
        })
    }

    changeTabs() {
        let btnGetYear = document.querySelector(".btnGetYear");
        let btnDatePicker = document.querySelector(".btnDatePicker");

        btnGetYear.addEventListener("click", (e) => {
            e.preventDefault();
            this.tabGetYear(btnGetYear);
        });
        btnDatePicker.addEventListener("click", (e) => {
            e.preventDefault();
            this.tabDatePicker(btnDatePicker);
        });
    }

    async getValueYear() {
        let parent = document.querySelector(".getYear");
        let input = parent.querySelector("input");
        let err = parent.querySelector(".error-mess");

        if (!this.isValidYear(input.value)) {
            err.innerHTML = "Năm không hợp lệ";
        } else {
            err.innerHTML = "";
            await admin.getTotalsPriceInYear(input.value).then(response => {
                const data = response.data;
                this.createChartByYear(data, input.value);
            });
        }
    }

    isValidYear(year) {
        const isNumeric = /^\d+$/;
        if (!isNumeric.test(year)) {
            return false;
        }

        year = parseInt(year, 10);

        if (year >= 1000 && year <= 9999) {
            return true;
        } else {
            return false;
        }
    }

    async getDateRange() {
        let parent = document.querySelector(".datePicker");
        let err = parent.querySelector(".error-mess");
        let startDate = document.querySelector(".startDate");
        let endDate = document.querySelector(".endDate");

        let inputStartDate = startDate.querySelector("input");
        let inputEndDate = endDate.querySelector("input");

        if (inputStartDate.value < inputEndDate.value) {
            err.innerHTML = "";
            await admin.getTotalsPriceByRange(String(inputStartDate.value), String(inputEndDate.value))
                .then(response => {
                    const data = response.data;
                    this.createChartDateRange(data, String(inputStartDate.value), String(inputEndDate.value));
                });
        } else {
            err.innerHTML = "Vui lòng chọn lại.";
        }
    }

    createChartDateRange(data, startDate, endDate) {
        let arrayDate = this.createDateRangeArray(startDate, endDate);
        let result = [];

        for (let i = 0; i < arrayDate.length; i++) {
            result[i] = 0;
        };

        data.forEach(item => {
            let dateIndex = arrayDate.indexOf(item[0]);
            if (dateIndex !== -1) {
                result[dateIndex] += item[1];
            }
        });

        var existingChart = Chart.getChart("myChart");
        if (existingChart) {
            existingChart.destroy();
        }

        var ctx = document.getElementById("myChart");

        new Chart(ctx, {
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
    }

    createDateRangeArray(startDate, endDate) {
        let currentDate = new Date(startDate);
        const arrayDate = [];

        while (currentDate <= new Date(endDate)) {
            arrayDate.push(currentDate.toISOString().split('T')[0]);
            currentDate.setDate(currentDate.getDate() + 1);
        }

        return arrayDate;
    }

    createChartByYear(data, year) {
        let arrayMonth = [];
        let result = [];

        for (let i = 1; i <= 12; i++) {
            arrayMonth.push(`Tháng ${i}`);
            let matchingMonth = data.find(item => item[0] === i);
            result.push(matchingMonth ? matchingMonth[1] : 0);
        }

        var existingChart = Chart.getChart("myChart");
        if (existingChart) {
            existingChart.destroy();
        }

        var ctx = document.getElementById("myChart");

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: arrayMonth,
                datasets: [{
                    label: `# doanh thu trong tháng năm ${year}`,
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
    }
}