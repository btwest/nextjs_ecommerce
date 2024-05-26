/**
 * Defines the initial state and reducer a function for managing the state.
 */

// This object defined the initial state of the app.
export const initialState = {
  prices: [],
  products: {}, // {[id], quantity}
};

// This function handles different actions to update the state.
// Takes the current state and an action, and returns a new state based on the action type.
export const AppReducer = (state = initialState, action) => {
  switch (action.type) {
    //
    case "add_product": {
      //id
      return {
        ...state,
        products: {
          ...state.products,
          [action.value]: 1,
        },
      };
    }
    case "remove_product": {
      return {
        ...state,
        products: Object.keys(state.products).reduce((acc, curr) => {
          if (curr !== action.value) {
            return { ...acc, [curr]: state.products[curr] };
          }
          return acc;
        }, {}),
      };
    }
    case "vary_count": {
      //[id], newCount
      return {
        ...state,
        products: {
          ...state.products,
          [action.value[0]]: action.value[1],
        },
      };
    }
    case "load_items": {
      return {
        ...state,
        prices: action.value.prices,
        products: action.value.products,
      };
    }
    case "set_prices": {
      return {
        ...state,
        prices: action.value,
      };
    }
  }
};
