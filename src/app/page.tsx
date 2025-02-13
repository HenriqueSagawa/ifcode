import React from "react";
import { Hero1 } from "@/components/Hero";
import { Spotlight } from "@/components/ui/spotlight";
import { Hero2 } from "@/components/Hero2";


export default function Home() {
  return (
    <div>
      
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="green"
      />
      
      <Hero2 />
      {/* <Hero1
        heading={"Tire suas dúvidas de forma rápida e fácil!"}
        description={"Lorem ipsum dolor sit amet consectetur adipisicing elit. Elig doloremque mollitia fugiat omnis! Porro facilis quo animi consequatur. Explicabo."} image={{
          src: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          alt: "Imagem do Hero, equipe trabalhando"
        }} /> */}
    </div>
  );
}
