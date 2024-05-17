import { Header } from "@/pages/(mainPage)/(_components)/header";
import { SummonerName } from "@/pages/(mainPage)/(_components)/summonerName";

export default function Home() {
  return (
    <main className="flex w-full min-h-screen flex-col items-center bg-black">
      <Header />
      <SummonerName />
    </main>
  );
}
