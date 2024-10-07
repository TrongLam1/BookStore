import slider1 from '../../../../assets/images/slider/slider1.jpg';
import slider2 from '../../../../assets/images/slider/slider2.jpg';
import slider3 from '../../../../assets/images/slider/slider3.jpg';
import banner1 from '../../../../assets/images/slider/banner1.jpg';
import banner2 from '../../../../assets/images/slider/banner2.jpg';
import newbook from '../../../../assets/images/type-book/newbook.webp';
import dictionary from '../../../../assets/images/type-book/tudien.webp';
import art from '../../../../assets/images/type-book/hoihoa.webp';
import history from '../../../../assets/images/type-book/lichsu.webp';
import children from '../../../../assets/images/type-book/thieunhi.webp';
import all from '../../../../assets/images/type-book/all.webp';
import './homepage.banner.scss';
import Image from 'next/image';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

const HomePageBanner = () => {
    return (
        <>
            <div className="banner row">
                <div id="carousel-custom" className="carousel slide col-lg-8 col-md-12" data-bs-ride="carousel">
                    <div className="banner-custom carousel-inner ">
                        <div className="carousel-item-custom carousel-item active">
                            <Image src={slider1} className="d-block w-100" alt="..." />
                        </div>
                        <div className="carousel-item-custom carousel-item">
                            <Image src={slider2} className="d-block w-100" alt="..." />
                        </div>
                        <div className="carousel-item-custom carousel-item">
                            <Image src={slider3} className="d-block w-100" alt="..." />
                        </div>
                    </div>
                    <button className="carousel-prev-custom carousel-control-prev" type="button"
                        data-bs-target="#carousel-custom" data-bs-slide="prev">
                        <FontAwesomeIcon icon={faChevronLeft} />
                    </button>
                    <button className="carousel-next-custom carousel-control-next" type="button"
                        data-bs-target="#carousel-custom" data-bs-slide="next">
                        <FontAwesomeIcon icon={faChevronRight} />
                    </button>
                </div>
                <div className="banner-deal-custom carousel col-lg-4">
                    <div className="banner-deal-item">
                        <Image src={banner1} alt="" />
                    </div>
                    <div className="banner-deal-item">
                        <Image src={banner2} alt="" />
                    </div>
                </div>
            </div>
            <div className="list-type-book">
                <ul className="list-type row">
                    <li className="list-type-item col-lg-2 col-6 col-sm-4">
                        <Link
                            href="/filter?category=Sách%20mới%202024&type=&brand="
                            className="d-flex flex-column align-items-center"
                        >
                            <Image className="type-book-img" src={newbook} alt="" />
                            <span>Sách mới 2024</span>
                        </Link>
                    </li>
                    <li className="list-type-item col-lg-2 col-6 col-sm-4">
                        <Link
                            href="/filter?category=Từ%20điển&type=&brand="
                            className="d-flex flex-column align-items-center"
                        >
                            <Image className="type-book-img" src={dictionary} alt="" />
                            <span>Tủ sách từ điển</span>
                        </Link>
                    </li>
                    <li className="list-type-item col-lg-2 col-6 col-sm-4">
                        <Link
                            href="/filter?category=Hội%20họa&type=&brand="
                            className="d-flex flex-column align-items-center"
                        >
                            <Image className="type-book-img" src={art} alt="" />
                            <span>Tủ sách hội họa</span>
                        </Link>
                    </li>
                    <li className="list-type-item col-lg-2 col-6 col-sm-4">
                        <Link
                            href="/filter?category=Lịch%20sử&type=&brand="
                            className="d-flex flex-column align-items-center"
                        >
                            <Image className="type-book-img" src={history} alt="" />
                            <span>Từ điển lịch sử</span>
                        </Link>
                    </li>
                    <li className="list-type-item col-lg-2 col-6 col-sm-4">
                        <Link
                            href="/filter?category=Thiếu%20nhi&type=&brand="
                            className="d-flex flex-column align-items-center"
                        >
                            <Image className="type-book-img" src={children} alt="" />
                            <span>Tủ sách thiếu nhi</span>
                        </Link>
                    </li>
                    <li className="list-type-item col-lg-2 col-6 col-sm-4">
                        <Link
                            href="/filter"
                            className="d-flex flex-column align-items-center"
                        >
                            <Image className="type-book-img" src={all} alt="" />
                            <span>Tất cả sách</span>
                        </Link>
                    </li>
                </ul>
            </div>
        </>
    )
}

export default HomePageBanner;