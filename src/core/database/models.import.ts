import { Role, RoleUser } from "src/modules/access-control/models/rol.model";
import { RefreshToken, TokenActivation } from "../../modules/users/models/token.model";
import { User } from "../../modules/users/models/user.model";
import { Permission, RolePermission } from "src/modules/access-control/models/permission.model";
import { Category } from "src/modules/categories/models/category.model";
import { Product } from "src/modules/products/models/product.model";
import { Cart } from "src/modules/cart/models/cart.model";
import { Item } from "src/modules/cart/models/item.model";
import { Commune, Province, Region } from "src/modules/address/models/locates.model";
import { Address, AddressUser } from "src/modules/address/models/address.model";
import { Sale, SaleProduct } from "src/modules/sales/models/sale.model";
import { Shipping } from "src/modules/shippings/models/shipping.model";
import { ImagesProduct } from "src/modules/products/models/image.model";
import { Offer } from "src/modules/offers/models/offer.model";
import { Branch, ProductBranch } from "src/modules/branch/models/branch.model";
import { Subscription } from "src/modules/subscriptions/models/subscription.model";
import { Employee } from "src/modules/branch/models/employee.model";
import { Purchase, PurchaseProduct } from "src/modules/purchase/models/purchase.model";
import { Supplier } from "src/modules/purchase/models/supplier.model";
import { PurchaseOrder } from "src/modules/purchase/models/purchase-order.model";

export const ArrayModels: Array<any> = [
    User,
    TokenActivation,
    RefreshToken,
    Role,
    RoleUser,
    Permission,
    RolePermission,
    Category,
    Product,
    Cart,
    Item,
    Region,
    Province,
    Commune,
    Address,
    AddressUser,
    Sale,
    Shipping,
    SaleProduct,
    ImagesProduct,
    Offer,
    Branch,
    ProductBranch,
    Subscription,
    Employee,
    Supplier,
    Purchase,
    PurchaseProduct,
    PurchaseOrder
]