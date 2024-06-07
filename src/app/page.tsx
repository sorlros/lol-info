import { Header } from "@/components/header";
import { SummonerName } from "@/app/(mainPage)/(_components)/summonerName";

export default function Home() {
  return (
    <div className="flex w-full h-full flex-col items-center bg-black">
      <Header />
      <SummonerName />
    </div>
  );
}
