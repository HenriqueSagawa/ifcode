"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { CardBody, CardContainer, CardItem } from "../ui/3d-card";

const teamMembers = [
  {
    name: "Henrique Tutomu Sagawa",
    role: "Desenvolvedor Frontend e Backend",
    image: "https://media.gettyimages.com/id/962792890/pt/foto/kiev-ukraine-cristiano-ronaldo-of-real-madrid-lifts-the-uefa-champions-league-trophy-following.jpg?s=2048x2048&w=gi&k=20&c=bHK_tF9_cMrXcIF8i_i9iDvhBKRxyFi0aGc13yywW7k=",
    github: "https://github.com/Henrique Sagawa",
    description: "Especialista em React e Next.js"
  },
  {
    name: "João Victor Nogueira Calassara",
    role: "Documentador de código",
    image: "https://media.gettyimages.com/id/2155285978/pt/foto/athens-greece-rodinei-of-olympiakos-poses-for-a-portrait-with-the-uefa-europa-conference.jpg?s=2048x2048&w=gi&k=20&c=GHouo3Aeqqlp5G9AgYRKwFaa43W2s6DvY51PWGW1lMc=",
    github: "",
    description: "O maior documentador já conhecido na história"
  },
  {
    name: "Michelli Cristina Galli",
    role: "Orientadora",
    image: "/img/team/member3.jpg",
    github: "",
    description: "Professora e dr. Estudos da Linguagem da Universidade Estadual de Londrina - UEL"
  },
  {
    name: "Vagner Simões Santos",
    role: "Orientador",
    image: "",
    github: "",
    description: "Professor e me. em PI e TT para Inovação"
  }
];

export function TeamMembers() {
  return (
    <div className="flex gap-4 max-w-full w-full dark:bg-[#121212] flex-wrap justify-center">
      {teamMembers.map((member, index) => (
        <CardContainer key={index} className="inter-var">
          <CardBody className="bg-gray-50 relative group/card  dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-[fit] max-w-80 sm:max-w-none sm:w-[30rem] sm:h-[25rem] h-fit rounded-xl p-6 border">
            <CardItem translateZ="50" className="text-xl font-bold text-neutral-600 dark:text-white">
              {member.name}
            </CardItem>
            <CardItem as="p" translateZ="60" className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300">
              {member.role}
            </CardItem>
            <CardItem translateZ="100" className="w-full mt-4">
            <Image
              src={member.image}
              height="1000"
              width="1000"
              className="h-60 w-full object-cover rounded-xl group-hover/card:shadow-xl"
              alt="thumbnail"
            />
            </CardItem>
            <CardItem translateZ="60" className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300">
              {member.description}
            </CardItem>
          </CardBody>
        </CardContainer>
      ))}
    </div>

  );
} 