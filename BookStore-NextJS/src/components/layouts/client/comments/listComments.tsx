'use client'

import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import './listComments.scss';

export default function ListComments(props: any) {

    return (
        <div className="row" style={{ padding: '15px' }}>
            <div className="product-comment-container col-lg-9">
                <div className="product-comment-heading d-flex justify-content-between align-items-center">
                    <span>ĐÁNH GIÁ - BÌNH LUẬN</span>
                    <button className="write-rating" type="button">
                        <FontAwesomeIcon icon={faPenToSquare} />
                    </button>
                </div>
                <div className="product-comment-body">

                </div>
            </div>
        </div>
    )
}