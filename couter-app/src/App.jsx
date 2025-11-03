import React, {useState} from 'react';

function App() {
  let [counter,setcounter] = useState(15);
 //let counter=14
 const addvalue=()=>{
    console.log("clicked",counter);
      if(counter < 20){
    setcounter(counter+1);
  }else{
    alert("value cant go beyond 20");
  }
 } 
 const removevalue=()=>{
  if(counter>0){
      setcounter(counter-1)
    }else{
      alert("value cant go beyond 0");
    }
 }
  return (
    <>
     <h1>radhe radhe</h1>
     <h2>counter value: {counter}</h2>
     <button onClick={addvalue}>add value</button>
     <br />
     <button onClick={removevalue}>remove value</button>
    </>
  );
}

export default App
