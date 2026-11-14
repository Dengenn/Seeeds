/* seeeds — catalogue, navigation and history data.
   Product images are background-free cut-outs in assets/products (demo images, see CREDITS.md).
   Replace with real product photography before launch. */

window.SEEEDS = window.SEEEDS || {};
var IMG = function (n) { return "assets/products/" + n + ".webp"; };
var PHOTO = function (n) { return "assets/photos/" + n + ".jpg"; };

SEEEDS.collections = [
  { id: "buried",    name: "Buried",    image: PHOTO("look-portrait"), line: "Black and white essentials. History, printed plainly." },
  { id: "bloom",     name: "Bloom",     image: PHOTO("look-bloom"),    line: "Pink, for everything that breaks through." },
  { id: "unbound",   name: "Unbound",   image: PHOTO("chain-hand"),    line: "The chain, always broken." },
  { id: "reclaimed", name: "Reclaimed", image: PHOTO("store"),         line: "Vintage pieces, reworked by hand. One of one." }
];

/* gender: men | women | kids.  type: tops | jackets | pants | shoes | hats | bags | jewellery.  kidsAge: big | little | baby */
SEEEDS.types = {
  tops: "Tops & T-Shirts", jackets: "Jackets", pants: "Pants & Jeans", shoes: "Shoes",
  hats: "Hats & Caps", bags: "Bags", jewellery: "Jewellery"
};
SEEEDS.typeGroups = { clothing: ["tops", "jackets", "pants"], accessories: ["hats", "bags", "jewellery"] };

var ADULT = ["XS", "S", "M", "L", "XL", "XXL"], SHOES = ["UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11"], KIDS = ["3–4Y", "5–6Y", "7–8Y", "9–10Y"], BABY = ["0–3M", "3–6M", "6–12M", "12–18M"];

