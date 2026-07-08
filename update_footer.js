const fs = require('fs');
let code = fs.readFileSync('src/components/Footer.js', 'utf8');

code = code.replace(
  'import { usePathname } from "next/navigation";',
  'import { usePathname } from "next/navigation";\nimport { useLanguage } from "@/contexts/LanguageContext";'
);

code = code.replace(
  'const pathname = usePathname();',
  `const pathname = usePathname();
  const { currentLang, globalContent } = useLanguage();
  const lang = currentLang;
  
  const foot = globalContent?.footer?.[lang] || {
    description: "Aruna brings you to exotic destinations with a personal, refined touch.",
    phone: "+62 851 2222 3333",
    email: "hello@aruna.com",
    company_title: "The Company",
    newsletter_title: "Stay Connected",
    newsletter_desc: "Join our newsletter for exclusive travel tips and early access to our curated retreats.",
    subscribe_btn: "Subscribe",
    copyright: "Aruna. All rights reserved."
  };`
);

code = code.replace('Aruna brings you to exotic destinations with a personal, refined touch.', '{foot.description}');
code = code.replace('+62 851 2222 3333', '{foot.phone}');
code = code.replace('hello@aruna.com', '{foot.email}');
code = code.replace('>The Company</h4>', '>{foot.company_title}</h4>');
code = code.replace('>Stay Connected</h4>', '>{foot.newsletter_title}</h4>');
code = code.replace('Join our newsletter for exclusive travel tips and early access to our curated retreats.', '{foot.newsletter_desc}');
code = code.replace('>\\n              Subscribe\\n            </button>', '>\\n              {foot.subscribe_btn}\\n            </button>');
code = code.replace('Aruna. All rights reserved.', '{foot.copyright}');

fs.writeFileSync('src/components/Footer.js', code);
console.log("Footer updated!");
