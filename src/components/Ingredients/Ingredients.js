import React, {useReducer, useEffect, useCallback } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';
import ErrorModal from '../UI/ErrorModal';

const ingredientReducer = (currentIngredients, action) => {
  switch(action.type) {
    case 'SET':
      return action.ingredients;
    case 'ADD':
      return [...currentIngredients, action.ingredient];
    case 'DELETE':
      return currentIngredients.filter(ing => ing.id !== action.id);
    default:
      throw new Error('Should not get there!');
  }
};

const httpReducer = (curHttpState, action) => {
  switch(action.type) {
    case 'SEND':
      return {loading: true, error: null};
    case 'RESPONSE':
      return {...curHttpState, loading: false};
    case 'ERROR':
      return {loading: false, error: action.errorMessage};
    case 'CLEAR':
      return {...curHttpState, error: null};
    default: 
      throw new Error('Should not be reached!');
  }
};

const Ingredients = () => {
  const [userIngredients, dispatch] = useReducer(ingredientReducer, []);
  const [httpState, dispatchHttp] = useReducer(httpReducer, {loading: false, error: null});
  // const [userIngredients, setUserIngredients] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState();

  useEffect(() => {
    // выполнится дважды
    // 1. пустой массив
    // 2. все что придет с бэка
    console.log('RENDERING INGREDIENTS', userIngredients);
  }, [userIngredients])

  const filteredIngredientsHandler = useCallback(filteredIngredients => {
    // setUserIngredients(filteredIngredients);
    dispatch({type: 'SET', ingredients: filteredIngredients});
  }, [])

  const addIngredientHandler = ingredient => {
    // setIsLoading(true);
    dispatchHttp({type: 'SEND'});

    fetch('https://react-hooks-df7fd.firebaseio.com/ingredients.json', {
      method: 'POST',
      body: JSON.stringify(ingredient),
      headers: {'Content-Type': 'application/json'}
    })
      .then(res => {
        // setIsLoading(false);
        dispatchHttp({type: 'RESPONSE'});

        return res.json();
      }).then(resData => {
        // setUserIngredients(prevIngredients => [
        //   ...prevIngredients, 
        //   { id: resData.name, ...ingredient }
        // ]);
        dispatch({type: 'ADD', ingredient: {id: resData.name, ...ingredient}});
      });
  };

  const removeIngredientHandler = (ingredientId) => {
    // setIsLoading(true);
    dispatchHttp({type: 'SEND'});

    fetch(`https://react-hooks-df7fd.firebaseio.com/ingredients/${ingredientId}.json`, {
      method: 'DELETE',
    })
      .then(res => {
        // setIsLoading(false);
        dispatchHttp({type: 'RESPONSE'});

        // setUserIngredients(prevIngredients =>
        //   prevIngredients.filter(ingredient => ingredient.id !== ingredientId)
        // )
        dispatch({type: 'DELETE', id: ingredientId});
      })
      .catch(err => {
        dispatchHttp({type: 'ERROR', errorMessage: 'Something went wrong!'});
        //  setError('Something went wrong!');
        //  setIsLoading(false);
      });
  };

  const clearError = () => {
    // setError(null);
    dispatch({type: 'CLEAR'});
  };

  return (
    <div className="App">
      {httpState.error && <ErrorModal onClose={clearError}>{httpState.error}</ErrorModal>}

      <IngredientForm 
        onAddIngredient={addIngredientHandler} 
        loading={httpState.loading} 
      />

      <section>
        <Search onLoadIngredients={filteredIngredientsHandler} />
        <IngredientList ingredients={userIngredients} onRemoveItem={removeIngredientHandler} />
      </section>
    </div>
  );
}

export default Ingredients;
