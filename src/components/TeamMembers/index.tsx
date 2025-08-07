"use client";

import Image from "next/image";
import { CardBody, CardContainer, CardItem } from "../ui/3d-card";
import Link from "next/link";

const teamMembers = [
  {
    name: "Henrique Tutomu Sagawa",
    role: "Desenvolvedor Frontend e Backend",
    image: "/img/henrique.webp",
    github: "https://github.com/HenriqueSagawa",
    description: "Especialista em React e Next.js"
  },
  {
    name: "João Victor Nogueira Calassara",
    role: "Desenvolvedor Frontend e Backend",
    image: "/img/joao.webp",
    github: "https://github.com/joaocalassara",
    description: "Aprendendo React e Next.js"
  },
  {
    name: "Michelli Cristina Galli",
    role: "Orientadora",
    image: "/img/michelli.webp",
    github: "",
    description: "Professora e dr. Estudos da Linguagem da Universidade Estadual de Londrina - UEL"
  },
  {
    name: "Vagner Simões Santos",
    role: "Orientador",
    image: "/img/vagner.webp",
    github: "",
    description: "Professor e me. em PI e TT para Inovação"
  }
];

export function TeamMembers() {
  return (
    <div className="flex gap-4 max-w-full w-full dark:bg-[#121212] flex-wrap justify-center">
      {teamMembers.map((member, index) => (
        <CardContainer key={index} className="inter-var">
          <CardBody className="bg-gray-50 relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-[fit] max-w-80 sm:max-w-none sm:w-[26rem] sm:h-[24rem] h-fit rounded-xl p-5 border">
            <CardItem translateZ="50" className="text-xl font-bold text-neutral-600 dark:text-white">
              {member.name}
            </CardItem>
            <CardItem as="p" translateZ="60" className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300">
              {member.role}
            </CardItem>
            <CardItem translateZ="100" className="w-full mt-4">
              <Image
                src={member.image}
                height={1000}
                width={1000}
                className="h-52 w-full object-cover rounded-xl group-hover/card:shadow-xl"
                alt={`Foto de ${member.name}, ${member.role}`}
              />
            </CardItem>
            {member.github && (
              <CardItem
                translateZ="100"
                as="p"
                href={member.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-500 text-sm mt-2 no-underline"
              >
                <Link href={member.github}>
                  Ver Github
                </Link>
              </CardItem>
            )}
            <CardItem translateZ="60" className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300">
              {member.description}
            </CardItem>
          </CardBody>
        </CardContainer>
      ))}
    </div>
  );
}
