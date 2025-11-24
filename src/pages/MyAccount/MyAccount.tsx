import { Section, Cell, Button, Spinner, List, Divider } from '@telegram-apps/telegram-ui';
import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '@/axios';
import { miniApp } from '@tma.js/sdk-react';

import { Page } from '@/components/Page.tsx';
import { TabbarMenu } from '@/components/TabbarMenu/TabbarMenu.tsx';

import CreditCardIcon from '@mui/icons-material/CreditCard';
import AddCardIcon from '@mui/icons-material/AddCard';
import ManageHistoryIcon from '@mui/icons-material/ManageHistory';
import LoyaltyIcon from '@mui/icons-material/Loyalty';
import LiveHelpIcon from '@mui/icons-material/LiveHelp';

import { Icon16Chevron } from '@telegram-apps/telegram-ui/dist/icons/16/chevron';

import { useTlgid } from '../../components/Tlgid';

export const MyAccountPage: FC = () => {
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const navigate = useNavigate();
  const tlgid = useTlgid();

  const handlePaymentClick = async () => {
    try {
      // Отправляем сообщение боту через API
      await axios.post(
        `https://api.telegram.org/bot${
          import.meta.env.VITE_BOT_TOKEN
        }/sendMessage`,
        {
          chat_id: tlgid,
          text: 'нажмите 👉/pay , что бы пополнить баланс',
        }
      );

      // Сворачиваем Mini App
      const tg = (window as any).Telegram?.WebApp;
      if (tg?.minimize) {
        tg.minimize();
      } else if (miniApp.close.isAvailable()) {
        miniApp.close();
      }
    } catch (error) {
      console.error('Error sending message to bot:', error);
    }
  };

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        setLoading(true);
        setIsError(false);

        if (!tlgid) {
          console.error('Telegram user ID not found');
          setLoading(false);
          return;
        }

        const response = await axios.get('/api/getBalance', {
          params: { tlgid },
        });

        // Проверяем наличие данных и статус ответа
        if (!response.data || response.data.status === 'error') {
          setIsError(true);
          return;
        }

        setBalance(response.data.balance);
      } catch (error) {
        console.error('Error fetching balance:', error);
        setIsError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();
  }, [tlgid]);

  return (
    <Page back={false}>
      {loading && (
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
      )}

      {isError && (
        <Section>
          <Cell subtitle="переазгрузите страницу">
            Упс ... что-то пошло не так
          </Cell>
        </Section>
      )}

      {!loading && !isError && (
        <>
          <Section header="Личный кабинет">
            <Cell
              before={<CreditCardIcon color="primary" />}
              after={`${balance ?? 0} ₽`}
            >
              Баланс
            </Cell>

            <Cell>
              <Button
                before={<AddCardIcon />}
                mode="filled"
                size="m"
                onClick={handlePaymentClick}
              >
                Пополнить баланс
              </Button>
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

          <Section>

            <Cell
              after={<Icon16Chevron color='#40a7e3'/>}
               onClick={() => navigate('/promocode-page')}
               before={<LoyaltyIcon color='primary'/>}
            >
              Использовать промокод
            </Cell>  

            <Cell
              after={<Icon16Chevron color='#40a7e3' />}
              onClick={() => navigate('/rqsthistory-page')}
              style={{ cursor: 'pointer' }}
              before={<ManageHistoryIcon color='primary'/>}
            >
              История запросов
            </Cell>
            
            

            <Cell
              after={<Icon16Chevron color='#40a7e3'/>}
               onClick={() => navigate('/help-page')}
               before={<LiveHelpIcon color='primary'/>}
            >
              Документация
            </Cell>
            
          </Section>
        </>
      )}

      <TabbarMenu />
    </Page>
  );
};
