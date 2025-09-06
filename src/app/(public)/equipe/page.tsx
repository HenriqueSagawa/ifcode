import { TeamHero } from "@/components/TeamHero";
import { TeamMembers } from "@/components/TeamMembers";
import { BackButton } from "@/components/BackButton";
import { AISupportButton } from "@/components/AISupport";

export default function Equipe() {
  return (
    <main className="">
      <div className="container mx-auto px-4 py-6">
        <BackButton className="mb-6" fallbackUrl="/" />
      </div>
      <TeamHero />
      <TeamMembers />
      <AISupportButton />
    </main>
  );
}
