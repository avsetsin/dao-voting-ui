import { CHAINS } from '@lido-sdk/constants'
import { useLidoSWR } from '@lido-sdk/react'
import { ContractVoting } from 'modules/blockChain/contracts'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import {
  DELEGATORS_FETCH_SIZE,
  DELEGATORS_FETCH_TOTAL,
  VP_MIN_TO_SHOW,
} from '../constants'
import { BigNumber } from 'ethers'

export function useDelegators() {
  const { walletAddress, chainId } = useWeb3()
  const voting = ContractVoting.useRpc()
  return useLidoSWR(
    walletAddress
      ? [`swr:useDelegatorsPaginatedList`, chainId, walletAddress]
      : null,
    async (_key: string, _chainId: CHAINS, _walletAddress: string) => {
      const delegatorsCount = (
        await voting.getDelegatedVotersCount(_walletAddress)
      ).toNumber()

      if (delegatorsCount === 0) {
        return {
          totalCount: 0,
          fetchedCount: 0,
          wealthyCount: 0,
          list: [] as { address: string; balance: BigNumber }[],
          fetchedValue: 0,
        }
      }

      const fetchLimit = Math.min(delegatorsCount, DELEGATORS_FETCH_TOTAL)
      const fetchCount = Math.ceil(fetchLimit / DELEGATORS_FETCH_SIZE)
      const fetchNumbers = Array(fetchCount)
        .fill(0)
        .map((_, i) => i)

      const delegators: { address: string; balance: BigNumber }[] = []
      let fetchedValue = BigNumber.from(0)
      console.log(fetchCount)

      for (const fetchNumber of fetchNumbers) {
        const delegatorsAtPage = await voting.getDelegatedVoters(
          _walletAddress,
          fetchNumber * DELEGATORS_FETCH_SIZE,
          DELEGATORS_FETCH_SIZE,
        )

        if (delegatorsAtPage.length === 0) {
          continue
        }

        const delegatorsAtPageBalances = await voting.getVotingPowerMultiple(
          delegatorsAtPage,
        )

        delegatorsAtPage.forEach((delegator, index) => {
          delegators.push({
            address: delegator,
            balance: delegatorsAtPageBalances[index],
          })
          console.log(delegatorsAtPageBalances[index].toString())
          fetchedValue = fetchedValue.add(delegatorsAtPageBalances[index])
        })
      }
      console.log(delegators)
      const fetchedCount = delegators.length
      console.log(delegators.length)

      const wealthyDelegators = delegators.filter(delegator =>
        delegator.balance.gt(VP_MIN_TO_SHOW),
      )
      console.log(wealthyDelegators)
      console.log({
        totalCount: delegatorsCount,
        fetchedCount,
        wealthyCount: wealthyDelegators.length,
        list: wealthyDelegators,
        fetchedValue,
      })
      return {
        totalCount: delegatorsCount,
        fetchedCount,
        wealthyCount: wealthyDelegators.length,
        list: wealthyDelegators,
        fetchedValue,
      }
    },
  )
}
