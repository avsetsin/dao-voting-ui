import type { VotingAbi, ExecuteVoteEventObject } from 'generated/VotingAbi'

export async function getEventExecuteVote(
  contractVoting: VotingAbi,
  voteId: string | number,
  block?: string | number,
) {
  const filter = contractVoting.filters.ExecuteVote(Number(voteId))
  const events = await contractVoting.queryFilter(
    filter,
    block ? Number(block) : undefined,
  )
  const event = events[0]
  if (!events[0]) return undefined
  if (!event.decode) {
    throw new Error('ExecuteVote event decoding error')
  }
  const decoded: ExecuteVoteEventObject = event.decode(event.data, event.topics)
  return {
    event,
    decoded,
  }
}
