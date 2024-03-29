import { useEffect, useRef, useState } from 'react';
import { line, curveMonotoneX } from 'd3-shape';
import { scaleLinear, scaleTime } from 'd3-scale';
import { format, parse } from 'date-fns';
import styled from 'styled-components';
import { bisectCenter } from 'd3-array';
import { pointer, select } from 'd3-selection';
import sortBy from 'lodash.sortby';
import min from 'lodash.min';
import max from 'lodash.max';
import { MultiLineChartDataType } from '../../../../Types';
import { numberFormattingFunction } from '../../../../Utils/numberFormattingFunction';
import { Tooltip } from '../../../Elements/Tooltip';

interface Props {
  data: MultiLineChartDataType[];
  colors: string[];
  width: number;
  height: number;
  dateFormat: string;
  noOfXTicks: number;
  labels: string[];
  topMargin: number;
  bottomMargin: number;
  leftMargin: number;
  rightMargin: number;
  tooltip?: (_d: any) => JSX.Element;
  onSeriesMouseOver?: (_d: any) => void;
  showColorLegendAtTop?: boolean;
}

const XTickText = styled.text`
  font-size: 12px;
  @media (max-width: 980px) {
    font-size: 10px;
  }
  @media (max-width: 600px) {
    font-size: 9px;
  }
  @media (max-width: 420px) {
    display: none;
  }
`;

