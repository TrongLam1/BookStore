export default class Toast {
    toast({ title = "", message = "", type = "info", duration = 3000, time = "" }) {
        const toastContainer = document.getElementById("toast");
        if (toastContainer) {
            const toastElement = document.createElement("div");

            // Auto remove toast
            const autoRemoveId = setTimeout(function () {
                toastContainer.removeChild(toastElement);
            }, duration + 1000);

            // Remove toast when clicked
            toastElement.onclick = function (e) {
                if (e.target.closest(".toast__close")) {
                    toastContainer.removeChild(toastElement);
                    clearTimeout(autoRemoveId);
                }
            };

            const icons = {
                success: "fa-solid fa-circle-check",
                error: "fa-solid fa-circle-exclamation"
            };
            const icon = icons[type];
            const delay = (duration / 1000).toFixed(2);

            toastElement.classList.add("toast-custom", `toast--${type}`);
            toastElement.style.animation = `slideInLeft ease .3s, fadeOut linear 1s ${delay}s forwards`;

            if (title === "Bạn có đơn hàng mới") {
                toastElement.innerHTML =
                    `
                        <div class="toast__icon">
                            ${time}
                        </div>
                        <div class="toast__body">
                            <h3 class="toast__title">${title}</h3>
                            <p class="toast__msg">${message}</p>
                        </div>
                        <div class="toast__close">
                            <i class="fas fa-times"></i>
                        </div>
                    `;
            } else {
                toastElement.innerHTML =
                    `
                        <div class="toast__icon">
                            <i class="${icon}"></i>
                        </div>
                        <div class="toast__body">
                            <h3 class="toast__title">${title}</h3>
                            <p class="toast__msg">${message}</p>
                        </div>
                        <div class="toast__close">
                            <i class="fas fa-times"></i>
                        </div>
                    `;
            }

            toastContainer.appendChild(toastElement);
        }
    }

    showSuccessToast(mess) {
        this.toast({
            title: "Thành công!",
            message: mess,
            type: "success",
            duration: 3000
        });
    }

    showErrorToast(mess) {
        this.toast({
            title: "Thất bại!",
            message: mess,
            type: "error",
            duration: 5000
        });
    }

    showNotificationNewOrder(mess) {
        this.toast({
            title: "Bạn có đơn hàng mới",
            message: `Đơn hàng <strong>#${mess.orderId}</strong> đã được đặt.`,
            type: "success",
            duration: 3000,
            time: mess.time
        });
    }
}