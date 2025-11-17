import { Section, List, Spinner } from '@telegram-apps/telegram-ui';
import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import axios from '../../axios';

import { useTlgid } from '../../components/Tlgid';

// import { Link } from '@/components/Link/Link.tsx';
import { Page } from '@/components/Page.tsx';

// import {TryLater} from '../../components/TryLater/TryLater.tsx'

export const EnterPage: FC = () => {
  const navigate = useNavigate();

    const tlgid = useTlgid();
  

  //   const [showTryLater, setShowTryLater] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEnter = async () => {
      try {
        const response = await axios.post('/api/enter', { tlgid: tlgid });

        if (!response || response.data.statusBE === 'notOk') {
          //   setShowTryLater(true);
          setIsLoading(false);
        }

        const { result } = response.data.userData;

        if (result === 'showOnboarding') {
          console.log('showOnboarding');

          // const nowpaymentid = response.data.userData.nowpaymentid;

          navigate('/onboarding');
        } else if (result === 'showIndexPage') {
          console.log('showIndexpage');
          // const nowpaymentid = response.data.userData.nowpaymentid;
          navigate('/index');
        }
      } catch (error) {
        console.error('Ошибка при выполнении запроса:', error);
        // setShowTryLater(true);
        setIsLoading(false);
      }
    };
    fetchEnter();
  }, []);

  return (
    <Page>
      {isLoading ? (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '300px',
            gap: '20px',
          }}
        >
          <Spinner size="m" />
          <div style={{ color: 'var(--tgui--hint_color)', fontSize: '14px' }}>
            Загрузка...
          </div>
        </div>
      ) : (
        <List>
          <Section></Section>
        </List>
      )}

      {/* {showTryLater && <TryLater/>} */}
    </Page>
  );
};
