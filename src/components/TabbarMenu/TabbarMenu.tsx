import { Tabbar } from '@telegram-apps/telegram-ui';
import type { FC } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect, useMemo, useCallback } from 'react';

import PersonIcon from '@mui/icons-material/Person';

import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import DomainVerificationIcon from '@mui/icons-material/DomainVerification';

import { ROUTES } from '@/constants/routes.ts';

export const TabbarMenu: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = useMemo(
    () => [
      {
        id: 1,
        text: 'Мои токены',
        Icon: DomainVerificationIcon,
        path: ROUTES.INDEX,
      },
      {
        id: 2,
        text: 'Все модели',
        Icon: FormatListBulletedIcon,
        path: ROUTES.LIST_MODELS,
      },
      {
        id: 3,
        text: 'Кабинет',
        Icon: PersonIcon,
        path: ROUTES.MY_ACCOUNT,
      },
    ],
    ['Мои токены', 'Все модели', 'Кабинет']
  );

  const getInitialTab = useCallback(() => {
    const currentTab = tabs.find((tab) => tab.path === location.pathname);
    return currentTab ? currentTab.id : tabs[0].id;
  }, [tabs, location.pathname]);

  const [currentTab, setCurrentTab] = useState(getInitialTab());

  // Синхронизируем состояние при изменении URL через навигацию вручную
  useEffect(() => {
    const currentTab = tabs.find((tab) => tab.path === location.pathname);
    if (currentTab) {
      setCurrentTab(currentTab.id);
    }
  }, [location.pathname, tabs]);

  const changePage = useCallback(
    (id: number) => {
      const tab = tabs.find((t) => t.id === id);
      if (tab) {
        setCurrentTab(id);
        navigate(tab.path);
      }
    },
    [tabs, navigate]
  );

  return (
    <Tabbar>
      {tabs.map(({ id, text, Icon }) => (
        <Tabbar.Item
          key={id}
          text={text}
          selected={id === currentTab}
          onClick={() => changePage(id)}
        >
          <Icon />
        </Tabbar.Item>
      ))}
    </Tabbar>
  );
};
