import { useEffect, useRef, useState } from "react";
import "./App.css";
import { LinneChart } from "./components/LinneChart";
import MemeGenerator from "./components/MemeGenerator";
import { GetGitHubInfo, GetProfileData } from "./APIs/GetProfileData";
import { Container } from "./components/Container";
import { Header } from "./components/Header";
import { ButtonArrow } from "./assets/buttonArrow";
import { AnimatePresence, easeInOut, motion } from "framer-motion";
import html2canvas from "html2canvas";

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
  const containerRef = useRef(null);

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
      
      console.error("Error fetching data:", error);
    } finally {
      
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

  const downloadImage = (e) => {

    if (!containerRef.current) return;
  
    e.currentTarget.style.visibility = 'hidden';
    html2canvas(containerRef.current, {backgroundColor: '#000000'})
      .then((canvas) => {
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = 'githubStatus.png';
        link.click();
      })
      .catch((error) => {
        console.error('Error capturing the image:', error);
      })
      .finally(()=> e.currentTarget.style.visibility = 'visible')
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

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  const fontSize = haveData ? (isMobile ? '34px' : '52px') : (isMobile ? '44px' : '68px');

  return (
    <motion.main className="body-container h-[100dvh] "
   
  animate={{
    "--x": '68%',  
    "--y": haveData ? '62%' : '100%', 
    "--color1" : 'rgba(74,178,1,1)',
    "--color2" : haveData ? 'rgba(0,0,0,1)' : 'rgba(0,0,0,0)',
    "--position2": haveData ? '50%' : '0%',
    }}
    transition={transition}>
      <Container className="h-full pt-7 font-sans">
        <Header />

        <div
        ref={containerRef}
          className={`main-container h-[calc(100dvh_-_88px)] flex flex-col pb-24 md:pl-8`}
         
        >
          <motion.div
            className="headering-wrapper flex mt-auto max-md:justify-center"
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
              className={`text-white leading-[0.9em] text-left w-fit ${haveData ? 'mt-8': ''} max-md:text-[34px]`}
              initial={false}
              animate={{
                fontSize: fontSize,
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
              exit={{scale: 0.9, opacity: 0, translateY: -100}}
              animate={{ translateY: 0, scale: 1, opacity: 1}}
              transition={transition}
                className="comparison-container flex max-md:flex-col"
              >
                <div className="line-graph w-1/2 mt-8 max-md:w-full">
                  <LinneChart
                    userNames={{ myname: myName, comparerName: comparerName }}
                    myData={myData?.total}
                    comparerData={comparerData?.total}
                  />
                  <div className="total-contri text-white flex gap-10 mt-10">
                    <div className="my-contri text-left flex items-center gap-3">
                      <div className="w-[54px] rounded-md bg-[#63FF60] aspect-square border border-black"></div>
                      <div className="myInfo">
                        <h1 className="my-name font-semibold text-[20px]">
                         {myName}
                        </h1> 
                        <p className="text-[12px] text-[#EAEAEA] font-light">
                          Total Contribution : {myTotalContribution}
                        </p>
                      </div>
                    </div>
                    <div className="comparer-contri text-left flex items-center gap-3">
                      <div className="w-[54px] rounded-md bg-[#FFE55B] aspect-square border border-black"></div>
                      <div className="comparerInfo">
                        <h1 className="comparer-name font-semibold text-[20px]">
                          {comparerName}
                        </h1>
                        <p className="text-[12px] text-[#EAEAEA] font-light">
                          Total Contribution : {comparertotalContri}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="meme h-[60vh] -mt-12 flex flex-col justify-start gap-6 mx-auto max-w-[400px]">
                  {/* <img src={memeDemo} alt="" className="max-h-[500px]" /> */}
                 <div className="canvas-wrapper">
                  {winner && loser && (
                    <MemeGenerator
                      winnerName={winner}
                      loserName={loser}
                      //  we dont have 10 memes yet so passing hardcoded value
                      memeIndex={0}
                    />
                  )}
                  </div>
                  {/* <div className="image-container w-[316px] h-[370px] bg-white rounded-md flex items-center justify-center">Meme</div> */}
                 <div className="btn-wrapper flex justify-center">
                  <button
                  onClick={(e)=> downloadImage(e)}
                    type="button"
                    className="bg-transparent text-white pl-9 border-[2px] flex items-center border-white rounded-full gap-9"
                  >
                    DOWNLOAD
                    <span className="bg-white rounded-full h-[54px] aspect-square grid content-center justify-center border-[2px] border-white">
                      <ButtonArrow />
                    </span>
                  </button>
                  </div>
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
