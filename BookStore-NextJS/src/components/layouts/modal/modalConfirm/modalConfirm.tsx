'use client'
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './modalConfirm.scss';

export default function ModalConfirm(props: any) {

    const { setIsOpen, name, cartItemId, handleRemoveProduct } = props;

    return (
        <div className="modal">
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Xác nhận</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={() => setIsOpen(false)}>
                            <FontAwesomeIcon icon={faXmark} />
                        </button>
                    </div>
                    <div className="modal-body">
                        <p>Bạn xác nhận xóa vật phẩm
                            <strong> &quot;{name}&quot; <span>?</span></strong>
                        </p>
                    </div>
                    <div className="modal-footer">
                        <button type="button"
                            className="btn btn-danger"
                            onClick={() => handleRemoveProduct(cartItemId)}>
                            Đồng ý
                        </button>
                        <button type="button" className="btn btn-secondary"
                            data-dismiss="modal" onClick={() => setIsOpen(false)}>
                            Đóng
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}