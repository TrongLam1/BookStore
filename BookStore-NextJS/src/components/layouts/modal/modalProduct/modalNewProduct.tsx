'use client'

import { useEffect, useState } from 'react';
import { Button, Col, Form, Modal, Row } from 'react-bootstrap';
import ListCategoriesComponent from './listCategoriesComponent';
import ListBrandsComponent from './listBrandsComponent';
import ListTypesComponent from './listTypesComponent';
import { AddNewProduct } from '@/app/api/productsApi';
import { toast } from 'react-toastify';
import { CSpinner } from '@coreui/react';

export default function ModalNewProduct(props: any) {

    const { show, handleClose, dataSelect } = props;

    const [loadingApi, setLoadingApi] = useState<boolean>(false);

    const [name, setName] = useState<string>('');
    const [category, setCategory] = useState<string>('');
    const [brand, setBrand] = useState<string>('');
    const [type, setType] = useState<string>('');
    const [price, setPrice] = useState<number>(1000);
    const [quantity, setQuantity] = useState<number>(1);
    const [sale, setSale] = useState<number>(0);
    const [description, setDescription] = useState<string>('');
    const [img, setImg] = useState<string>('');

    const [listTypes, setListTypes] = useState([]);
    const [listBrands, setListBrands] = useState([]);
    const [listCategories, setListCategories] = useState([]);

    useEffect(() => {
        setListBrands(dataSelect.brands);
        setListTypes(dataSelect.types);
        setListCategories(dataSelect.categories);
    }, []);

    const handleValidSubmitProduct = () => {
        if (name === '' || category === '' || brand === '' || type === '' || img === '') {
            toast.error("Vui lòng không để trống các trường '*'");
            return false;
        }
        return true;
    };

    const handleSubmitNewProduct = async () => {
        const valid = handleValidSubmitProduct();

        const formData = new FormData();

        formData.append('name', name);
        formData.append('categoryName', category);
        formData.append('typeName', type);
        formData.append('brandName', brand);
        formData.append('description', description);
        formData.append('price', price.toString());
        formData.append('sale', sale.toString());
        formData.append('inventory', quantity.toString());
        formData.append('file', img);

        if (valid) {
            setLoadingApi(true);
            const res = await AddNewProduct(formData);
            if (res.statusCode === 201) {
                toast.success("Thêm sản phẩm mới thành công.");
            } else {
                toast.error(res.message);
            }
            setLoadingApi(false);
        }
    };

    const clearModal = () => {
        setName('');
        setCategory('');
        setBrand('');
        setType('');
        setPrice(1000);
        setQuantity(1);
        setSale(0);
        setDescription('');
        setImg('');
    };

    return (
        <Modal style={{ color: 'black' }}
            size="lg" show={show}
            onHide={handleClose}
            backdrop="static"
            keyboard={false}
        >
            <Modal.Header closeButton>
                <Modal.Title>Thêm sản phẩm</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Tên sản phẩm <span className='text-danger'>*</span></Form.Label>
                        <Form.Control
                            type="text" autoFocus
                            onChange={(e) => setName(e.target.value)}
                        />
                    </Form.Group>

                    <Row className="mb-3">
                        <ListCategoriesComponent
                            category={category} setCategory={setCategory}
                            listCategories={listCategories} />
                        <ListBrandsComponent
                            brand={brand} setBrand={setBrand}
                            listBrands={listBrands} />
                        <ListTypesComponent
                            type={type} setType={setType}
                            listTypes={listTypes} />
                    </Row>

                    <Row className="mb-3">
                        <Col>
                            <Form.Group className="mb-3">
                                <Form.Label>Giá</Form.Label>
                                <Form.Control
                                    min={1000} type="number"
                                    value={price}
                                    onChange={(e) => setPrice(+e.target.value)}
                                />
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group className="mb-3">
                                <Form.Label>Số lượng</Form.Label>
                                <Form.Control
                                    type="number" min={0}
                                    value={quantity}
                                    onChange={(e) => setQuantity(+e.target.value)}
                                />
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group className="mb-3">
                                <Form.Label>Giảm giá</Form.Label>
                                <Form.Control
                                    type="number" min={0}
                                    value={sale}
                                    onChange={(e) => setSale(+e.target.value)}
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Form.Group className="mb-3">
                        <Form.Label>Hình ảnh <span className='text-danger'>*</span></Form.Label>
                        <Form.Control
                            type="file" accept="image/*"
                            onChange={(e) => setImg(e.target.files[0])}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" >
                        <Form.Label>Mô tả sản phẩm:</Form.Label>
                        <Form.Control as="textarea" rows={5}
                            onChange={(e) => setDescription(e.target.value)} />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary"
                    disabled={loadingApi ? true : false}
                    onClick={() => {
                        clearModal();
                        handleClose();
                    }}>
                    Đóng
                </Button>
                <Button variant="primary" type='submit'
                    disabled={loadingApi ? true : false}
                    onClick={() => handleSubmitNewProduct()}>
                    {loadingApi &&
                        <CSpinner color="light" size="sm" className='me-3' style={{ width: '1.3rem', height: '1.3rem' }} />}
                    Lưu
                </Button>
            </Modal.Footer>
        </Modal>
    )
}