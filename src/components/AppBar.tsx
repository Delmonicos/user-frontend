import {
  AppBar as MuiAppBar,
  Toolbar,
  IconButton,
  Typography,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import { Link as RouterLink } from "react-router-dom";

const AppBar = ({ toggleDrawer }: { toggleDrawer: () => void }) => {

  return (
    <MuiAppBar
      position="static"
      elevation={0}
    >
      <Toolbar>
        <IconButton edge="start" color="inherit" onClick={toggleDrawer}>
          <MenuIcon />
        </IconButton>
        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          color="inherit"
          style={{ textDecoration: "none" }}
        >
          Delmonicos
        </Typography>
      </Toolbar>
    </MuiAppBar>
  );
};

export default AppBar;
