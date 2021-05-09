import React, { useEffect } from "react";
import Backdrop from "@material-ui/core/Backdrop";
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
}));

function Loading(props) {
  const classes = useStyles();
  return (
    <div>
      <Backdrop className={classes.backdrop} open={props.open}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
}

export default Loading;
