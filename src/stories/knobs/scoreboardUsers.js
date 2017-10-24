import { array, object } from '@storybook/addon-knobs'

const user1 = {
    currentRank: 1,
    diffRank: 10,
    pastRank: 10,
    account: '0x90F8bf6A479f320ead074411a4B0e7944Ea8ca001',
    score: '554000000000000000',
    balance: '200000000000000000',
    predictedProfits: '354000000000000000',
    predictions: 14,
}

const user2 = {
    currentRank: 2,
    diffRank: 5,
    pastRank: 10,
    account: '0x90F8bf6A479f320ead074411a4B0e7944Ea8ca002',
    score: '534000000000000000',
    balance: '180000000000000000',
    predictedProfits: '354000000000000000',
    predictions: 32,
}

const user3 = {
    currentRank: 3,
    diffRank: 5,
    pastRank: 10,
    account: '0x90F8bf6A479f320ead074411a4B0e7944Ea8ca003',
    score: '614000000000000000',
    balance: '260000000000000000',
    predictedProfits: '354000000000000000',
    predictions: 20,
}

const user4 = {
    currentRank: 4,
    diffRank: 0,
    pastRank: 10,
    account: '0x90F8bf6A479f320ead074411a4B0e7944Ea8ca004',
    score: '632000000000000000',
    balance: '278000000000000000',
    predictedProfits: '354000000000000000',
    predictions: 9,
}

const user5 = {
    currentRank: 5,
    diffRank: 1,
    pastRank: 10,
    account: '0x90F8bf6A479f320ead074411a4B0e7944Ea8ca005',
    score: '465000000000000000',
    balance: '111000000000000000',
    predictedProfits: '354000000000000000',
    predictions: 5,
}

const user6 = {
    currentRank: 6,
    diffRank: -2,
    pastRank: 10,
    account: '0x90F8bf6A479f320ead074411a4B0e7944Ea8ca006',
    score: '466000000000000000',
    balance: '112000000000000000',
    predictedProfits: '354000000000000000',
    predictions: 10,
}

const user7 = {
    currentRank: 7,
    diffRank: 7,
    pastRank: 10,
    account: '0x90F8bf6A479f320ead074411a4B0e7944Ea8ca007',
    score: '520600000000000000',
    balance: '166600000000000000',
    predictedProfits: '354000000000000000',
    predictions: 17,
}

const user8 = {
    currentRank: 8,
    diffRank: -7,
    pastRank: 10,
    account: '0x90F8bf6A479f320ead074411a4B0e7944Ea8ca008',
    score: '55400000000000000',
    balance: '200000000000000000',
    predictedProfits: '354000000000000000',
    predictions: 36,
}

const user9 = {
    currentRank: 9,
    diffRank: 44,
    pastRank: 10,
    account: '0x90F8bf6A479f320ead074411a4B0e7944Ea8ca009',
    score: '502750000000000000',
    balance: '148750000000000000',
    predictedProfits: '354000000000000000',
    predictions: 4,
}

const user10 = {
    currentRank: 10,
    diffRank: 74,
    pastRank: 10,
    account: '0x90F8bf6A479f320ead074411a4B0e7944Ea8ca010',
    score: '719870000000000000',
    balance: '145870000000000000',
    predictedProfits: '574000000000000000',
    predictions: 1,
}

export const usersData = [ user1, user2, user3, user4, user5, user6, user7, user8, user9, user10 ];

const users = [
    object('User 1', user1),
    object('User 2', user2),
    object('User 3', user3),
    object('User 4', user4),
    object('User 5', user5),
    object('User 6', user6),
    object('User 7', user7),
    object('User 8', user8),
    object('User 9', user9),
    object('User 10', user10),
]

export default array('ScoreBoard Ranking', users);