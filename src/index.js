import React from "react";
import ReactDOM from "react-dom/client";
import StarRating from "./StarRating";
import "./index.css";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    {
      <App />
      // <>
      //   {/* <StarRating maxRating={10} /> */}
      //   {/* <StarRating maxRating={5} /> */}
      //   {/* <StarRating defaultRating={10} /> */}
      // </>
    }
  </React.StrictMode>
);
