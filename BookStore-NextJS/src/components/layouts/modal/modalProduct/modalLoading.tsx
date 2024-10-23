'use client'

import { Modal } from "react-bootstrap";

export default function ModalLoading(props: any) {
    const { show } = props;

    return (
        <Modal style={{ color: 'black' }}
            size="sm" show={show}
            backdrop="static"
            keyboard={false}
        >
            <Modal.Body>
                <div className="text-center">
                    <div className="loading-spinner mb-2"></div>
                    <div>Loading</div>
                </div>
            </Modal.Body>
        </Modal>
    );
};