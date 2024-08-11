/* reviews 내 user_id, content_id Join 방법 */
SELECT *
FROM favorites
INNER JOIN users ON favorites.user_id = users.id
INNER JOIN contents ON favorites.content_id = contents.id;