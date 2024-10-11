'use client'

import { Col, Form } from "react-bootstrap";

interface ITypeItem {
    typeName: string;
}

export default function ListTypesComponent(props: any) {
    const { type, setType, listTypes } = props;

    return (
        <Col>
            <Form.Label>Thể loại <span className='text-danger'>*</span></Form.Label>
            <Form.Select
                value={type}
                onChange={(e) => setType(e.target.value)}
            >
                <option>---Options---</option>
                {listTypes && listTypes.length > 0 &&
                    listTypes.map((item: ITypeItem, index: number) => {
                        return (
                            <option key={`type-${index}`} value={item.typeName} >
                                {item.typeName}
                            </option>
                        )
                    })}
            </Form.Select>
        </Col>
    );
};