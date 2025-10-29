import {
  Carousel,
  CarouselContent,
  CarouselItem
} from "@common/Carousels"; // make sure this path matches your actual file name
import type { SimilarProductRecord } from "@models/product";
import ProductCard from "@components/products/ProductCard";
import { HowSimilarKeys } from "@models/enums";

interface ProductsMarqueeProps {
  products: SimilarProductRecord[];
}

export default function ProductsMarquee({ products }: ProductsMarqueeProps) {

  return (
    <Carousel
      opts={{
        dragFree: true,
      }}
      orientation="horizontal"
      className="relative pb-[2rem]"
    >
      <CarouselContent className="-ml-2 px-2">
        {products.map((product, index) => {
          const totalSimilarity = (product.titleSimilarity + product.categorySimilarity + product.descriptionSimilarity);
          const howSimilarKey = totalSimilarity > 1.1 ? HowSimilarKeys.MostSimilar : totalSimilarity < 0.3 ? HowSimilarKeys.NotSimilar : HowSimilarKeys.KindaSimilar;
          return (
            <CarouselItem
              key={index}
              className="basis-1/2 pl-2 sm:basis-1/3 md:basis-1/4 md:pl-4 min-h-[15rem]"
            >
              <ProductCard 
                classNames="h-full"
                howSimilar={howSimilarKey} 
                product={product} 
                showCategory={true} 
              />
            </CarouselItem>
          );
        })}
      </CarouselContent>
    </Carousel>
  );
}
