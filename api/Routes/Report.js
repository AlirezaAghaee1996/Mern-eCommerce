import express from 'express';
import * as reportCn from '../Controllers/ReportCn.js';
import { isAdmin } from '../Middlewares/isAdmin.js';

const reportRouter = express.Router();

// 1. User Reports
reportRouter.get('/users/total', isAdmin, reportCn.getTotalUsers);
reportRouter.get('/users/new-vs-active', isAdmin, reportCn.getNewVsActiveUsers);

// 2. Product & Catalog
reportRouter.get('/products/inventory', isAdmin, reportCn.getInventoryLevels);
reportRouter.get('/products/sales-by-category', isAdmin, reportCn.getSalesByCategory);

// 3. Sales & Orders
reportRouter.get('/orders/status-counts', isAdmin, reportCn.getOrderStatusCounts);
reportRouter.get('/orders/revenue-summary', isAdmin, reportCn.getRevenueSummary);

// 4. Cart & Checkout
reportRouter.get('/carts/abandoned-rate', isAdmin, reportCn.getAbandonedCartRate);

// 5. Customer Interaction
reportRouter.get('/interactions/comments-stats', isAdmin, reportCn.getCommentsStats);
reportRouter.get('/interactions/ratings-stats', isAdmin, reportCn.getRatingsStats);

// 6. Marketing & Promotions
reportRouter.get('/marketing/discount-performance', isAdmin, reportCn.getDiscountPerformance);

// 7. Logistics & Geography
reportRouter.get('/logistics/shipping-by-region', isAdmin, reportCn.getShippingByRegion);

// 8. System Health
reportRouter.get('/system/data-growth', isAdmin, reportCn.getDataGrowth);

export default reportRouter;
