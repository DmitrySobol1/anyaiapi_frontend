import {
  Section,
  Spinner,
  Snackbar,
  Input,
  Tappable,
  Chip,
  Text,
  Cell,
} from '@telegram-apps/telegram-ui';
import type { FC } from 'react';
import { useState } from 'react';

import { Page } from '@/components/Page.tsx';
import { TabbarMenu } from '@/components/TabbarMenu/TabbarMenu.tsx';
import { useTlgid } from '../../components/Tlgid';
import axios from '../../axios';
import { hapticFeedback } from '@tma.js/sdk-react';
import { useEffect } from 'react';

export const Promocode: FC = () => {
  const [loading] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [promocodeValue, setPromocodeValue] = useState('');
  const [infoText, setInfoText] = useState('');
  const [infoType, setInfoType] = useState<'success' | 'error'>('error');
  const [showInfoText, setShowInfoText] = useState(false);
  const [isError, setIsError] = useState(false);

  const tlgid = useTlgid();

  // Добавляем CSS стили для конфетти
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .confetti {
        position: fixed;
        width: 10px;
        height: 10px;
        top: -10px;
        z-index: 9999;
        animation: confetti-fall linear forwards;
      }

      @keyframes confetti-fall {
        0% {
          transform: translateY(0) rotateZ(0deg);
          opacity: 1;
        }
        100% {
          transform: translateY(100vh) rotateZ(720deg);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

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

      // Создаем конфетти анимацию
      createConfettiAnimation();
    } catch (error) {
      console.error('Error showing confetti:', error);
    }
  };

  const createConfettiAnimation = () => {
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ffa500'];
    const confettiCount = 50;

    for (let i = 0; i < confettiCount; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      confetti.style.left = Math.random() * 100 + '%';
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.animationDelay = Math.random() * 0.3 + 's';
      confetti.style.animationDuration = Math.random() * 2 + 2 + 's';

      document.body.appendChild(confetti);

      // Удаляем конфетти после анимации
      setTimeout(() => {
        confetti.remove();
      }, 4000);
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

      // Проверяем наличие данных и статус ответа
      if (!response.data || response.data.status === 'error') {
        setIsError(true);
        return;
      }

      const { status, addedBalance } = response.data;

      if (status === 'notFound') {
        setInfoText('Не верный промокод');
        setInfoType('error');
        setShowInfoText(true);
        // Вибрация при ошибке
        if (hapticFeedback.notificationOccurred.isAvailable()) {
          hapticFeedback.notificationOccurred('error');
        }
      } else if (status === 'alreadyUsed') {
        setInfoText('Вы уже использовали этот промокод');
        setInfoType('error');
        setShowInfoText(true);
        // Вибрация при ошибке
        if (hapticFeedback.notificationOccurred.isAvailable()) {
          hapticFeedback.notificationOccurred('error');
        }
      } else if (status === 'success') {
        setInfoText(`Начислено ${addedBalance} баллов`);
        setInfoType('success');
        setShowInfoText(true);
        setPromocodeValue('');
        setShowSnackbar(true);
        // Показываем конфетти при успехе
        showConfetti();
      }
    } catch (error) {
      console.error('Error applying promocode:', error);
      setIsError(true);
    } finally {
      setBtnLoading(false);
    }
  };

  return (
    <Page back={true}>
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
