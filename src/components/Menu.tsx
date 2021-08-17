import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { Link, useLocation } from "react-router-dom";

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
  },
});

export const Menu = () => {
  const classes = useStyles();
  const location = useLocation();

  return (
    <Paper className={classes.root}>
      <Tabs
        value={
          location.pathname === "/comics"
            ? 1
            : location.pathname === "/bookmark"
            ? 2
            : 0
        }
        indicatorColor="secondary"
        textColor="secondary"
        centered
      >
        <Tab label="Personnage" to="/characters" component={Link} />
        <Tab label="Comics" to="/comics" component={Link} />
        <Tab label="Favoris" to="/bookmark" component={Link} />
      </Tabs>
    </Paper>
  );
};

export default Menu;
