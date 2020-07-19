import "../styles/Board.css";
import React, { Component } from "react";
import { connect } from "react-redux";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import AddList from "./AddList";
import List from "./List";

class Board extends Component {
    state = {
        addingList: false
      };
      
    toggleAddingList = () =>
        this.setState({ addingList: !this.state.addingList });

    //Handle during dropping the card or list on another position via two dispatcher method movelist and movecards
    handleDragEnd = ({ source, destination, type }) => {
            // dropped outside the allowed zones
            if (!destination) return;
          
            const { dispatch } = this.props;
          
            // Move list
            if (type === "COLUMN") {
              // Prevent update if nothing has changed
              if (source.index !== destination.index) {
                dispatch({
                  type: "MOVE_LIST",
                  payload: {
                    oldListIndex: source.index,
                    newListIndex: destination.index
                  }
                });
              }
              return;
            }
            if (source.index !== destination.index ||
                source.droppableId !== destination.droppableId) {
                dispatch({
                  type: "MOVE_CARD",
                  payload: {
                    sourceListId: source.droppableId,
                    destListId: destination.droppableId,
                    oldCardIndex: source.index,
                    newCardIndex: destination.index
                  }
                });
            }
     };
    

  render() {
    const { board } = this.props;
    const { addingList } = this.state;

    return (
        <DragDropContext onDragEnd={this.handleDragEnd}>
        <Droppable droppableId="board" direction="horizontal" type="COLUMN">
          {(provided, _snapshot) => (
            <div className="Board" ref={provided.innerRef}>
              {board.lists.map((listId, index) => {
                return <List listId={listId} key={listId} index={index} />;
              })}
  
              {provided.placeholder}
  
              <div className="Add-List">
                {addingList ? (
                  <AddList toggleAddingList={this.toggleAddingList} />
                ) : (
                  <div
                    onClick={this.toggleAddingList}
                    className="Add-List-Button"
                  >
                    <ion-icon name="add" /> Add a list
                  </div>
                )}
              </div>
            </div>
          )}
        </Droppable>
      </DragDropContext>
    );
  }
}


const mapStateToProps = state => ({ board: state.board });

export default connect(mapStateToProps)(Board);