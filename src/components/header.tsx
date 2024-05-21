import Link from "next/link"

export const Header = () => {
  return (
    <header className="flex w-full h-[3rem] bg-mainColor justify-center">
      <div className="flex w-[150px] h-full bg-mainColor items-center justify-center">
        <Link href="/">홈</Link>
      </div>
      <div className="flex w-[150px] h-full bg-mainColor items-center justify-center">
        <Link href="/analyze-champ">챔피언 분석</Link>
      </div>
      <div className="flex w-[150px] h-full bg-mainColor items-center justify-center">
        <Link href="/statistics">통계 랭킹</Link>
      </div>
      <div className="flex w-[150px] h-full bg-mainColor items-center justify-center">
        <Link href="/item-tree">아이템 트리</Link>
      </div>
      <div className="flex w-[150px] h-full bg-mainColor items-center justify-center">
        <Link href="/relative-analysis">상대 분석</Link>
      </div>
    </header>
  )
}