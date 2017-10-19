import 'react-table/react-table.css'
import * as React from 'react'
import ReactTable from 'react-table'

const tableStyle = {
    border: 'none',
}

const headerStyle = {
    backgroundColor: '#EBEBEB',
    border: 'none',
    lineHeight: '42px',
    fontWeight: 'bold',
    padding: 0,
}

const headerLeft = {
    ...headerStyle,
    textAlign: 'left',
}

const columStyle = {
    textAlign: 'center',
    border: 'none',
    borderBottom: '1px solid #C5C5C5',
    lineHeight: '33px',
}

const columns = [{
        Header: '#',
        accessor: 'position',
        headerStyle,
        style: { ...columStyle, fontWeight: 'bold' },
        width: 50,
    }, {
        Header: 'Wallet',
        accessor: 'wallet',
        headerStyle: headerLeft,
        style: columStyle,
    }, {
        Header: 'Markets',
        accessor: 'markets',
        headerStyle,
        style: columStyle,
    }, {
        Header: 'Score',
        accessor: 'score',
        headerStyle,
        style: columStyle,
    }, {
        Header: 'Change (24h)',
        accessor: 'change',
        headerStyle,
        style: columStyle,
    }]

const ownTrCallback = myWallet => (state, rowInfo) => ({
    style: {
        background: rowInfo && rowInfo.row.wallet === myWallet ? '#C7EAF1' : 'transparent',
    },
})

const ownTheadCallback = () => ({
    style: {
        boxShadow: 'none',
    },
})

const ScoreBoard = ({ tableData, myWallet }) =>
        <ReactTable
            data={ tableData }
            columns={ columns }
            showPagination={ false }
            defaultPageSize={ tableData.length }
            style={ tableStyle }
            getTrProps={ ownTrCallback(myWallet) }
            getTheadProps={ ownTheadCallback }
            sortable={ false }
        />


export default ScoreBoard
