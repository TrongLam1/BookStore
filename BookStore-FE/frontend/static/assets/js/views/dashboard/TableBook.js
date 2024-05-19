import Admin from '../../entities/Admin.js';
import Product from '../../entities/Product.js';
import Toast from '../Toast.js';

const admin = new Admin();
const product = new Product();
const toast = new Toast();

export default class TableBook {
    renderListBooks(item) {
        return `
        <tr>
            <td>#${item.id}</td>
            <td>${item.name}</td>
            <td id="img-book" class="d-flex align-items-center flex-column">
                <img src="${item.image_url}" alt="">
            </td>
            <td>
                <button class="btn-table-dashboard" id="view-book" type="button" data-bs-toggle="modal" data-bs-target="#ModalUpdBook" data-id="${item.id}">
                    <i class="fa-regular fa-pen-to-square"></i>
                </button>
                <button class="btn-table-dashboard" id="remove-book" type="button" data-id="${item.id}">
                    <i class="fa-regular fa-circle-xmark"></i>
                </button>
            </td>
        </tr>
        `;
    }

    async renderTableBooks(container, page) {
        const data = await admin.getAllBooks(page).then(response => {
            return response.status === 200 ? response.data : [];
        });
        const dataBooks = data.data;
        const listBooks = dataBooks.map(item => this.renderListBooks(item)).join("");
        let results = `
        <div class="container-fluid">
            <div class="loader-container">
                <div class="loader"></div>
            </div>
            <div class="container">
                <div class="d-flex align-items-center">
                    <button id="add-new-book" type="button" data-bs-toggle="modal" data-bs-target="#ModalAddBook">
                        Thêm sản phẩm
                    </button>
                    <div class="import-excel-container">
                        <div>
                            <input type="checkbox" name="checkExcel" id="checkExcel">
                            <label for="checkExcel">Import Excel</label>
                        </div>
                        <input type="file" id="import-excel" accept=".xlsx, .xls, .csv" disabled>
                        <button type="button" id="btn-import-excel" disabled>
                            <i class="fa-solid fa-upload"></i>
                            Import Excel
                        </button>
                        <button type="button" id="btn-export-excel">
                            <i class="fa-solid fa-download"></i>
                            Export Excel
                        </button>
                    </div>
                </div>
                <div class="nav-btn-search d-flex align-items-center search-dashboard">
                    <input id="searchBook" class="form-control" type="text" placeholder="Nhập tên sách ...">
                    <button id="searchIcon" class="btn text-dark" type="button">
                        <i class="fa-solid fa-magnifying-glass"></i>
                    </button>
                </div>
                <table class="table table-striped table-responsive table-dashboard">
                    <thead class="heading-table">
                        <tr>
                            <th>ID</th>
                            <th>Tên sản phẩm</th>
                            <th>Hình ảnh</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody class="body-table">
                        ${listBooks}
                    </tbody>
                </table>
            </div>
        </div>
        <div class="pagination"><ul></ul></div>
        `;

        container.innerHTML = results;
        return data.totalPages;
    }

    async getBookDetail(data) {
        const array = await product.getTypesBranchesOfCategory(data.category).then(response => {
            return response.status === 200 ? response.data : [];
        });
        let types = array[0].map(item => this.generateOption(item)).join('');
        let branches = array[1].map(item => this.generateOption(item)).join('');
        return `
        <form class="row" method="POST">
            <div class="mb3 col-lg-12">
                <label for="book-name" class="form-label">Tên sách</label>
                <input type="text" class="form-control" id="book-name" value="${data.name}">
            </div>
            <div class="mb3 col-lg-4 d-flex flex-column">
                <label for="book-category" class="form-label">Danh mục</label>
                <input type="text" class="form-control" id="book-category" value="${data.category}" disabled>
            </div>
            <div class="mb3 col-lg-4 d-flex flex-column">
                <label for="book-branch" class="form-label">Nhà xuất bản</label>
                <select name="book-branch" id="book-branch">
                    <option value="">-- Chọn --</option>
                    ${branches}
                </select>
            </div>
            <div class="mb3 col-lg-4 d-flex flex-column">
                <label for="book-type" class="form-label">Thể loại</label>
                <select name="book-type" id="book-type">
                    <option value="">-- Chọn --</option>
                    ${types}
                </select>
            </div>
            <div class="mb3 col-lg-4">
                <label for="book-price" class="form-label">Giá</label>
                <input type="number" class="form-control" min="1000" id="book-price" value="${data.price}">
            </div>
            <div class="mb3 col-lg-4">
                <label for="book-inventory" class="form-label">Số lượng</label>
                <input type="number" class="form-control" min="0" id="book-inventory" value="${data.inventory_quantity}">
            </div>
            <div class="mb3 col-lg-4">
                <label for="book-sale" class="form-label">Giảm giá</label>
                <input type="number" class="form-control" min="0" id="book-sale" value="${data.sale}">
            </div>
            <div class="mb3 col-lg-12">
                <div class="row">
                    <div class="col-lg-6 d-flex justify-content-between">
                        <div>
                            <input type="checkbox" class="change-image">
                            <label for="book-img" class="form-label">Thay đổi hình ảnh</label>
                            <input type="file" accept="image/*" class="form-control" id="book-img" disabled>
                        </div>
                        <div id="preview"></div>
                    </div>
                </div>
            </div>
            <div class="mb3 col-lg-12 d-flex flex-column">
                <label for="book-des" class="form-label">Mô tả</label>
                <textarea name="book-des" id="book-des" cols="40" rows="10">${data.description}</textarea>
            </div>
            <div class="d-flex flex-row-reverse">
                <button id="btn-update-book" type="button" data-id="${data.id}">Lưu</button>
            </div>
        </form>
        `;
    }

