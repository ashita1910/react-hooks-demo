import React, { useCallback, useEffect, useReducer, useState } from "react";
import ErrorModal from "../UI/ErrorModal";
import LoadingIndicator from "../UI/LoadingIndicator";

import IngredientForm from "./IngredientForm";
import IngredientList from "./IngredientList";
import Search from "./Search";

const IngredientReducer = (currentIngredients, action) => {
  switch (action?.type) {
    case "SET":
      return action?.ingredients;
    case "ADD":
      return [...currentIngredients, action?.ingredient];
    case "DELETE":
      return currentIngredients?.filter((ig) => {
        return ig?.id !== action?.id;
      });
    default:
      throw new Error("This should not happen!");
  }
};

const HttpReducer = (currentHttpState, action) => {
  switch (action?.action) {
    case "SEND":
      return { loading: true, error: null };
    case "RESPONSE":
      return { ...currentHttpState, loading: false };
    case "ERROR":
      return { loading: false, error: action?.errorMsg };
    case "CLEAR":
      return { loading: false, error: null };
    default:
      throw new Error("This should not be reached!");
  }
};

function Ingredients() {
  // const [ingredients, setIngredients] = useState([]);
  // const [error, setError] = useState(null);
  // const [loading, setLoading] = useState(false);

  const [userIngredients, dispatch] = useReducer(IngredientReducer, []);
  const [httpState, dispatchHttp] = useReducer(HttpReducer, {
    loading: false,
    error: null,
  });

  const setFilteredIngredients = useCallback((filteredIngredients) => {
    // setIngredients(filteredIngredients);
    dispatch({
      type: "SET",
      ingredients: filteredIngredients,
    });
  }, []);

  function addIngredient(ingredient) {
    // setLoading(true);
    dispatchHttp({
      action: "SEND",
    });
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
        // setIngredients((preIngredient) => [
        //   ...preIngredient,
        //   {
        //     id: data?.name,
        //     ...ingredient,
        //   },
        // ]);
        dispatch({
          type: "ADD",
          ingredient: {
            id: data?.name,
            ...ingredient,
          },
        });
        // setLoading(false);
        dispatchHttp({
          action: "RESPONSE",
        });
      })
      .catch((err) => {
        // setLoading(false));
        dispatchHttp({
          action: "RESPONSE",
        });
      });
  }

  function removeIngredient(id) {
    // setLoading(true);
    dispatchHttp({
      action: "SEND",
    });
    fetch(
      `https://react-hooks-demo-dd823-default-rtdb.firebaseio.com/ingredients/${id}.json`,
      {
        method: "DELETE",
      }
    )
      .then((res) => {
        // setIngredients((prevIngredient) =>
        //   prevIngredient.filter((ig) => {
        //     return ig?.id !== id;
        //   })
        // );
        dispatch({
          type: "DELETE",
          id: id,
        });
        // setLoading(false);
        dispatchHttp({
          action: "RESPONSE",
        });
      })
      .catch((err) => {
        // setError("Something went wrong!");
        // setLoading(false);
        dispatchHttp({
          action: "ERROR",
          errorMSg: "Something went wrong!",
        });
      });
  }

  function onClose() {
    // setError(null);
    dispatchHttp({
      action: "CLEAR",
    });
  }

  return (
    <div className="App">
      <IngredientForm addIngredient={addIngredient} />

      <section>
        <Search loadedIngredients={setFilteredIngredients} />
        {/* {loading ? (
          <div className="loader-container">
            <LoadingIndicator />
          </div>
        ) : (
          <>
            <IngredientList
              onRemoveItem={removeIngredient}
              ingredients={userIngredients}
            />
          </>
        )} */}
        {httpState?.loading ? (
          <div className="loader-container">
            <LoadingIndicator />
          </div>
        ) : (
          <>
            <IngredientList
              onRemoveItem={removeIngredient}
              ingredients={userIngredients}
            />
          </>
        )}
      </section>

      {/* {error && <ErrorModal onClose={onClose}>{error}</ErrorModal>} */}
      {httpState?.error && (
        <ErrorModal onClose={onClose}>{httpState?.error}</ErrorModal>
      )}
    </div>
  );
}

export default Ingredients;
