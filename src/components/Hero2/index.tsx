import { ExternalLink } from "lucide-react";

import { cn } from "@/lib/utils";

import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";

const Hero2 = () => {
    return (
        <section className="relative overflow-hidden py-24 -z-10">
            <div className="">
                <div className="magicpattern absolute inset-x-0 top-0 -z-10 flex h-full w-full items-center justify-center opacity-100" />
                <div className="mx-auto flex max-w-5xl flex-col items-center">
                    <div className="z-10 flex flex-col items-center gap-6 text-center">
                        <div>
                            <h1 className="mb-6 text-pretty text-2xl font-bold lg:text-5xl">
                                Tire suas dúvidas de forma rápida e fácil!
                            </h1>
                            <p className="text-muted-foreground lg:text-xl">
                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Elig
                                doloremque mollitia fugiat omnis! Porro facilis quo animi
                                consequatur. Explicabo.
                            </p>
                        </div>
                        <div className="mt-4 flex justify-center gap-2">
                            <Button>Get Started</Button>
                            <Button variant="outline">
                                Learn more <ExternalLink className="ml-2 h-4" />
                            </Button>
                        </div>
                        <img
                            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                            alt="placeholder"
                            className="mx-auto mt-12 max-h-[500px] w-full max-w-6xl rounded-t-lg object-cover shadow-lg"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export { Hero2 };
