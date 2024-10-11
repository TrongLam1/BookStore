/* eslint-disable @next/next/no-img-element */
'use client'

import { UpdateImgProduct } from "@/app/api/productsApi";
import { CSpinner } from "@coreui/react";
import { faCameraRotate, faCircleXmark, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { toast } from "react-toastify";

export default function ProductItemComponent(props: any) {
    const router = useRouter();
    const { item, setProductIdUpdate, setIsShowModalEditProduct } = props;

    const [loadingApi, setLoadingApi] = useState(false);
    const [img, setImg] = useState();
    const [changeImgModal, setChangeImgModal] = useState<boolean>(false);

    const handleRemoveProduct = async (productId: number) => {

    };

    const updateImgProduct = async () => {
        const formData = new FormData();
        formData.append('id', item.id);
        formData.append('file', img);

        setLoadingApi(true);
        const res = await UpdateImgProduct(formData);
        if (res.statusCode === 200) {
            toast.success("Cập nhật hình ảnh thành công.");
            setChangeImgModal(false);
            setTimeout(() => {
                router.refresh();
            }, 2000);
        } else {
            toast.error(res.message);
        }
        setLoadingApi(false);
    };

    return (
        <tr>
            <td>#{item.id}</td>
            <td>{item.name}</td>
            <td id="img-book" className="d-flex align-items-center flex-column">
                <img src={item.imageUrl} alt="" />
                <button className="mt-3" onClick={() => setChangeImgModal(true)}>
                    <FontAwesomeIcon icon={faCameraRotate} />
                </button>
                <Modal style={{ color: 'black' }}
                    size="lg" show={changeImgModal}
                    backdrop="static"
                    keyboard={false}>
                    <Modal.Header>
                        <Modal.Title>Cập nhật hình ảnh</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group className="mt-3 form-change-img">
                            <Form.Control
                                id={`change-img-${item.id}`}
                                type="file"
                                accept="image/*"
                                onChange={(e) => setImg(e.target.files[0])} />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary"
                            disabled={loadingApi ? true : false}
                            onClick={() => setChangeImgModal(false)}>
                            Đóng
                        </Button>
                        <Button variant="primary"
                            disabled={loadingApi ? true : false}
                            onClick={() => updateImgProduct()}>
                            {loadingApi &&
                                <CSpinner color="light" size="sm" className='me-3' style={{ width: '1.3rem', height: '1.3rem' }} />}
                            Lưu
                        </Button>
                    </Modal.Footer>
                </Modal>
            </td>
            <td>{item.inventory}</td>
            <td>
                <button
                    className="btn-table-dashboard" id="view-book" type="button"
                    onClick={() => {
                        setIsShowModalEditProduct(true);
                        setProductIdUpdate(item.id);
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