import styled from "styled-components";
import React from "react";



   
        const Button = styled.button`
background-color: #64b5f6;
color: white;
padding: 5px 15px;
border-radius: 5px;
outline: 0;
text-transform: uppercase;
margin: 1px 0px;
cursor: pointer;
box-shadow: 0px 2px 2px lightgray;
transition: ease background-color 250ms;
&:hover {
  /* background-color: "#283593"; */
  background-color: #1565c0;
}
&:disabled {
  cursor: default;
  opacity: 0.7;
}
`;



export default Button;