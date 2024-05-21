import { Header } from "../../components/header"

const DetailInfoLayoutPage = ({children}: {children: React.ReactNode}) => {
  return (
    <>
      <Header />
      {children}
    </>
  )
}

export default DetailInfoLayoutPage;