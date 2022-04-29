import { ReactElement } from "react"
import { Box, Container } from "@material-ui/core"

const Page = ({ children, size }: { children: ReactElement, size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' }) => {
  return (
    <Container
      style={{ height: '100%' }}
      maxWidth={size || "md"}
    >
      <Box p={1} height="100%">
        { children }
      </Box>
    </Container>
  )
};

export default Page;
