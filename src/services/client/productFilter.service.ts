import { prisma } from "../../config/client";

export const getPaginatedProducts = async (currentPage: number, pageSize: number) => {
  const page = currentPage < 1 ? 1 : currentPage;
  const size = pageSize < 1 ? 6 : pageSize;

  try {
    const products = await prisma.product.findMany({
      skip: (page - 1) * size,
      take: size,
    });
    return products;
  } catch (error) {
    console.error('Error fetching paginated products:', error);
    return [];
  }
};
// lấy tổng sản phẩm trong page
export const getTotalProductPages = async (pageSize: number) => {
  try {
    const size = pageSize < 1 ? 8 : pageSize;
    const total = await prisma.product.count();
    return Math.ceil(total / size);
  } catch (error) {
    console.error('Error counting total pages:', error);
    return 1;
  }
};
export const getProductWithFilter = async(
    page:number,
    pageSize:number,
    factory:string,
    target:string,
    price:string,
    sort:string,
)=>{
    const filterClause :any = {}; // chứa các dt filter
    //filter factory
    if(factory){
      const factoryInput = factory.split(",") // factoryInput string[]
      filterClause.factory={
       in:factoryInput // toán tử in lọc các bản ghi có giá trị thuộc 1 tập hợp cụ thể
      }
    }
    //filter target
    if(target){
      const targetInput = target.split(",") // targetInput string[]
      filterClause.target={
       in:targetInput
      }
    }
     // filter price
     const priceOR: any[] = [];

     if (price) {
       const priceInput = price.split(","); // ["duoi-10-trieu", "10-15-trieu", ...]
     
       for (let i = 0; i < priceInput.length; i++) {
         if (priceInput[i] === "duoi-10-trieu") {
           priceOR.push({ price: { lte: 10000000 } });
         }
         if (priceInput[i] === "10-15-trieu") {
           priceOR.push({ price: { gte: 10000000, lte: 15000000 } });
         }
         if (priceInput[i] === "15-20-trieu") {
           priceOR.push({ price: { gte: 15000000, lte: 20000000 } });
         }
         if (priceInput[i] === "tren-20-trieu") {
           priceOR.push({ price: { gte: 20_000_000 } });
         }
       }
     }
     

     if (priceOR.length > 0) {
      filterClause.OR = priceOR;
    }

    // mệnh đề orderBy
      const orderByClause: any = {};
  if (sort === "gia-tang-dan") {
    orderByClause.price = "asc";
  } else if (sort === "gia-giam-dan") {
    orderByClause.price= "desc";
  }
// Prisma transaction: lấy product list và count đồng thời
const [products, count] = await prisma.$transaction([
  // lấy ra product dựa vào filterClause
    prisma.product.findMany({
    skip: (page - 1) * pageSize,
    take: pageSize,
    where: filterClause,
    orderBy: Object.keys(orderByClause).length > 0 ? orderByClause : undefined,
  }),
  // đếm số lương bả ghi trong product dựa vào filterClause
  prisma.product.count({
    where: filterClause,
  })
]);
      const totalPages = Math.ceil(count / pageSize);
      return {
        totalPages,
        products
      }
}
