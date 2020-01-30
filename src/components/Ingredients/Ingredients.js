import React, {useState, useEffect} from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';

const Ingredients = () => {
  const [userIngredients, setUserIngredients] = useState([]);

  useEffect(() => {
    fetch('https://react-hooks-df7fd.firebaseio.com/ingredients.json')
    .then(res => res.json())
    .then(resData => {
      const loadedIngredients = [];

      for (const key in resData) {
        loadedIngredients.push({
          id: key,
          title: resData[key].title,
          amount: resData[key].amount
        })
      }

      setUserIngredients(loadedIngredients);
    })
  }, []); // [] => componentDidMount

  useEffect(() => {
    // выполнится дважды
    // 1. пустой массив
    // 2. все что придет с бэка
    console.log('RENDERING INGREDIENTS', userIngredients);
  }, [userIngredients])

  const addIngredientHandler = ingredient => {
    fetch('https://react-hooks-df7fd.firebaseio.com/ingredients.json', {
      method: 'POST',
      body: JSON.stringify(ingredient),
      headers: {'Content-Type': 'application/json'}
    })
      .then(res => {
        return res.json();
      }).then(resData => {
        setUserIngredients(prevIngredients => [
          ...prevIngredients, 
          { id: resData.name, ...ingredient }
        ]);
      });
  };

  return (
    <div className="App">
      <IngredientForm onAddIngredient={addIngredientHandler} />

      <section>
        <Search />
        <IngredientList ingredients={userIngredients} onRemoveItem={() => {}} />
      </section>
    </div>
  );
}

export default Ingredients;
