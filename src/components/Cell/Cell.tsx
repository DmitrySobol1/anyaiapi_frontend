import { Cell as TUICell } from '@telegram-apps/telegram-ui';
import type { FC } from 'react';

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
  isRqstOperated: boolean;
}

interface CellProps {
  request: RequestData;
}

export const Cell: FC<CellProps> = ({ request }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatPrice = (price: number) => {
    return price ? `${price.toFixed(2)} ₽` : '—';
  };

  return (
    <TUICell
      subtitle={
        <>
          <div>Модель: {request.aiModelLink?.nameForUser || 'N/A'}</div>
          <div>Запрос: {request.inputFromRequest?.substring(0, 50) || 'N/A'}...</div>
          <div>
            Токены: {request.inputTokens || 0} (вход) / {request.outputTokens || 0} (выход)
          </div>
          <div>Цена: {formatPrice(request.priceOurTotalAllRqstRub)}</div>
          <div>Дата: {formatDate(request.createdAt)}</div>
        </>
      }
    >
      Запрос #{request._id.substring(request._id.length - 6)}
    </TUICell>
  );
};
