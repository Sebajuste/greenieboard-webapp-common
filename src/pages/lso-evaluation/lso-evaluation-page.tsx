import { useContext, useEffect, useState } from "react";
import { LSODS } from "../../components/LSODS/lsods";
import { StopWatch } from "../../components/stop-watch/stop-watch";
import CancelIcon from '@mui/icons-material/Cancel';
import SaveIcon from '@mui/icons-material/Save';

import { useDebounce } from "../../hooks/useDebounce";
import { useNavigate, useParams } from "react-router-dom";
import { EvaluationServiceProvider } from "../../App";
import { LSOEvaluationSteps, LSOAnalysePosition, LSOEvaluationStep, Wire, LSOStep, LSOGrade, analyseGrade } from "../../services/evaluation-service";

import "./lso-evaluation-page.scss";
import { ITEM_INFO } from "../../services/evaluation-iteminfo";
import { Grade } from "../../components/lso-grade/lso-grade";
import { Box, Button, Chip, LinearProgress, styled, Switch, TextField } from "@mui/material";
import { FlexBox } from "../../components/flex-box";
import { CountDown } from "../../components/stop-watch/count-down";

interface Step {
  name: LSOStep,
  label?: string,
  scale: number
}


const STEPS: Array<Step> = [
  {
    name: 'BC',
    label: 'Ball call',
    scale: 0.2
  }, {
    name: 'X',
    label: 'At start',
    scale: 0.25
  }, {
    name: 'IM',
    label: 'In the middle',
    scale: 0.5
  }, {
    name: 'IC',
    label: 'In close',
    scale: 0.7
  }, {
    name: 'AR',
    label: 'At ramp',
    scale: 1.6
  }, {
    name: 'TL',
    label: 'To Land',
    scale: 4.0
  }, {
    name: 'IW',
    label: 'In Wires',
    scale: 4.0
  }
]


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
    <div className="evaluation-step" style={{ transform: `translateX(${x}px)`, opacity: opacity }}>
      <h4>{step}</h4>
      <FlexBox style={{ gap: '0.5em' }} >
        {items}
      </FlexBox>
    </div>
  )
}

function EvaluationSteps({ evaluationSteps }: { evaluationSteps: LSOEvaluationSteps }) {

  const steps = Object.keys(evaluationSteps).map((stepID, index) => {

    const step = stepID as LSOStep;

    const state = evaluationSteps[step];

    return <EvaluationStep key={index} step={step} state={state} />

  });


  return (
    <div className="evaluation-steps">
      {steps}
    </div>
  )

}


function LSOState({ stepIndex, evaluationSteps }: { stepIndex: number, evaluationSteps: LSOEvaluationSteps }) {

  const step = STEPS[stepIndex];

  const previousStep = stepIndex > 0 ? STEPS[stepIndex - 1] : null;

  const lsoState = previousStep ? previousStep.name : step.name;

  const steps = evaluationSteps[lsoState];


  const advices = steps.items.map((item: string, index: number) => {
    return (<li key={index}> {ITEM_INFO[item] ?? item} </li>);
  });

  const waveOff = (lsoState == 'AR' && (steps.items.includes('P') || steps.items.includes('_P_'))) ||
    ((lsoState == 'TL') && (steps.items.includes('P') || steps.items.includes('_P_')));

  return (
    <FlexBox className="lso-state">
      <div>
        <h5>Current Step</h5>
        <label>{step?.name} - {step.label}</label>
      </div>
      <ul className="lso-advises">
        {waveOff ? 'Wave Off ! Wave Off !' : advices}
      </ul>
    </FlexBox>
  );

}


// styled component
const StyledFlexBox = styled(FlexBox)(({ theme }) => ({
  justifyContent: "space-between",
  alignItems: "center",
  flexWrap: "wrap",
  marginBottom: 20,
  [theme.breakpoints.down(500)]: {
    width: "100%",
    "& .MuiInputBase-root": { maxWidth: "100%" },
    "& .MuiButton-root": {
      width: "100%",
      marginTop: 15,
    },
  },
}));


