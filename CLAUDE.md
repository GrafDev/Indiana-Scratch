# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Правила взаимодействия

- **Язык ответов**: Всегда отвечать на русском языке
- **Режим обсуждения**: Если запрос пользователя начинается с "..", то это режим обсуждения - НЕ писать код, только обсуждать что и как можно реализовать
- **Коммиты**: Писать короткие и понятные commit сообщения, учитывая что человек ленив и не любит много писать. Примеры: "fix logo animation", "add wheel spin", "update styles", 
- **Важно в коммитах**: Все комиты писать от имени grafDev, без упоминания ИИ или каких либо ссылок на ИИ, чтобы было как от меня. НЕ добавлять строки вроде "Generated with Claude Code" или "Co-Authored-By: Claude".
- **Комментарии в коде**: Все комментарии писать только на английском языке. Избегать лишних комментариев - код должен быть самодокументируемым
- **ЗАПРЕЩЕНО**: НИКОГДА не использовать overflow: hidden в CSS стилях , Запрещено ругаться матом!!!!

## Команды разработки

```bash
# Разработка (development mode с dev панелью)
npm run dev

# Сборка всех вариантов игры
npm run build:all

# Сборка отдельных вариантов
npm run build:click          # Cards + Click mode
npm run build:auto           # Cards + Auto mode  
npm run build:wheel-click    # Wheel + Click mode
npm run build:wheel-auto     # Wheel + Auto mode

# Деплой на Firebase
npm run deploy:all           # Деплой всех вариантов
npm run deploy:click         # Деплой cards+click на wheel-visit-click
npm run deploy:auto          # Деплой cards+auto на wheel-visit-auto
npm run deploy:wheel-click   # Деплой wheel+click на wheel-indiana-click
npm run deploy:wheel-auto    # Деплой wheel+auto на wheel-indiana-auto

# Превью сборки
npm run preview
```

## Архитектура проекта

### Типы игры и режимы
- **Game Types**: `scratch` (карточки) или `wheel` (колесо фортуны)  
- **Game Modes**: `click` (ручной запуск) или `auto` (автоматический запуск)
- Управляется через `VITE_GAME_TYPE` и `VITE_GAME_MODE` в vite.config.js
- В development mode можно переключать через dev панель

### Система сборки
- Vite создает отдельные сборки для каждой комбинации типа/режима
- Каждая сборка деплоится на отдельный Firebase hosting site
- Версионирование через version.js для кэширования ассетов

### Адаптивная система
Двухуровневая система размеров:
1. **JavaScript расчеты** (`config.js` + `responsive-sizing.js`):
   - Базовый размер колеса рассчитывается от размера экрана
   - Все элементы масштабируются относительно этого размера через CSS переменные
   - Размеры arrow зависят от размера main-container

2. **CSS медиа-запросы** (`wheel-responsive.css`, `responsive.css`):
   - Точная настройка для конкретных устройств
   - Переопределяют базовые размеры для лучшего UX

### Структура HTML templates
- `html-template.js` - Cards вариант игры с `.cards-container`
- `wheel-template.js` - Wheel вариант игры с `.wheel-container`  
- Общие элементы: `.main-container`, `.media-container` с персонажами

### Модульная архитектура JavaScript

#### Core системы
- `main.js` - Entry point, инициализация всех модулей
- `config.js` - Централизованная конфигурация размеров и настроек игры
- `responsive-sizing.js` - Расчет и применение адаптивных размеров через CSS переменные

#### Game логика
- `card-interactions.js` - Eraser эффект для карточек
- `wheel-game.js` - Логика вращения колеса с GSAP анимациями
- Оба поддерживают click/auto режимы

#### UI компоненты  
- `preloader.js` - Загрузка изображений с прогресс-баром
- `modal-animations.js` - Показ результатов игры
- `appearance-animations.js` - Entrance анимации при загрузке
- `logo-animations.js` - Постоянные анимации логотипа

#### Development
- `dev-panel.js` - Runtime переключение типа игры и режимов (только в dev)
- `touch-controls.js` - Управление зумом и тач-событиями

### CSS архитектура
- `main.css` - Entry point, импорты всех стилей
- `base.css` - Reset и базовые стили
- `layout.css` - Основная структура контейнеров
- `wheel.css` / `cards.css` - Стили для конкретных типов игры
- `wheel-responsive.css` / `responsive.css` - Адаптивность
- `modal.css`, `preloader.css` - Компонентные стили

### Система изображений
- `images-loader.js` - Централизованный импорт всех изображений
- Все изображения состоят из нескольких частей для анимаций
- Vite обрабатывает оптимизацию и кэширование 