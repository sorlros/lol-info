import { Header } from "../../components/header"
import { TopInfo } from "./(_conponents)/topInfo";

const DetailInfoLayoutPage = ({children}: {children: React.ReactNode}) => {
  return (
    <>
      <main className="flex flex-col w-full h-full justify-center items-center">
        <Header />
        <TopInfo />
        {children}
      </main>
    </>
  )
}

export default DetailInfoLayoutPage;