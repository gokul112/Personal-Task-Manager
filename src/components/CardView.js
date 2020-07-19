import React, { Component } from "react";
import Modal from "react-modal";
import { connect } from "react-redux";
import shortid from "shortid";
import EditButtons from "./EditButtons";

const customStyles = {
    content : {
      top                   : '50%',
      left                  : '50%',
      right                 : '50%',
      bottom                : 'auto',
      marginRight           : '-50%',
      transform             : 'translate(-50%, -50%)'
    }
  };

Modal.setAppElement('#root')


class CardView extends Component {

    state = {
        comments:[]
    }

//Set state value when user changes in text box
handleChangeText = event => this.setState({ comments: event.target.value });

//Add Comments to the Card selected using dispatcher method and update the store.
 addComment = async Comment => {
        const { item, dispatch } = this.props;
        const {comments} = this.state;
      
        dispatch({
          type: "ADD_COMMENT_TO_CARD",
          payload: { comment:comments, cardId:item.id }
        });
        this.setState({comments:[]})
};

//Delete All Comments respective to the card selected by using dispatcher method
deleteComment = async () => {
        const {  item, dispatch } = this.props;
      
        dispatch({
          type: "DELETE_COMMENT",
          payload: { cardId: item.id }
        });
};
    
//Renders the modal
render() {
    const {comments} = this.state;
    const { show, onClose, item, deleteCard } = this.props;
    
    return (
            <Modal
                isOpen={show}
                onRequestClose={onClose}
                style={customStyles}
                overlayClassName={"overlay"}
            >
                        <div>
                            <button className="pull-right" onClick={onClose}>X</button>
                            <h1 style={{ flex: "1 90%" }}>{item.text}</h1>
                            <div className="pull-right">
                                <EditButtons
                                    handleDelete={() => deleteCard()}
                                    handleComment="Card"
                                />
                            </div>
                        </div>
                        <div>
                            <div className="form-group">
                                <label htmlFor="Comments">Comments</label>
                                <textarea className="form-control" id="Comments" rows="3" value={comments}
                                onChange={this.handleChangeText}></textarea>
                            </div>
                            <EditButtons
                                handleSave={() => this.addComment(comments)}
                                saveLabel="Add Comment"
                                handleDelete={() => this.deleteComment()}
                                handleComment="Comments"
                            />
                            <h2>Previous Comments</h2>
                            {item.comment && item.comment.map((value)=>
                                <div key={shortid.generate()}>{value}</div>
                            )}
                        </div>
            </Modal>
                );
    }
}

const mapStateToProps = (state, ownProps) => ({
    card: state.cardsById[ownProps.cardId]
  });
  
export default connect(mapStateToProps)(CardView);