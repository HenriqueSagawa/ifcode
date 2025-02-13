import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Check, Linkedin } from "lucide-react";
import { LightBulbIcon } from "./Icons";
import Link from "next/link";

export const HeroCards = () => {
  return (
    <div className="lg:flex flex-row flex-wrap gap-8 relative w-[550px] h-[350px] 2xl:w-[700px] 2xl:h-[500px]">
      <Card className="absolute w-[340px] -top-[15px] 2xl:scale-100 scale-[.8] 2xl:left-0 left-[-100px] drop-shadow-xl shadow-black/10 dark:shadow-white/10">
        <CardHeader className="flex flex-row items-center gap-4 pb-2">
          <Avatar>
            <AvatarImage
              alt=""
              src="https://i.imgur.com/UJCtFtt.png"
            />
            <AvatarFallback>IF</AvatarFallback>
          </Avatar>

          <div className="flex flex-col">
            <CardTitle className="text-lg">IF Code</CardTitle>
            <CardDescription><Link href="https://www.instagram.com/ifcode.assis/" className="hover:underline">@ifcode.assis</Link></CardDescription>
          </div>
        </CardHeader>

        <CardContent>Siga nossa página no instagram</CardContent>
      </Card>

      <Card className="absolute 2xl:scale-100 scale-[.8] right-[30px] 2xl:right-[20px] top-4 w-80 flex flex-col justify-center items-center drop-shadow-xl shadow-black/10 dark:shadow-white/10">
        <CardHeader className="mt-8 flex justify-center items-center pb-2">
          <img
            src="https://www.pngall.com/wp-content/uploads/16/Google-Gemini-Logo-PNG-Photo.png"
            alt="Gemini"
            className="absolute grayscale-[0%] -top-12 rounded-full w-24 h-24 aspect-square object-cover"
          />
          <CardTitle className="text-center">Gemini</CardTitle>
          <CardDescription className="font-normal text-primary">
            Inteligência Artifical
          </CardDescription>
        </CardHeader>

        <CardContent className="text-center pb-2">
          <p>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Vitae, nobis deserunt?
          </p>
        </CardContent>

        <CardFooter>
          <Button>
            <Link href="https://gemini.google.com/app?hl=pt-BR">Conheça</Link>
          </Button>
        </CardFooter>
      </Card>

      <Card className="absolute 2xl:scale-100 scale-[.8] 2xl:top-[150px] top-[100px] left-[-50px] 2xl:left-[50px] w-72  drop-shadow-xl shadow-black/10 dark:shadow-white/10">
        <CardHeader>
          <CardTitle className="flex item-center justify-between">
            IF Code
          </CardTitle>

          <CardDescription>
            Lorem ipsum dolor sit, amet ipsum consectetur adipisicing elit.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Button className="w-full">Encontrar ajuda</Button>
        </CardContent>

        <hr className="w-4/5 m-auto mb-4" />

        <CardFooter className="flex">
          <div className="space-y-4">
            {["Encontre ajuda", "Desenvolva projetos", "Participe de um grupo"].map(
              (benefit: string) => (
                <span
                  key={benefit}
                  className="flex"
                >
                  <Check className="text-green-500" />{" "}
                  <h3 className="ml-2">{benefit}</h3>
                </span>
              )
            )}
          </div>
        </CardFooter>
      </Card>

      <Card className="absolute 2xl:scale-100 scale-[.8] w-[350px] right-[5px] 2xl:-right-[10px] 2xl:bottom-[35px] bottom-[-60px]  drop-shadow-xl shadow-black/10 dark:shadow-white/10">
        <CardHeader className="space-y-1 flex md:flex-row justify-start items-start gap-4">
          <div className="mt-1 invert bg-primary/20 p-1 rounded-2xl">
            <LightBulbIcon />
          </div>
          <div>
            <CardTitle>O Instituto Federal</CardTitle>
            <CardDescription className="text-md mt-2">
              Lorem ipsum dolor sit amet consect adipisicing elit. Consectetur
              natusm.
            </CardDescription>
          </div>
        </CardHeader>
      </Card>
    </div>
  );
};
