import { NavbarComponent } from "@/components/Navbar";

export default function HomeLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <NavbarComponent />

            {children}
        </>
    )
}