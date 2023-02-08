/**
 * @ Author: Hikaru
 * @ Create Time: 2023-02-08 02:53:11
 * @ Modified by: Hikaru
 * @ Modified time: 2023-02-08 21:16:01
 * @ Description: i@rua.moe
 */

import React, { useState } from 'react';
import { history, useIntl } from '@umijs/max';
import classNames from 'classnames';
import styles from './style.less';
import { ReactComponent as Logo } from '@/assets/logo.svg';
import { ReactComponent as Popula } from '@/assets/brand/logo-popula.svg';
import { ReactComponent as Twitter } from '@/assets/brand/logo-twitter.svg';
import { ReactComponent as Facebook } from '@/assets/brand/logo-facebook.svg';
import { ReactComponent as Instagram } from '@/assets/brand/logo-instagram.svg';
import { SiPinterest } from 'react-icons/si';

const Header: React.FC = () => {
  const pathname = history.location.pathname.substring(1);

  const intl = useIntl();

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
            <div
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
            </div>
          </div>
          <div className={styles.socialContainer}>
            <div className={styles.socialItem}>
              <Popula />
            </div>
            <div className={styles.socialItem}>
              <Twitter />
            </div>
            <div className={styles.socialItem}>
              <Facebook />
            </div>
            <div className={styles.socialItem}>
              <Instagram />
            </div>
            <div className={styles.socialItem}>
              <SiPinterest />
            </div>
          </div>
        </div>
        <div className={styles.accountContainer}>
          <div className={styles.buttonItem}>
            {intl.formatMessage({
              id: 'header.login',
            })}
          </div>
          <div className={styles.buttonItem}>
            <div className={styles.buttonItemIcon} />
            Mainnet
          </div>
        </div>
      </div>
    </div>
  )
}

export default Header;