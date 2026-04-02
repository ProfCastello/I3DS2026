import React from "react";

const Footer = (props) => {
  return (
    <footer>
      <p>
        Feito com 🫰🏻por{" "}
        <a href={props.link} target="_blank">
          {props.escritoLink}
        </a>
      </p>
    </footer>
  );
};

export default Footer;
