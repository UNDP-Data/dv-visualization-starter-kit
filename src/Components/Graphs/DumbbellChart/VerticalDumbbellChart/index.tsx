import UNDPColorModule from '@undp-data/undp-viz-colors';
import { useState, useRef, useEffect } from 'react';
import { Graph } from './Graph';
import { DumbbellChartDataType } from '../../../../Types';
import { GraphHeader } from '../../../Elements/GraphHeader';
import { GraphFooter } from '../../../Elements/GraphFooter';
import { ColorLegend } from '../../../Elements/ColorLegend';
import { checkIfNullOrUndefined } from '../../../../Utils/checkIfNullOrUndefined';

interface Props {
  data: DumbbellChartDataType[];
  colors?: string[];
  graphTitle?: string;
  graphDescription?: string;
  footNote?: string;
  sourceLink?: string;
  width?: number;
  height?: number;
  source?: string;
  barPadding?: number;
  showTicks?: boolean;
  leftMargin?: number;
  rightMargin?: number;
  topMargin?: number;
  bottomMargin?: number;
  truncateBy?: number;
  colorDomain: string[];
  colorLegendTitle?: string;
  backgroundColor?: string | boolean;
  padding?: string;
  dotRadius?: number;
  relativeHeight?: number;
  showLabel?: boolean;
  tooltip?: (_d: any) => JSX.Element;
  onSeriesMouseOver?: (_d: any) => void;
  graphID?: string;
}

export function VerticalDumbbellChart(props: Props) {
  const {
    data,
    graphTitle,
    colors,
    source,
    graphDescription,
    sourceLink,
    barPadding,
    showTicks,
    leftMargin,
    rightMargin,
    topMargin,
    bottomMargin,
    truncateBy,
    height,
    width,
    footNote,
    colorDomain,
    colorLegendTitle,
    padding,
    backgroundColor,
    dotRadius,
    tooltip,
    showLabel,
    relativeHeight,
    onSeriesMouseOver,
    graphID,
  } = props;

  const [svgWidth, setSvgWidth] = useState(0);
  const [svgHeight, setSvgHeight] = useState(0);

  const graphDiv = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (graphDiv.current) {
      setSvgHeight(graphDiv.current.clientHeight || 480);
      setSvgWidth(graphDiv.current.clientWidth || 620);
    }
  }, [graphDiv?.current, width]);

  const dotColors = colors || UNDPColorModule.categoricalColors.colors;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: 'fit-content',
        flexGrow: width ? 0 : 1,
        marginLeft: 'auto',
        marginRight: 'auto',
        padding: backgroundColor
          ? padding || 'var(--spacing-05)'
          : padding || 0,
        backgroundColor: !backgroundColor
          ? 'transparent'
          : backgroundColor === true
          ? 'var(--gray-200)'
          : backgroundColor,
      }}
      id={graphID}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          gap: 'var(--spacing-05)',
          flexGrow: 1,
          justifyContent: 'space-between',
        }}
      >
        {graphTitle || graphDescription ? (
          <GraphHeader
            graphTitle={graphTitle}
            graphDescription={graphDescription}
            width={width}
          />
        ) : null}
        <div
          style={{
            flexGrow: 1,
            flexDirection: 'column',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 'var(--spacing-04)',
            width: '100%',
          }}
        >
          <ColorLegend
            colorDomain={colorDomain}
            colors={dotColors}
            colorLegendTitle={colorLegendTitle}
          />
          <div
            style={{
              flexGrow: 1,
              width: '100%',
              lineHeight: 0,
              display: 'flex',
              justifyContent: 'center',
            }}
            ref={graphDiv}
          >
            {(width || svgWidth) && (height || svgHeight) ? (
              <Graph
                data={data}
                dotColors={dotColors}
                width={width || svgWidth}
                height={
                  height ||
                  (relativeHeight
                    ? (width || svgWidth) * relativeHeight
                    : svgHeight)
                }
                dotRadius={!dotRadius ? 3 : dotRadius}
                barPadding={
                  checkIfNullOrUndefined(barPadding)
                    ? 0.25
                    : (barPadding as number)
                }
                showTicks={
                  checkIfNullOrUndefined(showTicks)
                    ? true
                    : (showTicks as boolean)
                }
                leftMargin={
                  checkIfNullOrUndefined(leftMargin)
                    ? 20
                    : (leftMargin as number)
                }
                rightMargin={
                  checkIfNullOrUndefined(rightMargin)
                    ? 20
                    : (rightMargin as number)
                }
                topMargin={
                  checkIfNullOrUndefined(topMargin) ? 20 : (topMargin as number)
                }
                bottomMargin={
                  checkIfNullOrUndefined(bottomMargin)
                    ? 25
                    : (bottomMargin as number)
                }
                truncateBy={
                  checkIfNullOrUndefined(truncateBy)
                    ? 999
                    : (truncateBy as number)
                }
                showLabel={
                  checkIfNullOrUndefined(showLabel)
                    ? true
                    : (showLabel as boolean)
                }
                tooltip={tooltip}
                onSeriesMouseOver={onSeriesMouseOver}
              />
            ) : null}
          </div>
        </div>
        {source || footNote ? (
          <GraphFooter
            source={source}
            sourceLink={sourceLink}
            footNote={footNote}
            width={width}
          />
        ) : null}
      </div>
    </div>
  );
}
