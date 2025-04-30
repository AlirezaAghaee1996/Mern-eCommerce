/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         phone:
 *           type: string
 *         role:
 *           type: string
 *           enum: [user, admin]
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 * 
 *     Product:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         price:
 *           type: number
 *         category:
 *           type: string
 *         brand:
 *           type: string
 *         images:
 *           type: array
 *           items:
 *             type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 * 
 *     Category:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 * 
 *     Cart:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         user:
 *           type: string
 *         items:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               product:
 *                 type: string
 *               quantity:
 *                 type: number
 *               price:
 *                 type: number
 *         total:
 *           type: number
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 * 
 *     Address:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         user:
 *           type: string
 *         street:
 *           type: string
 *         city:
 *           type: string
 *         state:
 *           type: string
 *         country:
 *           type: string
 *         zipCode:
 *           type: string
 *         isDefault:
 *           type: boolean
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 * 
 *     Brand:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         logo:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 * 
 *     Comment:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         user:
 *           type: string
 *         product:
 *           type: string
 *         text:
 *           type: string
 *         rating:
 *           type: number
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 * 
 *     DiscountCode:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         code:
 *           type: string
 *         discount:
 *           type: number
 *         startDate:
 *           type: string
 *           format: date-time
 *         endDate:
 *           type: string
 *           format: date-time
 *         isActive:
 *           type: boolean
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 * 
 *     Slider:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         image:
 *           type: string
 *         link:
 *           type: string
 *         isActive:
 *           type: boolean
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 * 
 *     Variant:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *         values:
 *           type: array
 *           items:
 *             type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 * 
 *     ProductVariant:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         product:
 *           type: string
 *         variant:
 *           type: string
 *         price:
 *           type: number
 *         stock:
 *           type: number
 *         sku:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 * 
 *     Order:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         user:
 *           type: string
 *         items:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               product:
 *                 type: string
 *               quantity:
 *                 type: number
 *               price:
 *                 type: number
 *         total:
 *           type: number
 *         status:
 *           type: string
 *           enum: [pending, processing, completed, cancelled]
 *         paymentStatus:
 *           type: string
 *           enum: [pending, paid, failed]
 *         shippingAddress:
 *           type: string
 *         paymentMethod:
 *           type: string
 *           enum: [zarinpal, cash]
 *         trackingNumber:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 * 
 *     Rate:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         user:
 *           type: string
 *         product:
 *           type: string
 *         rating:
 *           type: number
 *           minimum: 1
 *           maximum: 5
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 * 
 *     Report:
 *       type: object
 *       properties:
 *         totalUsers:
 *           type: number
 *         newUsers:
 *           type: number
 *         activeUsers:
 *           type: number
 *         inventoryLevels:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               product:
 *                 type: string
 *               stock:
 *                 type: number
 *         salesByCategory:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               category:
 *                 type: string
 *               totalSales:
 *                 type: number
 *         orderStatusCounts:
 *           type: object
 *           properties:
 *             pending:
 *               type: number
 *             processing:
 *               type: number
 *             completed:
 *               type: number
 *             cancelled:
 *               type: number
 *         revenueSummary:
 *           type: object
 *           properties:
 *             totalRevenue:
 *               type: number
 *             averageOrderValue:
 *               type: number
 *             totalOrders:
 *               type: number
 *         abandonedCartRate:
 *           type: number
 *         commentsStats:
 *           type: object
 *           properties:
 *             totalComments:
 *               type: number
 *             averageRating:
 *               type: number
 *         ratingsStats:
 *           type: object
 *           properties:
 *             averageRating:
 *               type: number
 *             totalRatings:
 *               type: number
 *         discountPerformance:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *               usageCount:
 *                 type: number
 *               totalDiscount:
 *                 type: number
 *         shippingByRegion:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               region:
 *                 type: string
 *               orderCount:
 *                 type: number
 *         dataGrowth:
 *           type: object
 *           properties:
 *             users:
 *               type: number
 *             products:
 *               type: number
 *             orders:
 *               type: number
 */

/**
 * @swagger
 * /api/auth:
 *   post:
 *     tags: [Authentication]
 *     summary: User authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: Authentication successful
 *       401:
 *         description: Invalid credentials
 */

/**
 * @swagger
 * /api/auth/otp:
 *   post:
 *     tags: [Authentication]
 *     summary: Verify OTP
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               otp:
 *                 type: string
 *               email:
 *                 type: string
 *             required:
 *               - otp
 *               - email
 *     responses:
 *       200:
 *         description: OTP verified successfully
 *       400:
 *         description: Invalid OTP
 */

