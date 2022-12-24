import React, { useCallback, useEffect, useMemo, useReducer } from "react";
import useHttp from "../../hooks/http";
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

// const HttpReducer = (currentHttpState, action) => {
//   switch (action?.action) {
//     case "SEND":
//       return { loading: true, error: null };
//     case "RESPONSE":
//       return { ...currentHttpState, loading: false };
//     case "ERROR":
//       return { loading: false, error: action?.errorMsg };
//     case "CLEAR":
//       return { loading: false, error: null };
//     default:
//       throw new Error("This should not be reached!");
//   }
// };

function Ingredients() {
  // const [ingredients, setIngredients] = useState([]);
  // const [error, setError] = useState(null);
  // const [loading, setLoading] = useState(false);

  const [userIngredients, dispatch] = useReducer(IngredientReducer, []);
  const { loading, error, data, sendRequest, extra, identifier, clear } =
    useHttp();
  // const [httpState, dispatchHttp] = useReducer(HttpReducer, {
  //   loading: false,
  //   error: null,
  // });

  useEffect(() => {
    if (!loading && !error && identifier === "ADD") {
      dispatch({
        type: "ADD",
        ingredient: {
          id: data?.name,
          ...extra,
        },
      });
    } else if (
      !loading &&
      !error &&
      !loading &&
      !error &&
      identifier === "DELETE"
    ) {
      dispatch({
        type: "DELETE",
        id: extra,
      });
    }
  }, [data, extra, identifier, loading, error]);

  const setFilteredIngredients = useCallback((filteredIngredients) => {
    // setIngredients(filteredIngredients);
    dispatch({
      type: "SET",
      ingredients: filteredIngredients,
    });
  }, []);

  const addIngredient = useCallback(
    (ingredient) => {
      // setLoading(true);
      // dispatchHttp({
      //   action: "SEND",
      // });
      // fetch(
      //   "https://react-hooks-demo-dd823-default-rtdb.firebaseio.com/ingredients.json",
      //   {
      //     method: "POST",
      //     body: JSON.stringify(ingredient),
      //     headers: {
      //       "Content-Type": "application/json",
      //     },
      //   }
      // )
      //   .then((res) => {
      //     return res?.json();
      //   })
      //   .then((data) => {
      //     // setIngredients((preIngredient) => [
      //     //   ...preIngredient,
      //     //   {
      //     //     id: data?.name,
      //     //     ...ingredient,
      //     //   },
      //     // ]);
      //     dispatch({
      //       type: "ADD",
      //       ingredient: {
      //         id: data?.name,
      //         ...ingredient,
      //       },
      //     });
      //     // setLoading(false);
      //     dispatchHttp({
      //       action: "RESPONSE",
      //     });
      //   })
      //   .catch((err) => {
      //     // setLoading(false));
      //     dispatchHttp({
      //       action: "RESPONSE",
      //     });
      //   });
      sendRequest(
        "https://react-hooks-demo-dd823-default-rtdb.firebaseio.com/ingredients.json",
        "POST",
        JSON.stringify(ingredient),
        ingredient,
        "ADD"
      );
    },
    [sendRequest]
  );

  const removeIngredient = useCallback(
    (id) => {
      sendRequest(
        `https://react-hooks-demo-dd823-default-rtdb.firebaseio.com/ingredients/${id}.json`,
        "DELETE",
        null,
        id,
        "DELETE"
      );
      // setLoading(true);
      // dispatchHttp({
      //   action: "SEND",
      // });
      // fetch(
      //   `https://react-hooks-demo-dd823-default-rtdb.firebaseio.com/ingredients/${id}.json`,
      //   {
      //     method: "DELETE",
      //   }
      // )
      //   .then((res) => {
      //     // setIngredients((prevIngredient) =>
      //     //   prevIngredient.filter((ig) => {
      //     //     return ig?.id !== id;
      //     //   })
      //     // );
      //     dispatch({
      //       type: "DELETE",
      //       id: id,
      //     });
      //     // setLoading(false);
      //     // dispatchHttp({
      //     //   action: "RESPONSE",
      //     // });
      //   })
      //   .catch((err) => {
      //     // setError("Something went wrong!");
      //     // setLoading(false);
      //     // dispatchHttp({
      //     //   action: "ERROR",
      //     //   errorMSg: "Something went wrong!",
      //     // });
      //   });
    },
    [sendRequest]
  );

  const ingredientList = useMemo(() => {
    return (
      <IngredientList
        onRemoveItem={removeIngredient}
        ingredients={userIngredients}
      />
    );
  }, [removeIngredient, userIngredients]);

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
        {loading ? (
          <div className="loader-container">
            <LoadingIndicator />
          </div>
        ) : (
          <>{ingredientList}</>
        )}
      </section>

      {/* {error && <ErrorModal onClose={onClose}>{error}</ErrorModal>} */}
      {error && <ErrorModal onClose={clear}>{error}</ErrorModal>}
    </div>
  );
}

export default Ingredients;