    formAddNewBook() {
        let form = document.querySelector(".add-book-form form");
        let name = form.querySelector("#book-name");
        let category = form.querySelector("#book-category");
        let type = form.querySelector("#book-type");
        let branch = form.querySelector("#book-branch");
        let price = form.querySelector("#book-price");
        let quantity = form.querySelector("#book-inventory");
        let sale = form.querySelector("#book-sale");
        let img = document.getElementById("book-img");
        let description = form.querySelector("#book-des");
        let btnSave = document.querySelector("#btn-add-book");
        let btnClose = document.querySelector("#close-add");
        let src;

        img.addEventListener("change", (e) => {
            src = this.getImagePreview(e);
        });

        btnSave.addEventListener("click", async () => {
            const request = {
                "name": name.value,
                "category": category.value,
                "type": type.value,
                "branch": branch.value,
                "description": description.value,
                "price": price.value,
                "quantity": quantity.value,
                "sale": sale.value,
                "salePrice": price.value * (100 - sale.value) / 100,
                "file": src,
            }
            await admin.addNewBook(request).then(window.location.reload());
        });
    }

    formUpdateBook(form) {
        let name = form.querySelector("#book-name");
        let category = form.querySelector("#book-category");
        let type = form.querySelector("#book-type");
        let branch = form.querySelector("#book-branch");
        let price = form.querySelector("#book-price");
        let quantity = form.querySelector("#book-inventory");
        let sale = form.querySelector("#book-sale");
        let img = form.querySelector("#book-img");
        let description = form.querySelector("#book-des");
        let btnUpdate = form.querySelector("#btn-update-book");
        let btnClose = form.querySelector("#close-add");
        let src;

        img.addEventListener("change", (e) => {
            src = this.getImagePreview(e);
        });

        let changeImg = this.changeImageBook(form);
        let bodyImg;

        btnUpdate.addEventListener("click", async () => {
            let checkBox = form.querySelector(".change-image");
            let id = btnUpdate.getAttribute("data-id");
            const request = {
                "id": id,
                "name": name.value,
                "category": category.value,
                "type": type.value,
                "branch": branch.value,
                "description": description.value,
                "price": price.value,
                "inventory_quantity": quantity.value,
                "sale": sale.value,
                "salePrice": price.value * (100 - sale.value) / 100
            }

            if (checkBox.checked) {
                bodyImg = { "file": src };
                await admin.updateBook(request);
                await admin.changeImgBook(id, bodyImg)
                    .then(() => window.location.reload())
                    .catch(err => toast.showErrorToast(err));
            } else {
                let response = await admin.updateBook(request);
                let mess = response.message;
                let start = mess.indexOf("[");
                let end = mess.indexOf("for");
                if (end !== -1) {
                    mess = mess.substring(start + 1, end);
                    toast.showErrorToast(mess);
                }
            }
        });
    }

    getImagePreview(event) {
        var image = URL.createObjectURL(event.target.files[0]);
        var imagediv = document.getElementById('preview');
        var newimg = document.createElement('img');
        imagediv.innerHTML = '';
        newimg.src = image;
        newimg.width = "300";
        imagediv.appendChild(newimg);
        return event.target.files[0];
    }

