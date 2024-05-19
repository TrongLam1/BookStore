export default class Pagination {
    async createButtonPagination(totalPages, currentPage = 1) {
        if (totalPages === 1) return;

        let paginationContainer = document.querySelector(".pagination");
        paginationContainer.innerHTML = '';

        let ul = document.createElement("ul");

        let liPrev = document.createElement("li");
        liPrev.classList.add("prev-btn");
        let buttonPrev = document.createElement("button");
        buttonPrev.setAttribute("type", "button");
        buttonPrev.textContent = "Prev";
        liPrev.appendChild(buttonPrev);
        ul.appendChild(liPrev);

        let liPageCount = document.createElement("li");
        let currentPageInput = document.createElement("input");
        currentPageInput.classList.add("current-page");
        currentPageInput.setAttribute("type", "number");
        currentPageInput.setAttribute("value", currentPage);
        currentPageInput.setAttribute("disabled", true);
        liPageCount.appendChild(currentPageInput);

        liPageCount.appendChild(document.createTextNode("/"));

        let totalPagesInput = document.createElement("input");
        totalPagesInput.classList.add("total-pages");
        totalPagesInput.setAttribute("type", "number");
        totalPagesInput.setAttribute("value", totalPages);
        totalPagesInput.setAttribute("disabled", true);
        liPageCount.appendChild(totalPagesInput);
        ul.appendChild(liPageCount);

        let liNext = document.createElement("li");
        liNext.classList.add("next-btn");
        let buttonNext = document.createElement("button");
        buttonNext.setAttribute("type", "button");
        buttonNext.textContent = "Next";
        liNext.appendChild(buttonNext);
        ul.appendChild(liNext);

        paginationContainer.appendChild(ul);

        buttonPrev.addEventListener("click", () => {
            let currentPage = parseInt(currentPageInput.value);
            let totalPages = parseInt(totalPagesInput.value);
            if (currentPage > 1) {
                currentPage--;
                currentPageInput.value = currentPage;
                this.updateButtons(currentPage, totalPages, buttonPrev, buttonNext);
                this.changePage(currentPage);
                window.location.reload();
            }
        });

        buttonNext.addEventListener("click", () => {
            let currentPage = parseInt(currentPageInput.value);
            if (currentPage < totalPages) {
                currentPage++;
                currentPageInput.value = currentPage;
                this.updateButtons(currentPage, totalPages, buttonPrev, buttonNext);
                this.changePage(currentPage);
                window.location.reload();
            }
        });
    }


    updateButtons(currentPage, totalPages, prevButton, nextButton) {
        if (currentPage === 1) {
            prevButton.setAttribute("disabled", "disabled");
        } else {
            prevButton.removeAttribute("disabled");
        }

        if (currentPage === totalPages) {
            nextButton.setAttribute("disabled", "disabled");
        } else {
            nextButton.removeAttribute("disabled");
        }
    }

    changePage(page) {
        let url = window.location.href;
        url = this.modifyURL(url, page);
        history.pushState("", "", url);
    }

    modifyURL(url, page) {
        // Check if URL contains '?'
        if (url.includes("?")) {
            // Check if sortBy already exists in the URL
            if (url.includes("page=")) {
                // Replace the value of sortBy
                url = url.replace(/page=[^&]*/, `page=${page}`);
            } else {
                // Add sortBy to the URL
                url = `${url}&page=${page}`;
            }
        } else {
            // Add sortBy and sortDirection to the URL
            url = `${url}?page=${page}`;
        }

        return url;
    }
}