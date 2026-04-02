import React from "react";
import "./Rodape.module.css";

const Rodape = ({ children, link, prefixText }) => {
  return (
    <footer>
      <p>
        {prefixText}{" "}
        <a href={link} target="_blank" rel="noreferrer">
          {children}
        </a>
      </p>
    </footer>
  );
};

export default Rodape;
