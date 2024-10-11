'use client'

import { Col, Form } from "react-bootstrap";

interface ICategoryItem {
    categoryName: string;
}

export default function ListCategoriesComponent(props: any) {
    const { category, setCategory, listCategories } = props;

    return (
        <Col>
            <Form.Label>Danh mục <span className='text-danger'>*</span></Form.Label>
            <Form.Select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
            >
                <option>---Options---</option>
                {listCategories && listCategories.length > 0 &&
                    listCategories.map((item: ICategoryItem, index: number) => {
                        return (
                            <option key={`category-${index}`} value={item.categoryName} >
                                {item.categoryName}
                            </option>
                        )
                    })}
            </Form.Select>
        </Col>
    );
};