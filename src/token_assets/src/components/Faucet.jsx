import React,{useState} from "react";
import {canisterId,createActor } from "../../../declarations/token";
import { AuthClient } from "@dfinity/auth-client";

function Faucet() {

  const [isDisabled,setDisabled]=useState(false); //to prevent faucet button from being clicked too many times.
  const [btnText,setText]=useState("Gimme gimme");

  async function handleClick(event) {
    setDisabled(true); //to disable button

    const authClient = await AuthClient.create();
    const identity = await authClient.getIdentity();

    const authenticatedCanister=createActor(canisterId,{
      agentOptions:{
        identity,
      },
    });

    setText(await authenticatedCanister.payOut());
  }

  return (
    <div className="blue window">
      <h2>
        <span role="img" aria-label="tap emoji">
          🚰
        </span>
        Faucet
      </h2>
      <label>Get your free DAngela tokens here! Claim 10,000 DANG coins to your account.</label>
      <p className="trade-buttons">
        <button 
        id="btn-payout"
        onClick={handleClick}
        disabled={isDisabled}
        >
        {btnText}
        </button>
      </p>
    </div>
  );
}

export default Faucet;
