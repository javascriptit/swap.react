import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { connect } from 'redaction'
import actions from 'redux/actions'
import styles from './KeyActionsPanel.scss'

import CSSModules from 'react-css-modules'
import { isMobile } from 'react-device-detect'

import { constants } from 'helpers'
import { WithdrawButton } from 'components/controls'
import { FormattedMessage } from 'react-intl'

import config from 'app-config'


@connect(({
  rememberedOrders,
  core: { hiddenCoinsList },
  history: { swapHistory },
}) => ({
  hiddenCoinsList,
  decline: rememberedOrders.savedOrders,
  swapHistory,
}))
@CSSModules(styles, { allowMultiple: true })
export default class KeyActionsPanel extends Component {

  static propTypes = {
    hiddenCoinsList: PropTypes.array.isRequired,
  }

  static defaultProps = {
    hiddenCoinsList: [],
  }

  state = {
    correctDecline: [],
  }

  componentDidMount() {
    setInterval(() => {
      this.getCorrectDecline()
    }, 3000)
  }

  getCorrectDecline = () => {
    const { decline, swapHistory } = this.props
    if (swapHistory.length > 0) {
      const correctDecline = swapHistory
        .filter(item => item.isSwapExist === false)
        .filter(item => !item.isMy)
        .filter(item => decline.includes(item.id))

      this.setState(() => ({
        correctDecline,
      }))
    }
  }

  handleShowMore = () => {
    actions.modals.open(constants.modals.ShowMoreCoins, {})
  }

  handleDownload = () => {
    if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
      actions.modals.open(constants.modals.DownloadModal)
    } else {
      actions.user.downloadPrivateKeys()
    }
  }


  handleImportKeys = () => {
    actions.modals.open(constants.modals.ImportKeys, {})
  }

  handleClear = () => {
    actions.user.getDemoMoney()
  }

  handleShowIncomplete = (decline) => {
    actions.modals.open(constants.modals.IncompletedSwaps, {
      decline,
    })
  }

  render() {
    const { hiddenCoinsList, decline } = this.props
    const { correctDecline } = this.state

    return (
      <div styleName="WithdrawButtonContainer">
        { process.env.TESTNET && !isMobile &&
        <WithdrawButton onClick={this.handleClear} >
          <FormattedMessage id="KeyActionsPanel43" defaultMessage="Exit" />
        </WithdrawButton>
        }
        <WithdrawButton data-tut="reactour__save" onClick={this.handleDownload}>
          <FormattedMessage id="KeyActionsPanel46" defaultMessage="Download keys" />
        </WithdrawButton>
        <WithdrawButton onClick={this.handleImportKeys}>
          <FormattedMessage id="KeyActionsPanel49" defaultMessage="Import keys" />
        </WithdrawButton>
        {
          (config && !config.isWidget) && (
            <WithdrawButton onClick={this.handleShowMore}>
              <FormattedMessage id="KeyActionsPanel73" defaultMessage="Hidden coins ({length})" values={{ length: `${hiddenCoinsList.length}` }} />
            </WithdrawButton>
          )
        }
        {correctDecline.length > 0 &&
          <WithdrawButton onClick={() => this.handleShowIncomplete(decline)}>
            <FormattedMessage id="KeyActionsPane74" defaultMessage="incomplete swap ({length})" values={{ length: `${correctDecline.length}` }} />
          </WithdrawButton>
        }
      </div>
    )
  }
}
