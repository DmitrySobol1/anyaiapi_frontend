import { Section, Cell, Button } from '@telegram-apps/telegram-ui';
import type { FC } from 'react';
import { useEffect, useState } from 'react';
import axios from '@/axios';
import { miniApp } from '@tma.js/sdk-react';

import { Page } from '@/components/Page.tsx';
import { TabbarMenu } from '@/components/TabbarMenu/TabbarMenu.tsx';

import CreditCardIcon from '@mui/icons-material/CreditCard';
import AddCardIcon from '@mui/icons-material/AddCard';

import { useTlgid } from '../../components/Tlgid';

export const MyAccountPage: FC = () => {
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const tlgid = useTlgid();

  const handlePaymentClick = async () => {
    try {
      // Отправляем сообщение боту через API
      await axios.post(`https://api.telegram.org/bot${import.meta.env.VITE_BOT_TOKEN}/sendMessage`, {
        chat_id: tlgid,
        text: 'нажмите 👉/pay , что бы пополнить баланс'
      });

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

        if (!tlgid) {
          console.error('Telegram user ID not found');
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `http://localhost:4444/getBalance?tlgid=${tlgid}`
        );

        if (response.data.status === 'success') {
          setBalance(response.data.balance);
        }
      } catch (error) {
        console.error('Error fetching balance:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();
  }, [tlgid]);

  return (
    <Page back={false}>
      <Section header="Личный кабинет">
        <Cell
        before = {<CreditCardIcon color="primary" />}
        after={loading ? 'Загрузка...' : `${balance ?? 0} ₽`}>
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

      <TabbarMenu />
    </Page>
  );
};
