import ContactContent from "./_components/contact-content";
import { BackButton } from "@/components/BackButton";
import { AISupportButton } from "@/components/AISupport";

export default function Contato() {
    return (
        <div className="w-full px-4">
            <div className="container mx-auto py-6">
                <BackButton className="mb-6" fallbackUrl="/" />
            </div>
            <ContactContent />
            <AISupportButton />
        </div>       
    )
}