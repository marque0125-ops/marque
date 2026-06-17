import { Metadata } from 'next';
import BlogView from "../../components/BlogView";

export const metadata: Metadata = {
  title: "RC Knowledge Base & Blog | MARQUE",
  description: "Read the latest tips, tricks, and maintenance guides for high-performance RC cars.",
};

export default function BlogPage() {
  return <BlogView />;
}
