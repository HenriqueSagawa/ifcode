import CTA from "@/components/Cta";
import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import PopularQuestions from "@/components/PopularQuestions";
import Stats from "@/components/Stats";
import { getPlatformStats } from "./_actions/get-stats";
import SupportedLanguages from "@/components/SupportedLenguages";

export default async function Home() {
  const stats = await getPlatformStats();

  return (
    <div className="relative">
      <main>
        <Hero />
        <HowItWorks />
        <Stats posts={stats.posts} comments={stats.comments} users={stats.users} />
        <SupportedLanguages />
        <PopularQuestions />
        <CTA />
      </main>

    </div>
  );
}
