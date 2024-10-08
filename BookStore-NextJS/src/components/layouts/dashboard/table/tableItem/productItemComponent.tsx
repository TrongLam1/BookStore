/* eslint-disable @next/next/no-img-element */
'use client'

import { faCircleXmark, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { toast } from "react-toastify";

export default function ProductItemComponent(props: any) {

    const { item } = props;

    const [idEditProduct, setIdEditProduct] = useState('');

    const handleRemoveProduct = async (productId: number) => {
        // const res = await updateStatusProduct(productId, "Remove");
        // if (res && res.status === 200) {
        //     toast.success("Xóa sản phẩm thành công.");
        //     getAllProducts(page);
        // } else {
        //     toast.error("Xóa sản phẩm thất bại.");
        // }
    };

    return (
        <tr>
            <td>#{item.id}</td>
            <td>{item.name}</td>
            <td id="img-book" className="d-flex align-items-center flex-column">
                <img src={item.imageUrl} alt="" />
            </td>
            <td>
                <button
                    className="btn-table-dashboard" id="view-book" type="button"
                    onClick={() => {
                        // setIsShowModalEditProduct(true);
                        setIdEditProduct(item.id);
                    }}
                >
                    <FontAwesomeIcon icon={faPenToSquare} />
                </button>
                <button className="btn-table-dashboard"
                    id="remove-book"
                    type="button"
                    onClick={() => handleRemoveProduct(item.id)}>
                    <FontAwesomeIcon icon={faCircleXmark} />
                </button>
            </td>
        </tr>
    )
}