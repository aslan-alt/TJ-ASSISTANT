import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import OptionsApp from "~components/OptionsApp"
import "./globalStyle.css"


const queryClient = new QueryClient()

function OptionsIndex() {
  return (
    <QueryClientProvider client={queryClient}>
      <OptionsApp />
    </QueryClientProvider>
  )
}



export default OptionsIndex