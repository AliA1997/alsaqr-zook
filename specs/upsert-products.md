# Overview
- Series of changes that will accelerate development of application.
- Such as return requests that have a bearer token.

## Specification
- Create an Admin Dashboard for updating and deleting products. 
    - Follow the admin dashboard found in the ~/projects/alsaqr-meetup.
    - Copy it, but make it exclusively for zook, meaning it should products your selling.
    - Enable the deletion of product if the product is the user's product.
    - Enable update of a product if the product is the user's product. 
    - Use modal for deleting or updating product.
    - A modal called the UpsertProductModal would update the product.
    - A modal called the DeleteProductModal would delete the product after confirm.
    - Have the AdminDashboard have 2 buttons on the top, Create Product Button, and View On AlSaqr button.
    
- Pass a bearer token to every request.
- When updating product, only allow users who created the product to update it.
- When deleting, only allow users where created the product to delete it. 
- Use a custom confirm modal before each operation such as update or delete. 
    - Custom confirm modal can be found ~/projects/alsaqr-frontend-v2


### Constraints 
DO NOT COMMIT, EDIT THIS SPEC FILE, 