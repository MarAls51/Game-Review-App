import { Button } from "./ui/button";
import { Input } from "./ui/input";

export const Testimonial = () => {
  const handleSubmit = (e: any) => {
    e.preventDefault();
  };

  return (
    <section id="newsletter">
      <hr className="w-11/12 mx-auto" />

      <div className="container py-24 sm:py-32">
        <h3 className="text-center text-4xl md:text-5xl font-bold">
          Enjoying the app? Give us your{" "}
          <span className="inline bg-gradient-to-r from-[#00FF00] to-[#32CD32] text-transparent bg-clip-text">
            Testimonial.
          </span>
        </h3>
        <p className="text-xl text-muted-foreground text-center mt-4 mb-8">
          Feel free to write your honest opnion! We love community feedback.
        </p>

        <form
          className="flex flex-col w-full md:flex-row md:w-6/12 lg:w-4/12 mx-auto gap-4 md:gap-2"
          onSubmit={handleSubmit}
        >
          <Input
            placeholder="garbage application ky...."
            className="bg-muted/50 dark:bg-muted/80 "
            aria-label="email"
          />
          <Button>Submit</Button>
        </form>
      </div>

      <hr className="w-11/12 mx-auto" />
    </section>
  );
};
