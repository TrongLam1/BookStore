import HomePageFooter from "@/components/layouts/client/footer/homepage.footer"
import HomePageHeader from "@/components/layouts/client/header/homepage.header"

export default function SearchPageLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <>
            <HomePageHeader></HomePageHeader>
            {children}
            <HomePageFooter></HomePageFooter>
        </>
    )
}