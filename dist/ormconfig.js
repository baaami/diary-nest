"use strict";
const content_entity_1 = require("./src/api/content/entities/content.entity");
const user_entity_1 = require("./src/api/user/entities/user.entity");
const dotenv = require("dotenv");
const favorite_entity_1 = require("./src/common/entities/favorite.entity");
const review_entity_1 = require("./src/api/review/entities/review.entity");
const productimage_entity_1 = require("./src/common/entities/productimage.entity");
const chat_entity_1 = require("./src/events/chat/entities/chat.entity");
const room_entity_1 = require("./src/events/chat/entities/room.entity");
dotenv.config();
const config = {
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: [content_entity_1.Contents, user_entity_1.Users, favorite_entity_1.Favorites, review_entity_1.Reviews, productimage_entity_1.ProductImages, chat_entity_1.Chats, room_entity_1.Rooms],
    synchronize: true,
    autoLoadEntities: true,
    charset: "utf8mb4",
    logging: false,
    keepConnectionAlive: true,
};
module.exports = config;
//# sourceMappingURL=ormconfig.js.map