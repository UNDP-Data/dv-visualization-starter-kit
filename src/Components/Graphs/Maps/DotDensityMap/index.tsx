import UNDPColorModule from '@undp-data/undp-viz-colors';
import { useState, useRef, useEffect } from 'react';
import uniqBy from 'lodash.uniqby';
import { Graph } from './Graph';
import { GraphFooter } from '../../../Elements/GraphFooter';
import { GraphHeader } from '../../../Elements/GraphHeader';
import { checkIfNullOrUndefined } from '../../../../Utils/checkIfNullOrUndefined';
import { DotDensityMapDataType } from '../../../../Types';

interface Props {
  graphTitle?: string;
  mapData: any;
  graphDescription?: string;
  footNote?: string;
  sourceLink?: string;
  width?: number;
  height?: number;
  pointRadius?: number;
  source?: string;
  colors?: string | string[];
  colorDomain?: string[];
  colorLegendTitle?: string;
  data: DotDensityMapDataType[];
  scale?: number;
  centerPoint?: [number, number];
  backgroundColor?: string | boolean;
  mapBorderWidth?: number;
  mapNoDataColor?: string;
  mapBorderColor?: string;
  padding?: string;
  showLabel?: boolean;
  relativeHeight?: number;
  isWorldMap?: boolean;
  tooltip?: (_d: any) => JSX.Element;
  onSeriesMouseOver?: (_d: any) => void;
  showColorScale?: boolean;
  zoomScaleExtend?: [number, number];
  zoomTranslateExtend?: [[number, number], [number, number]];
  graphID?: string;
}

export function DotDensityMap(props: Props) {
  const {
    data,
    mapData,
    graphTitle,
    colors,
    source,
    graphDescription,
    sourceLink,
    height,
    width,
    footNote,
    colorLegendTitle,
    colorDomain,
    pointRadius,
    scale,
    centerPoint,
    padding,
    mapBorderWidth,
    mapNoDataColor,
    backgroundColor,
    showLabel,
    mapBorderColor,
    tooltip,
    relativeHeight,
    onSeriesMouseOver,
    isWorldMap,
    showColorScale,
    zoomScaleExtend,
    zoomTranslateExtend,
    graphID,
  } = props;

  const [svgWidth, setSvgWidth] = useState(0);
  const [svgHeight, setSvgHeight] = useState(0);

  const graphDiv = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (graphDiv.current) {
      setSvgHeight(graphDiv.current.clientHeight || 570);
      setSvgWidth(graphDiv.current.clientWidth || 760);
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
            lineHeight: 0,
          }}
          ref={graphDiv}
        >
          {(width || svgWidth) && (height || svgHeight) ? (
            <Graph
              data={data}
              mapData={mapData}
              colorDomain={
                data.filter(el => el.color).length === 0
                  ? []
                  : colorDomain ||
                    (uniqBy(
                      data.filter(
                        el => el.color !== undefined || el.color !== null,
                      ),
                      'color',
                    ).map(d => `${d.color}`) as string[])
              }
              width={width || svgWidth}
              height={
                height ||
                (relativeHeight
                  ? (width || svgWidth) * relativeHeight
                  : svgHeight)
              }
              scale={scale || 190}
              centerPoint={centerPoint || [10, 10]}
              colors={
                data.filter(el => el.color).length === 0
                  ? colors
                    ? [colors as string]
                    : ['var(--blue-600)']
                  : (colors as string[] | undefined) ||
                    UNDPColorModule.categoricalColors.colors
              }
              colorLegendTitle={colorLegendTitle}
              pointRadius={
                checkIfNullOrUndefined(pointRadius)
                  ? 5
                  : (pointRadius as number)
              }
              mapBorderWidth={
                checkIfNullOrUndefined(mapBorderWidth)
                  ? 0.5
                  : (mapBorderWidth as number)
              }
              mapNoDataColor={mapNoDataColor || UNDPColorModule.graphNoData}
              mapBorderColor={mapBorderColor || 'var(--gray-500)'}
              tooltip={tooltip}
              onSeriesMouseOver={onSeriesMouseOver}
              showLabel={showLabel}
              isWorldMap={isWorldMap === undefined ? true : isWorldMap}
              showColorScale={
                showColorScale === undefined ? true : showColorScale
              }
              zoomScaleExtend={zoomScaleExtend}
              zoomTranslateExtend={zoomTranslateExtend}
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