export function Graph(props: Props) {
  const {
    data,
    width,
    height,
    colors,
    dateFormat,
    noOfXTicks,
    labels,
    rightMargin,
    topMargin,
    bottomMargin,
    leftMargin,
    tooltip,
    onSeriesMouseOver,
    showColorLegendAtTop,
  } = props;
  const [mouseOverData, setMouseOverData] = useState<any>(undefined);
  const [eventX, setEventX] = useState<number | undefined>(undefined);
  const [eventY, setEventY] = useState<number | undefined>(undefined);
  const margin = {
    top: topMargin,
    bottom: bottomMargin,
    left: leftMargin,
    right: rightMargin,
  };
  const MouseoverRectRef = useRef(null);
  const dataFormatted = sortBy(
    data.map(d => ({
      date: parse(`${d.date}`, dateFormat, new Date()),
      y: d.y,
      data: d.data,
    })),
    'date',
  );
  const dataArray = dataFormatted[0].y.map((_d, i) => {
    return dataFormatted
      .map(el => ({
        date: el.date,
        y: el.y[i],
      }))
      .filter(el => el.y !== undefined);
  });
  const graphWidth = width - margin.left - margin.right;
  const graphHeight = height - margin.top - margin.bottom;
  const minYear = dataFormatted[0].date;
  const maxYear = dataFormatted[dataFormatted.length - 1].date;
  const minParam: number = min(dataFormatted.map(d => min(d.y)))
    ? (min(dataFormatted.map(d => min(d.y))) as number) > 0
      ? 0
      : (min(dataFormatted.map(d => min(d.y))) as number)
    : 0;
  const maxParam: number = (max(dataFormatted.map(d => max(d.y))) as number)
    ? (max(dataFormatted.map(d => max(d.y))) as number)
    : 0;

  const x = scaleTime().domain([minYear, maxYear]).range([0, graphWidth]);
  const y = scaleLinear()
    .domain([minParam, maxParam])
    .range([graphHeight, 0])
    .nice();

  const lineShape = line()
    .x((d: any) => x(d.date))
    .y((d: any) => y(d.y))
    .curve(curveMonotoneX);
  const yTicks = y.ticks(5);
  const xTicks = x.ticks(noOfXTicks);
  useEffect(() => {
    const mousemove = (event: any) => {
      const selectedData =
        dataFormatted[
          bisectCenter(
            dataFormatted.map(d => d.date),
            x.invert(pointer(event)[0]),
            1,
          )
        ];
      setMouseOverData(selectedData || dataFormatted[dataFormatted.length - 1]);
      setEventY(event.clientY);
      setEventX(event.clientX);
      if (onSeriesMouseOver) {
        onSeriesMouseOver(
          selectedData || dataFormatted[dataFormatted.length - 1],
        );
      }
    };
    const mouseout = () => {
      setMouseOverData(undefined);
      setEventX(undefined);
      setEventY(undefined);
    };
    select(MouseoverRectRef.current)
      .on('mousemove', mousemove)
      .on('mouseout', mouseout);
    if (onSeriesMouseOver) {
      onSeriesMouseOver(undefined);
    }
  }, [x, dataFormatted]);
  return (
    <>
      <svg
        width={`${width}px`}
        height={`${height}px`}
        viewBox={`0 0 ${width} ${height}`}
      >
        <g transform={`translate(${margin.left},${margin.top})`}>
          <g>
            {yTicks.map((d, i) =>
              d !== 0 ? (
                <g key={i}>
                  <line
                    y1={y(d)}
                    y2={y(d)}
                    x1={width}
                    x2={-20}
                    style={{
                      stroke: 'var(--gray-500)',
                    }}
                    strokeWidth={1}
                    strokeDasharray='4,8'
                  />
                  <text
                    x={-25}
                    y={y(d)}
                    style={{
                      fill: 'var(--gray-500)',
                      fontFamily: 'var(--fontFamily)',
                    }}
                    textAnchor='end'
                    fontSize={12}
                    dy={3}
                  >
                    {numberFormattingFunction(d)}
                  </text>
                </g>
              ) : null,
            )}
            <line
              y1={graphHeight}
              y2={graphHeight}
              x1={-20}
              x2={width}
              style={{
                stroke: 'var(--gray-700)',
              }}
              strokeWidth={1}
            />
          </g>
          <g>
            {xTicks.map((d, i) => (
              <g key={i}>
                <XTickText
                  y={graphHeight}
                  x={x(d)}
                  style={{
                    fill: 'var(--gray-700)',
                  }}
                  textAnchor='middle'
                  fontSize={12}
                  dy={15}
                >
                  {format(d, dateFormat)}
                </XTickText>
              </g>
            ))}
          </g>
          <g>
            {dataArray.map((d, i) => (
              <>
                <path
                  key={i}
                  d={lineShape(d as any) as string}
                  fill='none'
                  style={{
                    stroke: colors[i],
                  }}
                  strokeWidth={2}
                />
                <g>
                  {d.map((el, j) => (
                    <g key={j}>
                      {el.y !== undefined ? (
                        <g>
                          <circle
                            cx={x(el.date)}
                            cy={y(el.y)}
                            r={
                              graphWidth / dataFormatted.length < 5
                                ? 0
                                : graphWidth / dataFormatted.length < 20
                                ? 2
                                : 4
                            }
                            style={{
                              fill: colors[i],
                            }}
                          />
                        </g>
                      ) : null}
                    </g>
                  ))}
                </g>
                {showColorLegendAtTop ? null : (
                  <text
                    style={{
                      fill: colors[i],
                      fontSize: '12px',
                      fontWeight: 'bold',
                      fontFamily: 'var(--fontFamily)',
                    }}
                    x={x(d[d.length - 1].date)}
                    y={y(d[d.length - 1].y as number)}
                    dx={5}
                    dy={4}
                  >
                    {labels[i]}
                  </text>
                )}
              </>
            ))}
            {mouseOverData ? (
              <line
                y1={0}
                y2={graphHeight}
                x1={x(mouseOverData.date)}
                x2={x(mouseOverData.date)}
                stroke='#212121'
                strokeDasharray='4 8'
                strokeWidth={1}
              />
            ) : null}
          </g>
          <rect
            ref={MouseoverRectRef}
            fill='none'
            pointerEvents='all'
            width={graphWidth}
            height={graphHeight}
          />
        </g>
      </svg>
      {mouseOverData && tooltip && eventX && eventY ? (
        <Tooltip body={tooltip(mouseOverData)} xPos={eventX} yPos={eventY} />
      ) : null}
    </>
  );
}
