import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Tooltip } from "chart.js";
import { useEffect, useState } from "react";

ChartJS.register(CategoryScale,LinearScale,BarElement, PointElement, LineElement, Tooltip  )

export function LinneChart({myData, comparerData, userNames}) {
   
    
    const [myContributions, setMyContributions] = useState(Object.values(myData));
    const [comparerContributions, setComparerContributions] = useState(Object.values(comparerData));
    const getUserYearsforLabel = (myData, comparerData) => {
     const myYears = Object.keys(myData);   
     const comparerYears = Object.keys(comparerData);
     if(myYears.length > comparerYears.length){
        return myYears
     }else {
        return comparerYears
     }   
    }
    const mainLabel = getUserYearsforLabel(myData, comparerData) 
    
    useEffect(() => {
        const maxLength = Math.max(myContributions.length, comparerContributions.length);
    
        // Function to pad an array with null at the start
        const padArray = (arr, length) => {
          const padding = Array(length - arr.length).fill(null);
          return [...padding, ...arr];
        };
    
        if (myContributions.length < maxLength) {
          setMyContributions(padArray(myContributions, maxLength));
        }
        
        if (comparerContributions.length < maxLength) {
          setComparerContributions(padArray(comparerContributions, maxLength));
        }
      }, []);
 
    const LINECHART_DATA = {
        labels: mainLabel,
        datasets: [
           { label: userNames.myname,
            data: myContributions,
            borderColor: '#63FF60',
            pointBackgroundColor: '#fff', 
            pointBorderColor: '#fff', 
            pointWidth: 5,
            pointRadius: 5,
            borderWidth: 4
           },
           { label: userNames.comparerName,
            data: comparerContributions,
            borderColor: '#FFE55B',
            pointBackgroundColor: '#fff', 
            pointBorderColor: '#fff', 
            pointWidth: 5,
            pointRadius: 5,
            borderWidth: 4
           },
        ],
        
    }
  
    const options = {
      scales: {
        x: {
            grid: {
                color: '#FFFFFF33', 
            },
            ticks: {
              color: '#fff'
            }
        },
        y: {
            grid: {
                color: '#FFFFFF33', 
            },
            ticks: {
              color: '#fff'
            }
        },
    },
    }
    return (
        
            <Line options={options} data={LINECHART_DATA} />
       
    )
}
