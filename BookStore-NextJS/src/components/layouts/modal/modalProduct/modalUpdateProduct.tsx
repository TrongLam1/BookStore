'use client'

import { useEffect, useState } from 'react';
import { Button, Col, Form, Modal, Row } from 'react-bootstrap';
import ListCategoriesComponent from './listCategoriesComponent';
import ListBrandsComponent from './listBrandsComponent';
import ListTypesComponent from './listTypesComponent';
import { FindProductById, UpdateProduct } from '@/app/api/productsApi';
import { CSpinner } from '@coreui/react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

export default function ModalUpdateProduct(props: any) {

    const router = useRouter();
    const { show, handleClose, dataSelect, productId } = props;

    const [loadingApi, setLoadingApi] = useState<boolean>(false);

    const [name, setName] = useState<string>('');
    const [category, setCategory] = useState<string>('');
    const [brand, setBrand] = useState<string>('');
    const [type, setType] = useState<string>('');
    const [price, setPrice] = useState<number>(1000);
    const [quantity, setQuantity] = useState<number>(1);
    const [sale, setSale] = useState<number>(0);
    const [description, setDescription] = useState<string>('');

    const [listTypes, setListTypes] = useState([]);
    const [listBrands, setListBrands] = useState([]);
    const [listCategories, setListCategories] = useState([]);

    useEffect(() => {
        if (!isNaN(productId)) {
            const getProduct = async () => {
                const res = await FindProductById(productId);
                const product: IBook = res.data;

                setName(product.name);
                setPrice(product.price);
                setQuantity(product.inventory);
                setBrand(product.brand.brandName);
                setType(product.type.typeName);
                setCategory(product.category.categoryName);
                setDescription(product.description);
            }

            getProduct();
        }
        setListBrands(dataSelect.brands);
        setListTypes(dataSelect.types);
        setListCategories(dataSelect.categories);
    }, [productId]);


    const handleSubmitUpdateProduct = async () => {
        const updateProduct = {
            id: productId,
            name,
            categoryName: category,
            typeName: type,
            brandName: brand,
            description,
            price,
            sale,
            inventory: quantity
        };

        setLoadingApi(true);
        const res = await UpdateProduct(updateProduct);
        if (res.statusCode === 200) {
            toast.success("Cập nhật thông tin sản phẩm thành công.");
            handleClose();
            setTimeout(() => router.refresh(), 1500);
        } else {
            toast.error(res.message);
        }
        setLoadingApi(false);
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
                            type="text" autoFocus value={name}
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
                                    min={1000} type="number" value={price}
                                    onChange={((e) => setPrice(+e.target.value))}
                                />
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group className="mb-3">
                                <Form.Label>Số lượng</Form.Label>
                                <Form.Control
                                    type="number" min={0} value={quantity}
                                    onChange={((e) => setQuantity(+e.target.value))}
                                />
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group className="mb-3">
                                <Form.Label>Giảm giá</Form.Label>
                                <Form.Control
                                    type="number" min={0} value={sale}
                                    onChange={((e) => setSale(+e.target.value))}
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Form.Group
                        className="mb-3"
                    >
                        <Form.Label>Mô tả sản phẩm:</Form.Label>
                        <Form.Control as="textarea" rows={5} value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary"
                    disabled={loadingApi ? true : false}
                    onClick={handleClose}>
                    Đóng
                </Button>
                <Button variant="primary"
                    disabled={loadingApi ? true : false}
                    onClick={() => handleSubmitUpdateProduct()}>
                    {loadingApi &&
                        <CSpinner color="light" size="sm" className='me-3' style={{ width: '1.3rem', height: '1.3rem' }} />}
                    Lưu
                </Button>
            </Modal.Footer>
        </Modal>
    );
}