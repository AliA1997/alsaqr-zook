import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
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
      className="relative"
    >
      <CarouselContent className="-ml-2 px-2">
        {products.map((product, index) => {
          const totalSimilarity = (product.titleSimilarity + product.categorySimilarity + product.descriptionSimilarity);
          const howSimilarKey = totalSimilarity > 1.1 ? HowSimilarKeys.MostSimilar : totalSimilarity < 0.3 ? HowSimilarKeys.NotSimilar : HowSimilarKeys.KindaSimilar;
          return (
            <CarouselItem
              key={index}
              className="basis-1/2 pl-2 sm:basis-1/3 md:basis-1/4 md:pl-4 lg:basis-1/5 xl:basis-1/6 h-[20rem]"
            >
              <ProductCard product={product} howSimilar={howSimilarKey}/>
            </CarouselItem>
          );
        })}
      </CarouselContent>

      {/* Carousel Controls */}
      <CarouselPrevious className="left-0" />
      <CarouselNext className="right-0" />
    </Carousel>
  );
}
