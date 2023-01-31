import styled from 'styled-components'

export const TermsStyle = styled.label`
  display: flex;
  align-items: center;
  font-size: ${({ theme }) => theme.fontSizesMap.sm}px;
  padding: ${({ theme }) => theme.spaceMap.lg}px;
  margin-bottom: ${({ theme }) => theme.spaceMap.md}px;
  border-radius: ${({ theme }) => theme.borderRadiusesMap.lg}px;
  background: var(--lido-color-backgroundSecondary);
  cursor: pointer;
`

export const TermsTextStyle = styled.span`
  margin-left: ${({ theme }) => theme.spaceMap.lg}px;
`
