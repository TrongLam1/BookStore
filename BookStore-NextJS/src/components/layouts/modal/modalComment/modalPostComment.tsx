/* eslint-disable jsx-a11y/alt-text */
'use client'
import img from '@/assets/images/review.png';
import { faArrowRightLong } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from 'next/image';
import { Form, Modal } from 'react-bootstrap';
import './modalPostComment.scss';
import { useState } from 'react';
import { PostComment } from '@/app/api/commentApi';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

export default function ModalPostComment(props: any) {
    const router = useRouter();
    const { show, handleClose, bookId, token } = props;
    const [rating, setRating] = useState<number>(0);
    const [comment, setComment] = useState<string>('');

    const handlePostComment = async () => {
        const newComment = {
            content: comment,
            rating,
            bookId
        };

        if (token === undefined) {
            toast.error("Vui lòng đăng nhập.");
            setRating(0);
            setComment('');
            handleClose();
            return;
        }

        const res = await PostComment(newComment);
        if (res.statusCode === 201) {
            toast.success("Đánh giá sản phẩm thành công.");
            setRating(0);
            setComment('');
            handleClose();
            router.refresh();
        }
    }

    return (
        <Modal style={{ color: 'black' }} size="lg" show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Đánh giá sản phẩm</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className='img-comment'>
                    <Image src={img} alt='' height="100" width="100" />
                </div>
                <Form>
                    <div className="rating">
                        <input type="radio" name="rating" value="5" id="5"
                            onClick={(e) => setRating(+e.target.value)} />
                        <label htmlFor="5">☆</label>
                        <input type="radio" name="rating" value="4" id="4"
                            onClick={(e) => setRating(+e.target.value)} />
                        <label htmlFor="4">☆</label>
                        <input type="radio" name="rating" value="3" id="3"
                            onClick={(e) => setRating(+e.target.value)} />
                        <label htmlFor="3">☆</label>
                        <input type="radio" name="rating" value="2" id="2"
                            onClick={(e) => setRating(+e.target.value)} />
                        <label htmlFor="2">☆</label>
                        <input type="radio" name="rating" value="1" id="1"
                            onClick={(e) => setRating(+e.target.value)} />
                        <label htmlFor="1">☆</label>
                    </div>
                    <div className="comment-area">
                        <textarea className="form-control" placeholder="Đánh giá của bạn về sản phẩm" rows={4} value={comment} onChange={(e) => setComment(e.target.value)}></textarea>
                        <div className="err-mess"></div>
                    </div>
                    <div className="text-center mt-4">
                        <button type="button" className="btn btn-success btn-post-comment px-5"
                            onClick={handlePostComment}>
                            Đánh giá
                            <FontAwesomeIcon icon={faArrowRightLong} className="ml-2" />
                        </button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    )
}