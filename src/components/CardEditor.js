import "../styles/CardEditor.css";
import React, { Component } from "react";
import TextareaAutosize from "react-textarea-autosize";
import EditButtons from "./EditButtons";

class CardEditor extends Component {
  state = {
    text: this.props.text || ""
  };

  //Changes the text value as user types in and sets to state value
  handleChangeText = event => this.setState({ text: event.target.value });

  //On typing enter from keyboard saves the value
  onEnter = e => {
    const { text } = this.state;

    if (e.keyCode === 13) {
      e.preventDefault();
      this.props.onSave(text);
    }
  };

  render() {
    const { text } = this.state;
    const { onSave, onCancel, onDelete, adding } = this.props;

    return (
      <div className="Edit-Card">
        <div className="Card" onClick={this.onOpen}>
          <TextareaAutosize
            autoFocus
            className="Edit-Card-Textarea"
            placeholder="Enter the Title/Description for this card..."
            value={text}
            onChange={this.handleChangeText}
            onKeyDown={this.onEnter}
          />
        </div>
        {/* Save and delete buttons will come from editbuttons Component */}
        <EditButtons
          handleSave={() => onSave(text)}
          saveLabel={adding ? "Add card" : "Save"}
          handleDelete={onDelete}
          handleCancel={onCancel}
        />
      </div>
    );
  }
}

export default CardEditor;