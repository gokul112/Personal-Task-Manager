import "../styles/EditButtons.css";
import React from "react";

const EditButtons = ({ handleSave, saveLabel, handleDelete, handleCancel, handleComment }) => (
  
  <div className="Edit-Buttons">
    {handleSave && (<div
      tabIndex="0"
      className="Edit-Button save"
      onClick={handleSave}
    >
      {saveLabel}
    </div>)}

    {handleDelete && (
      <div
        tabIndex="0"
        className="Edit-Button delete"
        onClick={handleDelete}
      >
        Delete {handleComment}
      </div>
    )}

    {handleCancel && (<div tabIndex="0" className="Edit-Button-Cancel" onClick={handleCancel}>
      <ion-icon name="close" />
    </div>)}
  </div>
);

export default EditButtons;