SEEEDS.products = [
  {
    id: "seeeds-heavyweight-tee", name: "Seeeds Heavyweight Tee", gender: ["men", "women"], type: "tops", collection: "buried",
    colour: "White", price: 62, sizes: ADULT, images: [IMG("tee-white"), IMG("tee-white-hanger")], featured: true, isNew: true,
    honours: { name: "Everyone who came after", year: "Today", line: "The generation born free because someone else wasn't." },
    details: ["Heavyweight 280gsm cotton", "Relaxed fit", "Small wordmark on chest", "Pre-shrunk, garment-washed"]
  },
  {
    id: "they-buried-us-tee", name: "They Buried Us Tee", gender: ["men", "women"], type: "tops", collection: "buried",
    colour: "Black", price: 68, sizes: ADULT, images: [IMG("tee-black")], featured: true,
    honours: { name: "The 12.5 million", year: "1500s–1860s", line: "For everyone carried across the Atlantic in chains, whose names were taken from them." },
    details: ["Heavyweight 280gsm cotton", "Boxy, dropped shoulder", "Motto printed on the back", "Woven seed label at hem"]
  },
  {
    id: "bloom-tee", name: "Bloom Tee", gender: ["women", "men"], type: "tops", collection: "bloom",
    colour: "Bloom pink", price: 68, sizes: ADULT, images: [IMG("tee-pink")], featured: true, badge: "Signature", isNew: true,
    honours: { name: "The ones not yet born", year: "Tomorrow", line: "The seed doesn't see the flower. Neither did they. We wear the colour of what came up." },
    details: ["Heavyweight 280gsm cotton", "Garment-dyed Bloom pink", "Tonal splash print on the back", "Relaxed fit"]
  },
  {
    id: "1957-long-sleeve", name: "1957 Long Sleeve", gender: ["men"], type: "tops", collection: "buried",
    colour: "Black", price: 78, sizes: ADULT, images: [IMG("longsleeve-black")],
    honours: { name: "Kwame Nkrumah", year: "6 March 1957", line: "At midnight in Accra, Ghana became independent, and a whole continent saw that freedom could be won." },
    details: ["240gsm cotton jersey", "Ribbed cuffs", "1957 printed on the sleeve", "Regular fit"]
  },
  {
    id: "soil-denim", name: "Soil Denim", gender: ["men"], type: "pants", collection: "buried",
    colour: "Washed black", price: 120, sizes: ["28", "30", "32", "34", "36", "38"], images: [IMG("jeans-black")], isNew: true,
    honours: { name: "Steve Biko", year: "1970s", line: "The voice of Black Consciousness in South Africa: be proud of who you are, before anyone tells you otherwise." },
    details: ["13oz rigid denim", "Straight leg", "Rose-gold rivets", "Shamrock embroidered on back pocket"]
  },
  {
    id: "soil-low", name: "Soil Low", gender: ["men", "women"], type: "shoes", collection: "unbound",
    colour: "Black", price: 145, sizes: SHOES, images: [IMG("shoe-black")], badge: "New", isNew: true,
    honours: { name: "Rosa Parks", year: "1955–1956", line: "She kept her seat. A city walked instead of riding for 381 days, until the buses were desegregated. Made for walking." },
    details: ["Tumbled leather upper", "Tonal rubber sole, 381 debossed on the heel", "Broken-link lace charm", "Leather lining"]
  },
  {
    id: "wear-your-freedom-cap", name: "Wear Your Freedom Cap", gender: ["women", "men"], type: "hats", collection: "bloom",
    colour: "White", price: 58, sizes: ["One size"], images: [IMG("cap-white")],
    honours: { name: "Harriet Tubman", year: "1849", line: "She escaped slavery, then went back about thirteen times and guided around seventy people north to freedom." },
    details: ["Cotton twill", "Six panels, structured", "Pink embroidered motto", "Adjustable strap"]
  },
  {
    id: "seeeds-washed-cap", name: "Seeeds Washed Cap", gender: ["men", "women"], type: "hats", collection: "unbound",
    colour: "Washed black", price: 58, sizes: ["One size"], images: [IMG("cap-washed")],
    honours: { name: "Yaa Asantewaa", year: "1900", line: "Queen Mother of Ejisu. She led the Asante war against British rule to protect the Golden Stool." },
    details: ["Washed cotton twill", "Six panels, unstructured", "Rose-gold shamrock mark", "Brass buckle"]
  },
  {
    id: "unbound-chain", name: "Unbound Chain", gender: ["men", "women"], type: "jewellery", collection: "unbound",
    colour: "Gold", price: 185, sizes: ["50 cm", "60 cm"], images: [IMG("chain-gold")], featured: true,
    honours: { name: "Frederick Douglass", year: "1845", line: "He escaped in 1838 and turned his own life story into one of the sharpest weapons against slavery." },
    details: ["Gold-plated sterling silver", "One open link at the clasp: the chain is always broken", "Engraved with the motto", "Comes in a seeeds pouch"]
  },
  {
    id: "roll-call-tote", name: "Roll Call Tote", gender: ["women", "men"], type: "bags", collection: "buried",
    colour: "Natural", price: 48, sizes: ["One size"], images: [IMG("tote")],
    honours: { name: "Every name on the roll call", year: "Always", line: "Carry the names. Read them out loud. That's how a story stays above ground." },
    details: ["16oz natural canvas", "Long handles", "Inside pocket", "Names printed in black"]
  },
  {
    id: "little-seeeds-tee", name: "Little Seeeds Tee", gender: ["kids"], kidsAge: "little", type: "tops", collection: "bloom",
    colour: "White", price: 32, sizes: KIDS, images: [IMG("kids-tee")], isNew: true,
    honours: { name: "Ruby Bridges", year: "1960", line: "At six years old she walked past the crowds to become the first Black child at William Frantz Elementary in New Orleans." },
    details: ["Soft 180gsm cotton", "Pink shamrock on chest", "Easy-on neck", "Machine washable"]
  },
  {
    id: "first-seed-onesie", name: "First Seed Onesie", gender: ["kids"], kidsAge: "baby", type: "tops", collection: "bloom",
    colour: "White", price: 28, sizes: BABY, images: [IMG("baby-onesie")],
    honours: { name: "The next generation", year: "Tomorrow", line: "The newest seed. Everything we do is so they never have to fight the same fight." },
    details: ["Organic cotton", "Snap closures", "'little seeed' printed on the back", "Gift-boxed"]
  },
  {
    id: "kids-denim-set", name: "Kids Denim Set", gender: ["kids"], kidsAge: "big", type: "jackets", collection: "buried",
    colour: "Light wash", price: 74, sizes: KIDS, images: [IMG("kids-denim")],
    honours: { name: "Nelson Mandela", year: "1990", line: "He walked out after 27 years in prison, and four years later South Africa elected him its first Black president." },
    details: ["Jacket and jeans", "Soft washed denim", "Elasticated waist", "Shamrock button"]
  },
  {
    id: "reclaimed-01-denim", name: "Reclaimed No. 01 — Denim Jacket", gender: ["men", "women"], type: "jackets", collection: "reclaimed",
    colour: "Indigo", price: 340, sizes: ["L"], oneOfOne: true, images: [IMG("denim-jacket")],
    honours: { name: "Ida B. Wells", year: "1892", line: "A journalist who published the truth about lynching when printing it could have got her killed." },
    details: ["Vintage denim, 1990s", "Hand-painted pink splash on the back", "Numbered inside: 01"]
  },
  {
    id: "reclaimed-02-vintage-denim", name: "Reclaimed No. 02 — Vintage Denim", gender: ["men"], type: "pants", collection: "reclaimed",
    colour: "Faded black", price: 160, sizes: ["32"], oneOfOne: true, sold: true, images: [IMG("jeans-vintage")],
    honours: { name: "Malcolm X", year: "1964", line: "He founded the Organization of Afro-American Unity and demanded dignity on his own terms." },
    details: ["Vintage denim", "Chain-stitched wordmark", "Numbered inside: 02"]
  }
];

