import React from "react";
import { TimelineComponent } from "../../../components/TimeLine";
import { BackButton } from "@/components/BackButton";
import { AISupportButton } from "@/components/AISupport";

export default function Sobre() {
    return (
        <div>
            <div className="container mx-auto px-4 py-6">
                <BackButton className="mb-6" fallbackUrl="/" />
            </div>
            <TimelineComponent />
            <AISupportButton />
        </div>
    )
}