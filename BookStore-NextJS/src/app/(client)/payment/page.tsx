import PaymentResultComponent from "@/components/layouts/client/payment/PaymentResultComponent";

export default function PaymentResultPage({ searchParams }: {
    searchParams: { [key: string]: string | string[] | undefined }
}) {

    return (<PaymentResultComponent params={searchParams} />);
};