/* Mega menu, modelled on how Nike and Adidas organise their navigation */
SEEEDS.nav = [
  { label: "New & Featured", href: "shop.html?new=1", columns: [
    { title: "New & Featured", links: [["New Arrivals", "shop.html?new=1"], ["Best Sellers", "shop.html?sort=featured"], ["Drop 01: The Burial Collection", "shop.html?c=buried"], ["Reclaimed One-of-Ones", "shop.html?c=reclaimed"]] },
    { title: "Shop by collection", links: [["Buried", "shop.html?c=buried"], ["Bloom", "shop.html?c=bloom"], ["Unbound", "shop.html?c=unbound"], ["Reclaimed", "shop.html?c=reclaimed"]] },
    { title: "The story", links: [["Our Story", "story.html"], ["The Roll Call", "story.html#roll-call"]] }
  ], feature: { image: PHOTO("look-bloom"), title: "Bloom", href: "shop.html?c=bloom" } },
  { label: "Men", href: "shop.html?g=men", columns: [
    { title: "Featured", links: [["New Arrivals", "shop.html?g=men&new=1"], ["Best Sellers", "shop.html?g=men&sort=featured"], ["Shop All Men", "shop.html?g=men"]] },
    { title: "Shoes", links: [["All Shoes", "shop.html?g=men&t=shoes"], ["Sneakers", "shop.html?g=men&t=shoes"]] },
    { title: "Clothing", links: [["All Clothing", "shop.html?g=men&t=clothing"], ["Tops & T-Shirts", "shop.html?g=men&t=tops"], ["Jackets", "shop.html?g=men&t=jackets"], ["Pants & Jeans", "shop.html?g=men&t=pants"]] },
    { title: "Accessories", links: [["All Accessories", "shop.html?g=men&t=accessories"], ["Hats & Caps", "shop.html?g=men&t=hats"], ["Bags", "shop.html?g=men&t=bags"], ["Jewellery", "shop.html?g=men&t=jewellery"]] }
  ] },
  { label: "Women", href: "shop.html?g=women", columns: [
    { title: "Featured", links: [["New Arrivals", "shop.html?g=women&new=1"], ["Best Sellers", "shop.html?g=women&sort=featured"], ["Shop All Women", "shop.html?g=women"]] },
    { title: "Shoes", links: [["All Shoes", "shop.html?g=women&t=shoes"], ["Sneakers", "shop.html?g=women&t=shoes"]] },
    { title: "Clothing", links: [["All Clothing", "shop.html?g=women&t=clothing"], ["Tops & T-Shirts", "shop.html?g=women&t=tops"], ["Jackets", "shop.html?g=women&t=jackets"]] },
    { title: "Accessories", links: [["All Accessories", "shop.html?g=women&t=accessories"], ["Hats & Caps", "shop.html?g=women&t=hats"], ["Bags", "shop.html?g=women&t=bags"], ["Jewellery", "shop.html?g=women&t=jewellery"]] }
  ] },
  { label: "Kids", href: "shop.html?g=kids", columns: [
    { title: "Featured", links: [["New Arrivals", "shop.html?g=kids&new=1"], ["Shop All Kids", "shop.html?g=kids"]] },
    { title: "Shop by age", links: [["Big Kids (7–12 yrs)", "shop.html?g=kids&a=big"], ["Little Kids (3–7 yrs)", "shop.html?g=kids&a=little"], ["Baby & Toddler (0–3 yrs)", "shop.html?g=kids&a=baby"]] },
    { title: "Clothing", links: [["All Kids Clothing", "shop.html?g=kids"], ["Tops & T-Shirts", "shop.html?g=kids&t=tops"], ["Jackets & Sets", "shop.html?g=kids&t=jackets"]] }
  ] },
  { label: "Collections", href: "shop.html", columns: [
    { title: "Collections", links: [["Buried", "shop.html?c=buried"], ["Bloom", "shop.html?c=bloom"], ["Unbound", "shop.html?c=unbound"], ["Reclaimed", "shop.html?c=reclaimed"]] },
    { title: "Categories", links: [["Shoes", "shop.html?t=shoes"], ["Clothing", "shop.html?t=clothing"], ["Accessories", "shop.html?t=accessories"]] }
  ], feature: { image: PHOTO("chain-hand"), title: "Unbound", href: "shop.html?c=unbound" } }
];

