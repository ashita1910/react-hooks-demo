import React from "react";

import "./IngredientList.css";

const IngredientList = (props) => {
  return (
    <section className="ingredient-list">
      <h2>Loaded Ingredients</h2>
      <ul>
        {props.ingredients.map((ig) => (
          <li key={ig.id} onClick={props.onRemoveItem.bind(this, ig.id)}>
            <span>{ig.title}</span>
            <span>
              {ig.amount}
              <span className="ml-20">x</span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default IngredientList;
