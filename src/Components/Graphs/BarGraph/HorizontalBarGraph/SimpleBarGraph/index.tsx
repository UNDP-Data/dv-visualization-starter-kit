import uniqBy from 'lodash.uniqby';
import UNDPColorModule from '@undp-data/undp-viz-colors';
import { useState, useRef, useEffect } from 'react';
import { Graph } from './Graph';
import { checkIfNullOrUndefined } from '../../../../../Utils/checkIfNullOrUndefined';
import {
  HorizontalBarGraphDataType,
  ReferenceDataType,
} from '../../../../../Types';
import { GraphFooter } from '../../../../Elements/GraphFooter';
import { GraphHeader } from '../../../../Elements/GraphHeader';
import { ColorLegendWithMouseOver } from '../../../../Elements/ColorLegendWithMouseOver';

interface Props {
  data: HorizontalBarGraphDataType[];
  colors?: string | string[];
  graphTitle?: string;
  graphDescription?: string;
  footNote?: string;
  sourceLink?: string;
  width?: number;
  height?: number;
  suffix?: string;
  prefix?: string;
  source?: string;
  barPadding?: number;
  showBarValue?: boolean;
  showXTicks?: boolean;
  leftMargin?: number;
  rightMargin?: number;
  truncateBy?: number;
  colorDomain?: string[];
  colorLegendTitle?: string;
  backgroundColor?: string | boolean;
  padding?: string;
  topMargin?: number;
  bottomMargin?: number;
  relativeHeight?: number;
  showBarLabel?: boolean;
  showColorScale?: boolean;
  tooltip?: (_d: any) => JSX.Element;
  onSeriesMouseOver?: (_d: any) => void;
  refValues?: ReferenceDataType[];
  graphID?: string;
}

export function HorizontalBarGraph(props: Props) {
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
    showBarValue,
    showXTicks,
    leftMargin,
    rightMargin,
    truncateBy,
    height,
    width,
    footNote,
    colorDomain,
    colorLegendTitle,
    padding,
    backgroundColor,
    topMargin,
    bottomMargin,
    showBarLabel,
    relativeHeight,
    tooltip,
    onSeriesMouseOver,
    refValues,
    showColorScale,
    graphID,
  } = props;

  const [svgWidth, setSvgWidth] = useState(0);
  const [svgHeight, setSvgHeight] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    undefined,
  );

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
        marginLeft: 'auto',
        marginRight: 'auto',
        flexGrow: width ? 0 : 1,
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
        {showColorScale !== false &&
        data.filter(el => el.color).length !== 0 ? (
          <ColorLegendWithMouseOver
            width={width}
            colorLegendTitle={colorLegendTitle}
            colors={
              (colors as string[] | undefined) ||
              UNDPColorModule.categoricalColors.colors
            }
            colorDomain={
              colorDomain ||
              (uniqBy(
                data.filter(el => el.color),
                'color',
              ).map(d => d.color) as string[])
            }
            setSelectedColor={setSelectedColor}
            showNAColor
          />
        ) : null}
        <div
          style={{
            flexGrow: 1,
            flexDirection: 'column',
            display: 'flex',
            justifyContent: 'center',
            lineHeight: 0,
          }}
          ref={graphDiv}
        >
          {(width || svgWidth) && (height || svgHeight) ? (
            <Graph
              data={data}
              barColor={
                data.filter(el => el.color).length === 0
                  ? colors
                    ? [colors as string]
                    : ['var(--blue-600)']
                  : (colors as string[] | undefined) ||
                    UNDPColorModule.categoricalColors.colors
              }
              colorDomain={
                data.filter(el => el.color).length === 0
                  ? []
                  : colorDomain ||
                    (uniqBy(
                      data.filter(el => el.color),
                      'color',
                    ).map(d => d.color) as string[])
              }
              width={width || svgWidth}
              selectedColor={selectedColor}
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
              showBarValue={
                checkIfNullOrUndefined(showBarValue)
                  ? true
                  : (showBarValue as boolean)
              }
              showXTicks={
                checkIfNullOrUndefined(showXTicks)
                  ? true
                  : (showXTicks as boolean)
              }
              leftMargin={
                checkIfNullOrUndefined(leftMargin)
                  ? 100
                  : (leftMargin as number)
              }
              rightMargin={
                checkIfNullOrUndefined(rightMargin)
                  ? 40
                  : (rightMargin as number)
              }
              topMargin={
                checkIfNullOrUndefined(topMargin) ? 25 : (topMargin as number)
              }
              bottomMargin={
                checkIfNullOrUndefined(bottomMargin)
                  ? 10
                  : (bottomMargin as number)
              }
              truncateBy={
                checkIfNullOrUndefined(truncateBy)
                  ? 999
                  : (truncateBy as number)
              }
              showBarLabel={
                checkIfNullOrUndefined(showBarLabel)
                  ? true
                  : (showBarLabel as boolean)
              }
              tooltip={tooltip}
              onSeriesMouseOver={onSeriesMouseOver}
              refValues={refValues}
            />
          ) : null}
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
