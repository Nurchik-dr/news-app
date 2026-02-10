# News App (React Native / Expo)

Тестовое приложение для просмотра новостей с поиском, фильтрацией, деталями статьи, избранным, демо-авторизацией, демо-push и демо-файловыми операциями.

## Что реализовано

- Экран авторизации (демо биометрии) + logout.
- Лента новостей с публичного API (Algolia Hacker News):
  - пагинация с infinite scroll;
  - pull-to-refresh;
  - индикатор загрузки и обработка ошибок;
  - поиск по заголовку;
  - фильтрация по категориям.
- Детальный экран статьи (modal), переход к оригиналу.
- Экран избранного: добавление/удаление статей.
- Экран настроек:
  - демо push-уведомление (in-app banner);
  - демо upload запроса;
  - демо download запроса.

## Архитектура

Структура приближена к Feature-Sliced подходу:

- `src/app` — root state/store и app-level wiring.
- `src/entities/news` — типы, API-слой и hook работы с новостями.
- `src/screens` — экранные компоненты (Auth/Main).

> Из-за ограничений среды установки npm-пакетов (403 из registry) приложение реализовано на базовом стеке Expo + React Native, без внешних зависимостей вроде Redux Toolkit/RTK Query/WebView/AsyncStorage/Local Auth модулей.

## Стек

- React Native (Expo SDK 54)
- TypeScript
- Встроенный `fetch` API

## Запуск

```bash
npm install
npm run start
```

Дополнительно:

```bash
npm run android
npm run ios
npm run web
```

## Проверка качества

```bash
npx tsc --noEmit
```

## Что нужно добавить для production версии

1. Подключить Redux Toolkit + RTK Query для управления состоянием и data fetching.
2. Подключить `react-native-webview` для обязательного in-app просмотра полной статьи.
3. Подключить `expo-local-authentication` для настоящей биометрии (Face ID/Touch ID).
4. Подключить `expo-notifications` для push-уведомлений (FCM/APNS).
5. Подключить `expo-document-picker` и `expo-file-system` для реальной отправки/скачивания файлов и прогресса.
6. Добавить персист избранного в AsyncStorage.
7. Добавить unit/integration тесты (Jest + React Native Testing Library).

