import { combineReducers, createStore } from "redux";
import throttle from "lodash.throttle";
import data from "./data";

const board = (state = { lists: [] }, action) => {
    switch (action.type) {
      case "ADD_LIST": {
        const { listId } = action.payload;
        return { lists: [...state.lists, listId] };
      }
      case "MOVE_LIST": {
        const { oldListIndex, newListIndex } = action.payload;
        const newLists = Array.from(state.lists);
        const [removedList] = newLists.splice(oldListIndex, 1);
        newLists.splice(newListIndex, 0, removedList);
        return { lists: newLists };
      }
      case "DELETE_LIST": {
        const { listId } = action.payload;
        const filterDeleted = tmpListId => tmpListId !== listId;
        const newLists = state.lists.filter(filterDeleted);
        return { lists: newLists };
      }
      default:
        return state;
    }
  };

  const listsById = (state = {}, action) => {
    switch (action.type) {
      case "ADD_LIST": {
        const { listId, listTitle } = action.payload;
        return {
          ...state,
          [listId]: { id: listId, title: listTitle, cards: []}
        };
      }
      case "CHANGE_LIST_TITLE": {
        const { listId, listTitle } = action.payload;
        return {
          ...state,
          [listId]: { ...state[listId], title: listTitle }
        };
      }
      case "DELETE_LIST": {
        const { listId } = action.payload;
        const { [listId]: deletedList, ...restOfLists } = state;
        return restOfLists;
      }
      case "ADD_CARD": {
        const { listId, cardId } = action.payload;
        return {
          ...state,
          [listId]: { ...state[listId], cards: [...state[listId].cards, cardId] }
        };
      }
      case "MOVE_CARD": {
        const {
          oldCardIndex,
          newCardIndex,
          sourceListId,
          destListId
        } = action.payload;
        // Move within the same list
        if (sourceListId === destListId) {
          const newCards = Array.from(state[sourceListId].cards);
          const [removedCard] = newCards.splice(oldCardIndex, 1);
          newCards.splice(newCardIndex, 0, removedCard);
          return {
            ...state,
            [sourceListId]: { ...state[sourceListId], cards: newCards }
          };
        }
        // Move card from one list to another
        const sourceCards = Array.from(state[sourceListId].cards);
        const [removedCard] = sourceCards.splice(oldCardIndex, 1);
        const destinationCards = Array.from(state[destListId].cards);
        destinationCards.splice(newCardIndex, 0, removedCard);
        return {
          ...state,
          [sourceListId]: { ...state[sourceListId], cards: sourceCards },
          [destListId]: { ...state[destListId], cards: destinationCards }
        };
      }
      case "DELETE_CARD": {
        const { cardId: deletedCardId, listId } = action.payload;
        const filterDeleted = cardId => cardId !== deletedCardId;
        return {
            ...state,
            [listId]: {
              ...state[listId],
              cards: state[listId].cards.filter(filterDeleted)
            }
        };
      }
      default:
        return state;
    }
  };


  const cardsById = (state = {}, action) => {
    switch (action.type) {
      case "ADD_CARD": {
        const { cardText, cardId } = action.payload;
        return { ...state, [cardId]: { text: cardText, id: cardId, comment:[] } };
      }
      case "CHANGE_CARD_TEXT": {
        const { cardText, cardId } = action.payload;
        return { ...state, [cardId]: { ...state[cardId], text: cardText } };
      }
      case "ADD_COMMENT_TO_CARD": {
        const { comment, cardId } = action.payload;
        return { ...state, [cardId]: { ...state[cardId], comment:[...state[cardId].comment,comment]}};
      }
      case "DELETE_COMMENT": {
        const { cardId } = action.payload;
        return { ...state, [cardId]: { ...state[cardId], comment:[]}};
      }
      case "DELETE_CARD": {
        const { cardId } = action.payload;
        const { [cardId]: deletedCard, ...restOfCards } = state;
        return restOfCards;
      }
      // Find every card from the deleted list and remove it
      case "DELETE_LIST": {
        const { cards: cardIds } = action.payload;
        return Object.keys(state)
          .filter(cardId => !cardIds.includes(cardId))
          .reduce(
            (newState, cardId) => ({ ...newState, [cardId]: state[cardId] }),
            {}
          );
      }
      default:
        return state;
    }
  };


const reducers = combineReducers({
    board,
    listsById,
    cardsById
});

const saveState = state => {
    try {
      const stateData = JSON.stringify(state);
      localStorage.setItem("state", stateData);
    } catch {
      // ignore write errors
    }
};

const loadState = () => {
    try {
      const stateData = localStorage.getItem("state");
      if (stateData === null) {
        return undefined;
      }
      return JSON.parse(stateData);
    } catch (err) {
      return undefined;
    }
};

const savedState = loadState();
const store = createStore(reducers, savedState);

store.subscribe(
  throttle(() => {
    saveState(store.getState());
  }, 1000)
);

console.log(store.getState());
if (!store.getState().board.lists.length) {
  console.log("data feed");
  data(store);
}

export default store;



