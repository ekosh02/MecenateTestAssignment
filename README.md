# Запуск

```bash
npm i
npm start
```

(или `npx expo start`)

**Телефон:** установите [Expo Go](https://expo.dev/go), запустите проект, отсканируйте QR из терминала в Expo Go. ПК и телефон — в одной Wi‑Fi (или туннель в меню Expo).

По желанию: `npm run ios`, `npm run android`, `npm run web`, `npm run lint`.

## Структура

| Папка | Назначение |
|--------|-------------|
| `app/` | Маршруты Expo Router: тонкие файлы, экраны из `screens/`. |
| `screens/` | Полноценные экраны: папка на экран, `*.tsx`, `styles.ts`, при необходимости `constants.ts`. |
| `components/` | Переиспользуемый UI по доменам (кнопки, карточки, ошибки и т.д.). |
| `navigation/` | Обвязка навигаторов (например, нижняя вкладка). |
| `hooks/` | Хуки (`use-*`), без JSX. |
| `store/` | MobX-сторы. |
| `lib/` | API, secure store, утилиты без React. |
| `constants/` | Общие токены (цвета, URL API). |
| `assets/` | Картинки, иконки. |
