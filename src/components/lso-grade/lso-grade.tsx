import { LSOGrade } from "../../services/evaluation-service";

import './lso-grade.scss';

const regexp = /([\(\)])/g

export function Grade({ grade }: { grade: LSOGrade }) {


  return (
    <div className={`lso-grade grade-${grade.replaceAll(regexp, 'x')}`}>
      <label>{grade}</label>
    </div>
  )

}