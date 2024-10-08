'use client'

import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function OrderItemComponent(props: any) {
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

    return (
        <tr>
            <td>#{item?.id}</td>
            <td>{item?.username}</td>
            <td>{formattedDate}</td>
            <td>{item?.orderStatus}</td>
            <td>
                <button
                    className="btn-table-dashboard"
                    id="view-order" type="button"
                    onClick={() => {
                        // setIsShowModalOrderDetail(true);
                        // setIdOrderDetail(item?.id);
                    }}
                >
                    <FontAwesomeIcon icon={faCircleInfo} />
                </button>
            </td>
        </tr>
    )
}