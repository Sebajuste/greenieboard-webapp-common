import { useContext, useState } from "react"
import { Link } from "react-router-dom";
import { EvaluationServiceProvider } from "../../App";
import { LSOEvaluation } from "../../services/evaluation-service";
import { Timer } from "../../components/stop-watch/timer";

import './lso-page.scss';
import { Grade } from "../../components/lso-grade/lso-grade";


function DiscordUser() {

  const [user, setUser] = useState('');

  const clientID = '1259077922929639520';
  const token = 'aFDtQTyJ7-bQo0b9bEnRuzVUAoTI5JIY';
  const publicKey = 'fe84126b467c27e0b3516bd9237c384fb2c6d9d7a3996daea1767335763415a8';

  const fetchUser = async (id: any) => {
    const response = await fetch(`https://discord.com/oauth2/authorize?client_id=${clientID}&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A3000&scope=identify+guilds+openid`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    if (!response.ok) throw new Error(`Error status code: ${response.status}`)
    return JSON.parse(await response.json())
  }

  const searchHandler = () => {

    fetchUser(user).then(response => console.log(response)).catch(err => console.error(err));

  };

  // https://discord.com/oauth2/authorize?client_id=1259077922929639520&permissions=1099780063232&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A3000&integration_type=1&scope=identify+email+bot+connections

  // ?code=k4h7oCsBaybHnVU0u33dmpVaV1vWTT&guild_id=616933381799936011&permissions=1099780063232

  // admin 617319355658534912

  return (
    <div>

      <a
        href={`https://discord.com/oauth2/authorize?client_id=1259077922929639520&permissions=1099780063232&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A3000&integration_type=0&scope=identify+email+bot+connections`}


        style={{
          marginTop: '10px',
          backgroundColor: '#7289DA',
          border: 'none',
        }}
      >

        Login with Discord
      </a>
    </div>
  )

}


export default function LsoPage() {


  const evaluationService = useContext(EvaluationServiceProvider.Context);

  const evaluationItems = evaluationService.evaluations.map((evaluation: LSOEvaluation, index: number) => {

    return (
      <div key={index} className="evaluation">{evaluation.modex}
        <Timer time={evaluation.time} />
        <label className="evaluation-wire">{evaluation.wire}</label>
        <div className="evaluation-grade">
          <Grade grade={evaluation.grade} />
        </div>
      </div>
    );
  });

  return (
    <main className="lso-page">
      <h2>Evaluations</h2>
      <div className="evaluations">{evaluationItems}</div>



      <footer>
        <Link to="/lso/new-evaluation" className="button">New Evaluation</Link>
      </footer>

    </main>
  )

}