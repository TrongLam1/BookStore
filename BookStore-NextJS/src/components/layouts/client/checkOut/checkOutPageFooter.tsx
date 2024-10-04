
export default function CheckOutPageFooter(props: any) {

    const { totalPrices, couponValue } = props;

    const totalPricesOrder = totalPrices - (+couponValue);

    return (
        <>
            <tr className="cart-subtotal">
                <th>Tạm tính</th>
                <td>
                    <span className="woocommerce-Price-amount amount">
                        {totalPrices?.toLocaleString()}
                    </span>
                    <span className="woocommerce-Price-currencySymbol">₫</span>
                </td>
            </tr>
            <tr className="woocommerce-shipping-totals shipping">
                <th>Giảm giá</th>
                <td>
                    <span className="woocommerce-Price-amount sale-coupon amount">
                        {couponValue !== '' ? couponValue?.toLocaleString() : 0}
                    </span>
                    <span className="woocommerce-Price-currencySymbol">₫</span>
                </td>
            </tr>
            <tr className="order-total">
                <th>Tổng</th>
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