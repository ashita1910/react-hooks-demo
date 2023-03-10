import React, { useState } from "react";

import Card from "../UI/Card";
import "./IngredientForm.css";

const IngredientForm = React.memo((props) => {
  const inputState = useState({
    title: "",
    amount: "",
  });

  const submitHandler = (event) => {
    event.preventDefault();
    props?.addIngredient(inputState[0]);
    inputState[1]({
      title: "",
      amount: "",
    });
  };

  return (
    <section className="ingredient-form">
      <Card>
        <form onSubmit={submitHandler}>
          <div className="form-control">
            <label htmlFor="title">Name</label>
            <input
              type="text"
              id="title"
              value={inputState[0]?.title}
              onChange={(event) => {
                const newTitle = event?.target?.value;
                inputState[1]((prevInputState) => ({
                  title: newTitle,
                  amount: prevInputState?.amount,
                }));
              }}
            />
          </div>
          <div className="form-control">
            <label htmlFor="amount">Amount</label>
            <input
              type="number"
              id="amount"
              value={inputState[0]?.amount}
              onChange={(event) => {
                const newAmount = event?.target?.value;
                inputState[1]((prevInputState) => ({
                  title: prevInputState?.title,
                  amount: newAmount,
                }));
              }}
            />
          </div>
          <div className="ingredient-form__actions">
            <button type="submit">Add Ingredient</button>
          </div>
        </form>
      </Card>
    </section>
  );
});

export default IngredientForm;
