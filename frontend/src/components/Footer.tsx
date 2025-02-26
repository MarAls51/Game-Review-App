import { LogoIcon } from "./Icons";
import { Testimonial } from "./Testimonial";

export const Footer = () => {
  return (
    <footer id="footer">
      <hr className="w-11/12 mx-auto" />
      <Testimonial />
      <section className="container pb-14 text-center">
        <h3>&copy; 2025 GameReviewApp. All rights reserved.</h3>
      </section>
    </footer>
  );
};
