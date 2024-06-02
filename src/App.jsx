import { useEffect, useState } from "react";
import "./App.css";
import { GetProfileData } from "./APIs/getProfileData";

function App() {
  const [myUserName, setMyUserName] = useState("");
  const [comparerUserInput, setComparerUserInput] = useState("");
  const [myData, setMyData] = useState(null);
  const [comparerData, setComparerData] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    GetProfileData(myUserName).then((res) => {
      setMyData(res);
      GetProfileData(comparerUserInput).then((res) => {
        setComparerData(res);
      });
    });
  };
  
  useEffect(() => {
    if (myData && comparerData) {
      const arrOfMyContri = Object.values(myData.total)
      const arrOfComparerContri = Object.values(comparerData.total)
      
      const myTotalContribution = arrOfMyContri.reduce((total, curVal)=> {
        return total + curVal;
      })
      const comparertotalContri = arrOfComparerContri.reduce((total, curVal)=> {
        return total + curVal;
      })
      console.log('my total contribution :', myTotalContribution , ' Comparer total contribution :', comparertotalContri )
    }
  }, [myData, comparerData]);

  return (
    <>
      <h1>GitHub Profile compare</h1>

      <div className="main-container">
        <form onSubmit={handleSubmit} className="flex">
          <div className="my-info">
            <input
              value={myUserName}
              onChange={(e) => setMyUserName(e.currentTarget.value)}
              placeholder="enter your username"
              required
            />
          </div>
          <div className="comparer-info">
            <input
              value={comparerUserInput}
              onChange={(e) => setComparerUserInput(e.currentTarget.value)}
              placeholder="enter other persons username"
              required
            />
          </div>
          <button type="submit">Compare</button>
        </form>
      </div>
    </>
  );
}

export default App;