/**
 * @swagger
 * /api/auth/admin:
 *   post:
 *     tags: [Authentication]
 *     summary: Admin login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: Admin authentication successful
 *       401:
 *         description: Invalid credentials
 */

/**
 * @swagger
 * /api/auth/forget:
 *   post:
 *     tags: [Authentication]
 *     summary: Request password reset
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *             required:
 *               - email
 *     responses:
 *       200:
 *         description: Password reset email sent
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * /api/auth/resend:
 *   post:
 *     tags: [Authentication]
 *     summary: Resend OTP
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *             required:
 *               - email
 *     responses:
 *       200:
 *         description: OTP resent successfully
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * /api/product:
 *   get:
 *     tags: [Products]
 *     summary: Get all products
 *     responses:
 *       200:
 *         description: List of products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *   post:
 *     tags: [Products]
 *     summary: Create a new product
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       201:
 *         description: Product created successfully
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/product/{id}:
 *   get:
 *     tags: [Products]
 *     summary: Get product by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 *   patch:
 *     tags: [Products]
 *     summary: Update product
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Product not found
 *   delete:
 *     tags: [Products]
 *     summary: Delete product
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Product not found
 */

/**
 * @swagger
 * /api/product/favorite:
 *   post:
 *     tags: [Products]
 *     summary: Add product to favorites
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *             required:
 *               - productId
 *     responses:
 *       200:
 *         description: Product added to favorites
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Product not found
 */

/**
 * @swagger
 * /api/category:
 *   get:
 *     tags: [Categories]
 *     summary: Get all categories
 *     responses:
 *       200:
 *         description: List of categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 *   post:
 *     tags: [Categories]
 *     summary: Create a new category
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Category'
 *     responses:
 *       201:
 *         description: Category created successfully
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/cart:
 *   get:
 *     tags: [Cart]
 *     summary: Get user cart
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 *       401:
 *         description: Unauthorized
 *   post:
 *     tags: [Cart]
 *     summary: Add item to cart
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *               quantity:
 *                 type: number
 *             required:
 *               - productId
 *               - quantity
 *     responses:
 *       200:
 *         description: Item added to cart successfully
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/address:
 *   get:
 *     tags: [Address]
 *     summary: Get user addresses
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of addresses
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Address'
 *       401:
 *         description: Unauthorized
 *   post:
 *     tags: [Address]
 *     summary: Add new address
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Address'
 *     responses:
 *       201:
 *         description: Address added successfully
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/brand:
 *   get:
 *     tags: [Brands]
 *     summary: Get all brands
 *     responses:
 *       200:
 *         description: List of brands
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Brand'
 *   post:
 *     tags: [Brands]
 *     summary: Create a new brand
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Brand'
 *     responses:
 *       201:
 *         description: Brand created successfully
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/comment:
 *   get:
 *     tags: [Comments]
 *     summary: Get product comments
 *     parameters:
 *       - in: query
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of comments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Comment'
 *   post:
 *     tags: [Comments]
 *     summary: Add new comment
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Comment'
 *     responses:
 *       201:
 *         description: Comment added successfully
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/discount:
 *   get:
 *     tags: [Discounts]
 *     summary: Get all discount codes
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of discount codes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/DiscountCode'
 *   post:
 *     tags: [Discounts]
 *     summary: Create a new discount code
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DiscountCode'
 *     responses:
 *       201:
 *         description: Discount code created successfully
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/slider:
 *   get:
 *     tags: [Sliders]
 *     summary: Get all sliders
 *     responses:
 *       200:
 *         description: List of sliders
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Slider'
 *   post:
 *     tags: [Sliders]
 *     summary: Create a new slider
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Slider'
 *     responses:
 *       201:
 *         description: Slider created successfully
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/variant:
 *   get:
 *     tags: [Variants]
 *     summary: Get all variants
 *     responses:
 *       200:
 *         description: List of variants
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Variant'
 *   post:
 *     tags: [Variants]
 *     summary: Create a new variant
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Variant'
 *     responses:
 *       201:
 *         description: Variant created successfully
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/product-variant:
 *   get:
 *     tags: [Product Variants]
 *     summary: Get all product variants
 *     parameters:
 *       - in: query
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of product variants
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ProductVariant'
 *   post:
 *     tags: [Product Variants]
 *     summary: Create a new product variant
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductVariant'
 *     responses:
 *       201:
 *         description: Product variant created successfully
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/search:
 *   get:
 *     tags: [Search]
 *     summary: Search products
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Search results
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */

/**
 * @swagger
 * /api/upload:
 *   post:
 *     tags: [Upload]
 *     summary: Upload file
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: File uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 url:
 *                   type: string
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/order:
 *   post:
 *     tags: [Orders]
 *     summary: Create a new order
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: string
 *                     quantity:
 *                       type: number
 *                 required:
 *                   - productId
 *                   - quantity
 *               shippingAddress:
 *                 type: string
 *               paymentMethod:
 *                 type: string
 *                 enum: [zarinpal, cash]
 *             required:
 *               - items
 *               - shippingAddress
 *               - paymentMethod
 *     responses:
 *       201:
 *         description: Order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 order:
 *                   $ref: '#/components/schemas/Order'
 *                 paymentUrl:
 *                   type: string
 *                   description: Payment URL for Zarinpal (if payment method is zarinpal)
 *       401:
 *         description: Unauthorized
 *       400:
 *         description: Invalid request
 *   get:
 *     tags: [Orders]
 *     summary: Get all orders
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of orders
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/order/{id}:
 *   get:
 *     tags: [Orders]
 *     summary: Get order by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Order not found
 */

/**
 * @swagger
 * /api/order/zarinpal/callback:
 *   get:
 *     tags: [Orders]
 *     summary: Zarinpal payment callback
 *     parameters:
 *       - in: query
 *         name: Authority
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: Status
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Payment processed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       400:
 *         description: Payment failed
 *       404:
 *         description: Order not found
 */

/**
 * @swagger
 * /api/rate:
 *   post:
 *     tags: [Ratings]
 *     summary: Rate a product
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *               rating:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *             required:
 *               - productId
 *               - rating
 *     responses:
 *       201:
 *         description: Rating created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Rate'
 *       401:
 *         description: Unauthorized
 *       400:
 *         description: Invalid request
 */

/**
 * @swagger
 * /api/report/users/total:
 *   get:
 *     tags: [Reports]
 *     summary: Get total users report
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Total users report
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalUsers:
 *                   type: number
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/report/users/new-vs-active:
 *   get:
 *     tags: [Reports]
 *     summary: Get new vs active users report
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: New vs active users report
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 newUsers:
 *                   type: number
 *                 activeUsers:
 *                   type: number
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/report/products/inventory:
 *   get:
 *     tags: [Reports]
 *     summary: Get inventory levels report
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Inventory levels report
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 inventoryLevels:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Report/properties/inventoryLevels/items'
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/report/products/sales-by-category:
 *   get:
 *     tags: [Reports]
 *     summary: Get sales by category report
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Sales by category report
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 salesByCategory:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Report/properties/salesByCategory/items'
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/report/orders/status-counts:
 *   get:
 *     tags: [Reports]
 *     summary: Get order status counts report
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Order status counts report
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Report/properties/orderStatusCounts'
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/report/orders/revenue-summary:
 *   get:
 *     tags: [Reports]
 *     summary: Get revenue summary report
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Revenue summary report
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Report/properties/revenueSummary'
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/report/carts/abandoned-rate:
 *   get:
 *     tags: [Reports]
 *     summary: Get abandoned cart rate report
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Abandoned cart rate report
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 abandonedCartRate:
 *                   type: number
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/report/interactions/comments-stats:
 *   get:
 *     tags: [Reports]
 *     summary: Get comments statistics report
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Comments statistics report
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Report/properties/commentsStats'
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/report/interactions/ratings-stats:
 *   get:
 *     tags: [Reports]
 *     summary: Get ratings statistics report
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Ratings statistics report
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Report/properties/ratingsStats'
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/report/marketing/discount-performance:
 *   get:
 *     tags: [Reports]
 *     summary: Get discount performance report
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Discount performance report
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 discountPerformance:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Report/properties/discountPerformance/items'
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/report/logistics/shipping-by-region:
 *   get:
 *     tags: [Reports]
 *     summary: Get shipping by region report
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Shipping by region report
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 shippingByRegion:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Report/properties/shippingByRegion/items'
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/report/system/data-growth:
 *   get:
 *     tags: [Reports]
 *     summary: Get data growth report
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Data growth report
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Report/properties/dataGrowth'
 *       401:
 *         description: Unauthorized
 */
