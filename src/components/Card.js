import "../styles/Card.css";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Draggable } from "react-beautiful-dnd";
import CardEditor from "./CardEditor";
import CardView from "./CardView";

class Card extends Component {

  state = {
    hover: false,
    editing: false,
    show: false
  };
  
  //when hover edit button will be shown via hover boolen value
  startHover = () => this.setState({ hover: true });
  endHover = () => this.setState({ hover: false });

  //While editing setting the boolean values to show correctly
  startEditing = () =>
    this.setState({
      hover: false,
      editing: true,
      text: this.props.card.text
    });
  
  //After editing updating the state values to identify it is not in editing state.
  endEditing = () => this.setState({ hover: false, editing: false });
  
  //Edit the card text by calling dispatcher method by sending the cardid and text
  editCard = async text => {
    const { card, dispatch } = this.props;
  
    this.endEditing();
  
    dispatch({
      type: "CHANGE_CARD_TEXT",
      payload: { cardId: card.id, cardText: text }
    });
  };
  
  //Delete card by calling dispatcher method using id
  deleteCard = async () => {
    const { listId, card, dispatch } = this.props;
  
    dispatch({
      type: "DELETE_CARD",
      payload: { cardId: card.id, listId }
    });
  };

  //Opens the modal and Updated the show value to identify the modal state. It shows the card description and comments can be added
  onOpen = () => this.setState({show:true});

  //Updating state value when modal is closed .
  onClose = (e) =>{
    e.stopPropagation();
    this.setState({show:false});
  }
  

  render() {
      const { card, index, listId} = this.props;
      const { hover, editing, show } = this.state;

      if (!editing) {
        return (
          <Draggable draggableId={card.id} index={index}>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              className="Card"
              onMouseEnter={this.startHover}
              onMouseLeave={this.endHover}
            >
              {hover && (
                <div className="Card-Icons">
                  <div className="Card-Icon" onClick={this.startEditing}>
                    <ion-icon name="create" />
                  </div>
                </div>
              )}
            
              <div onClick={this.onOpen}> {card.text}</div>

              {show && (<CardView
                    item={card}
                    onClose={this.onClose}
                    show={show}
                    listId={listId}
                    deleteCard={this.deleteCard}
                />)}
            </div>
              
          )}
      
        </Draggable>
          
        );
      } else {
        return (
          <CardEditor
            text={card.text}
            onSave={this.editCard}
            onDelete={this.deleteCard}
            onCancel={this.endEditing}
          />
        );
      }
    }
}

const mapStateToProps = (state, ownProps) => ({
  card: state.cardsById[ownProps.cardId]
});

export default connect(mapStateToProps)(Card);