import HashMap "mo:base/HashMap";
import Principal "mo:base/Principal";
import Debug "mo:base/Debug";
import Nat "mo:base/Nat";
import Iter "mo:base/Iter";



actor token {
    
    var owner : Principal = Principal.fromText("coqih-7oo3i-a4bu7-tub5a-74fe4-m3rra-ylo6t-mdfr3-b6khn-oyltu-5qe");
    var totalSupply : Nat = 1000000000;
    var symbol: Text ="VISH";

   private stable var balanceEntries:[(Principal,Nat)]=[]; //stable array of tuples~hashmap

   private var balances= HashMap.HashMap<Principal,Nat>(1,Principal.equal,Principal.hash); //ledger storing principal id-->no. of tokens
   if(balances.size() < 1) //if VISH is launched for the very first time 
            {
                balances.put(owner,totalSupply);
            };

    

    public query func balanceOf(who:Principal):async Nat {
        let balance : Nat = switch(balances.get(who)){
            case null 0;
            case (?result) result;
        };

        return balance;
    };

    public query func getSymbol():async Text {
        return symbol;
    };

    public shared(msg) func payOut():async Text {
        if(balances.get(msg.caller)==null){
        let amt=10000;
        let result= await token.transfer(msg.caller,amt);  //the charged canister gives out the free tokens.
        return result;
        }
        else {
            return "Already claimed";
        }
    };

    public shared(msg) func transfer(to:Principal,amount:Nat):async Text{
        let fromBalance = await balanceOf(msg.caller);
        if(fromBalance > amount){
          let newFromBalance:Nat = fromBalance-amount;
          balances.put(msg.caller,newFromBalance);

          let toBalance=await balanceOf(to);
          let newToBalance=toBalance+amount;
          balances.put(to,newToBalance);

        return "Success";
        }
        else{
            return "Insufficient funds";
        }
    };

    system func preupgrade(){
        balanceEntries:=Iter.toArray(balances.entries()); //converting hashmap to an iterable array 
        };
    
    system func postupgrade(){
        balances:= HashMap.fromIter<Principal,Nat>(balanceEntries.vals(), 1 ,Principal.equal,Principal.hash);
        if(balances.size() < 1) //newly launched ledger
            {
                balances.put(owner,totalSupply);
            };

        
    };

};