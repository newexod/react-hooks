import React, {useState, useEffect, useCallback } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';
import ErrorModal from '../UI/ErrorModal';

const Ingredients = () => {
  const [userIngredients, setUserIngredients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  useEffect(() => {
    // выполнится дважды
    // 1. пустой массив
    // 2. все что придет с бэка
    console.log('RENDERING INGREDIENTS', userIngredients);
  }, [userIngredients])

  const filteredIngredientsHandler = useCallback(filteredIngredients => {
    setUserIngredients(filteredIngredients);
  }, [])

  const addIngredientHandler = ingredient => {
    setIsLoading(true);

    fetch('https://react-hooks-df7fd.firebaseio.com/ingredients.json', {
      method: 'POST',
      body: JSON.stringify(ingredient),
      headers: {'Content-Type': 'application/json'}
    })
      .then(res => {
        setIsLoading(false);

        return res.json();
      }).then(resData => {
        setUserIngredients(prevIngredients => [
          ...prevIngredients, 
          { id: resData.name, ...ingredient }
        ]);
      });
  };

  const removeIngredientHandler = (ingredientId) => {
    setIsLoading(true);

    fetch(`https://react-hooks-df7fd.firebaseio.com/ingredients/${ingredientId}.json`, {
      method: 'DELETE',
    })
      .then(res => {
        setIsLoading(false);

        setUserIngredients(prevIngredients =>
          prevIngredients.filter(ingredient => ingredient.id !== ingredientId)
        )
      })
      .catch(err => {
         setError('Something went wrong!');
         setIsLoading(false);
      });
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <div className="App">
      {error && <ErrorModal onClose={clearError}>{error}</ErrorModal>}

      <IngredientForm 
        onAddIngredient={addIngredientHandler} 
        loading={isLoading} 
      />

      <section>
        <Search onLoadIngredients={filteredIngredientsHandler} />
        <IngredientList ingredients={userIngredients} onRemoveItem={removeIngredientHandler} />
      </section>
    </div>
  );
}

export default Ingredients;
