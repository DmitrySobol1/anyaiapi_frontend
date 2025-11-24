import { Section, Spinner, Cell} from '@telegram-apps/telegram-ui';
import type { FC } from 'react';
import { useState, useEffect } from 'react';
import axios from '@/axios';

import { Page } from '@/components/Page.tsx';
import { TabbarMenu } from '@/components/TabbarMenu/TabbarMenu.tsx';
import { useTlgid } from '../../components/Tlgid';

interface RequestData {
  _id: string;
  aiModelLink: {
    nameForUser: string;
  };
  inputFromRequest: string;
  inputTokens: number;
  outputTokens: number;
  priceOurTotalAllRqstRub: number;
  createdAt: string;
  formattedDate: string;
  isRqstOperated: boolean;
}

export const RqstHistory: FC = () => {
  const [loading, setLoading] = useState(true);
  const [myRequest, setMyRequest] = useState<RequestData[]>([]);
  const [isError, setIsError] = useState(false);
  const tlgid = useTlgid();

  useEffect(() => {
    const fetchRequestHistory = async () => {
      if (!tlgid) return;

      setLoading(true);
      setIsError(false);

      try {
        const response = await axios.get('/api/getRequestHistory', {
          params: { tlgid },
        });

        // Проверяем наличие данных и статус ответа
        if (!response.data || response.data.status === 'error') {
          setIsError(true);
          return;
        }

        setMyRequest(response.data.requests || []);
      } catch (error) {
        console.error('Ошибка при загрузке истории запросов:', error);
        setIsError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchRequestHistory();
  }, [tlgid]);

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
          <Section header="История запросов" style = {{marginBottom: 100}}>
            {myRequest.length === 0 ? (
              <Cell>История запросов пока пуста</Cell>
            ) : (
              myRequest.map((request) => (
                <Cell
                  key={request._id}
                  after = {request.priceOurTotalAllRqstRub ? `${request.priceOurTotalAllRqstRub.toFixed(3)} ₽` : '—'}
                  subtitle={
                    <>
                      <div>{request.aiModelLink?.nameForUser || 'N/A'} | токены: {request.inputTokens || 0} / {request.outputTokens || 0}</div> 
                    </>
                  }
                >
                  {request.formattedDate} | #{request._id.substring(request._id.length - 6)}
                </Cell>
              ))
            )}
          </Section>
        </>
      )}

      <TabbarMenu />
    </Page>
  );
};
