# Cinema Service (ДЗ1)

Серверна частина сервісу кінотеатру на NestJS. Дані зберігаються в пам’яті (масиви в сервісах) і зникають після перезапуску.

## Встановлення залежностей

```bash
npm install
```

## Запуск у режимі розробки

```bash
npm run start:dev
```

API: `http://localhost:3000`  
Swagger: `http://localhost:3000/docs`

## Змінні оточення

Скопіюйте приклад і за потреби змініть значення:

```bash
cp .env.example .env
```

Приклад `.env`:

```env
# HTTP port the NestJS app listens on
PORT=3000
```

## Перевірка маршрутів

У корені репозиторію є `requests.http` — виконуйте запити згори вниз (VS Code REST Client / JetBrains HTTP Client). Ідентифікатори підставляються зі змінних файлу.

## Модулі

- `films` — фільми
- `halls` — зали та схема місць
- `showings` — сеанси та розклад
- `bookings` — бронювання місць
