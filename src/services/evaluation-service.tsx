import _ from "lodash";


export type LSOStep = 'BC' | 'X' | 'IM' | 'IC' | 'AR' | 'TL' | 'IW';

export type LSOGrade = '_OK_' | 'OK' | '(OK)' | '--' | 'C' | 'B' | '--B' | 'WO';

export type Wire = '#1' | '#2' | '#3' | '#4' | 'B' | 'WO';

export type LSOEvaluationItem = string;

export interface LSOEvaluationStep {
  position: { x: number, y: number },
  items: Array<LSOEvaluationItem>
}

export type LSOEvaluationSteps = { [step in LSOStep]: LSOEvaluationStep };

export interface LSOEvaluation {
  modex: string,
  time: number,
  grade: LSOGrade,
  wire: Wire,
  steps: LSOEvaluationSteps
}

export function LSOAnalysePosition({ x, y }: any): LSOEvaluationStep {

  const items = [];

  if (x < 0.38) {
    items.push('_LUR_')
  } else if (x < 0.425) {
    items.push('LUR')
  } else if (x <= 0.46) {
    items.push('(LUR)')
  }

  if (x > 0.61) {
    items.push('_LUL_')
  } else if (x > 0.57) {
    items.push('LUL')
  } else if (x > 0.535) {
    items.push('(LUL)')
  }

  if (y < 0.40) {
    items.push('_H_');
  } else if (y < 0.43) {
    items.push('H');
  } else if (y < 0.46) {
    items.push('(H)');
  }

  if (y > 0.60) {
    items.push('_P_');
  } else if (y > 0.565) {
    items.push('P');
  } else if (y > 0.53) {
    items.push('(P)');
  }

  return {
    position: { x, y },
    items: items
  } as LSOEvaluationStep;

}

export function analyseGrade(wire: Wire, steps: LSOEvaluationSteps): LSOGrade {


  const items = _.chain(steps)//
    .filter((step, stepName) => stepName !== 'BC' && stepName !== 'IW')//
    .map((step) => step.items)//
    .flatten()//
    .value();

  const haveNiceCorrection = items.includes('NC');

  const haveHighDerivation = items.includes('_LUR_') || items.includes('_LUL_') || items.includes('_H_') || items.includes('_P_');
  const haveDerivation = items.includes('LUR') || items.includes('LUL') || items.includes('H') || items.includes('P');
  const haveLowDerivation = items.includes('(LUR)') || items.includes('(LUL)') || items.includes('(H)') || items.includes('(P)');

  const goodBC = !steps.BC.items.includes('_LUR_') && !steps.BC.items.includes('_LUL_') && !steps.BC.items.includes('_H_') && !steps.BC.items.includes('_P_');
  const perfectIC = steps.IC.items.length == 0;
  const perfectTL = steps.TL.items.length == 0;
  const perfectAR = steps.AR.items.length == 0;

  const dangerousPass = steps.AR.items.includes('P') || steps.AR.items.includes('_P_') || steps.TL.items.includes('P') || steps.TL.items.includes('_P_');

  if (!haveHighDerivation && goodBC && perfectIC && perfectTL && perfectAR && wire === '#3') {
    return '_OK_';
  }

  if (!haveHighDerivation && goodBC && perfectIC && perfectTL && perfectAR && (wire === '#2' || wire === '#4')) {
    return 'OK';
  }

  if (dangerousPass && (wire === '#1' || wire === '#2' || wire === '#3' || wire === '#4')) {
    return 'C';
  }

  if ((!haveHighDerivation || haveNiceCorrection) && (haveDerivation || haveLowDerivation) && wire === '#3') {
    return 'OK';
  }

  if ((!haveHighDerivation || haveNiceCorrection) && (haveDerivation || haveLowDerivation) && (wire === '#2' || wire === '#4')) {
    return '(OK)';
  }

  if (!dangerousPass && wire === '#3') {
    return '(OK)';
  }

  if (wire === '#1') {
    return '--';
  }

  if (wire === 'WO') {
    return 'WO';
  }

  if (wire === 'B' && dangerousPass) {
    return '--B';
  }
  if (wire === 'B') {
    return 'B';
  }

  return '--';
}

export default class EvaluationService {

  private _evaluations: Array<LSOEvaluation> = [];

  addEvaluation(evaluation: LSOEvaluation) {

    this._evaluations.push(evaluation);
  }

  get evaluations() {
    return this._evaluations;
  }

}