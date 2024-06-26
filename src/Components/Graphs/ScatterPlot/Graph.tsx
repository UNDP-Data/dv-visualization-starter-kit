import { useState } from 'react';
import { format } from 'd3-format';
import maxBy from 'lodash.maxby';
import orderBy from 'lodash.orderby';
import { Delaunay } from 'd3-delaunay';
import { scaleLinear, scaleSqrt } from 'd3-scale';
import minBy from 'lodash.minby';
import UNDPColorModule from '@undp-data/undp-viz-colors';
import { ScatterPlotDataType, ReferenceDataType } from '../../../Types';
import { Tooltip } from '../../Elements/Tooltip';

interface Props {
  data: ScatterPlotDataType[];
  width: number;
  height: number;
  showLabels: boolean;
  colors: string[];
  colorDomain: string[];
  pointRadius: number;
  xAxisTitle: string;
  yAxisTitle: string;
  leftMargin: number;
  rightMargin: number;
  topMargin: number;
  bottomMargin: number;
  tooltip?: (_d: any) => JSX.Element;
  onSeriesMouseOver?: (_d: any) => void;
  refXValue?: ReferenceDataType;
  refYValue?: ReferenceDataType;
  highlightAreaSettings: [
    number | null,
    number | null,
    number | null,
    number | null,
  ];
  selectedColor?: string;
  highlightedDataPoints: (string | number)[];
}

