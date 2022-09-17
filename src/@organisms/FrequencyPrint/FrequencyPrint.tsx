import React from 'react';

// import useFrequencyPrint from './useFrequencyPrint';
// import FrequencyPrintProps from './FrequencyPrint.d.ts';


interface FrequencyPrintProps {
  height?: number;
  width?: number;
  stats?: [string, number][];
}

export const useFrequencyPrint = () => {
  return {

  };
};

const FrequencyPrint: React.FC<FrequencyPrintProps> = ({
  height,
  width,
  stats,
}) => {
  const {} = useFrequencyPrint();

  const maxFrequency = Math.max(...stats.map((item) => item[1]));
  const maxFrequencyK = maxFrequency/100;
  const ticksNum = Math.floor(height/24);
  
  const plotHeight = height - 30;
  const tickStep = plotHeight / ticksNum;

  const leftColumnWidth = 40;

  const barStartPoint = 10;
  const barWidth = (width-10-leftColumnWidth-barStartPoint)/stats.length;
  const barGap = 3;

  return (
    <>
      <svg width={width} height={height}>
        <g transform={`translate(${leftColumnWidth},20)`}>
        <g className="x axis" transform={`translate(0,${plotHeight})`}>
          {stats.map(([char], index) => (
            <g 
              className="tick" 
              transform={`translate(${(barStartPoint+barWidth/2) + (barWidth+barGap)*index},0)`} 
              style={{opacity: 1}}
            >
              <line y2="6" x2="0"></line>
              <text 
                dy=".71em" 
                y="9" 
                x="0" 
                style={{textAnchor: 'middle'}}
              >
                {char}
              </text>
            </g>
          ))}
          <path className="domain" d="M0,6V0H900V6"></path>
        </g>
          <g className="y axis">
            {Array.from(new Array(ticksNum+1)).map((_, index) => (
              <g 
              className="tick" 
              transform={`translate(0,${plotHeight-tickStep*index})`}
              style={{opacity: 1}}
            >
              <line x2="-6" y2="0" />
              <text 
                dy=".32em" 
                x="-9" 
                y="0" 
                style={{textAnchor: 'end'}}
              >
                {Math.ceil(maxFrequency*index/ticksNum)}%
              </text>
            </g>
            ))}
          <path className="domain" d="M-6,0H0V450H-6"></path>
          <text transform="rotate(-90)" y="6" dy=".71em" style={{textAnchor: 'end'}}>Frequency</text>
        </g>
        {stats.map(([char, frequency], index) => (
          <rect 
            className="bar" 
            x={`${barStartPoint + index*(barWidth + barGap)}`} 
            width={barWidth} 
            y={(100-frequency/maxFrequencyK)/100*plotHeight} 
            height={(frequency/maxFrequencyK/100)*plotHeight} 
          />
        ))}
        </g>
      </svg>
      <style jsx>{
        `
        .bar {
          fill: #d81c3f;
        }
        
        .axis {
          font: 10px sans-serif;
        }
        
        .axis path,
        .axis line {
          fill: none;
          stroke: #000;
          shape-rendering: crispEdges;
        }
        
        .x.axis path {
          display: none;
        }
        `
      }</style>
    </>
  );
};

FrequencyPrint.defaultProps = {
  height: 500,
  width: 400,
  stats: [
    ['A', 3],
    ['B', 13],
    ['C', 2],
    ['D', 16],
    ['E', 23],
  ]
}

FrequencyPrint.displayName = 'FrequencyPrint';

export default FrequencyPrint;
