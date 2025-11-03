import { OptimizedPostImage } from "@common/Image";
import { TagOrLabel } from "@common/Titles";
import { HowSimilarKeys } from "@models/enums";
import type { ProductRecord } from "@models/product";
import { useStore } from "@stores/index";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router";


interface ProductCardProps {
  product: ProductRecord;
  showCategory?: boolean;
  howSimilar?: HowSimilarKeys;
  classNames?: string;
  testId?: string;
}

export default observer(function ProductCard({ classNames, product, showCategory, howSimilar, testId }: ProductCardProps) {
  const { productFeedStore } = useStore();
  const navigate = useNavigate();
  const { setProductToViewId } = productFeedStore;

  const imageUrl =
    product.images && product.images.length > 0
      ? product.images[0]
      : "https://via.placeholder.com/200"; // fallback image

  const SimilarLabel = () => {
    if(howSimilar === HowSimilarKeys.NotSimilar)
      return (
        <TagOrLabel
          className="absolute bottom-1 right-0 m-0"
          color="danger"
          size="sm"
        >
          Not a Match
        </TagOrLabel>
      );
    else if(howSimilar === HowSimilarKeys.MostSimilar)
      return (
        <TagOrLabel
          className="absolute bottom-1 right-0 m-0"
          color="success"
          size="sm"
        >
          Good Match
        </TagOrLabel>
      );
    else
      return (
        <TagOrLabel
          className="absolute bottom-1 right-0 m-0"
          color="info"
          size="sm"
        >
          Ok Match
        </TagOrLabel>
      );
  }
  return (
    <a
      href={`/products/${product.slug}`}
      onClick={(e) => {
        e.preventDefault();
        setProductToViewId(product.id);
        navigate(`/products/${product.slug}`);
      }}
      className={`
        block transition-transform duration-200 hover:scale-[1.02]
        ${classNames && classNames}
      `}
      data-testid={testId ?? "productcard"}
    >
      <div className="flex h-full w-fit flex-col justify-around rounded-lg border border-gray-200 bg-white shadow-sm">

        <div className="flex items-center justify-center p-1 relative">
          <OptimizedPostImage 
            src={imageUrl}
            alt={product.title}
            classNames="rounded-md object-cover"
          />

          {howSimilar && <SimilarLabel />}
        </div>

        <div className="p-2 pt-0">
          <h3 
            data-testid="producttitle"
            className="line-clamp-2 max-w-[180px] text-sm font-medium leading-tight sm:text-base"
          >
            {product.title}
          </h3>
          {showCategory && (
            <p className="text-sm text-gray-500">{product.category}</p>
          )}
        </div>

        <div className="w-full p-2 pt-0">
          <p className="font-medium text-blue-600">${product.price}</p>
        </div>
      </div>
    </a>
  );
});