export function Graph(props: Props) {
  const {
    data,
    width,
    height,
    showLabels,
    colors,
    colorDomain,
    pointRadius,
    xAxisTitle,
    yAxisTitle,
    leftMargin,
    rightMargin,
    topMargin,
    bottomMargin,
    tooltip,
    onSeriesMouseOver,
    refXValue,
    refYValue,
    highlightAreaSettings,
    selectedColor,
    highlightedDataPoints,
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
  const graphWidth = width - margin.left - margin.right;
  const graphHeight = height - margin.top - margin.bottom;
  const radiusScale =
    data.filter(d => d.radius === undefined).length !== data.length
      ? scaleSqrt()
          .domain([0, maxBy(data, 'radius')?.radius as number])
          .range([0.25, pointRadius])
          .nice()
      : undefined;
  const dataOrdered =
    data.filter(d => d.radius !== undefined).length === 0
      ? data
      : orderBy(
          data.filter(d => d.radius !== undefined),
          'radius',
          'desc',
        );

  const x = scaleLinear()
    .domain([
      (minBy(data, 'x')?.x as number) > 0 ? 0 : (minBy(data, 'x')?.x as number),
      (maxBy(data, 'x')?.x as number) > 0 ? (maxBy(data, 'x')?.x as number) : 0,
    ])
    .range([0, graphWidth])
    .nice();
  const y = scaleLinear()
    .domain([
      (minBy(data, 'y')?.y as number) > 0 ? 0 : (minBy(data, 'y')?.y as number),
      (maxBy(data, 'y')?.y as number) > 0 ? (maxBy(data, 'y')?.y as number) : 0,
    ])
    .range([graphHeight, 0])
    .nice();
  const xTicks = x.ticks(5);
  const yTicks = y.ticks(5);
  const voronoiDiagram = Delaunay.from(
    data,
    d => x(d.x as number),
    d => y(d.y as number),
  ).voronoi([
    0,
    0,
    graphWidth < 0 ? 0 : graphWidth,
    graphHeight < 0 ? 0 : graphHeight,
  ]);
  return (
    <>
      <svg
        width={`${width}px`}
        height={`${height}px`}
        viewBox={`0 0 ${width} ${height}`}
      >
        <g transform={`translate(${margin.left},${margin.top})`}>
          {highlightAreaSettings.filter(d => d === null).length === 4 ? null : (
            <g>
              <rect
                style={{
                  fill: 'var(--gray-300)',
                }}
                x={
                  highlightAreaSettings[0]
                    ? x(highlightAreaSettings[0] as number)
                    : 0
                }
                width={
                  highlightAreaSettings[1]
                    ? x(highlightAreaSettings[1] as number) -
                      (highlightAreaSettings[0]
                        ? x(highlightAreaSettings[0] as number)
                        : 0)
                    : graphWidth -
                      (highlightAreaSettings[0]
                        ? x(highlightAreaSettings[0] as number)
                        : 0)
                }
                y={
                  highlightAreaSettings[3]
                    ? y(highlightAreaSettings[3] as number)
                    : 0
                }
                height={
                  highlightAreaSettings[2] !== null
                    ? y(highlightAreaSettings[2] as number) -
                      (highlightAreaSettings[3]
                        ? y(highlightAreaSettings[3] as number)
                        : 0)
                    : graphHeight -
                      (highlightAreaSettings[3]
                        ? graphHeight - y(highlightAreaSettings[3] as number)
                        : 0)
                }
              />
            </g>
          )}
          <g>
            {yTicks.map((d, i) => (
              <g key={i} opacity={d === 0 ? 0 : 1}>
                <line
                  x1={0}
                  x2={graphWidth}
                  y1={y(d)}
                  y2={y(d)}
                  style={{
                    stroke: 'var(--gray-500)',
                  }}
                  strokeWidth={1}
                  strokeDasharray='4,8'
                />
                <text
                  x={0}
                  y={y(d)}
                  style={{
                    fill: 'var(--gray-700)',
                    fontFamily: 'var(--fontFamily)',
                  }}
                  textAnchor='end'
                  fontSize={12}
                  dy={4}
                  dx={-3}
                >
                  {Math.abs(d) < 1 ? d : format('~s')(d).replace('G', 'B')}
                </text>
              </g>
            ))}
            <line
              x1={0}
              x2={graphWidth}
              y1={y(0)}
              y2={y(0)}
              style={{
                stroke: 'var(--gray-700)',
              }}
              strokeWidth={1}
            />
            <text
              x={0}
              y={y(0)}
              style={{
                fill: 'var(--gray-700)',
                fontFamily: 'var(--fontFamily)',
              }}
              textAnchor='end'
              fontSize={12}
              dy={4}
              dx={-3}
            >
              0
            </text>
            {yAxisTitle ? (
              <text
                transform={`translate(-30, ${graphHeight / 2}) rotate(-90)`}
                style={{
                  fill: 'var(--gray-700)',
                  fontWeight: 'bold',
                  fontFamily: 'var(--fontFamily)',
                }}
                textAnchor='middle'
                fontSize={12}
              >
                {yAxisTitle}
              </text>
            ) : null}
          </g>
          <g>
            {xTicks.map((d, i) => (
              <g key={i} opacity={d === 0 ? 0 : 1}>
                <line
                  y1={0}
                  y2={graphHeight}
                  x1={x(d)}
                  x2={x(d)}
                  style={{
                    stroke: 'var(--gray-500)',
                  }}
                  strokeWidth={1}
                  strokeDasharray='4,8'
                />
                <text
                  x={x(d)}
                  y={graphHeight}
                  style={{
                    fill: 'var(--gray-700)',
                    fontFamily: 'var(--fontFamily)',
                  }}
                  textAnchor='middle'
                  fontSize={12}
                  dy={12}
                >
                  {Math.abs(d) < 1 ? d : format('~s')(d).replace('G', 'B')}
                </text>
              </g>
            ))}
            <line
              y1={0}
              y2={graphHeight}
              x1={x(0)}
              x2={x(0)}
              style={{
                stroke: 'var(--gray-700)',
              }}
              strokeWidth={1}
            />
            <text
              x={x(0)}
              y={graphHeight}
              style={{
                fill: 'var(--gray-700)',
                fontFamily: 'var(--fontFamily)',
              }}
              textAnchor='middle'
              fontSize={12}
              dy={15}
            >
              {0}
            </text>
            {xAxisTitle ? (
              <text
                transform={`translate(${graphWidth / 2}, ${graphHeight})`}
                style={{
                  fill: 'var(--gray-700)',
                  fontWeight: 'bold',
                  fontFamily: 'var(--fontFamily)',
                }}
                textAnchor='middle'
                fontSize={12}
                dy={30}
              >
                {xAxisTitle}
              </text>
            ) : null}
          </g>
          {dataOrdered.map((d, i) => {
            return (
              <g key={i}>
                <g
                  opacity={
                    selectedColor
                      ? d.color
                        ? colors[colorDomain.indexOf(`${d.color}`)] ===
                          selectedColor
                          ? 1
                          : 0.3
                        : 0.3
                      : mouseOverData
                      ? mouseOverData.label === d.label
                        ? 1
                        : 0.3
                      : highlightedDataPoints.length !== 0
                      ? highlightedDataPoints.indexOf(d.label) !== -1
                        ? 1
                        : 0.3
                      : 1
                  }
                  transform={`translate(${x(d.x)},${y(d.y)})`}
                >
                  <circle
                    cx={0}
                    cy={0}
                    r={!radiusScale ? pointRadius : radiusScale(d.radius || 0)}
                    style={{
                      fill:
                        data.filter(el => el.color).length === 0
                          ? colors[0]
                          : !d.color
                          ? UNDPColorModule.graphGray
                          : colors[colorDomain.indexOf(`${d.color}`)],
                      stroke:
                        data.filter(el => el.color).length === 0
                          ? colors[0]
                          : !d.color
                          ? UNDPColorModule.graphGray
                          : colors[colorDomain.indexOf(`${d.color}`)],
                    }}
                    fillOpacity={0.6}
                  />
                  {showLabels ? (
                    <text
                      fontSize={10}
                      style={{
                        fill:
                          data.filter(el => el.color).length === 0
                            ? colors[0]
                            : !d.color
                            ? UNDPColorModule.graphGray
                            : colors[colorDomain.indexOf(`${d.color}`)],
                        fontFamily: 'var(--fontFamily)',
                      }}
                      y={0}
                      x={
                        !radiusScale ? pointRadius : radiusScale(d.radius || 0)
                      }
                      dy={4}
                      dx={3}
                    >
                      {d.label}
                    </text>
                  ) : highlightedDataPoints.length !== 0 ? (
                    highlightedDataPoints.indexOf(d.label) !== -1 ? (
                      <text
                        fontSize={10}
                        style={{
                          fill:
                            data.filter(el => el.color).length === 0
                              ? colors[0]
                              : !d.color
                              ? UNDPColorModule.graphGray
                              : colors[colorDomain.indexOf(`${d.color}`)],
                          fontFamily: 'var(--fontFamily)',
                        }}
                        y={0}
                        x={
                          !radiusScale
                            ? pointRadius
                            : radiusScale(d.radius || 0)
                        }
                        dy={4}
                        dx={3}
                      >
                        {d.label}
                      </text>
                    ) : null
                  ) : null}
                </g>
                <path
                  d={voronoiDiagram.renderCell(i)}
                  fill='#fff'
                  opacity={0}
                  onMouseEnter={event => {
                    setMouseOverData(d);
                    setEventY(event.clientY);
                    setEventX(event.clientX);
                    if (onSeriesMouseOver) {
                      onSeriesMouseOver(d);
                    }
                  }}
                  onMouseMove={event => {
                    setMouseOverData(d);
                    setEventY(event.clientY);
                    setEventX(event.clientX);
                  }}
                  onMouseLeave={() => {
                    setMouseOverData(undefined);
                    setEventX(undefined);
                    setEventY(undefined);
                    if (onSeriesMouseOver) {
                      onSeriesMouseOver(undefined);
                    }
                  }}
                />
              </g>
            );
          })}
          {refXValue ? (
            <g>
              <line
                style={{
                  stroke: 'var(--gray-700)',
                  strokeWidth: 1.5,
                }}
                strokeDasharray='4,4'
                x1={x(refXValue.value as number)}
                x2={x(refXValue.value as number)}
                y1={0}
                y2={graphHeight}
              />
              <text
                x={x(refXValue.value as number)}
                fontWeight='bold'
                y={0}
                style={{
                  fill: 'var(--gray-700)',
                  fontFamily: 'var(--fontFamily)',
                  textAnchor:
                    x(refXValue.value as number) > graphWidth * 0.75
                      ? 'end'
                      : 'start',
                }}
                fontSize={12}
                dy={12.5}
                dx={x(refXValue.value as number) > graphWidth * 0.75 ? -5 : 5}
              >
                {refXValue.text}
              </text>
            </g>
          ) : null}
          {refYValue ? (
            <g>
              <line
                style={{
                  stroke: 'var(--gray-700)',
                  strokeWidth: 1.5,
                }}
                strokeDasharray='4,4'
                y1={y(refYValue.value as number)}
                y2={y(refYValue.value as number)}
                x1={0}
                x2={graphWidth}
              />
              <text
                x={graphWidth}
                fontWeight='bold'
                y={y(refYValue.value as number)}
                style={{
                  fill: 'var(--gray-700)',
                  fontFamily: 'var(--fontFamily)',
                  textAnchor: 'end',
                }}
                fontSize={12}
                dy={-5}
              >
                {refYValue.text}
              </text>
            </g>
          ) : null}
        </g>
      </svg>
      {mouseOverData && tooltip && eventX && eventY ? (
        <Tooltip body={tooltip(mouseOverData)} xPos={eventX} yPos={eventY} />
      ) : null}
    </>
  );
}
