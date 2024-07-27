import { EmptyContent } from "~components/EmptyContent"
import { TitleWithAddButton } from "~components/TitleWithAddButton"

export const ImpersonateConfigs = () => {
  return (
    <div>
      <TitleWithAddButton title="Impersonate" onAddClick={() => {}} />
      <EmptyContent description="No data, please click the button to add an account." />
    </div>
  )
}
