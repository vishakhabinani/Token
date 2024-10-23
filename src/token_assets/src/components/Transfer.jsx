import React,{useState} from "react";
import { Principal } from "@dfinity/principal";
import {canisterId,createActor } from "../../../declarations/token";
import { AuthClient } from "@dfinity/auth-client";


function Transfer() {
  const [recipientId,setRecipient]=useState("");
  const [amount,setAmount]=useState("");  //initially both of these are strings
  const [isDisabled,setDisable]=useState(false);
  const [feedback,setFeedback]=useState("");
  const [isHidden,setHidden]=useState(true);

  
  async function handleClick() {
    setHidden(true);
    setDisable(true); //once clicked btn shld be disabled till current transaction is complete
    const recipient=Principal.fromText(recipientId);  //conversions to correct datatype.
    const amt=Number(amount);

    const authClient = await AuthClient.create();
    const identity = await authClient.getIdentity();

    const authenticatedCanister=createActor(canisterId,{
      agentOptions:{
        identity,
      },
    });

    const result=await authenticatedCanister.transfer(recipient,amt);
    setFeedback(result);
    setHidden(false); //feedback to be displayed
    setDisable(false); //btn is enabled for any further transaction


    
  }

  return (
    <div className="window white">
      <div className="transfer">
        <fieldset>
          <legend>To Account:</legend>
          <ul>
            <li>
              <input
                type="text"
                id="transfer-to-id"
                value={recipientId}
                onChange={(e) => setRecipient(e.target.value)}
              />
            </li>
          </ul>
        </fieldset>
        <fieldset>
          <legend>Amount:</legend>
          <ul>
            <li>
              <input
                type="number"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </li>
          </ul>
        </fieldset>
        <p className="trade-buttons">
          <button id="btn-transfer" onClick={handleClick} disabled={isDisabled} >
            Transfer
          </button>
        </p>
        <p hidden={isHidden}>{feedback}</p>
      </div>
    </div>
  );
}

export default Transfer;
