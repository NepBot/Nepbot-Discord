import './App.css';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import Index from './views/Index/Index';
import Verify from './views/Verify/Verify';
import Loading from './views/Loading/Loading';
import Failure from "./views/Failure/Failure";
import SetRule from "./views/SetRule/SetRule";
import CollectionList from "./views/CollectionList/collectionList";
import SeriesList from "./views/SeriesList/seriesList";
import Claim from "./views/Claim/Claim";
import LinkExpired from "./views/LinkExpired/LinkExpired";
function App() {
  return (
    <Router className="App">
        <Switch>
            <Route path='/' exact component={Index} />
            <Route path='/Verify' exact component={Verify} />
            <Route path='/wait' exact component={Loading} />
            <Route path='/failure' exact component={Failure} />
            <Route path='/setrule' exact component={SetRule} />
            <Route path='/collectionlist' exact component={CollectionList} />
            <Route path='/serieslist/:id' exact component={SeriesList} />
            <Route path='/claim' exact component={Claim} />
            <Route path='/linkexpired' exact component={LinkExpired} />
            {/*<Route path='/setrule' exact component={SetRuleS} />*/}
        </Switch>
    </Router>
  );
}

export default App;
