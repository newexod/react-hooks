import React, {useState, useEffect, useRef} from 'react';

import Card from '../UI/Card';
import './Search.css';

const Search = React.memo(props => {
  const {onLoadIngredients} = props;
  const [enteredFilter, setEnteredFilter] = useState('');
  const inputRef = useRef();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (enteredFilter === inputRef.current.value) {
        const query = enteredFilter.length === 0 ? '' : `?orderBy="title"&equalTo="${enteredFilter}"`;

        fetch('https://react-hooks-df7fd.firebaseio.com/ingredients.json' + query)
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
    
          onLoadIngredients(loadedIngredients);
        })
      }
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [enteredFilter, onLoadIngredients, inputRef]) // проверяет изменился ли onLoadIngredients или enteredFilter

  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          <input 
            ref={inputRef}
            type="text" 
            value={enteredFilter}
            onChange={event => setEnteredFilter(event.target.value)}
          />
        </div>
      </Card>
    </section>
  );
});

export default Search;
