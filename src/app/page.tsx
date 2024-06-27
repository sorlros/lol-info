import { Header } from "@/components/header";
import { SummonerName } from "@/app/(mainPage)/(_components)/summonerName";
import { ScrapeOpgg } from "./(mainPage)/(_components)/scrapeOpgg";

export default function Home() {
  return (
    <div className="flex w-full min-h-screen h-full flex-col items-center bg-black">
      <Header />
      <SummonerName />
      <ScrapeOpgg />
    </div>
  );
}
