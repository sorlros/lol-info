import { Skeleton } from "@/components/ui/skeleton"

const ChampMasterySkeleton = () => {
  return (
    <div className="flex w-[332px] h-[550px] flex-col">
      <Skeleton className="flex w-full h-[48px] mb-1 bg-neutral-800 p-[12px]"/>
      <Skeleton className="flex w-full h-[48px] mb-1 bg-neutral-800 p-[12px]"/>
      <Skeleton className="flex w-full h-[48px] mb-1 bg-neutral-800 p-[12px]"/>
      <Skeleton className="flex w-full h-[48px] mb-1 bg-neutral-800 p-[12px]"/>
      <Skeleton className="flex w-full h-[48px] mb-1 bg-neutral-800 p-[12px]"/>
      <Skeleton className="flex w-full h-[48px] mb-1 bg-neutral-800 p-[12px]"/>
      <Skeleton className="flex w-full h-[48px] mb-1 bg-neutral-800 p-[12px]"/>
    </div>
  )
}

export default ChampMasterySkeleton