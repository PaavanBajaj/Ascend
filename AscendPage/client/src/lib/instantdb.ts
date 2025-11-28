import { init, i } from "@instantdb/react";

const APP_ID = "6b5133f3-27f7-4e37-b46f-1bcbf1ebdd0c";

const schema = i.schema({
  entities: {
    users: i.entity({
      email: i.string(),
      age: i.number(),
    }),
    sessions: i.entity({
      userEmail: i.string(),
      day: i.string(),
      time: i.string(),
      status: i.string(),
      createdAt: i.number(),
    }),
  },
});

export const db = init({ appId: APP_ID, schema });

export const ADMIN_EMAIL = "paavan.awesome@gmail.com";
