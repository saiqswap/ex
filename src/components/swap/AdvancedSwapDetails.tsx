import { Trade, TradeType } from '@feswap/sdk'
import React, { useContext } from 'react'
//import styled, { ThemeContext } from 'styled-components'
import { ThemeContext } from 'styled-components'
import { Field } from '../../state/swap/actions'
import { useUserSlippageTolerance } from '../../state/user/hooks'
//import { TYPE, ExternalLink } from '../../theme'
import { TYPE } from '../../theme'
import { computeSlippageAdjustedAmounts } from '../../utils/prices'
import { AutoColumn } from '../Column'
import QuestionHelper from '../QuestionHelper'
import { RowBetween, RowFixed } from '../Row'
import FormattedPriceImpact from './FormattedPriceImpact'
import SwapRoute from './SwapRoute'
import { useActiveWeb3React } from '../../hooks'

/*
const InfoLink = styled(ExternalLink)`
  width: 100%;
  border: 1px solid ${({ theme }) => theme.bg4};
  padding: 6px 6px;
  border-radius: 8px;
  text-align: center;
  font-size: 14px;
  color: ${({ theme }) => theme.text1};
`
*/

function TradeSummary({ trade, allowedSlippage }: { trade: Trade; allowedSlippage: number }) {
  const { chainId } = useActiveWeb3React()
  const theme = useContext(ThemeContext)
  const priceImpact  = trade?.priceImpact
  const isExactIn = trade.tradeType === TradeType.EXACT_INPUT
  const slippageAdjustedAmounts = computeSlippageAdjustedAmounts(trade, allowedSlippage)

  return (
    <>
      <AutoColumn style={{ padding: '0 20px' }}>
        <RowBetween>
          <RowFixed>
            <TYPE.black fontSize={14} fontWeight={400} color={theme.text2}>
              {isExactIn ? 'Minimum received' : 'Maximum sold'}
            </TYPE.black>
            <QuestionHelper text="Your transaction will revert if there is a large, unfavorable price movement before it is confirmed." />
          </RowFixed>
          <RowFixed>
            <TYPE.black color={theme.text1} fontSize={14}>
              {isExactIn
                ? `${slippageAdjustedAmounts[Field.OUTPUT]?.toSignificant(4)} ${trade.outputAmount.currency.getSymbol(chainId)}` ??
                  '-'
                : `${slippageAdjustedAmounts[Field.INPUT]?.toSignificant(4)} ${trade.inputAmount.currency.getSymbol(chainId)}` ??
                  '-'}
            </TYPE.black>
          </RowFixed>
        </RowBetween>
        <RowBetween>
          <RowFixed>
            <TYPE.black fontSize={14} fontWeight={400} color={theme.text2}>
              Price Impact
            </TYPE.black>
            <QuestionHelper text="The difference between the market price and estimated price due to trade size." />
          </RowFixed>
          <FormattedPriceImpact priceImpact={priceImpact} />
        </RowBetween>
        <RowBetween>
          <RowFixed>
            <TYPE.black fontSize={14} fontWeight={400} color={theme.text2}>
              Liquidity Provider Fee
            </TYPE.black>
            <QuestionHelper text="FeSwap do NOT charge liquidity provider fee to exchange users, which could be 0.25-0.3% in 
                                  other DEXs. Instead we automatically capture profits for our liquidity providers 
                                  from the crypto intrinsic variability." />
          </RowFixed>
          <TYPE.black fontSize={14} color={theme.primary1}>
            FREE
          </TYPE.black>
        </RowBetween>
      </AutoColumn>
    </>
  )
}

export interface AdvancedSwapDetailsProps {
  trade?: Trade
}

export function AdvancedSwapDetails({ trade }: AdvancedSwapDetailsProps) {
  const theme = useContext(ThemeContext)

  const [allowedSlippage] = useUserSlippageTolerance()

  const showRoute = Boolean(trade && trade.route.path.length > 2)

  return (
    <AutoColumn>
      {trade && (
        <>
          <TradeSummary trade={trade} allowedSlippage={allowedSlippage} />
          {showRoute && (
              <AutoColumn style={{ padding: '0 20px' }}>
                <RowFixed>
                  <TYPE.black fontSize={14} fontWeight={400} color={theme.text2}>
                    Route
                  </TYPE.black>
                  <QuestionHelper text="Routing through these tokens resulted in the best price for your trade." />
                </RowFixed>
                <SwapRoute trade={trade} />
              </AutoColumn>
          )}
        </>
      )}
    </AutoColumn>
  )
}

//<AutoColumn style={{ padding: '0 20px' }}>
//  <InfoLink href={'https://info.feswap.io/pair/' + trade.route.pairs[0].liquidityToken0.address} target="_blank">
//    View pair analytics ↗
//  </InfoLink>
//  </AutoColumn>
