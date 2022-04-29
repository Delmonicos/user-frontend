import {
  Drawer as MuiDrawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@material-ui/core';
import { Link as RouterLink } from "react-router-dom";
import HomeIcon from '@material-ui/icons/Home';

const Drawer = ({ open, toggle }: { open: boolean, toggle: () => void }) => {
  return (
    <MuiDrawer open={open} onClose={toggle}>
      <List style={{ minWidth: 200 }}>
        <ListItem button component={RouterLink} to="/">
          <ListItemIcon>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText primary="Home" />
        </ListItem>
      </List>
    </MuiDrawer>
  )
};

export default Drawer;
