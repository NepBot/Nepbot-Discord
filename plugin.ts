import { IApi } from 'umi';

export default (api: IApi) => {
  api.addHTMLLinks(() => {
    return [
      {
        rel: 'icon',
        href: '/icon.svg',
        type: 'image/x-icon',
      },
    ];
  });
};
