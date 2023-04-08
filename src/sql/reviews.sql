/* reviews 내 buyer_id, seller_id Join 방법 */
SELECT * AS buyer_name, s.name AS seller_name
FROM school.reviews AS r
INNER JOIN school.users AS b ON r.buyer_id = b.id
INNER JOIN school.users AS s ON r.seller_id = s.id;

/* reviews 내 user_id, content_id Join 방법 */
SELECT *
FROM reviews
INNER JOIN users ON reviews.seller_id = users.id
INNER JOIN users ON reviews.buyer_id = users.id;