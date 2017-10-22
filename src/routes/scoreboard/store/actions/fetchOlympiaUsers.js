import addUsers from './addUsers'

const url = '';

const dummyData = [{
            currentRank: 1,
            diffRank: 10,
            pastRank: 10,
            account: '0x90F8bf6A479f320ead074411a4B0e7944Ea8ca01',
            score: '554000000000000000',
            balance: '200000000000000000',
            predictedProfits: '354000000000000000',
        }, {
            currentRank: 2,
            diffRank: 5,
            pastRank: 10,
            account: '0x90F8bf6A479f320ead074411a4B0e7944Ea8ca02',
            score: '534000000000000000',
            balance: '180000000000000000',
            predictedProfits: '354000000000000000',
        }, {
            currentRank: 3,
            diffRank: 5,
            pastRank: 10,
            account: '0x90F8bf6A479f320ead074411a4B0e7944Ea8ca03',
            score: '614000000000000000',
            balance: '260000000000000000',
            predictedProfits: '354000000000000000',
        }, {
            currentRank: 4,
            diffRank: 0,
            pastRank: 10,
            account: '0x90F8bf6A479f320ead074411a4B0e7944Ea8ca04',
            score: '632000000000000000',
            balance: '278000000000000000',
            predictedProfits: '354000000000000000',
        }, {
            currentRank: 5,
            diffRank: 1,
            pastRank: 10,
            account: '0x90F8bf6A479f320ead074411a4B0e7944Ea8ca05',
            score: '465000000000000000',
            balance: '111000000000000000',
            predictedProfits: '354000000000000000',
        }, {
            currentRank: 6,
            diffRank: -2,
            pastRank: 10,
            account: '0x90F8bf6A479f320ead074411a4B0e7944Ea8ca06',
            score: '466000000000000000',
            balance: '112000000000000000',
            predictedProfits: '354000000000000000',
        }, {
            currentRank: 7,
            diffRank: 7,
            pastRank: 10,
            account: '0x90F8bf6A479f320ead074411a4B0e7944Ea8ca07',
            score: '520600000000000000',
            balance: '166600000000000000',
            predictedProfits: '354000000000000000',
        }, {
            currentRank: 8,
            diffRank: -7,
            pastRank: 10,
            account: '0x90F8bf6A479f320ead074411a4B0e7944Ea8ca08',
            score: '55400000000000000',
            balance: '200000000000000000',
            predictedProfits: '354000000000000000',
        }, {
            currentRank: 9,
            diffRank: 44,
            pastRank: 10,
            account: '0x90F8bf6A479f320ead074411a4B0e7944Ea8ca09',
            score: '502750000000000000',
            balance: '148750000000000000',
            predictedProfits: '354000000000000000',
        }, {
            currentRank: 10,
            diffRank: 74,
            pastRank: 10,
            account: '0x90F8bf6A479f320ead074411a4B0e7944Ea8ca10',
            score: '719870000000000000',
            balance: '145870000000000000',
            predictedProfits: '574000000000000000',
        }]


const composeTournament = new Promise((resolve, reject) => resolve(dummyData));

export default (params) => (dispatch) =>
    //restFetch(url)
    composeTournament
        .then((response) => {
            if (!response) {
                return []
            }
            dispatch(addUsers(response));
        })
