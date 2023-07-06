import { useState, useCallback } from 'react'
import { useRouter } from 'next/dist/client/router'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import { useScrollLock } from 'modules/shared/hooks/useScrollLock'
import Link from 'next/link'
import { NoSSRWrapper } from 'modules/shared/ui/Utils/NoSSRWrapper'
import { HeaderWallet } from '../HeaderWallet'
import { Text, ThemeToggler } from '@lidofinance/lido-ui'
import { HeaderVoteInput } from 'modules/votes/ui/HeaderVoteInput'
import {
  Wrap,
  Logo,
  Nav,
  NavItems,
  NavLink,
  InputWrap,
  ActionsDesktop,
  Network,
  NetworkBulb,
  BurgerWrap,
  BurgerLine,
  MobileMenu,
  MobileMenuScroll,
  MobileNavItems,
  MobileNetworkWrap,
  MobileSpacer,
  NavBurger,
  ThemeTogglerWrap,
} from './HeaderStyle'

import { getChainName } from 'modules/blockChain/chains'
import { getChainColor } from '@lido-sdk/constants'
import LidoLogoSvg from 'assets/logo.com.svg.react'
import * as urls from 'modules/network/utils/urls'

function NavItem({
  link,
  activeOn,
  onClick,
  children,
}: {
  link: string
  activeOn?: (string | { url: string; exact: boolean })[]
  onClick?: React.MouseEventHandler<HTMLElement>
  children: React.ReactNode
}) {
  const { asPath } = useRouter()

  const isActive = activeOn
    ? activeOn.some(v => {
        if (typeof v === 'object' && v.exact) {
          return asPath === v.url
        }
        const testUrl = typeof v === 'object' ? v.url : v
        return asPath.startsWith(testUrl)
      })
    : asPath.startsWith(link)

  return (
    <Link passHref href={link}>
      <NavLink isActive={isActive} onClick={onClick}>
        <div>{children}</div>
      </NavLink>
    </Link>
  )
}

export function Header() {
  const { chainId } = useWeb3()
  const [isBurgerOpened, setBurgerOpened] = useState(false)
  const handleCloseMobileMenu = useCallback(() => setBurgerOpened(false), [])
  useScrollLock(isBurgerOpened)

  return (
    <>
      <Wrap>
        <Nav>
          <Logo>
            <LidoLogoSvg />
          </Logo>
          <NavItems>
            <NavItem
              link={urls.home}
              activeOn={[
                { url: urls.home, exact: true },
                urls.voteIndex,
                urls.dashboardIndex,
              ]}
            >
              Vote
            </NavItem>
            <NavItem link={urls.settings}>Settings</NavItem>
          </NavItems>
        </Nav>

        <InputWrap>
          <HeaderVoteInput />
        </InputWrap>

        <ActionsDesktop>
          <Network>
            <NetworkBulb color={getChainColor(chainId)} />
            <Text size="xs" weight={500}>
              {getChainName(chainId)}
            </Text>
          </Network>
          <NoSSRWrapper>
            <HeaderWallet />
          </NoSSRWrapper>
          <ThemeTogglerWrap>
            <ThemeToggler />
          </ThemeTogglerWrap>
        </ActionsDesktop>

        <NavBurger>
          <BurgerWrap
            isOpened={isBurgerOpened}
            onClick={() => setBurgerOpened(!isBurgerOpened)}
          >
            <BurgerLine />
            <BurgerLine />
            <BurgerLine />
          </BurgerWrap>
        </NavBurger>

        {isBurgerOpened && (
          <>
            <MobileNavItems>
              <NavItem
                link={urls.home}
                activeOn={[
                  { url: urls.home, exact: true },
                  urls.voteIndex,
                  urls.dashboardIndex,
                ]}
                onClick={handleCloseMobileMenu}
              >
                Vote
              </NavItem>
              <NavItem link={urls.settings} onClick={handleCloseMobileMenu}>
                Settings
              </NavItem>
            </MobileNavItems>

            <MobileMenu>
              <MobileMenuScroll>
                <MobileNetworkWrap>
                  <ThemeTogglerWrap>
                    <ThemeToggler />
                  </ThemeTogglerWrap>
                  <HeaderWallet />
                  <Network>
                    <Text size="xs" weight={500}>
                      {getChainName(chainId)}
                    </Text>
                    <NetworkBulb color={getChainColor(chainId)} />
                  </Network>
                </MobileNetworkWrap>
              </MobileMenuScroll>
            </MobileMenu>
          </>
        )}
        <MobileSpacer />
      </Wrap>
    </>
  )
}
