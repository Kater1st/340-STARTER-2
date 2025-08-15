-- QUERY #1
INSERT INTO public.account (
        account_firstname,
        account_lastname,
        account_email,
        account_password
    )
VALUES (
        'Tony',
        'Stark',
        'tony@starkent.com',
        'Iam1ronM@n'
    );
-- QUERY #2
UPDATE public.account
SET account_type = 'Admin'
WHERE account_id = 1;
-- QUERY #3
DELETE FROM public.account
WHERE account_id = 1;
-- QUERY #4
UPDATE inventory
SET inv_description = REPLACE(
        inv_description,
        'small interiors',
        'huge interior'
    );
-- QUERY #5
SELECT inv_make,
    inv_model,
    classification_name
FROM inventory AS inv
    INNER JOIN classification AS cla ON inv.classification_id = cla.classification_id
WHERE inv.classification_id = 2;
--QUERY #6  
UPDATE inventory
SET inv_image = REPLACE(inv_image, 'images', 'images/vehicles'),
    inv_thumbnail = REPLACE(inv_thumbnail, 'images', 'images/vehicles');