'use client'

import { GetProfileUser, UpdateProfileUser } from "@/app/api/userApi";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProfileInfoComponent(props: any) {
    const router = useRouter();

    const { user } = props;

    const [userName, setUsername] = useState<string>(user?.username);
    const [email, setEmail] = useState<string>('');
    const [phone, setPhone] = useState<string>('');
    const [address, setAddress] = useState<string>('');
    const [isUpdateInfo, setIsUpdateInfo] = useState<boolean>(false);

    useEffect(() => {
        if (!user) router.push("/auth/login");
        getProfileUser();
    }, []);

    const getProfileUser = async () => {
        const res = await GetProfileUser();
        if (res.statusCode === 200) {
            const userName = res.data[0].email !== null ? res.data[0].username : '';
            const email = res.data[0].email !== null ? maskEmail(res.data[0].email) : '';
            const phone = res.data[0].phone !== null ? maskPhoneNumber(res.data[0].phone) : '';
            const address = res.data[0].address !== null ? res.data[0].address : '';
            setUsername(userName);
            setEmail(email);
            setPhone(phone);
            setAddress(address);
        }
    };

    const maskPhoneNumber = (phoneNumber: string) => {
        if (phoneNumber !== '' || phoneNumber !== undefined) {
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
        const atIndex = email?.indexOf("@");

        const firstPart = email?.substring(0, 2);

        const maskedMiddle = email?.substring(2, atIndex).replace(/[^\s@]/g, "*");

        // Extract the domain part
        const domainPart = email?.substring(atIndex);

        // Concatenate the parts to form the masked email
        return firstPart + maskedMiddle + domainPart;
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
        const res = await UpdateProfileUser({
            username: userName,
            phone, address
        });
        handleActiveUpdateInfo();
        if (res.statusCode === 201) router.refresh();
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
                    <div className="profile-body-item row">
                        <span className="col-lg-2">Địa chỉ</span>
                        <input
                            className="content col-lg-8" readOnly type="text" maxLength={10}
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        />
                        <span className="error-message"></span>
                    </div>
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
                                Lưu
                            </button>
                        </div>)
                    }
                </div>
            </div>
        </>
    );
};