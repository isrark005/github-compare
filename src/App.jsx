import { useEffect, useState } from "react";
import "./App.css";
import { LinneChart } from "./components/LinneChart";
import MemeGenerator from "./components/MemeGenerator";
import { GetGitHubInfo, GetProfileData } from "./APIs/GetProfileData";
import { gorillaBg } from "./assets";
import { Container } from "./components/Container";
import { Header } from "./components/Header";
import { ButtonArrow } from "./assets/buttonArrow";

function App() {
  const [myUserName, setMyUserName] = useState("");
  const [comparerUserInput, setComparerUserInput] = useState("");
  const [myData, setMyData] = useState(null);
  const [comparerData, setComparerData] = useState(null);
  const [myName, setMyName] = useState("");
  const [myTotalContribution, setMyTotalContribution] = useState(0);
  const [comparertotalContri, setComparertotalContri] = useState(0);
  const [comparerName, setComparerName] = useState("");
  const [memeIndex, setMemeIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [winner, setWinner] = useState(null);
  const [loser, setLoser] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous data
    setMyData(null);
    setComparerData(null);

    // Start loading
    setIsLoading(true);

    try {
      const [
        myProfileData,
        myGitHubInfo,
        comparerProfileData,
        comparerGitHubInfo,
      ] = await Promise.all([
        GetProfileData(myUserName),
        GetGitHubInfo(myUserName),
        GetProfileData(comparerUserInput),
        GetGitHubInfo(comparerUserInput),
      ]);

      setMyData(myProfileData);
      setMyName(myGitHubInfo?.name || myUserName);
      setComparerData(comparerProfileData);
      setComparerName(comparerGitHubInfo?.name || comparerUserInput);
    } catch (error) {
      // Handle errors if any
      console.error("Error fetching data:", error);
    } finally {
      // Stop loading
      setIsLoading(false);
    }
  };

  const getMemeIndex = (myContribution, comparerContribution) => {
    if (myContribution === 0 && comparerContribution === 0) {
      return 0;
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

      const myTotalContribution = arrOfMyContri.reduce(
        (total, curVal) => total + curVal,
        0
      );
      setMyTotalContribution(myTotalContribution);

      const comparerTotalContribution = arrOfComparerContri.reduce(
        (total, curVal) => total + curVal,
        0
      );
      setComparertotalContri(comparerTotalContribution);

      const memeIndex = getMemeIndex(
        myTotalContribution,
        comparerTotalContribution
      );
      setMemeIndex(memeIndex);

      if (myTotalContribution > comparerTotalContribution) {
        setWinner(myName);
        setLoser(comparerName);
      } else {
        setWinner(comparerName);
        setLoser(myName);
      }
    }
  }, [myData, comparerData, myName, comparerName]);
  console.log(memeIndex);

  return (
    <main className="body-container h-[100dvh]">
      <Container className="h-full pt-7">
        <Header />

        <div className="main-container h-[calc(100dvh_-_88px)] flex flex-col justify-end pb-24">
          <h1 className="font-semibold text-[68px] text-center text-white leading-tight">
            GitHub Profile <br /> Comparison
          </h1>
          <form
            onSubmit={handleSubmit}
            className="flex flex-wrap justify-center mt-4"
          >
            <div className="my-info w-5/12 text-center">
              <input
                value={myUserName}
                onChange={(e) => setMyUserName(e.currentTarget.value)}
                placeholder="Your Username"
                required
                className="border bg-white shadow-[0px_4px_50px_rgba(0,_255,_87,_0.5)] w-[294px] py-3 px-4 text-[18px] rounded-full"
              />
            </div>
            <div className="vs-wrapper font-bold text-[38px] text-white border-[2px] border-white aspect-square w-[64px] rounded-full grid content-center justify-center">
              VS
            </div>
            <div className="comparer-info w-5/12 text-center">
              <input
                value={comparerUserInput}
                onChange={(e) => setComparerUserInput(e.currentTarget.value)}
                placeholder="enter other persons username"
                required
                className="border bg-white shadow-[0px_4px_50px_rgba(0,_255,_87,_0.5)] w-[294px] py-3 px-4 text-[18px] rounded-full"
              />
            </div>
            <div className="button-wrapper w-full flex justify-center items-center  mt-10">
              <button
                type="submit"
                className="bg-transparent text-white pl-9 border-[2px] flex items-center border-white rounded-full gap-9"
              >
                COMPARE
                <span className="bg-white rounded-full h-[54px] aspect-square grid content-center justify-center border-[2px] border-white">
                  <ButtonArrow />
                </span>
              </button>
            </div>
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
                    <p className="text-[12px]">
                      Total Contribution : {myTotalContribution}
                    </p>
                  </div>
                </div>
                <div className="comparer-contri text-left flex items-center gap-3">
                  <div className="w-[38px] bg-[#da73fa] aspect-square border border-black"></div>
                  <div className="comparerInfo">
                    <h1 className="comparer-name font-bold text-[20px]">
                      {comparerName}
                    </h1>
                    <p className="text-[12px]">
                      Total Contribution : {comparertotalContri}
                    </p>
                  </div>
                </div>
              </div>
              <LinneChart
                userNames={{ myname: myName, comparerName: comparerName }}
                myData={myData?.total}
                comparerData={comparerData?.total}
              />
            </div>
            <div className="meme h-[60vh] flex justify-center mx-auto max-w-[400px]">
              {/* <img src={memeDemo} alt="" className="max-h-[500px]" /> */}
              {winner && loser && (
                <MemeGenerator
                  winnerName={winner}
                  loserName={loser}
                  // below: we dont have 10 memes yet so passing hardcoded value
                  memeIndex={0}
                />
              )}
            </div>
          </div>
        )}
      </Container>
    </main>
  );
}

export default App;
