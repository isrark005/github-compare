import { useEffect, useState } from "react";
import "./App.css";
import { LinneChart } from "./components/LinneChart";
import MemeGenerator from "./components/MemeGenerator";
import { GetGitHubInfo, GetProfileData } from "./APIs/GetProfileData";
import { gorillaBg } from "./assets";
import { Container } from "./components/Container";
import { Header } from "./components/Header";
import { ButtonArrow } from "./assets/buttonArrow";
import { AnimatePresence, easeInOut, motion } from "framer-motion";

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
  const [haveData, setHaveData] = useState(false);

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
      setHaveData(true);
    }
  }, [myData, comparerData, myName, comparerName]);

  const transition = {duration: 1, ease: 'easeInOut' };
  const gradientStyles = {
    color1: 'rgba(74,178,1,1)',
    color2: 'rgba(0,0,0,1)',
    x: haveData ? '30%' : '50%',  // Adjust X position here
    y: haveData ? '70%' : '50%',  // Adjust Y position here
  };

  return (
    <motion.main className="body-container h-[100dvh] overflow-hidden"
   
  animate={{
    "--x": '68%',  // Adjust X position for animation
    "--y": haveData ? '62%' : '100%',  // Adjust Y position for animation
    "--color1" : 'rgba(74,178,1,1)',
    "--color2" : haveData ? 'rgba(0,0,0,1)' : 'rgba(0,0,0,0)',
    "--position2": haveData ? '50%' : '0%',
    }}
    transition={transition}>
      <Container className="h-full pt-7">
        <Header />

        <div
          className={`main-container h-[calc(100dvh_-_88px)] flex flex-col pb-24`}
         
        >
          <motion.div
            className="headering-wrapper flex mt-auto"
            transition={transition}
            initial={{
              marginTop: "auto",
              paddingLeft: "calc(50% - 230px)",
            }}
            animate={{
              marginTop: haveData ? "0px" : "200px",
              paddingLeft: haveData ? "0" : "calc(50% - 230px)",
              
            }}
          >
            <motion.h1
              className="text-white leading-tight text-left w-fit"
              initial={false}
              animate={{
                fontSize: haveData ? "52px" : "68px",
                fontWeight: haveData ? 600 : 700,
              }}
              transition={transition}
            >
              GitHub Profile <br />{" "}
              <motion.span
                transition={transition}
                initial={false}
                animate={{ marginLeft: haveData ? "0px" : "26px" }}
              >
                Comparison
              </motion.span>
            </motion.h1>
          </motion.div>
            <AnimatePresence>
          {!haveData && (
              <motion.form
                initial={{ translateY: 10, scale: 1.1, opacity: 0}}
                animate={{ translateY: 0, scale: 1, opacity: 1}}
                exit={{scale: 0.9, opacity: 0, translateY: -100, height: '0%'}}
                transition={transition}

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
                {isLoading ? <h1>Loading...</h1> : <span>VS</span>} 
                </div>
                <div className="comparer-info w-5/12 text-center">
                  <input
                    value={comparerUserInput}
                    onChange={(e) =>
                      setComparerUserInput(e.currentTarget.value)
                    }
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
              </motion.form>
          )}
          </AnimatePresence>
         

          <AnimatePresence>
          {myData && comparerData && (
              <motion.div
              initial={{opacity: 0, translateY: 100, scale: 0.8}}
              animate={{ translateY: 0, scale: 1, opacity: 1}}
              exit={{scale: 0.9, opacity: 0, translateY: -100}}
              transition={transition}
                className="comparison-container flex"
              >
                <div className="line-graph w-1/2">
                  <div className="total-contri">
                    <div className="my-contri text-left flex items-center gap-3">
                      <div className="w-[38px] bg-[#fad673] aspect-square border border-black"></div>
                      <div className="myInfo">
                        <h1 className="my-name font-bold text-[20px]">
                          {myName}
                        </h1>
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
              </motion.div>
          )}
          </AnimatePresence>
        </div>
      </Container>
    </motion.main>
  );
}

export default App;
