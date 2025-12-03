import {
  Section,
  Cell,
  Spinner,
  List,
  Divider,
  Snackbar,
  Caption,
  Accordion,
  Subheadline,
} from '@telegram-apps/telegram-ui';
import type { FC } from 'react';
import { useState } from 'react';

import { Page } from '@/components/Page.tsx';
import { TabbarMenu } from '@/components/TabbarMenu/TabbarMenu.tsx';
import Chip from '@mui/material/Chip';
import { AccordionSummary } from '@telegram-apps/telegram-ui/dist/components/Blocks/Accordion/components/AccordionSummary/AccordionSummary';
import { AccordionContent } from '@telegram-apps/telegram-ui/dist/components/Blocks/Accordion/components/AccordionContent/AccordionContent';

// import { useTlgid } from '../../components/Tlgid';

export const Help: FC = () => {
  const [loading] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [isFormatsExpanded, setIsFormatsExpanded] = useState(false);

  //   const tlgid = useTlgid();

  const handleCopy = async (text: string) => {
    try {
      let textForCopy = '';

      if (text == 'baseurl') {
        textForCopy = 'https://any-ai-api.ru/api/request';
      } else if (text == 'header') {
        textForCopy = 'Authorization: Bearer {{tokenAnyAi}}';
      } else if (text == 'text_to_text') {
        textForCopy = '{ "input": "здесь ваш запрос к ИИ" }';
      } else if (text == 'text_to_image') {
        textForCopy =
          '{ "input":"здесь текст запроса","type":"text_to_image","photo_url":"empty","format":"1:1" }';
      } else if (text == 'image_to_image') {
        textForCopy =
          '{ "input":"здесь текст запроса","type":"image_to_image","photo_url":"ссылка на изображение","format":"1:1" }';
      } else if (text == 'image_to_text') {
        textForCopy =
          '{ "input":"что изображено на фото?","type":"image_to_text","photo_url":"ссылка на изображение","format":"1:1" }';
      }

      await navigator.clipboard.writeText(textForCopy);
      setShowSnackbar(true);
      setTimeout(() => {
        setShowSnackbar(false);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <Page back={true}>
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
          <Section
            header="Как использовать Any AI Api"
            footer="Нажмите на любой пункт, что бы скопировать в буфер обмена"
          >
            <Cell
              subtitle="POST | https://any-ai-api.ru/api/request"
              onClick={() => handleCopy('baseurl')}
              style={{ cursor: 'pointer' }}
            >
              Единый url для всех запросов:
            </Cell>
            <Cell
              multiline
              subtitle="Authorization: Bearer {{tokenAnyAi}}"
              description="параметр {{tokenAnyAi}} - это ключ от AI модели, который вы получаете на вкладке «Все AI модели» "
              onClick={() => handleCopy('header')}
              style={{ cursor: 'pointer' }}
            >
              В каждом запросе необходимо передавать Header
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

          <Section
            header="Параметры для передачи в Body"
            style={{ marginBottom: 100 }}
          >
            <Cell
              multiline
              subtitle={
                <>
                  <div>
                    <div>{'{'}</div>
                    "input" : "здесь ваш запрос к ИИ"
                    <div>{'}'}</div>
                  </div>
                </>
              }
              onClick={() => handleCopy('text_to_text')}
              style={{ cursor: 'pointer' }}
            >
              <Chip
                label={
                  <Caption level="1" weight="3">
                    текст
                  </Caption>
                }
                variant="filled"
                color="warning"
                size="small"
              />{' '}
              для моделей, работающих с текстом
            </Cell>

            <Cell
              multiline
              subtitle={
                <>
                  <div>
                    <div>{'{'}</div>
                    <div> "input" : "здесь текст запроса",</div>
                    <div> "type" : "text_to_image",</div>
                    <div>"photo_url" : "empty",</div>
                    <div>"format" : "1:1"</div>
                    <div>{'}'} </div>
                  </div>
                </>
              }
              onClick={() => handleCopy('text_to_image')}
              style={{ cursor: 'pointer' }}
            >
              <Chip
                label={
                  <Caption level="1" weight="3">
                    фото
                  </Caption>
                }
                variant="filled"
                color="secondary"
                size="small"
              />{' '}
              преобразование текста в изображение
            </Cell>

            <Cell
              multiline
              subtitle={
                <>
                  <div>
                    <div>{'{'}</div>
                    <div> "input" : "здесь текст запроса",</div>
                    <div> "type" : "image_to_image",</div>
                    <div>"photo_url" : "ссылка на изображение",</div>
                    <div>"format" : "1:1"</div>
                    <div>{'}'} </div>
                  </div>
                </>
              }
              onClick={() => handleCopy('image_to_image')}
              style={{ cursor: 'pointer' }}
            >
              <Chip
                label={
                  <Caption level="1" weight="3">
                    фото
                  </Caption>
                }
                variant="filled"
                color="secondary"
                size="small"
              />{' '}
              преобразование изображения в изображение
            </Cell>

            <Cell
              multiline
              subtitle={
                <>
                  <div>
                    <div>{'{'}</div>
                    <div> "input" : "что изображено на фото?",</div>
                    <div> "type" : "image_to_text",</div>
                    <div>"photo_url" : "ссылка на изображение",</div>
                    <div>"format" : "1:1"</div>
                    <div>{'}'} </div>
                  </div>
                </>
              }
              onClick={() => handleCopy('image_to_text')}
              style={{ cursor: 'pointer' }}
            >
              <Chip
                label={
                  <Caption level="1" weight="3">
                    фото
                  </Caption>
                }
                variant="filled"
                color="secondary"
                size="small"
              />{' '}
              преобразование изображения в текст
            </Cell>

            <Accordion
              expanded={isFormatsExpanded}
              onChange={(expanded) => setIsFormatsExpanded(expanded)}
            >
              <AccordionSummary>Форматы изображений (format)</AccordionSummary>
              <AccordionContent>
                <div
                  style={{
                    padding: '1px 0px 10px 40px',
                  }}
                >
                  <div>
                    <Subheadline level="2" weight="3">
                      значения для параметра format:
                   
                    
                  
                  <div>1:1  → 1024px × 1024px (default)</div>
                  <div>2:3  → 832px × 1248px</div>
                  <div>3:2  → 1248px × 832px</div>
                  <div>3:4  → 864px × 1184px</div>
                  <div>4:3  → 1184px × 864px</div>
                  <div>4:5  → 896px × 1152px</div>
                  <div>5:4  → 1152px × 896px</div>
                  <div>9:16 → 768px × 1344px</div>
                  <div>16:9 → 1344px × 768px</div>
                  <div>21:9 → 1536px × 672px</div>
                   </Subheadline>
                  </div>

                  








                </div>
              </AccordionContent>
            </Accordion>
          </Section>
        </>
      )}

      <TabbarMenu />

      {showSnackbar && (
        <Snackbar onClose={() => setShowSnackbar(false)} duration={2000}>
          Скопировано
        </Snackbar>
      )}
    </Page>
  );
};