export function LsoEvaluationPage() {

  const initialModex = parseInt(useParams().modex ?? '0');

  const [helper, setHelper] = useState(false);

  const [isEvaluating, setEvaluating] = useState(false);

  const [modex, setModex] = useState(initialModex);

  const [stepIndex, setStepIndex] = useDebounce(2000, 0)

  const [evaluationSteps, setEvaluationSteps] = useState<LSOEvaluationSteps>({} as LSOEvaluationSteps);

  const [time, setTime] = useState(0);

  const [wire, setWire] = useState<Wire | null>(null);

  const navigate = useNavigate();

  const evaluationService = useContext(EvaluationServiceProvider.Context);

  const [enableCountDown, setEnableCountDown] = useState(false);
  const [timer, setTimer] = useState(0);


  const stateChangedHandler = (evaluationStep: LSOEvaluationStep) => {

    setEvaluationSteps(oldValue => {
      const step = STEPS[stepIndex];
      return { ...oldValue, [step.name]: evaluationStep };
    })

    setStepIndex((oldValue: number) => {
      const newValue = (oldValue + 1);
      setEnableCountDown(false);
      setTimer(0);
      if (newValue >= STEPS.length) {
        setEvaluating(false);
        return oldValue;
      }
      return newValue;
    });



  }

  const onPositionChangedHandler = (position: { x: number, y: number }) => {

    if (!isEvaluating && time > 0) return;

    setEvaluating(true);
    setEnableCountDown(true);

    const analyseStep = LSOAnalysePosition(position);

    stateChangedHandler(analyseStep);

  };

  const saveHandler = () => {
    evaluationService.addEvaluation({
      modex,
      time,
      steps: evaluationSteps,
      grade: analyseGrade(wire as Wire, evaluationSteps),
      wire: wire as Wire
    });
    navigate('/dashboard/lso')
  };


  return (
    <div className="lso-evaluation-page">
      <div className="lso-evaluation-content">
        <h3 style={{ textAlign: "center" }}>LSO Evaluation</h3>
        <FlexBox style={{ justifyContent: "space-between", paddingLeft: 10, marginBottom: 20 }}>

          <TextField
            type="number"
            label="Modex"
            id="outlined-size-small"
            size="small"
            value={modex} onChange={(e: any) => setModex(e.target.value)}
          />

          <FlexBox style={{ alignItems: "center" }}>
            <label style={{ display: "block", fontWeight: 600 }}>
              Help
            </label>
            <Switch value={helper} onChange={(e: any) => setHelper(e.target.checked)} />
          </FlexBox>
        </FlexBox>

        <div className="lso-screen">
          <LSODS onPositionChanged={onPositionChangedHandler} planeScale={STEPS[stepIndex]?.scale ?? 1.0} helper={helper} />
          <div className="lso-stop-watch">
            <StopWatch active={isEvaluating} onStopped={setTime} />
          </div>
          { /*
          <CountDown active={enableCountDown} countDown={2000} onProgress={setTimer} onStopped={() => setEnableCountDown(false)} />
          <LinearProgress variant="determinate" value={(timer / 2000) * 100} />
          */ }
        </div>

        <div className="lso-evaluation-infos">

          {isEvaluating ? (
            <LSOState stepIndex={stepIndex} evaluationSteps={evaluationSteps} />
          ) : null}

          <EvaluationSteps evaluationSteps={evaluationSteps} />

          {!isEvaluating && wire != null ? <Grade grade={analyseGrade(wire, evaluationSteps)} /> : null}

          {!isEvaluating && Object.keys(evaluationSteps).length > 0 ? (
            <FlexBox style={{ justifyContent: "space-between", flexWrap: 'wrap', gap: 10 }}>
              <Button variant="outlined" onClick={() => setWire('#1')}>#1</Button>
              <Button variant="outlined" color="success" onClick={() => setWire('#2')}>#2</Button>
              <Button variant="outlined" color="success" onClick={() => setWire('#3')}>#3</Button>
              <Button variant="outlined" color="success" onClick={() => setWire('#4')}>#4</Button>
              <Button variant="outlined" onClick={() => setWire('B')}>Bolter</Button>
              <Button variant="outlined" color="error" onClick={() => setWire('WO')}>Wave Off</Button>
            </FlexBox>
          ) : null}

          {wire != null ? (
            <StyledFlexBox style={{ textAlign: "center", marginTop: 10 }}>
              <Button variant="contained" onClick={saveHandler} startIcon={<SaveIcon />}>Save</Button>

            </StyledFlexBox>
          ) : null}

          <StyledFlexBox style={{ textAlign: "center", marginTop: 10 }}>
            <Button variant="contained" color="secondary" onClick={() => navigate('/dashboard/lso')} startIcon={<CancelIcon />} >Cancel</Button>
          </StyledFlexBox>

        </div>

      </div>

    </div>
  );

}
