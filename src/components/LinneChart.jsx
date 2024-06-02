import { Line, Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Tooltip } from "chart.js";
import { useEffect, useState } from "react";

ChartJS.register(CategoryScale,LinearScale,BarElement, PointElement, LineElement, Tooltip  )

export function LinneChart({myData, comparerData}) {
   
    
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
    const mainLabel =getUserYearsforLabel(myData, comparerData) 
    
    useEffect(() => {
        const maxLength = Math.max(myContributions.length, comparerContributions.length);
    
        // Function to pad an array with zeroes at the start
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
           { label: 'My data',
            data: myContributions,
            borderColor: '#fad673'
           },
           { label: 'Comparer data',
            data: comparerContributions,
            borderColor: '#da73fa'
           },

        ]
    }
  
    const options = {}
    return (
        
            <Line options={options} data={LINECHART_DATA} />
       
    )
}
