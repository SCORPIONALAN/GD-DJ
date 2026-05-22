import Nav       from '../components/Nav';
import Hero      from '../components/Hero';
import Servicios from '../components/Servicios';
import LeadForm  from '../components/LeadForm';
import Resenas   from '../components/Resenas';
import Faqs      from '../components/Faqs';
import Blog      from '../components/Blog';
import Footer    from '../components/Footer';

export default function HomePage() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Servicios />
        <Resenas />
        <Faqs />
        <Blog />
        <LeadForm />
      </main>
      <Footer />
    </>
  );
}
