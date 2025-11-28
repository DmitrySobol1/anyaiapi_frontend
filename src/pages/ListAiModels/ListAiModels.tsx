import {
  Section,
  Accordion,
  Snackbar,
  Subheadline,
  Button,
  Caption,
  Spinner,
  Cell,
  Divider,
  List,
} from '@telegram-apps/telegram-ui';
import { FC, useEffect, useState } from 'react';

import { Page } from '@/components/Page.tsx';

import { TabbarMenu } from '@/components/TabbarMenu/TabbarMenu.tsx';

import { useTlgid } from '../../components/Tlgid';

import axios from '@/axios';
import { AccordionSummary } from '@telegram-apps/telegram-ui/dist/components/Blocks/Accordion/components/AccordionSummary/AccordionSummary';
import { AccordionContent } from '@telegram-apps/telegram-ui/dist/components/Blocks/Accordion/components/AccordionContent/AccordionContent';
import Chip from '@mui/material/Chip';

interface AiModel {
  _id: string;
  nameForUser: string;
  nameForRequest: string;
  input_token_priceBasicUsd?: number;
  output_token_priceBasicUsd?: number;
  input_token_priceOurRub: number;
  output_token_priceOurRub: number;
  isChoosed?: boolean;
  createdAt: string;
  updatedAt: string;
  type: string;
}

