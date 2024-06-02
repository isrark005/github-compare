import { useEffect, useState } from "react";
import "./App.css";
import { GetProfileData } from "./APIs/getProfileData";
import { LinneChart } from "./components/LinneChart";

function App() {
  const [myUserName, setMyUserName] = useState("");
  const [comparerUserInput, setComparerUserInput] = useState("");
  const [myData, setMyData] = useState(null);
  const [comparerData, setComparerData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = (e) => {
    setMyData(null)
    setComparerData(null)
    e.preventDefault();
    setIsLoading(true);
    GetProfileData(myUserName).then((res) => {
      setMyData(res);
    });
    GetProfileData(comparerUserInput).then((res) => {
      setComparerData(res);
    });
    setIsLoading(false);
  };

  useEffect(() => {
    if (myData && comparerData) {
      const arrOfMyContri = Object.values(myData.total);
      const arrOfComparerContri = Object.values(comparerData.total);

      const myTotalContribution = arrOfMyContri.reduce((total, curVal) => {
        return total + curVal;
      });
      const comparertotalContri = arrOfComparerContri.reduce(
        (total, curVal) => {
          return total + curVal;
        }
      );
      console.log(
        "my total contribution :",
        myTotalContribution,
        " Comparer total contribution :",
        comparertotalContri
      );
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

      {isLoading && <h1>Loading...</h1>}
      {myData && comparerData && (
        <div className="comparison-container">
          <LinneChart
            myData={myData?.total}
            comparerData={comparerData?.total}
          />
        </div>
      )}
    </>
  );
}

export default App;
