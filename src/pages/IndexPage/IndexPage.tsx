import {
  Section,
  Cell,
  Snackbar,
  Tappable,
  Modal,
  Button,
  Placeholder,
  Spinner,
} from '@telegram-apps/telegram-ui';
import { FC, useEffect, useState } from 'react';

import { Page } from '@/components/Page.tsx';

import { TabbarMenu } from '@/components/TabbarMenu/TabbarMenu.tsx';

import { useTlgid } from '../../components/Tlgid';
// import { tlTL } from '@mui/material/locale';

import axios from '@/axios';
import { ModalHeader } from '@telegram-apps/telegram-ui/dist/components/Overlays/Modal/components/ModalHeader/ModalHeader';
import Chip from '@mui/material/Chip';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

interface AiModel {
  _id: string;
  nameForUser: string;
  nameForRequest: string;
  createdAt: string;
  updatedAt: string;
}

interface ChosenModel {
  _id: string;
  aiModelLink: AiModel;
  userLink: any;
  tlgid: string;
  token: string;
  createdAt: string;
  updatedAt: string;
}

export const IndexPage: FC = () => {
  const [chosenModels, setChosenModels] = useState<ChosenModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [modelToDelete, setModelToDelete] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);

  const tlgid = useTlgid();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setIsError(false);

        // Получаем выбранные модели пользователя
        if (tlgid) {
          const chosenResponse = await axios.get('/api/getUserChosenModels', {
            params: { tlgid },
          });

          // Проверяем наличие данных и статус ответа
          if (
            !chosenResponse.data ||
            chosenResponse.data.status === 'error'
          ) {
            setIsError(true);
            return;
          }

          setChosenModels(chosenResponse.data.models || []);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setIsError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [tlgid]);

  const handleCopyToken = async (token: string) => {
    try {
      await navigator.clipboard.writeText(token);
      setSnackbarMessage('Токен скопирован');
      setShowSnackbar(true);
      setTimeout(() => {
        setShowSnackbar(false);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy token:', err);
    }
  };

  const handleDelete = (e: React.MouseEvent, chosenModelId: string) => {
    e.stopPropagation(); // Предотвращаем всплытие события
    setModelToDelete(chosenModelId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!modelToDelete) return;

    try {
      const response = await axios.delete('/api/deleteChosenModel', {
        data: { chosenModelId: modelToDelete },
      });

      // Проверяем статус ответа удаления
      if (!response.data || response.data.status === 'error') {
        setIsError(true);
        return;
      }

      console.log('Model deleted:', response.data);

      // Обновляем список выбранных моделей
      const chosenResponse = await axios.get('/api/getUserChosenModels', {
        params: { tlgid },
      });

      // Проверяем наличие данных и статус ответа
      if (
        !chosenResponse.data ||
        chosenResponse.data.status === 'error'
      ) {
        setIsError(true);
        return;
      }

      setChosenModels(chosenResponse.data.models || []);

      // Показываем Snackbar
      setSnackbarMessage('Успешно удалено');
      setShowSnackbar(true);
      setTimeout(() => {
        setShowSnackbar(false);
      }, 2000);

      console.log('удалено');
    } catch (err: any) {
      console.error('Error deleting model:', err);
      console.error('Error response:', err.response?.data);
      setIsError(true);
    } finally {
      setShowDeleteModal(false);
      setModelToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setModelToDelete(null);
  };

  return (
    <Page back={false}>
      {isError && (
        <Section>
          <Cell
          subtitle='переазгрузите страницу'
          >Упс ... что-то пошло не так</Cell>
        </Section>
      )}

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

      {/* {error && <Cell>Ошибка: {error}</Cell>} */}

      {!loading && !isError && (
        <Section
          header="Мои API ключи"
          footer="Нажмите на ключ, что бы скопировать в буфер обмена"
          style={{ marginBottom: 100 }}
        >
          {chosenModels.length === 0 && (
            <Cell
              multiline
              subtitle="cоздайте свой первый API ключ на вкладке «Все AI модели»"
            >
              Нет полученных ключей
            </Cell>
          )}

          {chosenModels.map((chosen) => (
            <Cell
              key={chosen._id}
              subtitle={`ваш токен: ${chosen.token}`}
              onClick={() => handleCopyToken(chosen.token)}
              style={{ cursor: 'pointer' }}
              after={
                <span onClick={(e) => handleDelete(e, chosen._id)}>
                  <Tappable
                    Component="div"
                    style={{
                      display: 'flex',
                      color: '#168acd',
                      fontWeight: '600',
                    }}
                  >
                    <Chip
                      label="удалить"
                      size="small"
                      variant="outlined"
                      color="warning"
                      icon={<HighlightOffIcon />}
                    />
                  </Tappable>
                </span>
              }

              // description={chosen.aiModelLink.nameForRequest}
            >
              {chosen.aiModelLink.nameForUser}
            </Cell>
          ))}
        </Section>
      )}

      <TabbarMenu />

      {showDeleteModal && (
        <Modal
          header={<ModalHeader>Подтверждение удаления</ModalHeader>}
          open={showDeleteModal}
          onOpenChange={setShowDeleteModal}
        >
          <Placeholder description="Вы точно хотите удалить данный токен?">
            <div
              style={{
                display: 'flex',
                gap: '10px',
                justifyContent: 'center',
                marginTop: '20px',
              }}
            >
              <Button size="m" onClick={confirmDelete} mode="filled">
                Да
              </Button>
              <Button size="m" onClick={cancelDelete} mode="plain">
                Нет
              </Button>
            </div>
          </Placeholder>
        </Modal>
      )}

      {showSnackbar && (
        <Snackbar onClose={() => setShowSnackbar(false)} duration={2000}>
          {snackbarMessage}
        </Snackbar>
      )}
    </Page>
  );
};
