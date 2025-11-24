import {
  Section,
  Cell,
  Spinner,
  Checkbox,
  Caption,
  Button,
  Divider,
  List,
} from '@telegram-apps/telegram-ui';
import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Page } from '@/components/Page.tsx';

export const Onboarding: FC = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Имитация загрузки данных или инициализации
    const initOnboarding = async () => {
      try {
        setLoading(true);
        // Здесь можно добавить загрузку данных для онбординга
        // await fetch(...)
      } catch (error) {
        console.error('Error initializing onboarding:', error);
      } finally {
        setLoading(false);
      }
    };

    initOnboarding();
  }, []);

  return (
    <Page back={false}>
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
        <Section>
          <Cell multiline>Any AI - это доступ к API нейронок через единый endpoint</Cell>

          <Cell multiline before={<Checkbox defaultChecked />}>
            <Caption level="1" weight="3">
              без регистрации в личных кабинетах ИИ
            </Caption>
          </Cell>
          <Cell multiline before={<Checkbox defaultChecked />}>
            <Caption level="1" weight="3">
              без покупки иностранных номеров телефонов
            </Caption>
          </Cell>
          <Cell multiline before={<Checkbox defaultChecked />}>
            <Caption level="1" weight="3">
              с оплатой в рублях
            </Caption>
          </Cell>
          <Cell multiline before={<Checkbox defaultChecked />}>
            <Caption level="1" weight="3">
              работает без VPN
            </Caption>
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
 <Section style={{ marginBottom: 100 }}>

          
          <Cell multiline>
            Документация по настройке сервиса находится в разделе Кабинет - Документация
          </Cell>

          <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <Button
            style={{ width: '90%', marginBottom: 15 }}
            onClick={() => navigate('/index')}
            >
              Далее
            </Button>
          </div>
        </Section>
        </>
      )}
    </Page>
  );
};
