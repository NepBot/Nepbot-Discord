import './App.css';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import Index from './views/Index/Index';
import Oauth from './views/Oauth/Oauth';
import Success from './views/Success/Success';
import Failure from "./views/Failure/Failure";
import SetRule from "./views/SetRule/SetRule";
import Claim from "./views/Claim/Claim";
function App() {
  return (
    <Router className="App">
        <Switch>
            <Route path='/' exact component={Index} />
            <Route path='/oauth' exact component={Oauth} />
            <Route path='/success' exact component={Success} />
            <Route path='/failure' exact component={Failure} />
            <Route path='/setrule' exact component={SetRule} />
            <Route path='/claim' exact component={Claim} />
            {/*<Route path='/setrule' exact component={SetRuleS} />*/}
        </Switch>
    </Router>
  );
}

export default App;
