// Copyright 2015-2017 Parity Technologies (UK) Ltd.
// This file is part of Parity.

// Parity is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// Parity is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with Parity.  If not, see <http://www.gnu.org/licenses/>.

import { observe } from 'mobx';
import { observer } from 'mobx-react';
import { uniq, isEqual, pickBy } from 'lodash';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import HardwareStore from '@parity/shared/lib/mobx/hardwareStore';
import { setVisibleAccounts } from '@parity/shared/lib/redux/providers/personalActions';
import { Actionbar, ActionbarSearch, ActionbarSort, Button, DappLink, Page } from '@parity/ui';
import { AddIcon, KeyIcon, FileDownloadIcon } from '@parity/ui/lib/Icons';

import CreateWallet from './CreateWallet';
import CreateAccount from './CreateAccount';
import ExportAccount from './ExportAccount';
import List from './List';
import styles from './accounts.css';

@observer
class Accounts extends Component {
  static contextTypes = {
    api: PropTypes.object
  }

  static propTypes = {
    accounts: PropTypes.object.isRequired,
    accountsInfo: PropTypes.object.isRequired,
    availability: PropTypes.string.isRequired,
    setVisibleAccounts: PropTypes.func.isRequired
  }

  hwstore = HardwareStore.get(this.context.api);

  state = {
    _observeCancel: null,
    addressBook: false,
    newDialog: false,
    newWalletDialog: false,
    newExportDialog: false,
    restoreDialog: false,
    sortOrder: '',
    searchValues: [],
    searchTokens: [],
    show: false
  }

  componentWillMount () {
    // FIXME: Messy, figure out what it fixes and do it elegantly
    window.setTimeout(() => {
      this.setState({ show: true });
    }, 100);

    this.setVisibleAccounts();

    this.setState({
      _observeCancel: observe(this.hwstore, 'wallets', this.onHardwareChange, true)
    });
  }

  componentWillReceiveProps (nextProps) {
    const prevAddresses = Object.keys(this.props.accounts);
    const nextAddresses = Object.keys(nextProps.accounts);

    if (prevAddresses.length !== nextAddresses.length || !isEqual(prevAddresses.sort(), nextAddresses.sort())) {
      this.setVisibleAccounts(nextProps);
    }
  }

  componentWillUnmount () {
    this.props.setVisibleAccounts([]);
    this.state._observeCancel();
  }

  setVisibleAccounts (props = this.props) {
    const { accounts, setVisibleAccounts } = props;

    setVisibleAccounts(Object.keys(accounts));
  }

  render () {
    return (
      <div>
        { this.renderNewDialog() }
        { this.renderRestoreDialog() }
        { this.renderNewWalletDialog() }
        { this.renderNewExportDialog() }
        { this.renderActionbar() }

        <Page>
          { this.renderExternalAccounts() }
          { this.renderWallets() }
          { this.renderAccounts() }
        </Page>
      </div>
    );
  }

  renderLoading (object) {
    const loadings = ((object && Object.keys(object)) || []).map((_, idx) => (
      <div key={ idx } className={ styles.loading }>
        <div />
      </div>
    ));

    return (
      <div className={ styles.loadings }>
        { loadings }
      </div>
    );
  }

  renderAccounts () {
    const { accounts } = this.props;
    const _accounts = pickBy(accounts, (account) => account.uuid);
    const _hasAccounts = Object.keys(_accounts).length > 0;

    if (!this.state.show) {
      return this.renderLoading(_accounts);
    }

    const { searchValues, sortOrder } = this.state;

    return (
      <List
        search={ searchValues }
        accounts={ _accounts }
        empty={ !_hasAccounts }
        order={ sortOrder }
        handleAddSearchToken={ this.onAddSearchToken }
      />
    );
  }

  renderWallets () {
    const { accounts } = this.props;
    const wallets = pickBy(accounts, (account) => account.wallet);
    const hasWallets = Object.keys(wallets).length > 0;

    if (!hasWallets) {
      return null;
    }

    if (!this.state.show) {
      return this.renderLoading(wallets);
    }

    const { searchValues, sortOrder } = this.state;

    return (
      <List
        link='wallet'
        search={ searchValues }
        accounts={ wallets }
        order={ sortOrder }
        handleAddSearchToken={ this.onAddSearchToken }
      />
    );
  }

  renderExternalAccounts () {
    const { accounts } = this.props;
    const { wallets } = this.hwstore;
    const hardware = pickBy(accounts, (account) => account.hardware);
    const external = pickBy(accounts, (account) => account.external);
    const all = Object.assign({}, hardware, external);

    if (Object.keys(all).length === 0) {
      return null;
    }

    if (!this.state.show) {
      return this.renderLoading(hardware);
    }

    const { searchValues, sortOrder } = this.state;
    const disabled = Object
      .keys(hardware)
      .filter((address) => !wallets[address])
      .reduce((result, address) => {
        result[address] = true;
        return result;
      }, {});

    return (
      <List
        search={ searchValues }
        accounts={ all }
        disabled={ disabled }
        order={ sortOrder }
        handleAddSearchToken={ this.onAddSearchToken }
      />
    );
  }

