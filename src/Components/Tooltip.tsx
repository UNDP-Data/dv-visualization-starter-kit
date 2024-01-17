import styled from 'styled-components';

interface Props {
  heading?: JSX.Element;
  body: JSX.Element;
  xPos: number;
  yPos: number;
}

interface TooltipElProps {
  x: number;
  y: number;
  verticalAlignment: string;
  horizontalAlignment: string;
}

const TooltipEl = styled.div<TooltipElProps>`
  display: block;
  position: fixed;
  z-index: 8;
  background-color: var(--gray-200);
  border: 1px solid var(--gray-300);
  word-wrap: break-word;
  top: ${props =>
    props.verticalAlignment === 'bottom' ? props.y - 40 : props.y + 40}px;
  left: ${props =>
    props.horizontalAlignment === 'left' ? props.x - 20 : props.x + 20}px;
  max-width: 24rem;
  transform: ${props =>
    `translate(${props.horizontalAlignment === 'left' ? '-100%' : '0%'},${
      props.verticalAlignment === 'top' ? '-100%' : '0%'
    })`};
`;

export function Tooltip(props: Props) {
  const { heading, body, xPos, yPos } = props;
  return (
    <TooltipEl
      x={xPos}
      y={yPos}
      verticalAlignment={yPos > window.innerHeight / 2 ? 'top' : 'bottom'}
      horizontalAlignment={xPos > window.innerWidth / 2 ? 'left' : 'right'}
    >
      {heading ? (
        <>
          <div style={{ padding: '0 var(--spacing-05)' }}>{heading}</div>
          <hr className='undp-style margin-top-00 margin-bottom-00' />
        </>
      ) : null}
      <div style={{ padding: '0 var(--spacing-05)' }}>{body}</div>
    </TooltipEl>
  );
}
