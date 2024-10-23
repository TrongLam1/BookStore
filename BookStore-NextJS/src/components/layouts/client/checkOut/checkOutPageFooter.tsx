
export default function CheckOutPageFooter(props: any) {

    const { totalPrices, couponValue } = props;

    const totalPricesOrder = totalPrices - (+couponValue);

    return (
        <>
            <tr className="order-total">
                <th>Thanh toán</th>
                <td>
                    <strong>
                        <span className="woocommerce-Price-amount amount">
                            {totalPricesOrder?.toLocaleString() ?? 0}
                        </span>
                        <span className="woocommerce-Price-currencySymbol">₫</span>
                    </strong>
                </td>
            </tr>
        </>
    );
}