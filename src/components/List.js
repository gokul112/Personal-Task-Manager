import "../styles/List.css";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Droppable, Draggable } from "react-beautiful-dnd";
import Card from "./Card";
import CardEditor from "./CardEditor";
import shortid from "shortid";
import ListEditor from "./ListEditor";


class List extends Component {
      state = {
        editingTitle: false,
        title: this.props.list.title,
        addingCard: false
      };
      
//When Adding card cancelled
 toggleAddingCard = () =>
        this.setState({ addingCard: !this.state.addingCard });
      

//Add card by calling dispatcher method
addCard = async cardText => {
        const { listId, dispatch } = this.props;
      
        this.toggleAddingCard();
      
        const cardId = shortid.generate();
      
        dispatch({
          type: "ADD_CARD",
          payload: { cardText, cardId, listId }
        });
};
    

//Toggle Editing title and sets editing title to true or false to identify the state
toggleEditingTitle = () =>
      this.setState({ editingTitle: !this.state.editingTitle });


//Sets the title value when user types
handleChangeTitle = e => this.setState({ title: e.target.value });
    

//Edit the list title (calling the change List title Dispatcher)
editListTitle = async () => {
      const { listId, dispatch } = this.props;
      const { title } = this.state;
    
      this.toggleEditingTitle();
    
      dispatch({
        type: "CHANGE_LIST_TITLE",
        payload: { listId, listTitle: title }
      });
};
    
//Delete the list 
//Calling the delete Dispatcher method
deleteList = async () => {
      const { listId, list, dispatch } = this.props;
    
      dispatch({
        type: "DELETE_LIST",
        payload: { listId, cards: list.cards }
      });
};

  render() {
    const { list, index } = this.props;
    const { editingTitle, addingCard, title } = this.state;

    return (
        <Draggable draggableId={list.id} index={index}>
        {(provided, snapshot) => (
            <div
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                className="List"
            >

        <div className="List">
            {editingTitle ? (
                <ListEditor
                list={list}
                title={title}
                handleChangeTitle={this.handleChangeTitle}
                saveList={this.editListTitle}
                onClickOutside={this.editListTitle}
                deleteList={this.deleteList}
                />
            ) : (
                <div className="List-Title" onClick={this.toggleEditingTitle}>
                {list.title}
                </div>
            )}
        
            {addingCard ? (
                <CardEditor
                onSave={this.addCard}
                onCancel={this.toggleAddingCard}
                adding
                />
            ) : (
                <div className="Toggle-Add-Card" onClick={this.toggleAddingCard}>
                <ion-icon name="add" /> Add a card
                </div>
            )}

            <Droppable droppableId={list.id}>
            {(provided, _snapshot) => (
                <div ref={provided.innerRef}>
                {list.cards &&
                    list.cards.map((cardId, index) => (
                    <Card
                        key={cardId}
                        cardId={cardId}
                        index={index}
                        listId={list.id}
                    />
                    ))}

                {provided.placeholder}
                </div>
            )}
            </Droppable>
            </div>
        </div>
     )}
    </Draggable>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  list: state.listsById[ownProps.listId]
});

export default connect(mapStateToProps)(List);