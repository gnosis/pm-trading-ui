import classNames from 'classnames/bind'
import Block from 'components/layout/Block'
import Img from 'components/layout/Img'
import PageFrame from 'components/layout/PageFrame'
import Paragraph from 'components/layout/Paragraph'
import * as React from 'react'
import * as css from './index.css'
import ScoreTable from './ScoreTable'

const cx = classNames.bind(css)
const trophy = require('../assets/trophy.svg')

const Table = ({ data, myAccount }) => (
  <Block>
    <ScoreTable tableData={data} myAccount={myAccount} />
    { myAccount && <Block className={cx('ol-account')}>
      <Block className={cx('dot')} />
      <Paragraph className={cx('your')}>
                = YOUR ACCOUNT
            </Paragraph>
    </Block> }
  </Block>
)

const NoRows = () => (
  <Paragraph className={cx('norows')}>
        No rows found
    </Paragraph>
)

class Layout extends React.PureComponent {

    render() {
        const { data, myAccount } = this.props
        const hasRows = data && data.size > 1

        return (
          <Block>
            <PageFrame>
              <Block className={cx('trophy')}>
                <Img src={trophy} width="100" bordered />
                <Paragraph>Scoreboard</Paragraph>
              </Block>
              <Paragraph className={cx('explanation')}>
                The total score is calculated based on the sum of predicted profits and OLY
                tokens each wallet holds. Scores are updated every hour.
              </Paragraph>
              { hasRows
                ? <Table data={data} myAccount={myAccount} />
                : <NoRows />
              }
              <Block margin="xl" />
            </PageFrame>
          </Block>
        )
    }
}

export default Layout
