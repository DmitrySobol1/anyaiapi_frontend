import { Section, Accordion, Snackbar, Subheadline, Button, Caption, Spinner, Cell} from '@telegram-apps/telegram-ui';
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
}

export const ListAiModels: FC = () => {
  const [aiModels, setAiModels] = useState<AiModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [expandedAccordions, setExpandedAccordions] = useState<Set<string>>(
    new Set()
  );
  const [showSnackbar, setShowSnackbar] = useState(false);

  const tlgid = useTlgid();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setIsError(false);

        // Получаем все доступные модели с информацией о выборе
        const modelsResponse = await axios.get('/api/getAiModels', {
          params: { tlgid }
        });

        // Проверяем наличие данных и статус ответа
        if (
          !modelsResponse.data ||
          modelsResponse.data.status === 'error'
        ) {
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
          params: { tlgid }
        });

        // Проверяем наличие данных и статус ответа
        if (
          !modelsResponse.data ||
          modelsResponse.data.status === 'error'
        ) {
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
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
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
      <Section header="Доступные AI модели" style = {{marginBottom: 100}}>
        {aiModels.map((model) => (
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
                {model.nameForUser} {model.isChoosed && 
                
                //  <Chip label="получен" variant="filled" color="primary" size="small"/>
                 <Chip label=<Caption
                          level="2"
                          weight="3"
                        >
                          получен
                     
                        </Caption> variant="filled" color="primary" size="small"/>
                }
              </AccordionSummary>
              <AccordionContent>
                <div
                  style={{
                    padding: '1px 0px 10px 40px',
                  }}
                >
                  <div style={{
                    padding: '0px 0px 10px 0px',
                  }}>



                      <Subheadline
                          level="2"
                          weight="3"
                        >
                          цена за 1 млн. input токенов:  {''}
                     {model.input_token_priceOurRub?.toFixed(2) ?? 'N/A'} ₽
                        </Subheadline>


                      <Subheadline
                          level="2"
                          weight="3"
                        >
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
          Токен получен, перейдите на вкладку "мои токены"
        </Snackbar>
      )}
    </Page>
  );
};
