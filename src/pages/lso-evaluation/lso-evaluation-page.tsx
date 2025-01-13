import { useContext, useEffect, useReducer, useState } from "react";
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
import { EvaluationSteps } from "../../components/lso-grade/lso-evaluation";
import { ActionMap } from "../../utils/types";

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
  }
  /*
  , {
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
    */
]




function LSOState({ stepIndex, evaluationSteps }: { stepIndex: number, evaluationSteps: LSOEvaluationSteps }) {

  const step = STEPS[stepIndex];

  const previousStep = stepIndex > 0 ? STEPS[stepIndex - 1] : null;

  const lsoState = previousStep ? previousStep.name : step.name;

  const steps = evaluationSteps[lsoState] ?? {
    position: { x: 0, y: 0 },
    items: []
  };


  const advices = steps.items.map((item: string, index: number) => {
    return (<li key={index}> {ITEM_INFO[item] ?? item} </li>);
  });

  const waveOff = (lsoState == 'AR' && (steps.items.includes('LO') || steps.items.includes('_LO_'))) ||
    ((lsoState == 'TL') && (steps.items.includes('LO') || steps.items.includes('_LO_')));

  return (
    <FlexBox className="lso-state">
      <div>
        <h5>Current Step</h5>
        <label>{step?.name} - {step?.label}</label>
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



enum StepsActionsTypes {
  Save = "SAVE",
  Next = "NEXT",
  SaveAndNext = "SAVE_AND_NEXT",
  Previous = "PREVIOUS",
  SaveAndPrevious = "SAVE_AND_PREVIOUS"
}

type StateSteps = { currentIndex: number, evaluationSteps: LSOEvaluationSteps }

type StatePayload = {
  [StepsActionsTypes.Save]: LSOEvaluationStep;
  [StepsActionsTypes.Next]: undefined;
  [StepsActionsTypes.SaveAndNext]: LSOEvaluationStep;
  [StepsActionsTypes.Previous]: undefined;
  [StepsActionsTypes.SaveAndPrevious]: LSOEvaluationStep;
};

type StepsActions = ActionMap<StatePayload>[keyof ActionMap<StatePayload>];

function stateReducer(steps: StateSteps, action: StepsActions): StateSteps {

  switch (action.type) {

    case "SAVE": {
      return {
        currentIndex: steps.currentIndex,
        evaluationSteps: {
          ...steps.evaluationSteps,
          [STEPS[steps.currentIndex].name]: action.payload
        }
      };
    }

    case "NEXT": {
      const currentIndex = Math.min(STEPS.length - 1, steps.currentIndex + 1);
      return {
        currentIndex,
        evaluationSteps: { ...steps.evaluationSteps }
      };
    }

    case "SAVE_AND_NEXT": {
      const currentIndex = Math.min(STEPS.length - 1, steps.currentIndex + 1);
      return {
        currentIndex,
        evaluationSteps: {
          ...steps.evaluationSteps,
          [STEPS[steps.currentIndex].name]: action.payload
        }
      };
    }

    case "PREVIOUS": {
      const currentIndex = Math.max(0, steps.currentIndex - 1);
      return {
        currentIndex,
        evaluationSteps: { ...steps.evaluationSteps }
      };
    }

    case "SAVE_AND_PREVIOUS": {
      const currentIndex = Math.max(0, steps.currentIndex - 1);
      return {
        currentIndex,
        evaluationSteps: {
          ...steps.evaluationSteps,
          [STEPS[steps.currentIndex].name]: action.payload
        }
      };
    }

    default: {
      return steps;
    }
  }

};

const initialStateSteps: StateSteps = {
  currentIndex: 0,
  evaluationSteps: {} as LSOEvaluationSteps
};

export function LsoEvaluationPage() {

  const initialModex = parseInt(useParams().modex ?? '0');

  const [helper, setHelper] = useState(false);

  const [isEvaluating, setEvaluating] = useState(false);

  const [modex, setModex] = useState(initialModex);

  // const [stepIndex, setStepIndex] = useDebounce(2000, 0)
  // const [stepIndex, setStepIndex] = useState(0)
  const [steps, dispatchSteps] = useReducer(stateReducer, initialStateSteps as StateSteps);
  // const [evaluationSteps, setEvaluationSteps] = useState<LSOEvaluationSteps>({} as LSOEvaluationSteps);

  const [time, setTime] = useState(0);

  const [wire, setWire] = useState<Wire | null>(null);

  const navigate = useNavigate();

  const evaluationService = useContext(EvaluationServiceProvider.Context);

  const [enableCountDown, setEnableCountDown] = useState(false);
  const [timer, setTimer] = useState(0);

  const timestamp = Date.now();


  const nextStep = () => {

    if (steps.currentIndex >= (STEPS.length - 1)) {
      setEvaluating(false);
    }

    /*
    dispatchSteps({
      type: StepsActionsTypes.Next
    });
    */
    dispatchSteps({
      type: StepsActionsTypes.SaveAndNext,
      payload: steps.evaluationSteps[STEPS[steps.currentIndex].name] ?? steps.evaluationSteps[STEPS[steps.currentIndex - 1].name]
    });

    // setStepIndex((oldStep: number) => Math.min(STEPS.length, oldStep + 1));
  };


  const previousStep = () => {
    dispatchSteps({
      type: StepsActionsTypes.Previous
    });
    // setStepIndex((oldStep: number) => Math.max(STEPS.length, oldStep - 1));
  };

  const stateChangedHandler = (evaluationStep: LSOEvaluationStep) => {

    /*
    setEvaluationSteps(oldValue => {
      const step = STEPS[stepIndex];
      return { ...oldValue, [step.name]: evaluationStep };
    });
    */

    dispatchSteps({
      type: StepsActionsTypes.Save,
      payload: evaluationStep
    });
    /*
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
    */



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
      timestamp,
      time,
      steps: steps.evaluationSteps,
      grade: analyseGrade(wire as Wire, steps.evaluationSteps),
      wire: wire as Wire
    });
    navigate('/dashboard/lso')
  };

  const stepIndex = steps.currentIndex;
  const evaluationSteps = steps.evaluationSteps;

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
            <>
              <FlexBox style={{ justifyContent: "space-between", gap: 10 }}>
                <Button variant="contained" onClick={previousStep}>Previous</Button>
                <Button variant="contained" onClick={nextStep}>Next</Button>
              </FlexBox>

              <LSOState stepIndex={stepIndex} evaluationSteps={evaluationSteps} />
            </>
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
