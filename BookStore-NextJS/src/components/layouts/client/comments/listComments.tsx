'use client'

import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import './listComments.scss';
import ModalPostComment from "../../modal/modalComment/modalPostComment";
import { useEffect, useState } from "react";
import CommentItem from "./commentItem";

export default function ListComments(props: any) {
    const { data, bookId, token } = props;
    const [openModal, isOpenModal] = useState<boolean>(false);
    const [listComments, setListComments] = useState<Array<any>>();

    useEffect(() => {
        setListComments(data.listComments ?? []);
    }, [data])

    const handleClose = () => { isOpenModal(false); }

    return (
        <>
            <div className="row" style={{ padding: '15px' }}>
                <div className="product-comment-container col-lg-9">
                    <div className="product-comment-heading d-flex justify-content-between align-items-center">
                        <span>ĐÁNH GIÁ - BÌNH LUẬN</span>
                        <button className="write-rating" type="button" onClick={() => isOpenModal(true)}>
                            <FontAwesomeIcon icon={faPenToSquare} />
                        </button>
                    </div>
                    <div className="product-comment-body">
                        {listComments && listComments.length > 0 &&
                            listComments.map((item, index: number) => {
                                return (
                                    <CommentItem key={`comment-${index}`} item={item} />
                                )
                            })
                        }
                    </div>
                </div>
            </div>
            <ModalPostComment show={openModal} handleClose={handleClose} bookId={bookId} token={token} />
        </>
    )
}