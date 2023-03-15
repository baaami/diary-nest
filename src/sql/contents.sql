/* reviews 내 user_id, content_id Join 방법 */
SELECT users.id, users.nickname, users.location
FROM contents
INNER JOIN users ON contents.owner_id = users.id;

-- 게시글 리스트 응답 시 필요한 필드
SELECT contents.id, contents.title, contents.chat_cnt, contents.like_cnt, contents.createdAt
FROM contents