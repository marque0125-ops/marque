import { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { BRANDS, PRODUCTS } from '../../../data/mockData';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const product = PRODUCTS.find((p) => p.slug === params.slug);
  
  if (!product) {
    return {
      title: "Product Not Found | MARQUE",
      description: "The requested RC model could not be found.",
    };
  }

  const brand = BRANDS.find(b => b.id === product.brandId);
  const brandName = brand ? brand.name : "MARQUE";

  return {
    title: `${product.name} - ${brandName} RC Car | MARQUE`,
    description: product.description.substring(0, 160) + "...",
    openGraph: {
      title: `${product.name} | MARQUE Premium RC`,
      description: product.description.substring(0, 160) + "...",
      images: [
        {
          url: product.images[0].startsWith('http') ? product.images[0] : `https://marque.co.in${product.images[0]}`,
          width: 800,
          height: 600,
          alt: product.name,
        },
      ],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} | MARQUE Premium RC`,
      description: product.description.substring(0, 160) + "...",
      images: [product.images[0].startsWith('http') ? product.images[0] : `https://marque.co.in${product.images[0]}`],
    },
  };
}

const ProductPageClient = dynamic(() => import('../../../components/ProductPageClient'), { ssr: false });

export default function ProductPage({ params }: { params: { slug: string } }) {
  return <ProductPageClient slug={params.slug} />;
}
