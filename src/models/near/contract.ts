/**
 * @ Author: Hikaru
 * @ Create Time: 2023-03-16 16:28:58
 * @ Modified by: Hikaru
 * @ Modified time: 2023-03-16 16:56:58
 * @ Description: 
 */

import { useModel } from '@umijs/max';
import { Contract } from 'near-api-js';
import { useCallback, useState } from 'react';

export default () => {
  const { nearAccount } = useModel('near.account');
  const [nearContract, setNearContract] = useState<Contract | null>(null);

  const InitContract = useCallback(
    ({
      contractId,
      methodOptions,
    }: {
      contractId: string;
      methodOptions: {
        viewMethods: string[];
        changeMethods: string[];
      };
    }) => {
      if (!!nearAccount) {
        const contract = new Contract(nearAccount, contractId, methodOptions);

        setNearContract(contract);
      }
    },
    [],
  );

  return {
    nearContract,
    InitContract,
  };
};
