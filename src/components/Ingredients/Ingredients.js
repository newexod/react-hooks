import React, {useReducer, useEffect, useCallback, useMemo } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';
import ErrorModal from '../UI/ErrorModal';
import useHttp from '../../hooks/http';

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

const Ingredients = () => {
  const [userIngredients, dispatch] = useReducer(ingredientReducer, []);
  const {isLoading, data, error, sendRequest} = useHttp();
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

  const addIngredientHandler = useCallback(ingredient => {
    // setIsLoading(true);
    // dispatchHttp({type: 'SEND'});

    // fetch('https://react-hooks-df7fd.firebaseio.com/ingredients.json', {
    //   method: 'POST',
    //   body: JSON.stringify(ingredient),
    //   headers: {'Content-Type': 'application/json'}
    // })
    //   .then(res => {
    //     // setIsLoading(false);
    //     dispatchHttp({type: 'RESPONSE'});

    //     return res.json();
    //   }).then(resData => {
    //     // setUserIngredients(prevIngredients => [
    //     //   ...prevIngredients, 
    //     //   { id: resData.name, ...ingredient }
    //     // ]);
    //     dispatch({type: 'ADD', ingredient: {id: resData.name, ...ingredient}});
    //   });
  }, []);

  const removeIngredientHandler = useCallback(ingredientId => {
    sendRequest(`https://react-hooks-df7fd.firebaseio.com/ingredients/${ingredientId}.json`, 'DELETE');
  }, [sendRequest]);

  const clearError = useCallback(() => {
    // setError(null);
    // dispatch({type: 'CLEAR'});
  }, []);

  const ingredientList = useMemo(() => {
    return (
      <IngredientList 
        ingredients={userIngredients} 
        onRemoveItem={removeIngredientHandler} 
      />
    );
  }, [userIngredients, removeIngredientHandler]);

  return (
    <div className="App">
      {error && <ErrorModal onClose={clearError}>{error}</ErrorModal>}

      <IngredientForm 
        onAddIngredient={addIngredientHandler} 
        loading={isLoading} 
      />

      <section>
        <Search onLoadIngredients={filteredIngredientsHandler} />
        {ingredientList}
      </section>
    </div>
  );
}

export default Ingredients;
