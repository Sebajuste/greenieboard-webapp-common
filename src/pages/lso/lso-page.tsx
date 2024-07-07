import { FC, Fragment, useContext, useState } from "react"
import { Link, useNavigate, useNavigation } from "react-router-dom";
import { Box, BoxProps, Button, Collapse, IconButton, InputBase, styled, Table, TableBody, TableCell, TableHead, TableRow, TextField } from "@mui/material";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

import { EvaluationServiceProvider } from "../../App";
import { LSOEvaluation } from "../../services/evaluation-service";
import { Timer } from "../../components/stop-watch/timer";


import { Grade } from "../../components/lso-grade/lso-grade";
import { useTitle } from "../../components/portal/contexts/portal-context";


import ScrollBar from "simplebar-react";
import { FlexBox } from "../../components/flex-box";

import './lso-page.scss';
import { EvaluationSteps } from "../../components/lso-grade/lso-evaluation";

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



function Row({ evaluation }: { evaluation: LSOEvaluation }) {

  const [open, setOpen] = useState(false);

  return (
    <Fragment>
      <TableRow>
        <TableCell style={{ padding: 0 }}>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>{evaluation.modex}</TableCell>
        <TableCell><Timer time={evaluation.time} /></TableCell>
        <TableCell>{evaluation.wire}</TableCell>
        <TableCell>
          <Grade grade={evaluation.grade} />
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <EvaluationSteps evaluationSteps={evaluation.steps} />
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </Fragment>
  );

}


export default function LsoPage() {

  useTitle('Evaluations')

  const navigate = useNavigate();

  const evaluationService = useContext(EvaluationServiceProvider.Context);

  const [newModex, setNewModex] = useState('');

  /*
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
  */

  const startEvaluationHandler = () => {

    navigate(`/evaluation/${newModex}`);

  };

  const evaluationItems = evaluationService.evaluations.map((evaluation: LSOEvaluation, index: number) => {

    return (<Row key={index} evaluation={evaluation} />);
  });

  return (
    <Box pt={2} pb={4}>

      <StyledFlexBox>
        <TextField type="number" id="outlined-basic" label="Modex" variant="outlined" value={newModex} onChange={(e) => setNewModex(e.target.value)} />
        <Button variant="contained" onClick={startEvaluationHandler} disabled={newModex === ''}>
          New Evaluation
        </Button>
      </StyledFlexBox>

      <Box>
        <ScrollBar>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell style={{ padding: 0 }} />
                <TableCell>Modex</TableCell>
                <TableCell>Time</TableCell>
                <TableCell>Wire</TableCell>
                <TableCell>Grade</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>

              {evaluationItems}

            </TableBody>

          </Table>
        </ScrollBar>
      </Box>

    </Box >
  );

  /*
  return (
    <main className="lso-page">

      <div className="evaluations">{evaluationItems}</div>

      <footer>
        <Link to="/new-evaluation" className="button">New Evaluation</Link>
      </footer>

    </main>
  );
  */

}