import { useEffect, useState } from "react";
import "./App.css";
import { GetProfileData, GetGitHubInfo } from "./APIs/GetProfileData";
import { LinneChart } from "./components/LinneChart";
import MemeGenerator from "./components/MemeGenerator";

function App() {
  const [myUserName, setMyUserName] = useState("");
  const [comparerUserInput, setComparerUserInput] = useState("");
  const [myData, setMyData] = useState(null);
  const [comparerData, setComparerData] = useState(null);
  const [myName, setMyName] = useState("");
  const [myTotalContribution, setMyTotalContribution] = useState(0);
  const [comparertotalContri, setComparertotalContri] = useState(0)
  const [comparerName, setComparerName] = useState('');
  const [memeIndex, setMemeIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(false);
 const handleSubmit = async (e) => {
  e.preventDefault();
  
  // Clear previous data
  setMyData(null);
  setComparerData(null);
  
  // Start loading
  setIsLoading(true);

  try {
    const [myProfileData, myGitHubInfo, comparerProfileData, comparerGitHubInfo] = await Promise.all([
      GetProfileData(myUserName),
      GetGitHubInfo(myUserName),
      GetProfileData(comparerUserInput),
      GetGitHubInfo(comparerUserInput)
    ]);

    setMyData(myProfileData);
    setMyName(myGitHubInfo?.name);
    setComparerData(comparerProfileData);
    setComparerName(comparerGitHubInfo?.name);

  } catch (error) {
    // Handle errors if any
    console.error('Error fetching data:', error);
  } finally {
    // Stop loading
    setIsLoading(false);
  }
};

const getMemeIndex = (myContribution, comparerContribution) => {
  if (myContribution === 0 && comparerContribution === 0) {
  }
  const maxContribution = Math.max(myContribution, comparerContribution);
  const difference = Math.abs(myContribution - comparerContribution);
  const percentageDifference = (difference / maxContribution) * 100;
  const index = Math.floor(percentageDifference / 10);
  return Math.min(index, 9);
};

  useEffect(() => {
    if (myData && comparerData) {
      const arrOfMyContri = Object.values(myData.total);
      const arrOfComparerContri = Object.values(comparerData.total);

      const myTotalContribution = arrOfMyContri.reduce((total, curVal) => {
        return total + curVal;
      });
      setMyTotalContribution(myTotalContribution)

      const comparertotalContri = arrOfComparerContri.reduce(
        (total, curVal) => {
          return total + curVal;
        }
        );
      setComparertotalContri(comparertotalContri);
      setMemeIndex(getMemeIndex(myTotalContribution, comparertotalContri));
    }
  }, [myData, comparerData]);
console.log(memeIndex);
  return (
    <>
      <h1>GitHub Profile compare</h1>

      <div className="main-container">
        <form onSubmit={handleSubmit} className="flex flex-wrap justify-center">
          <div className="my-info w-1/2">
            <input
              value={myUserName}
              onChange={(e) => setMyUserName(e.currentTarget.value)}
              placeholder="enter your username"
              required
              className="border bg-slate-400"
            />
          </div>
          <div className="comparer-info w-1/2">
            <input
              value={comparerUserInput}
              onChange={(e) => setComparerUserInput(e.currentTarget.value)}
              placeholder="enter other persons username"
              required
              className="border bg-slate-400"
            />
          </div>
          <button type="submit" className="bg-[#0d1117] text-white px-4 py-2 rounded-md">Compare</button>
        </form>
      </div>

      {isLoading && <h1>Loading...</h1>}
      {myData && comparerData && (
        <div className="comparison-container flex">
          <div className="line-graph w-1/2">
          <div className="total-contri">
            <div className="my-contri text-left flex items-center gap-3">
            <div className="w-[38px] bg-[#fad673] aspect-square border border-black"></div>
            <div className="myInfo">
              <h1 className="my-name font-bold text-[20px]">{myName}</h1>
              <p className="text-[12px]">Total Contribution : {myTotalContribution}</p>
            </div>
            </div>
            <div className="comparer-contri text-left flex items-center gap-3">
            <div className="w-[38px] bg-[#da73fa] aspect-square border border-black"></div>
            <div className="comparerInfo">
              <h1 className="comparer-name font-bold text-[20px]">{comparerName}</h1>
              <p className="text-[12px]">Total Contribution : {comparertotalContri}</p>
            </div>
            </div>
          </div>
          <LinneChart
            userNames={{myname: myName,comparerName: comparerName}}
            myData={myData?.total}
            comparerData={comparerData?.total}
          />
          </div>
          <div className="meme h-[60vh] flex justify-center mx-auto max-w-[400px]">
        {/* <img src={memeDemo} alt="" className="max-h-[500px]" /> */}
        <MemeGenerator myName={myName} comparerName={comparerName} memeIndex={0} />
          </div>
        </div>
      )}
    </>
  );
}

export default App;
