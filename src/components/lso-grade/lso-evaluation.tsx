import { useEffect, useState } from "react";
import { LSOEvaluationStep, LSOEvaluationSteps, LSOStep } from "../../services/evaluation-service";
import { Box, Chip, styled } from "@mui/material";
import { FlexBox } from "../flex-box";


const StyledEvaluation = styled(Box)(() => ({
  display: 'flex',
  margin: 0,
  flexDirection: 'row',
  flexWrap: 'wrap',
  width: '100%',
  justifyContent: 'space-start',
  gap: '10px',
  color: '#222'
}));

const StyledEvaluationStep = styled(Box)(() => ({
  flexGrow: 0,
  backgroundColor: '#cecece',
  borderRadius: '4px',
  padding: '0.5rem',
  transition: 'transform 1s ease-in-out, opacity 1s ease-in-out'
}));


const H4 = styled("h4")(({ theme }) => ({
  margin: 0
}));

function EvaluationStep({ step, state }: { step: LSOStep, state: LSOEvaluationStep }) {

  const [x, setX] = useState(50);
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    setTimeout(() => {
      setX(0);
      setOpacity(1);
    }, 100);

  }, [])

  const items = state.items.map((item: string, index: number) => {
    if (item.includes('(')) {
      return (<Chip key={index} label={item} size="small" color="primary" variant="outlined" />)
    }
    return (<Chip key={index} label={item} size="small" color="primary" />)
  });

  return (
    <StyledEvaluationStep style={{ transform: `translateX(${x}px)`, opacity: opacity }}>
      <H4>{step}</H4>
      <FlexBox style={{ gap: '0.5em' }} >
        {items}
      </FlexBox>
    </StyledEvaluationStep>
  )
}

export function EvaluationSteps({ evaluationSteps }: { evaluationSteps: LSOEvaluationSteps }) {

  const steps = Object.keys(evaluationSteps).map((stepID, index) => {

    const step = stepID as LSOStep;

    const state = evaluationSteps[step];

    return <EvaluationStep key={index} step={step} state={state} />

  });


  return (
    <StyledEvaluation>
      {steps}
    </StyledEvaluation>
  )

}
