import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { makeStyles } from "@material-ui/core/styles";

import { i18n } from "../../translate/i18n";

const useStyles = makeStyles(theme => ({
  textField: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    width: "100%",
  },
}));

const SolutionDescriptionModal = ({ open, onClose, onConfirm }) => {
  const classes = useStyles();
  const [solutionDescription, setSolutionDescription] = useState("");

  const handleClose = () => {
    setSolutionDescription("");
    onClose();
  };

  const handleConfirm = () => {
    onConfirm(solutionDescription);
    setSolutionDescription("");
  };

  const handleExited = () => {
    // Reset focus when modal is completely closed
    setSolutionDescription("");
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      onExited={handleExited}
      aria-labelledby="solution-dialog-title"
      aria-describedby="solution-dialog-description"
      maxWidth="md"
      fullWidth
      disableBackdropClick
      disableEscapeKeyDown={false}
      keepMounted={false}
    >
      <DialogTitle id="solution-dialog-title">
        {i18n.t("solutionDescriptionModal.title")}
      </DialogTitle>
      <DialogContent dividers id="solution-dialog-description">
        <TextField
          autoFocus
          multiline
          rows={4}
          variant="outlined"
          label={i18n.t("solutionDescriptionModal.form.description")}
          placeholder={i18n.t("solutionDescriptionModal.form.placeholder")}
          value={solutionDescription}
          onChange={(e) => setSolutionDescription(e.target.value)}
          className={classes.textField}
          inputProps={{
            'aria-describedby': 'solution-dialog-description',
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="default">
          {i18n.t("solutionDescriptionModal.buttons.cancel")}
        </Button>
        <Button
          onClick={handleConfirm}
          color="primary"
          variant="contained"
        >
          {i18n.t("solutionDescriptionModal.buttons.confirm")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SolutionDescriptionModal; 