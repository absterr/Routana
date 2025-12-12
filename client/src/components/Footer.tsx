import { Link } from "react-router-dom";

const footerLinks = [
  {
    name: "Pricing",
    url: "/pricing",
  },
  {
    name: "Contact",
    url: "#",
  },
  {
    name: "𝕏 (Twitter)",
    url: "https://x.com/_absterr",
  },
  {
    name: "LinkedIn",
    url: "https://linkedin.com/in/abba-is-haq-b1457932",
  },
  {
    name: "Github",
    url: "https://github.com/absterr",
  },
];

const Footer = () => (
  <footer className="bg-black text-white w-full pt-12 pb-30 px-12 md:px-16 lg:px-24 min-h-[calc(40vh)]">
    <div className="max-w-7xl mx-auto px-6 text-center md:text-left">
      <div className="grid gap-12 grid-cols-1 md:grid-cols-2 md:grid-rows-[1fr_0.5fr]">
        <div className="space-y-2">
          <p className="font-bold text-2xl tracking-tight">Routana</p>
          <p className="text-neutral-400 tracking-tight">
            Designed to help you learn with clarity
          </p>
        </div>

        <div className="grid md:grid-cols-3">
          <ul className="space-y-2 md:col-end-4">
            {footerLinks.map((link) => (
              <li className="hover:underline" key={link.url}>
                <Link to={link.url}>{link.name}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="text-sm text-neutral-400 flex items-end justify-center md:justify-start">
          <p>&copy; Routana 2025. All rights reserved</p>
        </div>

        <div className="text-sm text-neutral-400 flex justify-center md:grid md:grid-cols-3">
          <div className="md:col-end-4 space-x-12 flex items-end">
            <Link to={"#"} className="hover:underline">
              Privacy policy
            </Link>
            <Link to={"#"} className="hover:underline">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </div>
  </footer>
);
export default Footer;
