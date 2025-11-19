import {
  Section,
  Spinner,
  Snackbar,
  Input,
  Tappable,
  Chip,
  Text,
  Button,
} from '@telegram-apps/telegram-ui';
import type { FC } from 'react';
import { useState } from 'react';

import { Page } from '@/components/Page.tsx';
import { TabbarMenu } from '@/components/TabbarMenu/TabbarMenu.tsx';
import { useTlgid } from '../../components/Tlgid';
import axios from '../../axios';
import { postEvent, hapticFeedback } from '@tma.js/sdk-react';

export const Promocode: FC = () => {
  const [loading] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [promocodeValue, setPromocodeValue] = useState('');
  const [infoText, setInfoText] = useState('');
  const [infoType, setInfoType] = useState<'success' | 'error'>('error');
  const [showInfoText, setShowInfoText] = useState(false);

  const tlgid = useTlgid();

  const handlePromocodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPromocodeValue(e.target.value);
    if (showInfoText) {
      setShowInfoText(false);
    }
  };

  const showConfetti = () => {
    try {
      // Показываем haptic feedback (вибрация успеха)
      if (hapticFeedback.notificationOccurred.isAvailable()) {
        hapticFeedback.notificationOccurred('success');
      }

      // Пробуем вызвать конфетти через прямое обращение к Telegram WebApp API
      if (typeof window !== 'undefined' && (window as any).Telegram?.WebApp) {
        const tg = (window as any).Telegram.WebApp;

        // Некоторые версии Telegram поддерживают showConfetti
        if (typeof tg.showConfetti === 'function') {
          tg.showConfetti();
        }

        // Или используем postEvent напрямую
        postEvent('web_app_trigger_haptic_feedback', {
          type: 'notification',
          notification_type: 'success'
        });
      }
    } catch (error) {
      console.error('Error showing confetti:', error);
    }
  };

  const handleApplyPromocode = async () => {
    if (!promocodeValue.trim()) {
      setInfoText('Введите промокод');
      setInfoType('error');
      setShowInfoText(true);
      return;
    }

    setBtnLoading(true);
    setShowInfoText(false);

    try {
      const response = await axios.post('/api/applyPromocode', {
        promocode: promocodeValue.trim(),
        tlgid: tlgid,
      });

      const { status,  addedBalance } = response.data;

      if (status === 'notFound') {
        setInfoText('Не верный промокод');
        setInfoType('error');
        setShowInfoText(true);
      } else if (status === 'alreadyUsed') {
        setInfoText('Вы уже использовали этот промокод');
        setInfoType('error');
        setShowInfoText(true);
      } else if (status === 'success') {
        setInfoText(`Начислено ${addedBalance} баллов`);
        setInfoType('success');
        setShowInfoText(true);
        setPromocodeValue('');
        setShowSnackbar(true);
      }
    } catch (error) {
      console.error('Error applying promocode:', error);
      setInfoText('Произошла ошибка при применении промокода');
      setInfoType('error');
      setShowInfoText(true);
    } finally {
      setBtnLoading(false);
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
          <Section header="Использовать промокод">
            <>
              <Input
                status="focused"
                header="введите промокод"
                placeholder="сюда"
                value={promocodeValue}
                onChange={handlePromocodeChange}
                after={
                  <Tappable
                    Component="div"
                    style={{ display: 'flex' }}
                    onClick={handleApplyPromocode}
                  >
                    <Chip
                      mode="outline"
                      style={{
                        backgroundColor: '#a2d7f6ff',
                        padding: '3px 15px 3px 15px',
                        color: 'white',
                      }}
                    >
                      {btnLoading ? <Spinner size="s" /> : 'применить'}
                    </Chip>
                  </Tappable>
                }
              />

              {showInfoText && (
                <Text
                  weight="3"
                  style={{
                    paddingLeft: 22,
                    marginTop: 10,
                    color: infoType === 'success' ? 'green' : 'red',
                  }}
                >
                  {infoText}
                </Text>
              )}
            </>

            <Button onClick={showConfetti}>Показать конфетти</Button>
          </Section>
        </>
      )}

      {showSnackbar && (
        <Snackbar onClose={() => setShowSnackbar(false)} duration={3000}>
          Промокод успешно применен!
        </Snackbar>
      )}

      <TabbarMenu />
    </Page>
  );
};
