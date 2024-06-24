import { Skeleton } from "@/components/ui/skeleton"

const RecentGamesSkeleton = () => {
  return (
    <div className="flex flex-col w-[694px] min-h-screen bg-[#1C1C1F]">
      <Skeleton className="flex w-full h-[96px] rounded-lg bg-[#28344E] mb-[8px]"/>
      <Skeleton className="flex w-full h-[96px] rounded-lg bg-[#28344E] mb-[8px]"/>
      <Skeleton className="flex w-full h-[96px] rounded-lg bg-[#28344E] mb-[8px]"/>
      <Skeleton className="flex w-full h-[96px] rounded-lg bg-[#28344E] mb-[8px]"/>
      <Skeleton className="flex w-full h-[96px] rounded-lg bg-[#28344E] mb-[8px]"/>
      <Skeleton className="flex w-full h-[96px] rounded-lg bg-[#28344E] mb-[8px]"/>
    </div>
  )
}

export default RecentGamesSkeleton