import UNDPColorModule from '@undp-data/undp-viz-colors';
import { useState, useRef, useEffect } from 'react';
import { Graph } from './Graph';
import { checkIfNullOrUndefined } from '../../../../../Utils/checkIfNullOrUndefined';
import {
  ReferenceDataType,
  VerticalGroupedBarGraphDataType,
} from '../../../../../Types';
import { GraphHeader } from '../../../../Elements/GraphHeader';
import { GraphFooter } from '../../../../Elements/GraphFooter';
import { ColorLegend } from '../../../../Elements/ColorLegend';

interface Props {
  data: VerticalGroupedBarGraphDataType[];
  colors?: string[];
  graphTitle?: string;
  width?: number;
  height?: number;
  suffix?: string;
  prefix?: string;
  source?: string;
  graphDescription?: string;
  footNote?: string;
  sourceLink?: string;
  barPadding?: number;
  showBarLabel?: boolean;
  showBarValue?: boolean;
  showYTicks?: boolean;
  colorDomain: string[];
  colorLegendTitle?: string;
  truncateBy?: number;
  backgroundColor?: string | boolean;
  padding?: string;
  leftMargin?: number;
  rightMargin?: number;
  topMargin?: number;
  bottomMargin?: number;
  relativeHeight?: number;
  tooltip?: (_d: any) => JSX.Element;
  onSeriesMouseOver?: (_d: any) => void;
  refValues?: ReferenceDataType[];
  graphID?: string;
}

export function VerticalGroupedBarGraph(props: Props) {
  const {
    data,
    graphTitle,
    colors,
    suffix,
    source,
    prefix,
    graphDescription,
    sourceLink,
    barPadding,
    showBarLabel,
    showBarValue,
    showYTicks,
    height,
    width,
    footNote,
    colorDomain,
    colorLegendTitle,
    truncateBy,
    padding,
    backgroundColor,
    leftMargin,
    rightMargin,
    topMargin,
    bottomMargin,
    relativeHeight,
    tooltip,
    onSeriesMouseOver,
    refValues,
    graphID,
  } = props;

  const barColors = colors || UNDPColorModule.categoricalColors.colors;

  const [svgWidth, setSvgWidth] = useState(0);
  const [svgHeight, setSvgHeight] = useState(0);

  const graphDiv = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (graphDiv.current) {
      setSvgHeight(graphDiv.current.clientHeight || 480);
      setSvgWidth(graphDiv.current.clientWidth || 620);
    }
  }, [graphDiv?.current, width]);
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
            gap: 'var(--spacing-04)',
            width: '100%',
          }}
        >
          <ColorLegend
            colorDomain={colorDomain}
            colors={barColors}
            colorLegendTitle={colorLegendTitle}
          />
          <div
            style={{ flexGrow: 1, width: '100%', lineHeight: 0 }}
            ref={graphDiv}
          >
            {(width || svgWidth) && (height || svgHeight) ? (
              <Graph
                data={data}
                barColors={barColors}
                width={width || svgWidth}
                height={
                  height ||
                  (relativeHeight
                    ? (width || svgWidth) * relativeHeight
                    : svgHeight)
                }
                suffix={suffix || ''}
                prefix={prefix || ''}
                barPadding={
                  checkIfNullOrUndefined(barPadding)
                    ? 0.25
                    : (barPadding as number)
                }
                showBarLabel={
                  checkIfNullOrUndefined(showBarLabel)
                    ? true
                    : (showBarLabel as boolean)
                }
                showBarValue={
                  checkIfNullOrUndefined(showBarValue)
                    ? true
                    : (showBarValue as boolean)
                }
                showYTicks={
                  checkIfNullOrUndefined(showYTicks)
                    ? true
                    : (showYTicks as boolean)
                }
                truncateBy={
                  checkIfNullOrUndefined(truncateBy)
                    ? 999
                    : (truncateBy as number)
                }
                leftMargin={
                  checkIfNullOrUndefined(leftMargin)
                    ? 50
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
                tooltip={tooltip}
                onSeriesMouseOver={onSeriesMouseOver}
                refValues={refValues}
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
