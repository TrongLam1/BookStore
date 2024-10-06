'use client'

import { useState } from "react";
import './resetPassword.scss';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { signOut } from "next-auth/react";
import { ResetPasswordApi } from "@/app/api/userApi";

export default function ResetPassword(props: any) {

    const [currentPassword, setCurrentPassword] = useState<string>('');
    const [newPassword, setNewPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');

    const checkFormReset = (e: any) => {
        const parentNode = e.target.parentNode.parentNode;
        const errorMessages = parentNode.querySelectorAll(".error-message");
        let validForm = true;

        if (currentPassword === newPassword) {
            errorMessages[1].innerHTML = "Mật khẩu mới phải khác mật khẩu hiện tại.";
            validForm = false;
        } else {
            errorMessages[1].innerHTML = "";
        }

        if (newPassword !== confirmPassword) {
            errorMessages[2].innerHTML = "Nhập lại mật khẩu không đúng."
            validForm = false;
        } else {
            errorMessages[2].innerHTML = ""
        }

        return validForm;
    }

    const handleResetPassword = async (e) => {
        const validForm = checkFormReset(e);
        if (validForm) {
            const res = await ResetPasswordApi({ password: newPassword });
            if (+res.statusCode === 200) signOut();
        }
    }

    const handleShowPassword = (item) => {
        const inputContainer = item.parentNode.parentNode;
        const input = inputContainer.querySelector('.content');
        if (input.type === 'text') {
            input.type = 'password';
        } else {
            input.type = 'text';
        }
    };

    return (
        <div className="change-password d-flex align-items-center row">
            <div className="profile-content-header">Đổi mật khẩu</div>
            <div className="change-pass-container row profile-body-item align-items-center">
                <div>
                    <div className="change-pass-input row">
                        <span className="col-lg-3">Mật khẩu hiện tại:</span>
                        <div className="col-lg-8">
                            <input
                                type="password" className="content"
                                value={currentPassword}
                                min={8}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                            />
                            <FontAwesomeIcon icon={faEye}
                                onClick={(e) => handleShowPassword(e.target)} />
                        </div>
                        <span className="error-message"></span>
                    </div>
                    <div className="change-pass-input row">
                        <span className="col-lg-3">Mật khẩu mới:</span>
                        <div className="col-lg-8">
                            <input
                                type="password" className="content"
                                min={8}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                            <FontAwesomeIcon icon={faEye}
                                onClick={(e) => handleShowPassword(e.target)} />
                        </div>
                        <span className="error-message"></span>
                    </div>
                    <div className="change-pass-input row">
                        <span className="col-lg-3">Nhập lại mật khẩu mới:</span>
                        <div className="col-lg-8">
                            <input
                                type="password" className="content"
                                min={8}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                            <FontAwesomeIcon icon={faEye}
                                onClick={(e) => handleShowPassword(e.target)} />
                        </div>
                        <span className="error-message"></span>
                    </div>
                </div>
                <div className="btn-reset-password">
                    <button
                        type="submit" id="save-pass" className="btn btn-primary"
                        onClick={(e) => handleResetPassword(e)}
                    >
                        Lưu mật khẩu
                    </button>
                </div>
            </div>
        </div>
    )
} 