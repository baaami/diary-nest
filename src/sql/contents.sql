/* reviews 내 user_id, content_id Join 방법 */
SELECT *
FROM contents
INNER JOIN users ON contents.owner_id = users.id;
