import './App.css';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import { KeepaliveRouterSwitch ,KeepaliveRoute ,addKeeperListener } from 'react-keepalive-router'
import Index from './views/Index/Index';
import Verify from './views/Verify/Verify';
import Loading from './views/Loading/Loading';
import Failure from "./views/Failure/Failure";
import Success from "./views/Success/Success";
import SetRule from "./views/SetRule/SetRule";
import CollectionList from "./views/CollectionList/collectionList";
import SeriesList from "./views/SeriesList/seriesList";
import Mint from "./views/Mint/Mint";
import Vote from "./views/Vote/Vote";
import TwitterVerify from "./views/TwitterVerify/TwitterVerify";
import CreateSnapshot from "./views/Snapshot/CreateSnapshot";
import FTAirdrop from "./views/Airdrop/FTAirdrop";
import FTClaim from "./views/Airdrop/FTClaim";
import FTRedeem from "./views/Airdrop/FTRedeem";
import Claim from "./views/Claim/Claim";
import LinkExpired from "./views/LinkExpired/LinkExpired";
function App() {
  return (
    <Router className="App">
        <KeepaliveRouterSwitch>
            <Route path='/' exact component={Index} />
            <Route path='/Verify' exact component={Verify} />
            <Route path='/wait' exact component={Loading} />
            <Route path='/failure' exact component={Failure} />
            <Route path='/success' exact component={Success} />
            <Route path='/setrule' exact component={SetRule} />
            {/* <Route path='/collectionlist' exact component={CollectionList} /> */}
            <KeepaliveRoute path={'/collectionlist'} component={ CollectionList } scroll={true}/>
            <Route path='/serieslist/:id' exact component={SeriesList} />
            <Route path='/mint' exact component={Mint} />
            <Route path='/vote' exact component={Vote} />
            <Route path='/twitterverify' exact component={TwitterVerify} />
            <Route path='/createsnapshot' exact component={CreateSnapshot} />
            <Route path='/ftairdrop' exact component={FTAirdrop} />
            <Route path='/ftclaim' exact component={FTClaim} />
            <Route path='/ftredeem' exact component={FTRedeem} />
            <Route path='/claim' exact component={Claim} />
            <Route path='/linkexpired' exact component={LinkExpired} />
            {/*<Route path='/setrule' exact component={SetRuleS} />*/}
        </KeepaliveRouterSwitch>
    </Router>
  );
}

export default App;
