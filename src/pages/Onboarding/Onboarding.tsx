import { Section, Cell, Spinner } from '@telegram-apps/telegram-ui';
import type { FC } from 'react';
import { useEffect, useState } from 'react';

import { Page } from '@/components/Page.tsx';


export const Onboarding: FC = () => {
  const [loading, setLoading] = useState(true);

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
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
          <Spinner size="m" />
        </div>
      ) : (
        <Section>
          <Cell>
            Onboarding page
          </Cell>
        </Section>
      )}
    </Page>
  );
};
