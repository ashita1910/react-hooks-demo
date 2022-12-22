import React, { useEffect, useRef, useState } from "react";

import Card from "../UI/Card";
import "./Search.css";

const Search = React.memo((props) => {
  const { loadedIngredients } = props;
  const filteredInputRef = useRef();
  const [filteredIngredient, setFilteredIngredient] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      if (filteredIngredient === filteredInputRef?.current?.value) {
        const query =
          filteredIngredient?.length === 0
            ? ""
            : `?orderBy="title"&equalTo="${filteredIngredient}"`;

        fetch(
          `https://react-hooks-demo-dd823-default-rtdb.firebaseio.com/ingredients.json${query}`
        )
          .then((res) => {
            return res?.json();
          })
          .then((data) => {
            const loadedIngredientsArr = [];
            Object?.keys(data)?.forEach((key) => {
              loadedIngredientsArr?.push({ id: key, ...data?.[key] });
            });
            loadedIngredients(loadedIngredientsArr);
          });
      }
    }, 500);
    return () => {
      clearTimeout(timer);
    };
  }, [filteredIngredient, loadedIngredients, filteredInputRef]);

  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          <input
            type="text"
            ref={filteredInputRef}
            value={filteredIngredient}
            onChange={(event) => setFilteredIngredient(event?.target?.value)}
          />
        </div>
      </Card>
    </section>
  );
});

export default Search;