SEEEDS.rollCall = [
  { year: "1791", name: "Toussaint Louverture", place: "Haiti", line: "Leads the revolt that, by 1804, makes Haiti the first nation founded by people who freed themselves from slavery." },
  { year: "1845", name: "Frederick Douglass", place: "United States", line: "Seven years after escaping, he publishes his Narrative, turning his own life into evidence against slavery." },
  { year: "1849", name: "Harriet Tubman", place: "Maryland", line: "Escapes, then returns about thirteen times and guides around seventy people to freedom." },
  { year: "1892", name: "Ida B. Wells", place: "Memphis", line: "Publishes Southern Horrors and names the lynching terror that others refused to report." },
  { year: "1900", name: "Yaa Asantewaa", place: "Ashanti, Gold Coast", line: "The Queen Mother of Ejisu leads the War of the Golden Stool against British colonial rule." },
  { year: "1955", name: "Rosa Parks", place: "Montgomery", line: "Refuses to give up her seat. The bus boycott that follows lasts 381 days." },
  { year: "1957", name: "Kwame Nkrumah", place: "Accra", line: "Ghana becomes independent on 6 March, and the rest of the continent sees that it can be done." },
  { year: "1960", name: "Ruby Bridges", place: "New Orleans", line: "At six years old, she becomes the first Black child to attend William Frantz Elementary School." },
  { year: "1960", name: "Patrice Lumumba", place: "Congo", line: "Becomes the first prime minister of an independent Congo." },
  { year: "1963", name: "Martin Luther King Jr.", place: "Washington", line: "Speaks to around 250,000 people at the March on Washington." },
  { year: "1964", name: "Malcolm X", place: "New York", line: "Founds the Organization of Afro-American Unity." },
  { year: "1977", name: "Steve Biko", place: "South Africa", line: "The founder of Black Consciousness dies in police custody. His ideas outlive the cell." },
  { year: "1990", name: "Nelson Mandela", place: "Cape Town", line: "Walks free after 27 years in prison. In 1994 he is elected president." }
];

SEEEDS.product = function (id) { return SEEEDS.products.find(function (p) { return p.id === id; }); };
SEEEDS.collection = function (id) { return SEEEDS.collections.find(function (c) { return c.id === id; }); };
SEEEDS.sizesFor = function (p) { return p.sizes || ["One size"]; };
