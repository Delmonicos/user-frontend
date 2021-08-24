import { ReactElement } from "react"
import { Box } from "@material-ui/core"

const Page = ({ children }: { children: ReactElement }) => {
  return (
    <Box p={1} height="100%">
      { children }
    </Box>
  )
};

export default Page;
