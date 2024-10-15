'use client'

import { faStar as faStarSolid } from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarRegular } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function CommentItem(props: any) {
    const { item } = props;

    const date = new Date(item.createdAt);

    const options = {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    };

    const formattedDate = date.toLocaleString('en-GB', options).replace(/\//g, '-');

    const ratingProduct = () => {
        const solidStar = <FontAwesomeIcon icon={faStarSolid} />;
        const regularStar = <FontAwesomeIcon icon={faStarRegular} />;

        const solidStars = Array(+item.rating).fill(solidStar);
        const regularStars = Array(5 - +item.rating).fill(regularStar);

        return (
            <div>
                {solidStars.concat(regularStars).map((star, index) => (
                    <span key={index}>{star}</span>
                ))}
            </div>
        );
    }

    return (
        <div className="comment-item">
            <div className="comment-heading d-flex justify-content-between">
                <div className="d-flex align-items-center">
                    <span className="user">{item.user.username}</span>
                    <span className="createdTime">{formattedDate}</span>
                </div>
                <span className="comment-rating">
                    {ratingProduct()}
                </span>
            </div>
            <div className="comment-body">
                <span className="content">{item.content}</span>
            </div>
        </div>
    );
};