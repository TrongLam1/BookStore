'use client'

import { Col, Form } from "react-bootstrap";

interface IBrandItem {
    brandName: string;
}

export default function ListBrandsComponent(props: any) {
    const { brand, setBrand, listBrands } = props;

    return (
        <Col>
            <Form.Label>Nhà xuất bản <span className='text-danger'>*</span></Form.Label>
            <Form.Select
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
            >
                <option>---Options---</option>
                {listBrands && listBrands.length > 0 &&
                    listBrands.map((item: IBrandItem, index: number) => {
                        return (
                            <option key={`brand-${index}`} value={item.brandName} >
                                {item.brandName}
                            </option>
                        )
                    })}
            </Form.Select>
        </Col>
    );
};