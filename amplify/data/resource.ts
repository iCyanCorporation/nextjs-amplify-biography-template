import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

/*== Data ===============================================================
The section below creates a database table with fields.
=========================================================================*/
const schema = a
  .schema({
    Blog: a.model({
      title: a.string(),
      imgUrl: a.string(),
      content: a.string(), // markdown content
      category: a.string(),
      tags: a.string().array(),
      createdAt: a.datetime(),
      updatedAt: a.datetime(),
    }),

    ProductType: a.model({
      name: a.string().required(),
      description: a.string(),
      products: a.hasMany("Product", "productTypeId"),
      attributes: a.string().array(), // Store type-specific attribute definitions
      createdAt: a.datetime(),
      updatedAt: a.datetime(),
    }),

    Product: a.model({
      name: a.string().required(),
      description: a.string(),
      price: a.float().required(),
      stock: a.integer().required(),
      imgUrl: a.string(),
      images: a.string().array(), // Store multiple images
      isActive: a.boolean().default(true),
      discountPrice: a.float(), // Add discount price
      attributes: a.string(), // JSON stringified attributes/specs
      customAttributes: a.string(), // JSON stringified custom attributes
      productTypeId: a.id(),
      productType: a.belongsTo("ProductType", "productTypeId"),
      variants: a.hasMany("ProductVariant", "productId"),
      orderProducts: a.hasMany("OrderProduct", "productId"),
      createdAt: a.datetime(),
      updatedAt: a.datetime(),
    }),

    ProductVariant: a.model({
      productId: a.id(),
      product: a.belongsTo("Product", "productId"),
      name: a.string(), // Variant name
      sku: a.string(), // Stock keeping unit
      price: a.float(), // Variant-specific price
      stock: a.integer(), // Variant-specific stock
      color: a.string(),
      size: a.string(), // Common variant attribute
      attributes: a.string(), // JSON stringified variant attributes
      images: a.string().array(),
      isActive: a.boolean().default(true),
      createdAt: a.datetime(),
      updatedAt: a.datetime(),
    }),

    Order: a.model({
      orderNumber: a.string().required(),
      customerName: a.string().required(),
      customerEmail: a.string().required(),
      status: a.enum([
        "pending",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
      ]),
      totalAmount: a.float().required(),
      shippingAddress: a.string(),
      paymentInfo: a.string(),
      orderProducts: a.hasMany("OrderProduct", "orderId"),
      createdAt: a.datetime(),
      updatedAt: a.datetime(),
    }),

    OrderProduct: a.model({
      orderId: a.id(),
      order: a.belongsTo("Order", "orderId"),
      productId: a.id(),
      product: a.belongsTo("Product", "productId"),
      quantity: a.integer().required(),
      priceAtPurchase: a.float().required(),
    }),

    Settings: a.model({
      key: a.string(),
      value: a.string(),
      description: a.string(),
      group: a.string(),
      createdAt: a.datetime(),
      updatedAt: a.datetime(),
    }),
  })
  .authorization((allow) => [allow.publicApiKey(), allow.owner()]);

export type Schema = ClientSchema<typeof schema>;

/*== Auth ===============================================================
The section below creates an auth for the database table.
=========================================================================*/
export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "apiKey",
    apiKeyAuthorizationMode: {
      expiresInDays: 365,
    },
  },
});
