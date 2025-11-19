import {
  Section,
  Cell,
  Spinner,
  List,
  Divider,
  Snackbar,
} from '@telegram-apps/telegram-ui';
import type { FC } from 'react';
import { useState } from 'react';

import { Page } from '@/components/Page.tsx';
import { TabbarMenu } from '@/components/TabbarMenu/TabbarMenu.tsx';

// import { useTlgid } from '../../components/Tlgid';

export const Help: FC = () => {
  const [loading] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);

  //   const tlgid = useTlgid();

  const handleCopy = async (text: string) => {
    try {
      let textForCopy = '';

      if (text == 'baseurl') {
        textForCopy = 'https://any-ai-api.ru/api/';
      } else if (text == 'header') {
        textForCopy = 'Authorization: Bearer {token}';
      } else if (text == 'request') {
        textForCopy = '{ "input": "здесь ваш запрос к ИИ" }';
      }

      await navigator.clipboard.writeText(textForCopy);
      setShowSnackbar(true);
      setTimeout(() => {
        setShowSnackbar(false);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <Page back={true}>
      {loading ? (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '200px',
          }}
        >
          <Spinner size="m" />
        </div>
      ) : (
        <>
          <Section
            header="Как использовать Any AI Api"
            footer="Нажмите на любой пункт, что бы скопировать в буфер обмена"
          >
            <Cell
              subtitle="https://any-ai-api.ru/api/"
              onClick={() => handleCopy('baseurl')}
              style={{ cursor: 'pointer' }}
            >
              Базовый url:
            </Cell>
            <Cell
              multiline
              subtitle="Authorization: Bearer {token}"
              description="параметр {token} - это ключ от AI модели, который вы получаете на вкладке «Все AI модели» "
              onClick={() => handleCopy('header')}
              style={{ cursor: 'pointer' }}
            >
              В каждом запросе необходимо передавать Header
            </Cell>
          </Section>

          <List
            style={{
              background: 'var(--tgui--secondary_bg_color)',
              padding: '10px 0px 0px 0px',
            }}
          >
            <div
              style={{
                background: 'var(--tgui--bg_color)',
              }}
            >
              <Divider />
            </div>
          </List>

          <Section header="Методы" style={{ marginBottom: 100 }}>
            <Cell
              multiline
              subtitle={
                <>
                  <div>
                    https://any-ai-api.ru/api/<b>request</b>
                  </div>
                  <div>Body в JSON формате:</div>
                  <div>
                    {'{'} "input": "здесь ваш запрос к ИИ" {'}'}{' '}
                  </div>
                </>
              }
              onClick={() => handleCopy('request')}
              style={{ cursor: 'pointer' }}
            >
              /request - ответ от ИИ в текстовом формате
            </Cell>
          </Section>
        </>
      )}

      <TabbarMenu />

      {showSnackbar && (
        <Snackbar onClose={() => setShowSnackbar(false)} duration={2000}>
          Скопировано
        </Snackbar>
      )}
    </Page>
  );
};
