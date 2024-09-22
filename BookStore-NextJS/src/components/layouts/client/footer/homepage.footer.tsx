import styles from './homepage.footer.module.scss';
import img1 from '../../../../assets/images/bocongthuong.webp';
import logo from '../../../../assets/images/logo.png';
import imgPay from '../../../../assets/images/bocongthuong.webp';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquareFacebook, faSquareInstagram, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope, faLocationDot, faPhone } from '@fortawesome/free-solid-svg-icons';

const HomePageFooter = () => {
    return (
        <footer className={styles.footer}>
            <div className={styles.headingFooter}>
                <div className={`${styles.headingContent} row d-flex justify-content-between`}>
                    <div className={`col-xl-6 col-lg-4 col-sm-12 col-12 ${styles.headingContentSocial}`}>
                        <FontAwesomeIcon icon={faSquareFacebook} />
                        <FontAwesomeIcon icon={faSquareInstagram} />
                        <FontAwesomeIcon icon={faLinkedin} />
                    </div>
                    <div className={`d-flex align-items-center col-xl-6 col-lg-8 col-sm-12 col-12 ${styles.headingContentSubscribe}`}>
                        <FontAwesomeIcon icon={faEnvelope} />
                        <div className={`${styles.subscribe} d-flex flex-column`}>
                            <span>Bạn muốn nhận khuyến mãi đặc biệt?</span>
                            <span>Đăng ký ngay.</span>
                        </div>
                        <div className={styles.formSubscribe}>
                            <input id="subscribe" name="subscribe" type="text" />
                            <button>Đăng ký</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.infoFooter}>
                <div className={`${styles.infoFooterWrap} row d-flex justify-content-between`}>
                    <div className={`${styles.infoFooterItem} col-lg-3 col-12 col-sm-6`}>
                        <div className={styles.logo}>
                            <Image src={logo} alt="Logo" />
                        </div>
                        <div className={styles.contact}>
                            <FontAwesomeIcon icon={faLocationDot} />
                            <strong>Địa chỉ: </strong>
                            <span>Số 2, Đường Võ Oanh, P.25, Q. Bình Thạnh, Thành Phố Hồ Chí Minh</span>
                        </div>
                        <div className={styles.contact}>
                            <FontAwesomeIcon icon={faPhone} />
                            <strong>SĐT: </strong>
                            <span>0123456789</span>
                        </div>
                        <div className={styles.contact}>
                            <FontAwesomeIcon icon={faEnvelope} />
                            <strong>Email: </strong>
                            <span>supportBook@gmail.com</span>
                        </div>
                        <div>
                            <Image src={img1} alt="" />
                        </div>
                    </div>
                    <div className={`${styles.infoFooterItem} col-lg-3 col-12 col-sm-6`}>
                        <ul>
                            Hỗ trợ
                            <li>Hướng dẫn đặt hàng</li>
                            <li>Câu hỏi thường gặp</li>
                            <li>Chính sách đổi trả</li>
                            <li>Chính sách bảo mật</li>
                        </ul>
                    </div>
                    <div className={`${styles.infoFooterItem} col-lg-3 col-12 col-sm-6`}>
                        <ul>
                            Về Book Store
                            <li>Giới thiệu về Book Store</li>
                        </ul>
                    </div>
                    <div className={`${styles.infoFooterItem} col-lg-3 col-12 col-sm-6`}>
                        <ul>
                            Tổng đài hỗ trợ
                            <li>Gọi mua hàng</li>
                            <li>Gọi khiếu nại</li>
                            <li>
                                <b>Phương thức thanh toán</b>
                            </li>
                            <Image src={imgPay} alt="" />
                        </ul>
                    </div>
                </div>
            </div>
            <div className={styles.copyRight}>
                <span>&copy;</span> Thành phố Hồ Chí Minh, 2024
            </div>
        </footer>
    );
};

export default HomePageFooter;
