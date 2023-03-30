/**
 * @ Author: Hikaru
 * @ Create Time: 2023-02-16 04:16:28
 * @ Modified by: Hikaru
 * @ Modified time: 2023-03-31 04:46:39
 * @ Description: i@rua.moe
 */

import React from 'react';
import styles from './style.less';
import { ReactComponent as Popula } from '@/assets/brand/logo-popula.svg';
import { SiDiscord, SiGithub, SiGmail, SiMedium, SiTwitter } from 'react-icons/si';
import { TfiYoutube } from 'react-icons/tfi';

const Footer: React.FC = () => {
  return (
    <div className={styles.footerContainer}>
      <div className={styles.wrapper}>
        <div className={styles.snsContainer}>
          <div
            className={styles.snsItem}
            onClick={() => {
              window.open('https://popula.io/', '_blank');
            }}
          >
            <Popula className={styles.snsImage} />
          </div>
          <div
            className={styles.snsItem}
            onClick={() => {
              window.open('https://github.com/NepBot', '_blank');
            }}
          >
            <SiGithub className={styles.snsImage} />
          </div>
          <div
            className={styles.snsItem}
            onClick={() => {
              window.open('https://twitter.com/nepbot4near', '_blank');
            }}
          >
            <SiTwitter className={styles.snsImage} />
          </div>
          <div
            className={styles.snsItem}
            onClick={() => {
              window.open('https://discord.gg/d8u6YHgDMP', '_blank');
            }}
          >
            <SiDiscord className={styles.snsImage} />
          </div>
          <div
            className={styles.snsItem}
            onClick={() => {
              window.open('https://www.youtube.com/@nepbot3934', '_blank');
            }}
          >
            <TfiYoutube className={styles.snsImage} />
          </div>
          <div
            className={styles.snsItem}
            onClick={() => {
              window.open('https://medium.com/nepbot', '_blank');
            }}
          >
            <SiMedium className={styles.snsImage} />
          </div>
          <div
            className={styles.snsItem}
            onClick={() => {
              window.open('mailto:hi@nepbot.org');
            }}
          >
            <SiGmail className={styles.snsImage} />
          </div>
        </div>
      </div>
    </div>
  )
};

export default Footer;
