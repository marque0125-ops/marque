import { Metadata } from 'next';
import ContactView from "../../components/ContactView";

export const metadata: Metadata = {
  title: "Contact Support | MARQUE Technical Garage",
  description: "Need technical support or custom part compatibility advice? Our expert RC pilots are ready to help.",
};

export default function ContactPage() {
  return <ContactView />;
}
