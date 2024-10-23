import React, { useState } from "react";
import { Principal } from '@dfinity/principal';
import { token } from "../../../declarations/token";


function Balance() {

  const [inputValue,setInput]= useState(""); 
  const [balanceResult,setBalance]= useState("");  //the type of balance to be displayed is set as string
  const [cryptoSymbol,setSymbol]=useState(""); //to display DSHIV
  const [isHidden,setHidden]=useState(true); 
  
  async function handleClick() {
    const principal=Principal.fromText(inputValue); //converting user input to principal type
    const balance = await token.balanceOf(principal); //giving input to motoko backend for function
    setBalance(balance.toLocaleString()); //need to convert Nat output from backend into string to display in frontend
    setSymbol(await token.getSymbol());
    setHidden(false);
    


  }


  return (
    <div className="window white">
      <label>Check account token balance:</label>
      <p>
        <input
          id="balance-principal-id"
          type="text"
          placeholder="Enter a Principal ID"
          value={inputValue}
          onChange={(e) => setInput(e.target.value)}
        />
      </p>
      <p className="trade-buttons">
        <button
          id="btn-request-balance"
          onClick={handleClick}
        >
          Check Balance
        </button>
      </p>
      <p hidden={isHidden}>This account has a balance of {balanceResult} {cryptoSymbol} .</p>
    </div>
  );
}

export default Balance;