export const ListAiModels: FC = () => {
  const [aiModels, setAiModels] = useState<AiModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [expandedAccordions, setExpandedAccordions] = useState<Set<string>>(
    new Set()
  );
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [filter, setFilter] = useState<
    'all' | 'text_to_text' | 'text_to_image'
  >('all');

  // Фильтрация моделей
  const filteredModels = aiModels.filter((model) => {
    if (filter === 'all') return true;
    return model.type === filter;
  });

  const tlgid = useTlgid();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setIsError(false);

        // Получаем все доступные модели с информацией о выборе
        const modelsResponse = await axios.get('/api/getAiModels', {
          params: { tlgid },
        });

        // Проверяем наличие данных и статус ответа
        if (!modelsResponse.data || modelsResponse.data.status === 'error') {
          setIsError(true);
          return;
        }

        setAiModels(modelsResponse.data.models || []);
      } catch (err) {
        console.error('Error fetching data:', err);
        setIsError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [tlgid]);

  const handleCheckboxChange = async (modelId: string, checked: boolean) => {
    if (checked) {
      // Отправляем запрос на бэкенд
      try {
        console.log('Sending request:', { tlgid: tlgid, modelId });
        const response = await axios.post('/api/chooseAiModel', {
          tlgid: tlgid,
          modelId: modelId,
        });

        // Проверяем статус ответа
        if (!response.data || response.data.status === 'error') {
          setIsError(true);
          return;
        }

        console.log('Model chosen:', response.data);

        // Обновляем список моделей
        const modelsResponse = await axios.get('/api/getAiModels', {
          params: { tlgid },
        });

        // Проверяем наличие данных и статус ответа
        if (!modelsResponse.data || modelsResponse.data.status === 'error') {
          setIsError(true);
          return;
        }

        setAiModels(modelsResponse.data.models || []);

        // Показываем Snackbar
        setShowSnackbar(true);
        setTimeout(() => {
          setShowSnackbar(false);
        }, 2000);
      } catch (err: any) {
        console.error('Error choosing model:', err);
        console.error('Error response:', err.response?.data);
        setIsError(true);
      }
    }
  };

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
        <Section header="Доступные AI модели" style={{ marginBottom: 100 }}>
          {/* Фильтры */}
          <div
            style={{
              display: 'flex',
              gap: '8px',
              marginBottom: '16px',
              padding: '0 16px',
            }}
          >
            <div
              onClick={() => setFilter('all')}
              style={{
                marginTop: 10,
                padding: '8px 16px',
                borderRadius: '8px',
                backgroundColor: filter === 'all' ? '#40a7e2' : '#f4f4f6',
                // color: 'black',
                color: filter === 'all' ? '#ffffffff' : '#000000ff',
                cursor: 'pointer',
                fontWeight: 500,
                fontSize: '14px',
              }}
            >
              <Caption level="1" weight="3">
                все
              </Caption>
            </div>
            <div
              onClick={() => setFilter('text_to_text')}
              style={{
                marginTop: 10,
                padding: '8px 16px',
                borderRadius: '8px',
                backgroundColor:
                  filter === 'text_to_text' ? '#40a7e2' : '#f4f4f6',
                color: filter === 'text_to_text' ? '#ffffffff' : '#000000ff',
                cursor: 'pointer',
                fontWeight: 500,
                fontSize: '14px',
              }}
            >
              <Caption level="1" weight="3">
                текст
              </Caption>
            </div>
            <div
              onClick={() => setFilter('text_to_image')}
              style={{
                marginTop: 10,
                padding: '8px 16px',
                borderRadius: '8px',
                backgroundColor:
                  filter === 'text_to_image' ? '#40a7e2' : '#f4f4f6',
                color: filter === 'text_to_image' ? '#ffffffff' : '#000000ff',
                cursor: 'pointer',
                fontWeight: 500,
                fontSize: '14px',
              }}
            >
              <Caption level="1" weight="3">
                фото
              </Caption>
            </div>
          </div>

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

          {filteredModels.map((model) => (
            <Accordion
              key={model._id}
              expanded={expandedAccordions.has(model._id)}
              onChange={(expanded) => {
                setExpandedAccordions((prev) => {
                  const newSet = new Set(prev);
                  if (expanded) {
                    newSet.add(model._id);
                  } else {
                    newSet.delete(model._id);
                  }
                  return newSet;
                });
              }}
            >
              <AccordionSummary>
                <div
                  style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  {model.nameForUser}

                  {model.type == 'text_to_text' && (
                    <Chip
                      label={
                        <Caption level="1" weight="3">
                          текст
                        </Caption>
                      }
                      variant="filled"
                      color="warning"
                      size="small"
                    />
                  )}
                  {model.type == 'text_to_image' && (
                    <Chip
                      label={
                        <Caption level="1" weight="3">
                          фото
                        </Caption>
                      }
                      variant="filled"
                      color="secondary"
                      size="small"
                    />
                  )}

                  {model.isChoosed && (
                    <Chip
                      label={
                        <Caption level="2" weight="3">
                          получен
                        </Caption>
                      }
                      variant="filled"
                      // color="primary"
                      size="small"
                      sx={{
                        backgroundColor: '#000000ff', // свой фон
                        color: '#ffffff', // цвет текста
                        '&:hover': {
                          backgroundColor: '#e64a19', // цвет при наведении
                        },
                      }}
                    />
                  )}
                </div>
              </AccordionSummary>
              <AccordionContent>
                <div
                  style={{
                    padding: '1px 0px 10px 40px',
                  }}
                >
                  <div
                    style={{
                      padding: '0px 0px 10px 0px',
                    }}
                  >
                    <Subheadline level="2" weight="3">
                      цена за 1 млн. input токенов: {''}
                      {model.input_token_priceOurRub?.toFixed(2) ?? 'N/A'} ₽
                    </Subheadline>

                    <Subheadline level="2" weight="3">
                      цена за 1 млн. output токенов: {''}
                      {model.output_token_priceOurRub?.toFixed(2) ?? 'N/A'} ₽
                    </Subheadline>
                  </div>

                  {!model.isChoosed && (
                    <Button
                      onClick={() => handleCheckboxChange(model._id, true)}
                    >
                      получить ключ
                    </Button>
                  )}
                </div>
              </AccordionContent>
            </Accordion>
          ))}
        </Section>
      )}

      <TabbarMenu />

      {showSnackbar && (
        <Snackbar onClose={() => setShowSnackbar(false)} duration={2000}>
          Токен получен, перейдите на вкладку "мои ключи"
        </Snackbar>
      )}
    </Page>
  );
};
