import ProductCarousel from "./ProductCarousel";
import { ProductRecord } from "@models/product";

export default function ProductDetailCard({
  product
}: {
  product: ProductRecord
}) {
  return (
    <div data-testid="productdetailscard" className="flex flex-col">

      <section className="flex w-full flex-col py-4 md:flex-row">
        <ProductCarousel product={product} />

        <div className="flex w-full flex-col space-y-4 px-0 py-2 md:w-1/2 md:px-4 lg:px-12">
          <p className="p-2 text-[2rem] font-bold md:text-[2.5rem]">{product.title}</p>

          <h2 data-testid="productdetailsprice" className="p-2 text-lg font-semibold text-primary">
            Price: ${" "}
            <span className="text-xl font-bold">{product.price}</span>
            <span className="px-2 text-xs text-gray-500">(including GST)</span>
          </h2>
          {/* <div className="pt-2">
              <AddToCartButton product={product} />
          </div> */}
        </div>
      </section>
      <section>
        <div className="overflow-x-auto">
            <table className="min-w-full border-collapse text-sm">
              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="whitespace-nowrap px-2 py-2 font-medium text-gray-600">
                    Product Code:
                  </td>
                  <td className="px-2 py-2">{product.slug}</td>
                </tr>

                {product.description && (
                  <tr className="border-b border-gray-200">
                    <td className="px-2 py-2 font-medium text-gray-600">
                      Description:
                    </td>
                    <td className="px-2 py-2">{product.description}</td>
                  </tr>
                )}

                <tr>
                  <td className="px-2 py-2 font-medium text-gray-600">
                    Category:
                  </td>
                  <td className="px-2 py-2">{product.category}</td>
                </tr>
              </tbody>
            </table>
          </div>
      </section>
    </div>
  );
}
