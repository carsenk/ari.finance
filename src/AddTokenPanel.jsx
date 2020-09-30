import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SwitchNetworkNotice from './SwitchNetworkNotice'
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Typography from '@material-ui/core/Typography';
import DownloadMetaMaskButton from './DownloadMetaMaskButton';
import Eth from 'ethjs-query';
import etherscanLink from 'etherscan-link';
import { Link } from 'react-router-dom'
import queryString from 'querystringify'

const ContractAddress = '0x8a8b5318d3a59fa6d1d0a83a1b0506f2796b5670';

class AddTokenPanel extends Component {

  constructor (props) {
    const {
      tokenName = 'Denarii',
        tokenSymbol = 'ARI',
        tokenDecimals = 8,
        tokenAddress = ContractAddress,
        tokenImage = 'https://user-images.githubusercontent.com/10162347/94634854-7109a080-028e-11eb-9d40-0ab64924ee5b.png',
        tokenNet = '1',
        message = '',
        errorMessage = '',
        net = '1',
    } = props

    super()
    this.state = {
      tokenName,
      tokenSymbol,
      tokenDecimals,
      tokenAddress,
      tokenImage,
      tokenNet,
      message,
      errorMessage,
      net,
    }

    const search = window.location.search
    const params = queryString.parse(search)

    for (let key in params) {
      this.state[key] = params[key]
    }

    this.updateNet()
  }

  componentDidMount() {
    const search = this.props.location.search
    const params = queryString.parse(search)
    this.setState(params)
  }

  async updateNet () {
    const provider = window.web3.currentProvider
    const eth = new Eth(provider)
    const realNet = await eth.net_version()
    this.setState({ net: realNet })
  }

  render (props, context) {
    const {
      tokenName,
      tokenSymbol,
      tokenDecimals,
      tokenNet,
      net,
      tokenImage,
      tokenAddress,
      message,
      errorMessage,
    } = this.state

    let error
    if (errorMessage !== '') {
      error = <p className="errorMessage">
        There was a problem adding ARI to your wallet. Make sure you have the latest version of MetaMask installed!
        <DownloadMetaMaskButton/>
      </p>
    }

    if (tokenNet !== net) {
      return <SwitchNetworkNotice net={net} tokenNet={tokenNet}/>
    }

    return (
      <div className="values">
        <header className="App-header">
          <img src={tokenImage} className="logo" alt="Coin"/>
          <h1 className="App-title">{tokenName} - ARI</h1>
          <h4>0x8a8b5318d3a59fa6d1d0a83a1b0506f2796b5670</h4>
        </header>
        <Table className="table">
          <TableBody>
            <TableRow>
              <TableCell>Symbol</TableCell>
              <TableCell>{tokenSymbol}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Decimals</TableCell>
              <TableCell>{tokenDecimals}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Fixed ARI Supply</TableCell>
              <TableCell>30,000,000</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Discord</TableCell>
              <TableCell><a href="https://discord.gg/ryVyZDq">Chat</a></TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Twitter</TableCell>
              <TableCell><a href="https://twitter.com/DenariiToken">@DenariiToken</a></TableCell>
            </TableRow>
            <TableRow>
              <TableCell>ARI Uniswap LP</TableCell>
              <TableCell><a href="https://uniswap.info/pair/0x399c74f05c912d60329b038d52628558f28e4f7e">Uniswap Pool</a></TableCell>
            </TableRow>
            <TableRow>
              <TableCell>ARI Balancer LP</TableCell>
              <TableCell><a href="https://pools.balancer.exchange/#/pool/0xa516b20aaa2ceaf619004fda6d7d31dcc98f342a/">Balancer Pool</a></TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Uniswap List URI</TableCell>
              <TableCell>list.denarii.eth</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Explorer</TableCell>
              <TableCell><a href="https://etherscan.io/token/0x8a8b5318d3a59fa6d1d0a83a1b0506f2796b5670">Etherscan</a></TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <div>

          <Button className="buttons"
            onClick = {async (event) => {
              const provider = window.web3.currentProvider
              provider.sendAsync({
                method: 'metamask_watchAsset',
                params: {
                  "type":"ERC20",
                  "options":{
                    "address": tokenAddress,
                    "symbol": tokenSymbol,
                    "decimals": tokenDecimals,
                    "image": tokenImage,
                  },
                },
                id: Math.round(Math.random() * 100000),
              }, (err, added) => {
                console.log('provider returned', err, added)
                if (err || 'error' in added) {
                  this.setState({
                    errorMessage: 'There was a problem adding the token.',
                    message: '',
                  })
                  return
                }
                this.setState({
                  message: 'Denarii (ARI) was added to your Metamask!',
                  errorMessage: '',
                })
              })
            }}
            >Add ARI to Metamask</Button>

        </div>

        <p>{message}</p>
        {error}

        <div className="spacer"></div>

        {/* <Typography gutterBottom noWrap>
          {`
            Create a simple page to watch your token with one click.
          `}
        </Typography>
        <Link to="/edit">
          <Button>
            Create Page
          </Button>
        </Link> */}

      </div>
    )
  }
}

AddTokenPanel.contextTypes = {
  web3: PropTypes.object,
}

export default AddTokenPanel;

