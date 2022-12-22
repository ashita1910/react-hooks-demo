import React, { useCallback, useEffect, useState } from "react";
import ErrorModal from "../UI/ErrorModal";
import LoadingIndicator from "../UI/LoadingIndicator";

import IngredientForm from "./IngredientForm";
import IngredientList from "./IngredientList";
import Search from "./Search";

function Ingredients() {
  const [ingredients, setIngredients] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const setFilteredIngredients = useCallback((filteredIngredients) => {
    setIngredients(filteredIngredients);
  }, []);

  function addIngredient(ingredient) {
    setLoading(true);
    fetch(
      "https://react-hooks-demo-dd823-default-rtdb.firebaseio.com/ingredients.json",
      {
        method: "POST",
        body: JSON.stringify(ingredient),
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((res) => {
        return res?.json();
      })
      .then((data) => {
        setIngredients((preIngredient) => [
          ...preIngredient,
          {
            id: data?.name,
            ...ingredient,
          },
        ]);
        setLoading(false);
      })
      .catch((err) => setLoading(false));
  }

  function removeIngredient(id) {
    setLoading(true);
    fetch(
      `https://react-hooks-demo-dd823-default-rtdb.firebaseio.com/ingredients/${id}.json`,
      {
        method: "DELETE",
      }
    )
      .then((res) => {
        setIngredients((prevIngredient) =>
          prevIngredient.filter((ig) => {
            return ig?.id !== id;
          })
        );
        setLoading(false);
      })
      .catch((err) => {
        setError("Something went wrong!");
        setLoading(false);
      });
  }

  function onClose() {
    setError(null);
  }

  return (
    <div className="App">
      <IngredientForm addIngredient={addIngredient} />

      <section>
        <Search loadedIngredients={setFilteredIngredients} />
        {loading ? (
          <div className="loader-container">
            <LoadingIndicator />
          </div>
        ) : (
          <>
            <IngredientList
              onRemoveItem={removeIngredient}
              ingredients={ingredients}
            />
          </>
        )}
      </section>

      {error && <ErrorModal onClose={onClose}>{error}</ErrorModal>}
    </div>
  );
}

export default Ingredients;
