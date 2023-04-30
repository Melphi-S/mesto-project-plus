/* eslint-disable no-shadow,no-unused-vars */

export enum ErrorMessage {
  INTERNAL_SERVER_ERROR = 'Ошибка на стороне сервера',
  INVALID_DATA = 'Переданы некорректные данные',
  PAGE_NOT_FOUND = 'Страница не найдена',
  DATA_NOT_FOUND = 'Данные не найдены',
  INVALID_EMAIL_OR_PASSWORD = 'Неправильные почта или пароль',
  NO_AUTH = 'Необходима авторизация',
  ACCESS_DENIED = 'Нет прав доступа',
  NOT_UNIQUE_EMAIL = 'Пользователь с данным емэйл уже зарегистрирован',
  INCORRECT_ID = 'Некорректный ID',
}
