import React from 'react';
import {
  createCache,
  extractStyle as extStyle,
  StyleProvider,
} from '@ant-design/cssinjs';
import * as antd from 'antd';
import { renderToString } from 'react-dom/server';
import type { CustomRender } from './interface';
import { ConfigProvider } from 'antd';
const blackList: string[] = [
  'ConfigProvider',
  'Drawer',
  'Grid',
  'Modal',
  'Popconfirm',
  'Popover',
  'Tooltip',
  'Tour',
];

const defaultNode = (keys?: Record<string, any>) => (
  <>
    {Object.keys(keys || antd)
      .filter(
        (name) =>
          !blackList.includes(name) && name[0] === name[0].toUpperCase(),
      )
      .map((compName) => {
        const Comp = antd[compName];
        if (compName === 'Dropdown') {
          return (
            <Comp
              key={compName}
              menu={{ items: [] }}
            >
                <div />
            </Comp>
          );
        }
        return <Comp key={compName} />;
      })}
  </>
);

export function extractStyle(customTheme?: CustomRender, keys?: Record<string, any>): string {
  const cache = createCache();
  renderToString(
    <StyleProvider cache={cache} hashPriority="high">
      <ConfigProvider theme={{ hashed: false }}>
        {customTheme ? customTheme(defaultNode(keys)) : defaultNode(keys)}
      </ConfigProvider>
    </StyleProvider>,
  );

  // Grab style from cache
  const styleText = extStyle(cache, true);

  return styleText;
}
