import { Section, Cell } from '@telegram-apps/telegram-ui';
import type { FC } from 'react';

import { Page } from '@/components/Page.tsx';


export const Onboarding: FC = () => {
  return (
    <Page back={false}>
        <Section>
          <Cell>
            Onboarding page

          </Cell>
        </Section>
    </Page>
  );
};
