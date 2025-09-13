import http from "k6/http";
import { check, sleep } from "k6";

export let options = {
	stages: [
    { duration: "30s", target: 100 },  // старт: 100 VUs (увеличиваем длительность для стабильности)
    { duration: "30s", target: 200 },  // рост до 200 VUs
    { duration: "30s", target: 400 },  // рост до 400 VUs
    { duration: "30s", target: 600 },  // рост до 600 VUs
    { duration: "30s", target: 800 },  // рост до 800 VUs
    { duration: "30s", target: 2000 }, // пик: 1000 VUs
    { duration: "30s", target: 0 },    // плавный спуск
  ],
	thresholds: {
    'http_req_duration': ['p(95)<500'], // 95% запросов должны быть быстрее 500 мс
    'checks': ['rate>0.95'], // 95% проверок должны быть успешными
    'http_req_failed': ['rate<0.01'], // Ошибок должно быть менее 1%
  },
	
}

const BASE_URL =  "http://localhost:3000";
const TOKEN = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjUsImlhdCI6MTc1NzUyODYzMSwiZXhwIjoxNzU3NjE1MDMxfQ.2A0HL_9ZEs9Jctg7hcpdm94mBxgQmzIbMmTa7pHlT3Q';
const CHAT_ID = 10;


export default function () {
  // 1. Получить список сообщений в чате
  let res = http.get(`${BASE_URL}/chats/${CHAT_ID}/messages`, {
    headers: { Authorization: TOKEN },
  });
  check(res, {
    "GET /messages status is 200": (r) => r.status === 200,
  });

  // 2. Создать сообщение
  let createRes = http.post(
    `${BASE_URL}/chats/${CHAT_ID}/messages`,
    JSON.stringify({ text: "Hello from k6" }),
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: TOKEN,
      },
    }
  );
  check(createRes, {
    "POST /messages status is 201": (r) => r.status === 201,
  });

  const createdMessage = createRes.json();
  const messageId = createdMessage?.id;

  // 3. Обновить сообщение
  if (messageId) {
    let updateRes = http.patch(
      `${BASE_URL}/chats/${CHAT_ID}/messages/${messageId}`,
      JSON.stringify({ text: "Updated by k6" }),
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: TOKEN,
        },
      }
    );
    check(updateRes, {
      "PATCH /messages status is 200": (r) => r.status === 200,
    });
  }

  // 4. Удалить сообщение
  if (messageId) {
    let deleteRes = http.del(
      `${BASE_URL}/chats/${CHAT_ID}/messages/${messageId}`,
      null,
      {
        headers: { Authorization: TOKEN },
      }
    );
    check(deleteRes, {
      "DELETE /messages status is 200/204": (r) =>
        r.status === 200 || r.status === 204,
    });
  }

  sleep(1);
}