    generateOption(item) {
        return `<option value="${item}">${item}</option>`;
    }

    async generateCategories() {
        let category = document.querySelector("#book-category");
        let listCategories = await product.getAllCategories().then(response => {
            return response.status === 200 ? response.data : [];
        });
        let container = "<option>---Chọn---</option>";
        container += listCategories.map(item => this.generateOption(item)).join('');
        category.innerHTML = container;
    }

    generateTypes(list) {
        let type = document.querySelector("#book-type");
        let container = "<option>---Chọn---</option>";
        container += list.map(item => this.generateOption(item)).join('');
        type.innerHTML = container;
    }

    generateBranches(list) {
        let branch = document.querySelector("#book-branch");
        let container = "<option>---Chọn---</option>";
        container += list.map(item => this.generateOption(item)).join('');
        branch.innerHTML = container;
    }

    generateSelectTypesAndBranchesOfCategory() {
        let category = document.querySelector("#book-category");
        category.addEventListener("change", async () => {
            const list = await product.getTypesBranchesOfCategory(category.value);
            let listTypes = list[0];
            let listBranches = list[1];
            this.generateTypes(listTypes);
            this.generateBranches(listBranches);
        });
    }

    changeImageBook(form) {
        let checkBox = form.querySelector(".change-image");
        checkBox.addEventListener("click", () => {
            if (checkBox.checked) {
                form.querySelector("#book-img").removeAttribute("disabled");
            } else {
                form.querySelector("#book-img").setAttribute("disabled", "disabled");
            }
        });
    }

    showConfirmationPopup(callback) {
        const confirmed = confirm("Bạn xác nhận muốn xóa sản phẩm này ?");
        callback(confirmed);
    }

    checkImportExcel() {
        let btn = document.querySelector("#checkExcel");
        let inputImport = document.querySelector("#import-excel");
        let btnImport = document.querySelector("#btn-import-excel");
        let checked = false;
        btn.addEventListener("click", () => {
            if (btn.checked) {
                inputImport.removeAttribute("disabled");
                btnImport.removeAttribute("disabled");
                checked = true;
            } else {
                inputImport.setAttribute("disabled", "disabled");
                btnImport.setAttribute("disabled", "disabled");
                checked = false;
            }
        });

        return checked;
    }

    importExcel() {
        let btnImport = document.querySelector("#btn-import-excel");
        if (this.checkImportExcel) {
            btnImport.addEventListener("click", () => {
                let inputImport = document.querySelector("#import-excel");
                let loader = document.querySelector(".loader-container");

                const file = { "file": inputImport.files[0] };
                loader.style.display = "flex";

                admin.importExcel(file)
                    .then((res) => {
                        if (res.status === 201) {
                            toast.showSuccessToast(res.message);
                            setTimeout(() => { window.location.reload() }, 1200);
                        } else {
                            toast.showErrorToast(res.message);
                            loader.style.display = "none";
                        }
                    })
                    .catch(err => {
                        toast.showErrorToast(err);
                        loader.style.display = "none";
                    });
            });
        }
    }

    exportExcel() {
        let btn = document.querySelector("#btn-export-excel");
        btn.addEventListener("click", async () => {
            try {
                const response = await fetch('http://localhost:8080/api/v1/book/down');

                if (!response.ok) {
                    toast.showErrorToast('Network response was not ok ' + response.statusText);
                    throw new Error('Network response was not ok ' + response.statusText);
                }

                const blob = await response.blob();

                const tempUrl = URL.createObjectURL(blob);

                const aTag = document.createElement('a');
                aTag.href = tempUrl;
                aTag.download = 'book_excel.xlsx';

                document.body.appendChild(aTag);
                aTag.click();
                aTag.remove();

                URL.revokeObjectURL(tempUrl);
            } catch (error) {
                toast.showErrorToast('There was an error downloading the file:', error);
            }
        });
    }

    searchBook() {
        let search = document.querySelector("#searchBook");
        let bodyTable = document.querySelector(".body-table");
        search.addEventListener("keydown", async (e) => {
            if (e.keyCode == 13) {
                await product.renderFindByNameContaining(search.value)
                    .then(response => {
                        let data = response.data;
                        let listBooks = data.map(item => this.renderListBooks(item)).join('');
                        bodyTable.innerHTML = listBooks;
                    })
                    .catch(error => {
                        body.innerHTML = "Không tìm thấy sản phẩm.";
                        document.querySelector(".pagination").innerHTML = "";
                    });
            }
        });
    }
}