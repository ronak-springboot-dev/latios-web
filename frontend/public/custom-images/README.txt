HOW TO USE YOUR OWN IMAGES
==========================

1. Drop your image files into THIS folder:
   /app/frontend/public/custom-images/

2. Your file is then served at:
   /custom-images/<filename>
   Example: public/custom-images/my-tower.jpg  ->  /custom-images/my-tower.jpg

3. Point any product/section at your image by editing its path in:
   - Category heroes, chapter photos, spec imagery:
       /app/frontend/src/data/products.js     (look for  hero: "..."  and  image: "...")
   - Model cards, 360° galleries, feature photos:
       /app/frontend/src/data/models.js       (look for  image: "...", gallery: [...], heroImage: "...")
   - Homepage Applications / News sections:
       /app/frontend/src/pages/Home.jsx       (APPLICATIONS list)

4. Save the file — the site hot-reloads automatically. No restart needed.

Tip: keep images under ~300KB (JPG/WEBP) for fast loading.
See /app/frontend/src/data/customImages.js for a full list of image slots and their current defaults.