  renderSearchButton () {
    const onChange = (searchTokens, searchValues) => {
      this.setState({ searchTokens, searchValues });
    };

    return (
      <ActionbarSearch
        key='searchAccount'
        tokens={ this.state.searchTokens }
        onChange={ onChange }
      />
    );
  }

  renderSortButton () {
    const onChange = (sortOrder) => {
      this.setState({ sortOrder });
    };

    return (
      <ActionbarSort
        key='sortAccounts'
        id='sortAccounts'
        order={ this.state.sortOrder }
        onChange={ onChange }
      />
    );
  }

  renderActionbar () {
    const buttons = [
      this.renderVaultsButton(),
      <Button
        key='newAccount'
        icon={ <AddIcon /> }
        label={
          <FormattedMessage
            id='accounts.button.newAccount'
            defaultMessage='account'
          />
        }
        onClick={ this.onNewAccountClick }
      />,
      this.renderNewWalletButton(),
      <Button
        key='restoreAccount'
        icon={ <AddIcon /> }
        label={
          <FormattedMessage
            id='accounts.button.restoreAccount'
            defaultMessage='restore'
          />
        }
        onClick={ this.onRestoreAccountClick }
      />,
      <Button
        key='newExport'
        icon={ <FileDownloadIcon /> }
        label={
          <FormattedMessage
            id='accounts.button.export'
            defaultMessage='export'
          />
        }
        onClick={ this.onNewExportClick }
      />,
      this.renderSearchButton(),
      this.renderSortButton()
    ];

    return (
      <Actionbar
        className={ styles.toolbar }
        title={
          <FormattedMessage
            id='accounts.title'
            defaultMessage='Accounts Overview'
          />
        }
        buttons={ buttons }
      />
    );
  }

  renderNewDialog () {
    const { accounts } = this.props;
    const { newDialog } = this.state;

    if (!newDialog) {
      return null;
    }

    return (
      <CreateAccount
        accounts={ accounts }
        onClose={ this.onNewAccountClose }
      />
    );
  }

  renderRestoreDialog () {
    const { accounts } = this.props;
    const { restoreDialog } = this.state;

    if (!restoreDialog) {
      return null;
    }

    return (
      <CreateAccount
        accounts={ accounts }
        onClose={ this.onRestoreAccountClose }
        restore
      />
    );
  }

  renderVaultsButton () {
    if (this.props.availability !== 'personal') {
      return null;
    }

    return (
      <DappLink
        to='/vaults'
        key='vaults'
      >
        <Button
          icon={ <KeyIcon /> }
          label={
            <FormattedMessage
              id='accounts.button.vaults'
              defaultMessage='vaults'
            />
          }
          onClick={ this.onVaultsClick }
        />
      </DappLink>
    );
  }

  renderNewWalletButton () {
    return (
      <Button
        key='newWallet'
        icon={ <AddIcon /> }
        label={
          <FormattedMessage
            id='accounts.button.newWallet'
            defaultMessage='wallet'
          />
        }
        onClick={ this.onNewWalletClick }
      />
    );
  }

  renderNewWalletDialog () {
    const { accounts } = this.props;
    const { newWalletDialog } = this.state;

    if (!newWalletDialog) {
      return null;
    }

    return (
      <CreateWallet
        accounts={ accounts }
        onClose={ this.onNewWalletClose }
      />
    );
  }

  renderNewExportDialog () {
    const { newExportDialog } = this.state;

    if (!newExportDialog) {
      return null;
    }

    return (
      <ExportAccount
        onClose={ this.onNewExportClose }
      />
    );
  }

  onAddSearchToken = (token) => {
    const { searchTokens } = this.state;
    const newSearchTokens = uniq([].concat(searchTokens, token));

    this.setState({ searchTokens: newSearchTokens });
  }

  onNewAccountClick = () => {
    this.setState({
      newDialog: true
    });
  }

  onRestoreAccountClick = () => {
    this.setState({
      restoreDialog: true
    });
  }

  onNewWalletClick = () => {
    this.setState({
      newWalletDialog: true
    });
  }

  onNewExportClick = () => {
    this.setState({
      newExportDialog: true
    });
  }

  onNewAccountClose = () => {
    this.setState({
      newDialog: false
    });
  }

  onRestoreAccountClose = () => {
    this.setState({
      restoreDialog: false
    });
  }

  onNewWalletClose = () => {
    this.setState({
      newWalletDialog: false
    });
  }

  onNewExportClose = () => {
    this.setState({
      newExportDialog: false
    });
  }

  onHardwareChange = () => {
    const { accountsInfo } = this.props;
    const { wallets } = this.hwstore;

    Object
      .keys(wallets)
      .filter((address) => {
        const account = accountsInfo[address];

        return !account || !account.meta || !account.meta.hardware;
      })
      .forEach((address) => this.hwstore.createAccountInfo(wallets[address], accountsInfo[address]));

    this.setVisibleAccounts();
  }
}

function mapStateToProps (state) {
  const { accounts, accountsInfo } = state.personal;
  const { availability = 'unknown' } = state.nodeStatus.nodeKind || {};

  return {
    accounts,
    accountsInfo,
    availability
  };
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    setVisibleAccounts
  }, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Accounts);
