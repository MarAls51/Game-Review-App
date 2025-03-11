import { AboutUsSection } from "../components/AboutUsSection";
import pilot from "@/assets/pilot.png";

export const About = () => {
  return (
    <section id="about" className="container py-24 sm:py-32">
      <div className="bg-muted/50 border rounded-lg py-12">
        <div className="px-6 flex flex-col-reverse md:flex-row gap-8 md:gap-12">
          <img
            src={pilot}
            alt="Pilot Image"
            className="w-[300px] object-contain rounded-lg"
          />
          <AboutUsSection />
        </div>
      </div>
    </section>
  );
};
