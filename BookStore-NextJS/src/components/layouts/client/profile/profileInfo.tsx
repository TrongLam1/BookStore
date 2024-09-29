'use client'

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProfileInfoComponent(props: any) {
    const router = useRouter();

    const { user } = props;
    if (!user) router.push("/auth/login");

    const [userName, setUsername] = useState<string>(user.username);
    const [email, setEmail] = useState<string>('');
    const [phone, setPhone] = useState<string>('');
    const [currentPassword, setCurrentPassword] = useState<string>('');
    const [newPassword, setNewPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [showChangePassword, setShowChangePassword] = useState<boolean>(false);
    const [isUpdateInfo, setIsUpdateInfo] = useState<boolean>(false);

    useEffect(() => {
        const email = maskEmail(user.email);
        const phone = maskPhoneNumber(user.phone);
        setEmail(email);
        setPhone(phone);
    }, []);

    const handleShowChangePassword = () => {
        setShowChangePassword(!showChangePassword);
    };

    const maskPhoneNumber = (phoneNumber: string) => {
        if (phoneNumber !== undefined) {
            if (typeof phoneNumber !== 'string' || phoneNumber.length !== 10) {
                return "Invalid phone number format";
            }
        } else { return ""; }

        // Extract the first 3 characters
        const firstPart = phoneNumber.substring(0, 2);

        // Extract the last 2 characters
        const lastPart = phoneNumber.substring(8);

        // Mask the middle characters
        const maskedMiddle = phoneNumber.substring(3, 8).replace(/[0-9]/g, "*");

        // Concatenate the parts to form the masked phone number
        return firstPart + maskedMiddle + lastPart;
    }

    const maskEmail = (email: string) => {
        // Find the position of the "@" symbol
        const atIndex = email.indexOf("@");

        const firstPart = email.substring(0, 2);

        const maskedMiddle = email.substring(2, atIndex).replace(/[^\s@]/g, "*");

        // Extract the domain part
        const domainPart = email.substring(atIndex);

        // Concatenate the parts to form the masked email
        return firstPart + maskedMiddle + domainPart;
    }

    const handleChangePassword = async (e: any) => {
        const parentNode = e.target.parentNode.parentNode;
        const errorMessages = parentNode.querySelectorAll(".error-message");

        let res;

        if (currentPassword === newPassword) {
            errorMessages[1].innerHTML = "Mật khẩu mới phải khác mật khẩu hiện tại."
            return;
        } else {
            errorMessages[1].innerHTML = ""
        }

        if (newPassword === confirmPassword) {
            //res = await changePassword(currentPassword, newPassword);
            errorMessages[2].innerHTML = ""
        } else {
            errorMessages[2].innerHTML = "Nhập lại mật khẩu không đúng."
            return;
        }

        // if (res && res.status === 200) {

        // }
    }

    const handleActiveUpdateInfo = () => {
        const container = document.querySelector(".profile-body-container");
        const containerInputs = container?.querySelectorAll(".profile-body-item");
        containerInputs?.forEach(containerInput => {
            const input = containerInput.querySelector(".content");
            input?.toggleAttribute("readonly");
        });
        setIsUpdateInfo(!isUpdateInfo);
    }

    const handleUpdateInfo = async () => {
        console.log("update info");
        handleActiveUpdateInfo();
    }

    return (
        <>
            <div className="profile-content-header">
                Thông tin tài khoản
            </div>
            <div className="profile-content-body">
                <div className="profile-body-title">Thông tin cơ bản</div>
                <div className="profile-body-container row">
                    <div className="profile-body-item row">
                        <span className="col-lg-2">Họ và tên</span>
                        <input
                            className="content col-lg-8" readOnly type="text"
                            value={userName}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div className="profile-body-item row">
                        <span className="col-lg-2">Email</span>
                        <input
                            className="content-email col-lg-8" readOnly type="text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="profile-body-item row">
                        <span className="col-lg-2">Số điện thoại</span>
                        <input
                            className="content col-lg-8" readOnly type="text" maxLength={10}
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                        <span className="error-message"></span>
                    </div>
                </div>
                <div className="change-password d-flex align-items-center row">
                    <div className="btn-change-password col-lg-2">
                        <button
                            type="button"
                            id="btn-change-pass"
                            className="btn btn-primary"
                            onClick={() => handleShowChangePassword()}
                        >
                            Đổi mật khẩu
                        </button>
                    </div>
                    {showChangePassword === true &&
                        <div className="change-pass-container row profile-body-item align-items-center col-lg-10">
                            <div className="col-lg-10">
                                <div className="change-pass-input row">
                                    <span className="col-lg-3">Mật khẩu hiện tại:</span>
                                    <input
                                        type="password" className="content col-lg-7"
                                        value={currentPassword}
                                        min={8}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                    />
                                    <span className="error-message"></span>
                                </div>
                                <div className="change-pass-input row">
                                    <span className="col-lg-3">Mật khẩu mới:</span>
                                    <input
                                        type="password" className="content col-lg-7"
                                        min={8}
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                    />
                                    <span className="error-message"></span>
                                </div>
                                <div className="change-pass-input row">
                                    <span className="col-lg-3">Nhập lại mật khẩu mới:</span>
                                    <input
                                        type="password" className="content col-lg-7"
                                        min={8}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    />
                                    <span className="error-message"></span>
                                </div>
                            </div>
                            <div className="col-lg-2">
                                <button
                                    type="submit" id="save-pass" className="btn btn-primary"
                                    onClick={(e) => handleChangePassword(e)}
                                >
                                    Lưu mật khẩu
                                </button>
                            </div>
                        </div>
                    }
                </div>
                <div className="profile-update-btn">
                    {!isUpdateInfo ?
                        (<button
                            type="button" className="btn btn-primary"
                            onClick={() => handleActiveUpdateInfo()}
                        >
                            Cập nhật thông tin
                        </button>)
                        :
                        (<div>
                            <button
                                type="button" className="btn btn-primary"
                                style={{ backgroundColor: 'red', borderColor: 'red' }}
                                onClick={() => handleActiveUpdateInfo()}
                            >
                                Hủy
                            </button>
                            <button
                                type="button" className="btn btn-primary"
                                onClick={() => handleUpdateInfo()}
                            >
                                Cập nhật thông tin
                            </button>
                        </div>)
                    }
                </div>
            </div>
        </>
    );
};