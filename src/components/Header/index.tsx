/**
 * @ Author: Hikaru
 * @ Create Time: 2023-02-08 02:53:11
 * @ Modified by: Hikaru
 * @ Modified time: 2023-03-30 20:44:03
 * @ Description: i@rua.moe
 */

import React from 'react';
import { history, useIntl } from '@umijs/max';
import classNames from 'classnames';
import styles from './style.less';
import { ReactComponent as Logo } from '@/assets/logo.svg';
import { ReactComponent as Popula } from '@/assets/brand/logo-popula.svg';
import { SiDiscord, SiGithub, SiGmail, SiMedium, SiPinterest, SiTwitter } from 'react-icons/si';
import { TfiYoutube } from 'react-icons/tfi';
import { Dropdown, MenuProps } from 'antd';

const Header: React.FC = () => {
  const pathname = history.location.pathname.substring(1);

  const intl = useIntl();
  console.log(location)

  const items: MenuProps['items'] = [
    {
      key: 'mainnet',
      label: (
        <div
          className={styles.buttonDropdownItem}
          onClick={() => {
            window.location.href = 'https://nepbot.org';
          }}
        >
          <div className={classNames(styles.buttonItemIcon, styles.buttonItemIconMainnet)} />
          Mainnet
        </div>
      ),
    },
    {
      key: 'testnet',
      label: (
        <div
          className={styles.buttonDropdownItem}
          onClick={() => {
            window.location.href = 'https://testnet.nepbot.org';
          }}
        >
          <div className={classNames(styles.buttonItemIcon, styles.buttonItemIconTestnet)} />
          Testnet
        </div>
      ),
    },
  ];

  return (
    <div className={styles.headerContainer}>
      <div className={styles.wrapper}>
        <div className={styles.logoContainer}>
          <Logo
            className={styles.logoImage}
            onClick={() => {
              history.push('/');
            }}
          />
        </div>
        <div className={styles.middleContainer}>
          <div className={styles.navContainer}>
            <div
              className={classNames(styles.navItem, pathname === '' && styles.navItemActive)}
              onClick={() => {
                history.push('/');
              }}
            >
              {intl.formatMessage({
                id: 'header.home',
              })}
            </div>
            <div
              className={classNames(styles.navItem, pathname === 'guide' && styles.navItemActive)}
              onClick={() => {
                history.push('/guide');
              }}
            >
              {intl.formatMessage({
                id: 'header.guide',
              })}
            </div>
            <div
              className={classNames(styles.navItem, pathname === 'blog' && styles.navItemActive)}
              onClick={() => {
                history.push('/blog');
              }}
            >
              {intl.formatMessage({
                id: 'header.blog',
              })}
            </div>
            <div
              className={classNames(styles.navItem, pathname === 'community' && styles.navItemActive)}
              onClick={() => {
                history.push('/community');
              }}
            >
              {intl.formatMessage({
                id: 'header.community',
              })}
            </div>
            <div
              className={classNames(styles.navItem, pathname === 'docs' && styles.navItemActive)}
              onClick={() => {
                history.push('/docs');
              }}
            >
              {intl.formatMessage({
                id: 'header.docs',
              })}
            </div>
            {/* <div
              className={classNames(styles.navItem, pathname === 'events' && styles.navItemActive)}
              onClick={() => {
                history.push('/events');
              }}
            >
              {intl.formatMessage({
                id: 'header.events',
              })}
            </div>
            <div
              className={classNames(styles.navItem, pathname === 'mint' && styles.navItemActive)}
              onClick={() => {
                history.push('/mint');
              }}
            >
              {intl.formatMessage({
                id: 'header.mint',
              })}
            </div> */}
          </div>
          <div className={styles.socialContainer}>
            <div
              className={styles.socialItem}
            >
              <Popula className={styles.socialItemImg} />
            </div>
            <div className={styles.socialItem}>
              <SiGithub className={styles.socialItemImg} />
            </div>
            <div className={styles.socialItem}>
              <SiTwitter className={styles.socialItemImg} />
            </div>
            <div className={styles.socialItem}>
              <SiDiscord className={styles.socialItemImg} />
            </div>
            <div className={styles.socialItem}>
              <TfiYoutube className={styles.socialItemImg} />
            </div>
            <div className={styles.socialItem}>
              <SiMedium className={styles.socialItemImg} />
            </div>
            <div
              className={styles.socialItem}
              onClick={() => {
                window.open('mailto:hi@nepbot.org');
              }}
            >
              <SiGmail className={styles.socialItemImg} />
            </div>
          </div>
        </div>
        <div className={styles.accountContainer}>
          {/* <div className={styles.buttonItem}>
            {intl.formatMessage({
              id: 'header.login',
            })}
          </div> */}
          <Dropdown
            menu={{ items }}
            overlayClassName={styles.buttonDropdown}
          >
            {location.hostname === 'nepbot.org' ? (
              <div
                className={styles.buttonItem}
                onClick={(e) => e.preventDefault()}
              >
                <div className={classNames(styles.buttonItemIcon, styles.buttonItemIconMainnet)} />
                Mainnet
              </div>
            ) : (
              <div
                className={styles.buttonItem}
                onClick={(e) => e.preventDefault()}
              >
                <div className={classNames(styles.buttonItemIcon, styles.buttonItemIconTestnet)} />
                Testnet
              </div>
            )}
          </Dropdown>
        </div>
      </div>
    </div>
  )
}

export default Header;