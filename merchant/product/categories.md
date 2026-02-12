---
subtitle: Organize your products with a hierarchical category tree.
---
# Categories

Categories let you organize products into a browsable hierarchy. A product can belong to multiple categories, and categories can be nested to create a tree structure. On the frontend, categories are used to build navigation menus, product listing pages, and breadcrumb trails.

Navigate to **Shop → Categories** to manage your category tree.

## Creating a Category

Click **New Category** to create a new category. The following fields are available:

- **Name** — The display name of the category, shown on the storefront and in the backend. This is the only required field.
- **Code** — An optional internal identifier for referencing the category in custom logic or integrations.
- **Parent** — Select a parent category to nest this category within. Leave empty for a top-level category.

### Content Fields

Each category has several content fields for display on the storefront:

- **Title** — An optional page title, often used in the browser tab. Defaults to the category name if left empty.
- **Description** — A long-form description displayed on the category page. Supports rich text formatting.
- **Short Description** — A brief summary used in category listings or previews.

### URL Slug

The **Slug** is automatically generated from the category name and is used to build the category's URL. For example, a category named "Winter Jackets" under "Clothing" would produce a full slug of `clothing/winter-jackets`. The full slug is built automatically from the entire parent chain, so you only need to manage the individual slug for each category.

You can customize the slug if you want a different URL path, but keep in mind that changing it will change the category's frontend URL.

## Category Hierarchy

Categories support unlimited nesting depth. A top-level category with no parent appears at the root of the tree. Child categories appear nested under their parent.

The hierarchy serves several purposes:

- **Navigation** — Your theme can render the category tree as a multi-level navigation menu.
- **Breadcrumbs** — The parent chain is used to generate breadcrumb navigation on product and category pages.
- **Full Slugs** — The complete URL path is built from the parent chain (e.g., `electronics/phones/smartphones`).

To move a category within the tree, you can either change its **Parent** field when editing, or use the **Reorder** button on the category list to drag and drop categories into the desired position.

## Category Images

Categories support image attachments. Use the **Images** section on the category form to upload one or more images. These can be used by your theme to display category banners, thumbnails, or hero images on the storefront.

## Category Visibility

The **Hidden** checkbox controls whether a category is visible on the frontend. When a category is hidden:

- It will not appear in category listings or navigation menus on the storefront.
- Products within the hidden category are still accessible through other categories or direct links.
- The category remains fully manageable in the backend.

::: tip
Hiding a category is useful for seasonal categories, categories under construction, or categories used only for internal organization.
:::

## Reordering Categories

To change the display order of categories, click the **Reorder** button on the category list page. This opens a drag-and-drop interface where you can:

- Drag categories up or down to change their sort order within the same level.
- Drag categories left or right to change their nesting depth (promoting or demoting them in the hierarchy).

Click **Save** when you are satisfied with the new arrangement. The sort order is reflected on the frontend wherever your theme renders the category tree.

## Products in a Category

Products are assigned to categories from the product form, not from the category form. A single product can belong to multiple categories. The category page on your storefront lists all products assigned to that category.

The product count for a category includes all products directly assigned to it. Your theme can also be configured to include products from child categories when displaying a parent category page.

For details on assigning products to categories, see the [Products](./products) documentation.
